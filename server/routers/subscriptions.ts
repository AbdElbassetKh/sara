import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { subscriptions, paymentHistory } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

// Plan pricing in DZD
const PLAN_PRICES = { monthly: 500, yearly: 4000 };
const PLAN_DAYS = { monthly: 30, yearly: 365 };

// CCP/BaridiMob payment coordinates
export const PAYMENT_COORDS = {
  ccp: {
    number: "002 123456 78",
    key: "45",
    name: "SARL AlleNest Services",
  },
  baridimob: {
    number: "0550 12 34 56",
    name: "AlleNest",
  },
};

export const subscriptionsRouter = router({
  // Get current user's subscription status
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const rows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    const sub = rows[0];
    const now = new Date();

    if (!sub || sub.plan === "free") {
      return { isPremium: false, plan: "free" as const, premiumUntil: null, status: "active" as const };
    }

    // Check if premium is still valid
    const isPremium =
      sub.status === "active" &&
      sub.premiumUntil != null &&
      new Date(sub.premiumUntil) > now;

    // Auto-expire if needed
    if (sub.status === "active" && sub.premiumUntil && new Date(sub.premiumUntil) <= now) {
      await db
        .update(subscriptions)
        .set({ status: "expired" })
        .where(eq(subscriptions.id, sub.id));
    }

    return {
      isPremium,
      plan: sub.plan,
      premiumUntil: sub.premiumUntil,
      status: sub.status,
    };
  }),

  // Submit a subscription request (pending until admin validates)
  create: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["monthly", "yearly"]),
        paymentMethod: z.enum(["ccp", "baridimob"]),
        transactionRef: z.string().min(1, "Référence de transaction requise").max(255),
        proofUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const amount = PLAN_PRICES[input.plan];

      // Insert payment history record (pending)
      await db.insert(paymentHistory).values({
        userId: ctx.user.id,
        amount,
        plan: input.plan,
        status: "pending",
        paymentMethod: input.paymentMethod,
        transactionRef: input.transactionRef,
      });

      // Upsert subscription as pending
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(subscriptions)
          .set({
            plan: input.plan,
            status: "pending",
            paymentRef: input.transactionRef,
          })
          .where(eq(subscriptions.userId, ctx.user.id));
      } else {
        await db.insert(subscriptions).values({
          userId: ctx.user.id,
          plan: input.plan,
          status: "pending",
          paymentRef: input.transactionRef,
        });
      }

      return { success: true, message: "Demande soumise. En attente de validation." };
    }),

  // Get payment history for current user
  listHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const rows = await db
      .select()
      .from(paymentHistory)
      .where(eq(paymentHistory.userId, ctx.user.id))
      .orderBy(desc(paymentHistory.createdAt))
      .limit(20);

    return rows;
  }),

  // Admin: list all pending subscriptions
  adminList: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const rows = await db
      .select()
      .from(paymentHistory)
      .orderBy(desc(paymentHistory.createdAt))
      .limit(100);

    return rows;
  }),

  // Admin: validate or reject a subscription
  adminValidate: protectedProcedure
    .input(
      z.object({
        paymentId: z.number(),
        userId: z.number(),
        action: z.enum(["approve", "reject"]),
        plan: z.enum(["monthly", "yearly"]),
        adminNote: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (input.action === "approve") {
        const now = new Date();
        const premiumUntil = new Date(now);
        premiumUntil.setDate(now.getDate() + PLAN_DAYS[input.plan]);

        // Update payment record
        await db
          .update(paymentHistory)
          .set({ status: "completed" })
          .where(eq(paymentHistory.id, input.paymentId));

        // Activate subscription
        const existing = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, input.userId))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(subscriptions)
            .set({ plan: input.plan, status: "active", premiumUntil })
            .where(eq(subscriptions.userId, input.userId));
        } else {
          await db.insert(subscriptions).values({
            userId: input.userId,
            plan: input.plan,
            status: "active",
            premiumUntil,
          });
        }
      } else {
        // Reject
        await db
          .update(paymentHistory)
          .set({ status: "failed" })
          .where(eq(paymentHistory.id, input.paymentId));

        await db
          .update(subscriptions)
          .set({ status: "cancelled" })
          .where(and(eq(subscriptions.userId, input.userId), eq(subscriptions.status, "pending")));
      }

      return { success: true };
    }),

  // Get payment coordinates (public)
  getPaymentCoords: protectedProcedure.query(() => {
    return PAYMENT_COORDS;
  }),
});
