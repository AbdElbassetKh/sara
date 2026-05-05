import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { notifications, childVaccines, vaccines, symptomEntries } from "../../drizzle/schema";
import { eq, and, desc, gte } from "drizzle-orm";

export const notificationsRouter = router({

  // Get all notifications for the current user
  list: protectedProcedure
    .input(z.object({
      childId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(notifications.userId, ctx.user.id)];
      if (input.childId) {
        conditions.push(eq(notifications.childId, input.childId));
      }

      const rows = await db
        .select()
        .from(notifications)
        .where(and(...conditions))
        .orderBy(desc(notifications.createdAt))
        .limit(50);

      return rows;
    }),

  // Get unread count
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return 0;

    const rows = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.isRead, 0)
        )
      );

    return rows.length;
  }),

  // Mark notification as read
  markRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      await db
        .update(notifications)
        .set({ isRead: 1 })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  // Mark all notifications as read
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    await db
      .update(notifications)
      .set({ isRead: 1 })
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.isRead, 0)
        )
      );

    return { success: true };
  }),

  // Delete a notification
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  // Generate vaccine reminders for a child
  generateVaccineReminders: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      const pendingVaccines = await db
        .select({
          id: childVaccines.id,
          scheduledDate: childVaccines.scheduledDate,
          vaccineName: vaccines.name,
        })
        .from(childVaccines)
        .innerJoin(vaccines, eq(childVaccines.vaccineId, vaccines.id))
        .where(
          and(
            eq(childVaccines.childId, input.childId)
          )
        );

      const now = new Date();
      let created = 0;

      for (const pv of pendingVaccines) {
        if (!pv.scheduledDate) continue;
        const scheduled = new Date(pv.scheduledDate);
        const diffDays = Math.ceil((scheduled.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Only create reminders for vaccines due in 7 days or overdue
        if (diffDays > 7) continue;

        const isOverdue = diffDays < 0;
        const title = isOverdue
          ? `⚠️ Vaccin en retard : ${pv.vaccineName}`
          : `💉 Rappel vaccin : ${pv.vaccineName}`;
        const content = isOverdue
          ? `Le vaccin ${pv.vaccineName} était prévu le ${scheduled.toLocaleDateString('fr-FR')} – Prenez rendez-vous dès que possible.`
          : `Le vaccin ${pv.vaccineName} est prévu dans ${diffDays} jour(s) (${scheduled.toLocaleDateString('fr-FR')}).`;

        await db.insert(notifications).values({
          userId: ctx.user.id,
          childId: input.childId,
          type: "vaccine_reminder",
          title,
          content,
          isRead: 0,
        });

        created++;
      }

      return { created };
    }),

  // Create a custom notification
  create: protectedProcedure
    .input(z.object({
      childId: z.number(),
      type: z.enum(["vaccine_reminder", "medication_reminder", "appointment_reminder", "symptom_alert", "allergen_alert", "other"]),
      title: z.string().min(1).max(200),
      content: z.string().min(1).max(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      const result = await db.insert(notifications).values({
        userId: ctx.user.id,
        childId: input.childId,
        type: input.type,
        title: input.title,
        content: input.content,
        isRead: 0,
      });

      return { success: true, id: Number(result[0].insertId) };
    }),

  // Detect unusual symptoms (3+ in a week) and create alert
  detectUnusualSymptoms: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { alertCreated: false };

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const recentSymptoms = await db
        .select()
        .from(symptomEntries)
        .where(
          and(
            eq(symptomEntries.childId, input.childId),
            gte(symptomEntries.occurredAt, oneWeekAgo)
          )
        );

      if (recentSymptoms.length < 3) return { alertCreated: false, count: recentSymptoms.length };

      // Check if we already sent this alert recently
      const recentAlerts = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, ctx.user.id),
            eq(notifications.childId, input.childId),
            eq(notifications.type, "symptom_alert"),
            gte(notifications.createdAt, oneWeekAgo)
          )
        )
        .limit(1);

      if (recentAlerts.length > 0) return { alertCreated: false, alreadyAlerted: true };

      await db.insert(notifications).values({
        userId: ctx.user.id,
        childId: input.childId,
        type: "symptom_alert",
        title: `⚠️ Symptômes inhabituels détectés`,
        content: `${recentSymptoms.length} symptômes ont été enregistrés cette semaine. Consultez un médecin si les symptômes persistent.`,
        isRead: 0,
      });

      return { alertCreated: true, count: recentSymptoms.length };
    }),
});
