import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getSymptomEntriesByChildId, createSymptomEntry } from "../db";

export const symptomsRouter = router({
  list: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ input }) => {
      return getSymptomEntriesByChildId(input.childId, 100);
    }),

  create: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        symptomType: z.string().min(1),
        severity: z.number().min(1).max(10),
        notes: z.string().optional(),
        foodEntryId: z.number().optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createSymptomEntry({
        childId: input.childId,
        symptomType: input.symptomType,
        severity: input.severity,
        notes: input.notes,
        occurredAt: new Date(),
        foodEntryId: input.foodEntryId,
        photoUrl: input.photoUrl,
      });
    }),
});
