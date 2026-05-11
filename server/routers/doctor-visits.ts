import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb, getChildrenByUserId } from "../db";
import { doctorVisits } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/** Verify that the child belongs to the authenticated user */
async function assertChildOwnership(userId: number, childId: number) {
  const children = await getChildrenByUserId(userId);
  if (!children.find((c) => c.id === childId)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Child not found" });
  }
}

export const doctorVisitsRouter = router({
  list: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db
        .select()
        .from(doctorVisits)
        .where(eq(doctorVisits.childId, input.childId))
        .orderBy(desc(doctorVisits.visitDate));
    }),

  create: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        doctorName: z.string().min(1),
        specialty: z.string().optional(),
        visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [result] = await db.insert(doctorVisits).values({
        childId: input.childId,
        doctorName: input.doctorName,
        specialty: input.specialty || null,
        visitDate: new Date(input.visitDate + 'T12:00:00Z'),
        notes: input.notes || null,
      });
      return { id: (result as any).insertId };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      // Verify ownership via join before deleting
      const [record] = await db
        .select({ childId: doctorVisits.childId })
        .from(doctorVisits)
        .where(eq(doctorVisits.id, input.id));
      if (record) await assertChildOwnership(ctx.user.id, record.childId);
      await db.delete(doctorVisits).where(eq(doctorVisits.id, input.id));
      return { success: true };
    }),
});
