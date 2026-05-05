import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  foodEntries,
  symptomEntries,
  doctorVisits,
  children,
} from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

async function verifyChildOwnership(userId: number, childId: number) {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
  const rows = await db
    .select({ id: children.id })
    .from(children)
    .where(and(eq(children.id, childId), eq(children.userId, userId)))
    .limit(1);
  if (rows.length === 0) throw new TRPCError({ code: "FORBIDDEN", message: "Child not found or access denied" });
}

export const timelineRouter = router({
  /**
   * Returns all timeline entries (meals + symptoms + doctor visits) for a child,
   * sorted by date descending.
   * Optional filter: 'all' | 'meal' | 'symptom' | 'doctor'
   */
  getEntries: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        filter: z.enum(["all", "meal", "symptom", "doctor"]).default("all"),
        limit: z.number().min(1).max(200).default(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      await verifyChildOwnership(ctx.user.id, input.childId);

      const results: Array<{
        id: number;
        type: "meal" | "symptom" | "doctor";
        title: string;
        detail: string;
        date: Date;
        severity?: number;
        photoUrl?: string | null;
      }> = [];

      if (input.filter === "all" || input.filter === "meal") {
        const meals = await db
          .select()
          .from(foodEntries)
          .where(eq(foodEntries.childId, input.childId))
          .orderBy(desc(foodEntries.eatenAt))
          .limit(input.limit);

        for (const m of meals) {
          const ingredients = Array.isArray(m.ingredients) ? (m.ingredients as string[]) : [];
          results.push({
            id: m.id,
            type: "meal",
            title: m.foodName,
            detail: ingredients.join(", ") || "—",
            date: new Date(m.eatenAt),
            photoUrl: m.photoUrl,
          });
        }
      }

      if (input.filter === "all" || input.filter === "symptom") {
        const symptoms = await db
          .select()
          .from(symptomEntries)
          .where(eq(symptomEntries.childId, input.childId))
          .orderBy(desc(symptomEntries.occurredAt))
          .limit(input.limit);

        for (const s of symptoms) {
          results.push({
            id: s.id,
            type: "symptom",
            title: s.symptomType,
            detail: s.notes || `Sévérité: ${s.severity}/10`,
            date: new Date(s.occurredAt),
            severity: s.severity,
            photoUrl: s.photoUrl,
          });
        }
      }

      if (input.filter === "all" || input.filter === "doctor") {
        const visits = await db
          .select()
          .from(doctorVisits)
          .where(eq(doctorVisits.childId, input.childId))
          .orderBy(desc(doctorVisits.visitDate))
          .limit(input.limit);

        for (const v of visits) {
          results.push({
            id: v.id,
            type: "doctor",
            title: v.doctorName,
            detail: v.specialty ? `${v.specialty}${v.notes ? " — " + v.notes : ""}` : v.notes || "—",
            date: new Date(v.visitDate),
          });
        }
      }

      // Sort all entries by date descending
      results.sort((a, b) => b.date.getTime() - a.date.getTime());
      return results.slice(0, input.limit);
    }),

  /**
   * Delete a timeline entry by type and id.
   * Only the owner (via child ownership) can delete.
   */
  deleteEntry: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        entryId: z.number(),
        type: z.enum(["meal", "symptom", "doctor"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });

      await verifyChildOwnership(ctx.user.id, input.childId);

      if (input.type === "meal") {
        // Also delete linked symptom entries
        await db.delete(symptomEntries).where(eq(symptomEntries.foodEntryId, input.entryId));
        await db.delete(foodEntries).where(
          and(eq(foodEntries.id, input.entryId), eq(foodEntries.childId, input.childId))
        );
      } else if (input.type === "symptom") {
        await db.delete(symptomEntries).where(
          and(eq(symptomEntries.id, input.entryId), eq(symptomEntries.childId, input.childId))
        );
      } else if (input.type === "doctor") {
        await db.delete(doctorVisits).where(
          and(eq(doctorVisits.id, input.entryId), eq(doctorVisits.childId, input.childId))
        );
      }

      return { success: true };
    }),
});
