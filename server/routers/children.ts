import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getChildrenByUserId, createChild, getChildById, updateChild } from "../db";
import { storagePut } from "../storage";

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
      await createChild({
        userId: ctx.user.id,
        ...input,
      });
      // Fetch the newly created child to return full data with ID
      const allChildren = await getChildrenByUserId(ctx.user.id);
      return allChildren[allChildren.length - 1];
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

  // Upload a child's profile photo (base64 encoded) and update the DB
  uploadPhoto: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        // base64-encoded image data (without the data:image/...;base64, prefix)
        base64Data: z.string(),
        mimeType: z.string().default("image/jpeg"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the child belongs to the current user
      const child = await getChildById(input.childId);
      if (!child || child.userId !== ctx.user.id) {
        throw new Error("Child not found or access denied");
      }

      // Decode base64 and upload to S3
      const buffer = Buffer.from(input.base64Data, "base64");
      const ext = input.mimeType.split("/")[1] || "jpg";
      const key = `children/${ctx.user.id}/child-${input.childId}-photo.${ext}`;
      const { url } = await storagePut(key, buffer, input.mimeType);

      // Update the child record with the new photo URL
      await updateChild(input.childId, { photoUrl: url });

      return { photoUrl: url };
    }),
});
