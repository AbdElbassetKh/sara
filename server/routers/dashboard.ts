import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  foodEntries,
  symptomEntries,
  childVaccines,
  notifications,
  children,
  dailyCheckins,
} from "../../drizzle/schema";
import { eq, and, gte, lte, lt, desc, sql } from "drizzle-orm";

/** Verify that the child belongs to the current user */
async function verifyChildOwnership(userId: number, childId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const rows = await db
    .select({ id: children.id })
    .from(children)
    .where(and(eq(children.id, childId), eq(children.userId, userId)))
    .limit(1);
  if (rows.length === 0) throw new Error("Child not found or access denied");
}

export const dashboardRouter = router({
  /**
   * Returns computed stats for the Dashboard:
   *  - mealsThisMonth  : number of food_entries this calendar month
   *  - symptomFreeDays : consecutive days (from today backwards) with no symptom_entries
   *  - activeAlerts    : unread notifications for this user
   *  - vaccinesDone    : child_vaccines with status = 'done'
   */
  getStats: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { mealsThisMonth: 0, symptomFreeDays: 0, activeAlerts: 0, vaccinesDone: 0 };

      await verifyChildOwnership(ctx.user.id, input.childId);

      const now = new Date();

      // ── Meals this month ──────────────────────────────────────────────────
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const mealsRows = await db
        .select({ id: foodEntries.id })
        .from(foodEntries)
        .where(
          and(
            eq(foodEntries.childId, input.childId),
            gte(foodEntries.eatenAt, monthStart),
            lte(foodEntries.eatenAt, monthEnd)
          )
        );
      const mealsThisMonth = mealsRows.length;

      // ── Symptom-free days (consecutive from today backwards) ──────────────
      // Fetch all symptom dates for this child, sorted descending
      const symptomRows = await db
        .select({ occurredAt: symptomEntries.occurredAt })
        .from(symptomEntries)
        .where(eq(symptomEntries.childId, input.childId))
        .orderBy(desc(symptomEntries.occurredAt));

      // Build a Set of date strings (YYYY-MM-DD) that have symptoms
      const symptomDates = new Set(
        symptomRows.map((r) => new Date(r.occurredAt).toISOString().split("T")[0])
      );

      let symptomFreeDays = 0;
      const cursor = new Date(now);
      // Walk backwards day by day until we hit a day with symptoms (max 365)
      for (let i = 0; i < 365; i++) {
        const dateStr = cursor.toISOString().split("T")[0];
        if (symptomDates.has(dateStr)) break;
        symptomFreeDays++;
        cursor.setDate(cursor.getDate() - 1);
      }

      // ── Active (unread) alerts ────────────────────────────────────────────
      const alertRows = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, ctx.user.id),
            eq(notifications.isRead, 0)
          )
        );
      const activeAlerts = alertRows.length;

      // ── Vaccines done ─────────────────────────────────────────────────────
      const vaccineRows = await db
        .select({ id: childVaccines.id })
        .from(childVaccines)
        .where(
          and(
            eq(childVaccines.childId, input.childId),
            eq(childVaccines.status, "done")
          )
        );
      const vaccinesDone = vaccineRows.length;

      return { mealsThisMonth, symptomFreeDays, activeAlerts, vaccinesDone };
    }),

  /**
   * Returns the most recent allergen alert:
   * the last food_entry (within 24h) that is linked to a symptom_entry
   * with severity >= 7. Returns null if none found.
   */
  getRecentAllergenAlert: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      await verifyChildOwnership(ctx.user.id, input.childId);

      const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find symptom entries with severity >= 7 in the last 24h that have a foodEntryId
      const severeSymptoms = await db
        .select({
          foodEntryId: symptomEntries.foodEntryId,
          symptomType: symptomEntries.symptomType,
          severity: symptomEntries.severity,
        })
        .from(symptomEntries)
        .where(
          and(
            eq(symptomEntries.childId, input.childId),
            gte(symptomEntries.occurredAt, since24h),
            gte(symptomEntries.severity, 7)
          )
        )
        .orderBy(desc(symptomEntries.occurredAt))
        .limit(1);

      if (severeSymptoms.length === 0 || !severeSymptoms[0].foodEntryId) return null;

      const foodEntryId = severeSymptoms[0].foodEntryId;

      // Fetch the food entry
      const foodRows = await db
        .select({
          id: foodEntries.id,
          foodName: foodEntries.foodName,
          ingredients: foodEntries.ingredients,
          eatenAt: foodEntries.eatenAt,
        })
        .from(foodEntries)
        .where(eq(foodEntries.id, foodEntryId))
        .limit(1);

      if (foodRows.length === 0) return null;

      return {
        foodName: foodRows[0].foodName,
        ingredients: foodRows[0].ingredients as string[],
        eatenAt: foodRows[0].eatenAt,
        severity: severeSymptoms[0].severity,
        symptomType: severeSymptoms[0].symptomType,
      };
    }),

  /**
   * Returns the last 5 timeline entries (meals + symptoms) for the child,
   * sorted by date descending — used for the "Recent Activity" section.
   */
  getRecentActivity: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      await verifyChildOwnership(ctx.user.id, input.childId);

      const [meals, symptoms] = await Promise.all([
        db
          .select({
            id: foodEntries.id,
            type: sql<string>`'meal'`,
            title: foodEntries.foodName,
            detail: foodEntries.ingredients,
            date: foodEntries.eatenAt,
          })
          .from(foodEntries)
          .where(eq(foodEntries.childId, input.childId))
          .orderBy(desc(foodEntries.eatenAt))
          .limit(10),

        db
          .select({
            id: symptomEntries.id,
            type: sql<string>`'symptom'`,
            title: symptomEntries.symptomType,
            detail: sql<string>`CAST(${symptomEntries.severity} AS CHAR)`,
            date: symptomEntries.occurredAt,
          })
          .from(symptomEntries)
          .where(eq(symptomEntries.childId, input.childId))
          .orderBy(desc(symptomEntries.occurredAt))
          .limit(10),
      ]);

      // Merge and sort by date descending, return top 5
      const all = [
        ...meals.map((m) => ({
          id: m.id,
          type: "meal" as const,
          title: m.title,
          detail: Array.isArray(m.detail) ? (m.detail as string[]).join(", ") : String(m.detail),
          date: m.date,
        })),
        ...symptoms.map((s) => ({
          id: s.id,
          type: "symptom" as const,
          title: s.title,
          detail: `Severity: ${s.detail}`,
          date: s.date,
        })),
      ];

      all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return all.slice(0, 5);
    }),
});
