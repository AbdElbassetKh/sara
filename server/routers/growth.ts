import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb, getChildrenByUserId } from "../db";
import { growthRecords } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/** Verify that the child belongs to the authenticated user */
async function assertChildOwnership(userId: number, childId: number) {
  const children = await getChildrenByUserId(userId);
  if (!children.find((c) => c.id === childId)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Child not found" });
  }
}

export const growthRouter = router({
  list: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db
        .select()
        .from(growthRecords)
        .where(eq(growthRecords.childId, input.childId))
        .orderBy(desc(growthRecords.recordDate));
    }),

  create: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        weightKg: z.string().optional(),
        heightCm: z.string().optional(),
        headCircCm: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [result] = await db.insert(growthRecords).values({
        childId: input.childId,
        recordDate: new Date(input.recordDate + 'T12:00:00Z'),
        weightKg: input.weightKg || null,
        heightCm: input.heightCm || null,
        headCircCm: input.headCircCm || null,
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
        .select({ childId: growthRecords.childId })
        .from(growthRecords)
        .where(eq(growthRecords.id, input.id));
      if (record) await assertChildOwnership(ctx.user.id, record.childId);
      await db.delete(growthRecords).where(eq(growthRecords.id, input.id));
      return { success: true };
    }),
});
