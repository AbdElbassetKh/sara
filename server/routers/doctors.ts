import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { doctors } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const doctorsRouter = router({
  // List all doctors for the current user (optionally filtered by child)
  list: protectedProcedure
    .input(z.object({ childId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      const conditions = [eq(doctors.userId, ctx.user.id)];
      if (input?.childId) {
        conditions.push(eq(doctors.childId, input.childId));
      }
      const rows = await db
        .select()
        .from(doctors)
        .where(and(...conditions))
        .orderBy(doctors.createdAt);
      return rows;
    }),

  // Create a new doctor
  create: protectedProcedure
    .input(
      z.object({
        childId: z.number().optional(),
        name: z.string().min(1).max(255),
        specialty: z.string().max(100).optional(),
        phone: z.string().max(50).optional(),
        email: z.string().email().max(320).optional().or(z.literal("")),
        address: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      const [result] = await db.insert(doctors).values({
        userId: ctx.user.id,
        childId: input.childId ?? null,
        name: input.name,
        specialty: input.specialty ?? null,
        phone: input.phone ?? null,
        email: input.email || null,
        address: input.address ?? null,
        notes: input.notes ?? null,
      });
      const id = (result as { insertId: number }).insertId;
      const [created] = await db.select().from(doctors).where(eq(doctors.id, id));
      return created;
    }),

  // Update a doctor
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        specialty: z.string().max(100).optional(),
        phone: z.string().max(50).optional(),
        email: z.string().email().max(320).optional().or(z.literal("")),
        address: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      const { id, ...fields } = input;
      await db
        .update(doctors)
        .set({
          ...(fields.name !== undefined && { name: fields.name }),
          ...(fields.specialty !== undefined && { specialty: fields.specialty }),
          ...(fields.phone !== undefined && { phone: fields.phone }),
          ...(fields.email !== undefined && { email: fields.email || null }),
          ...(fields.address !== undefined && { address: fields.address }),
          ...(fields.notes !== undefined && { notes: fields.notes }),
        })
        .where(and(eq(doctors.id, id), eq(doctors.userId, ctx.user.id)));
      const [updated] = await db.select().from(doctors).where(eq(doctors.id, id));
      return updated;
    }),

  // Delete a doctor
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      await db
        .delete(doctors)
        .where(and(eq(doctors.id, input.id), eq(doctors.userId, ctx.user.id)));
      return { success: true };
    }),
});
