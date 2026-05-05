import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { appointments, children, notifications } from "../../drizzle/schema";
import { eq, and, gte, lte, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

async function verifyChildOwnership(userId: number, childId: number) {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  const result = await db
    .select()
    .from(children)
    .where(and(eq(children.id, childId), eq(children.userId, userId)))
    .limit(1);
  if (!result[0]) throw new TRPCError({ code: "FORBIDDEN" });
  return db;
}

export const appointmentsRouter = router({
  // List all appointments for a child
  list: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await verifyChildOwnership(ctx.user.id, input.childId);
      return db
        .select()
        .from(appointments)
        .where(eq(appointments.childId, input.childId))
        .orderBy(asc(appointments.appointmentDate));
    }),

  // Get upcoming appointments (next 30 days)
  getUpcoming: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await verifyChildOwnership(ctx.user.id, input.childId);
      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.childId, input.childId),
            eq(appointments.status, "upcoming"),
            gte(appointments.appointmentDate, now),
            lte(appointments.appointmentDate, in30Days)
          )
        )
        .orderBy(asc(appointments.appointmentDate));
    }),

  // Get next single appointment
  getNext: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const childRows = await db
        .select()
        .from(children)
        .where(and(eq(children.id, input.childId), eq(children.userId, ctx.user.id)))
        .limit(1);
      if (!childRows[0]) return null;

      const now = new Date();
      const results = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.childId, input.childId),
            eq(appointments.status, "upcoming"),
            gte(appointments.appointmentDate, now)
          )
        )
        .orderBy(asc(appointments.appointmentDate))
        .limit(1);

      return results[0] ?? null;
    }),

  // Create a new appointment
  create: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        doctorName: z.string().min(1),
        specialty: z.string().optional(),
        appointmentDate: z.string(),
        location: z.string().optional(),
        notes: z.string().optional(),
        enableReminder: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await verifyChildOwnership(ctx.user.id, input.childId);

      const appointmentDate = new Date(input.appointmentDate);
      const reminderAt = input.enableReminder
        ? new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000)
        : null;

      const [result] = await db.insert(appointments).values({
        childId: input.childId,
        userId: ctx.user.id,
        doctorName: input.doctorName,
        specialty: input.specialty ?? null,
        appointmentDate,
        location: input.location ?? null,
        notes: input.notes ?? null,
        status: "upcoming",
        reminderSent: 0,
        reminderAt,
      });

      // Create a notification for the appointment
      await db.insert(notifications).values({
        userId: ctx.user.id,
        childId: input.childId,
        type: "appointment_reminder",
        title: `RDV: ${input.doctorName}`,
        content: `Rendez-vous le ${appointmentDate.toLocaleDateString("fr-FR")} à ${appointmentDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}${input.location ? ` — ${input.location}` : ""}`,
        isRead: 0,
      });

      return { id: (result as { insertId: number }).insertId };
    }),

  // Update appointment status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["upcoming", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const apptRows = await db
        .select()
        .from(appointments)
        .where(and(eq(appointments.id, input.id), eq(appointments.userId, ctx.user.id)))
        .limit(1);
      if (!apptRows[0]) throw new TRPCError({ code: "FORBIDDEN" });

      await db
        .update(appointments)
        .set({ status: input.status })
        .where(eq(appointments.id, input.id));

      return { success: true };
    }),

  // Update appointment details
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        doctorName: z.string().min(1).optional(),
        specialty: z.string().optional(),
        appointmentDate: z.string().optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const apptRows = await db
        .select()
        .from(appointments)
        .where(and(eq(appointments.id, input.id), eq(appointments.userId, ctx.user.id)))
        .limit(1);
      if (!apptRows[0]) throw new TRPCError({ code: "FORBIDDEN" });

      const updates: Record<string, unknown> = {};
      if (input.doctorName) updates.doctorName = input.doctorName;
      if (input.specialty !== undefined) updates.specialty = input.specialty;
      if (input.appointmentDate) {
        updates.appointmentDate = new Date(input.appointmentDate);
        updates.reminderAt = new Date(
          new Date(input.appointmentDate).getTime() - 24 * 60 * 60 * 1000
        );
        updates.reminderSent = 0;
      }
      if (input.location !== undefined) updates.location = input.location;
      if (input.notes !== undefined) updates.notes = input.notes;

      await db.update(appointments).set(updates).where(eq(appointments.id, input.id));
      return { success: true };
    }),

  // Delete appointment
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const apptRows = await db
        .select()
        .from(appointments)
        .where(and(eq(appointments.id, input.id), eq(appointments.userId, ctx.user.id)))
        .limit(1);
      if (!apptRows[0]) throw new TRPCError({ code: "FORBIDDEN" });

      await db.delete(appointments).where(eq(appointments.id, input.id));
      return { success: true };
    }),
});
