import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { subscriptions, dailyCheckins, feedbacks, paymentHistory } from "../../drizzle/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";

// ─── Subscription Router ──────────────────────────────────────────────────────
export const premiumRouter = router({

  // Get current subscription status
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (rows.length === 0) {
      // Create default free subscription
      await db.insert(subscriptions).values({
        userId: ctx.user.id,
        plan: "free",
        status: "active",
      });
      return { plan: "free", status: "active", isPremium: false, aiAnalysesUsedToday: 0, premiumUntil: null };
    }

    const sub = rows[0];
    const now = new Date();
    const isPremium =
      sub.plan !== "free" &&
      sub.status === "active" &&
      (sub.premiumUntil === null || sub.premiumUntil > now);

    // Reset daily AI analyses counter if needed
    const resetAt = sub.aiAnalysesResetAt ? new Date(sub.aiAnalysesResetAt) : new Date(0);
    const isNewDay = now.toDateString() !== resetAt.toDateString();
    if (isNewDay && sub.aiAnalysesUsedToday && sub.aiAnalysesUsedToday > 0) {
      await db
        .update(subscriptions)
        .set({ aiAnalysesUsedToday: 0, aiAnalysesResetAt: now })
        .where(eq(subscriptions.userId, ctx.user.id));
      sub.aiAnalysesUsedToday = 0;
    }

    return {
      plan: sub.plan,
      status: sub.status,
      isPremium,
      aiAnalysesUsedToday: sub.aiAnalysesUsedToday ?? 0,
      premiumUntil: sub.premiumUntil,
      aiAnalysesLimit: isPremium ? null : 1, // null = unlimited
    };
  }),

  // Simulate payment and activate premium
  activatePremium: protectedProcedure
    .input(z.object({
      plan: z.enum(["monthly", "yearly"]),
      paymentMethod: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      const now = new Date();
      const premiumUntil = new Date(now);
      if (input.plan === "monthly") {
        premiumUntil.setMonth(premiumUntil.getMonth() + 1);
      } else {
        premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);
      }

      const amount = input.plan === "monthly" ? 500 : 4000;
      const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      // Record payment
      await db.insert(paymentHistory).values({
        userId: ctx.user.id,
        amount,
        currency: "DZD",
        plan: input.plan,
        status: "completed",
        paymentMethod: input.paymentMethod ?? "simulated",
        transactionRef,
      });

      // Upsert subscription
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(subscriptions)
          .set({ plan: input.plan, status: "active", premiumUntil, paymentRef: transactionRef })
          .where(eq(subscriptions.userId, ctx.user.id));
      } else {
        await db.insert(subscriptions).values({
          userId: ctx.user.id,
          plan: input.plan,
          status: "active",
          premiumUntil,
          paymentRef: transactionRef,
        });
      }

      return {
        success: true,
        plan: input.plan,
        premiumUntil,
        transactionRef,
        amount,
      };
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    await db
      .update(subscriptions)
      .set({ status: "cancelled" })
      .where(eq(subscriptions.userId, ctx.user.id));

    return { success: true };
  }),

  // Get payment history
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(paymentHistory)
      .where(eq(paymentHistory.userId, ctx.user.id))
      .orderBy(desc(paymentHistory.createdAt))
      .limit(20);
  }),

  // Increment AI analyses used today (called from meals router)
  incrementAiUsage: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (rows.length === 0) return { allowed: true };

    const sub = rows[0];
    const used = (sub.aiAnalysesUsedToday ?? 0) + 1;

    await db
      .update(subscriptions)
      .set({ aiAnalysesUsedToday: used, aiAnalysesResetAt: new Date() })
      .where(eq(subscriptions.userId, ctx.user.id));

    return { allowed: true, usedToday: used };
  }),

  // ─── Daily Check-ins ────────────────────────────────────────────────────────

  getTodayCheckin: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const today = new Date().toISOString().split("T")[0];
      const rows = await db
        .select()
        .from(dailyCheckins)
        .where(
          and(
            eq(dailyCheckins.childId, input.childId),
            eq(dailyCheckins.userId, ctx.user.id),
            sql`${dailyCheckins.checkinDate} = ${today}`
          )
        )
        .limit(1);

      return rows[0] ?? null;
    }),

  submitCheckin: protectedProcedure
    .input(z.object({
      childId: z.number(),
      hasSymptoms: z.boolean(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      const today = new Date().toISOString().split("T")[0];

      // Check if already checked in today
      const existing = await db
        .select()
        .from(dailyCheckins)
        .where(
          and(
            eq(dailyCheckins.childId, input.childId),
            eq(dailyCheckins.userId, ctx.user.id),
            sql`${dailyCheckins.checkinDate} = ${today}`
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return { success: true, alreadyCheckedIn: true, id: existing[0].id };
      }

      const result = await db.insert(dailyCheckins).values({
        childId: input.childId,
        userId: ctx.user.id,
        checkinDate: new Date(today),
        hasSymptoms: input.hasSymptoms ? 1 : 0,
        notes: input.notes,
      });

      return { success: true, alreadyCheckedIn: false, id: Number(result[0].insertId) };
    }),

  getCheckinHistory: protectedProcedure
    .input(z.object({ childId: z.number(), days: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const since = new Date();
      since.setDate(since.getDate() - input.days);
      const sinceStr = since.toISOString().split("T")[0];

      return db
        .select()
        .from(dailyCheckins)
        .where(
          and(
            eq(dailyCheckins.childId, input.childId),
            eq(dailyCheckins.userId, ctx.user.id),
            sql`${dailyCheckins.checkinDate} >= ${sinceStr}`
          )
        )
        .orderBy(desc(dailyCheckins.checkinDate));
    }),

  // ─── Feedback ───────────────────────────────────────────────────────────────

  submitFeedback: protectedProcedure
    .input(z.object({
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      await db.insert(feedbacks).values({
        userId: ctx.user.id,
        rating: input.rating,
        comment: input.comment,
        appVersion: "1.0.0",
      });

      return { success: true };
    }),

  // Check if user has already given feedback
  hasFeedback: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return false;

    const rows = await db
      .select()
      .from(feedbacks)
      .where(eq(feedbacks.userId, ctx.user.id))
      .limit(1);

    return rows.length > 0;
  }),
});
