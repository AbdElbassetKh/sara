import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getChildrenByUserId, createChild, getChildById, updateChild } from "../db";

export const childrenRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return getChildrenByUserId(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ input }) => {
      return getChildById(input.childId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        birthDate: z.string().transform(v => new Date(v)),
        gender: z.enum(["boy", "girl"]),
        feedingType: z.enum(["breast", "formula", "mixed", "solids"]).optional(),
        allergies: z.array(z.string()).default([]),
        bloodType: z.string().optional(),
        emergencyContact: z
          .object({ name: z.string(), phone: z.string() })
          .optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createChild({
        userId: ctx.user.id,
        ...input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        data: z.object({
          name: z.string().optional(),
          birthDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
          gender: z.enum(["boy", "girl"]).optional(),
          feedingType: z.enum(["breast", "formula", "mixed", "solids"]).optional(),
          allergies: z.array(z.string()).optional(),
          bloodType: z.string().optional(),
          emergencyContact: z
            .object({ name: z.string(), phone: z.string() })
            .optional(),
          photoUrl: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return updateChild(input.childId, input.data);
    }),
});
