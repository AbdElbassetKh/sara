import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { foodEntries, symptomEntries, doctors, children } from "../../drizzle/schema";
import { eq, and, gte } from "drizzle-orm";
import { generateReportPDF } from "../_core/pdfReport";
import { sendReportEmail } from "../_core/email";

export const reportRouter = router({
  /**
   * Génère un rapport PDF et l'envoie par email
   */
  sendByEmail: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        recipientEmail: z.string().email(),
        language: z.enum(["fr", "en", "ar"]).default("fr"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Fetch child info
      const childList = await db
        .select()
        .from(children)
        .where(and(eq(children.id, input.childId), eq(children.userId, ctx.user.id)));

      const child = childList[0];
      if (!child) throw new Error("Child not found");

      // Last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Fetch symptoms
      const symptomList = await db
        .select()
        .from(symptomEntries)
        .where(
          and(
            eq(symptomEntries.childId, input.childId),
            gte(symptomEntries.createdAt, thirtyDaysAgo)
          )
        );

      // Fetch meals
      const mealList = await db
        .select()
        .from(foodEntries)
        .where(
          and(
            eq(foodEntries.childId, input.childId),
            gte(foodEntries.createdAt, thirtyDaysAgo)
          )
        );

      // Fetch doctors
      const doctorList = await db
        .select()
        .from(doctors)
        .where(
          and(
            eq(doctors.userId, ctx.user.id),
            eq(doctors.childId, input.childId)
          )
        );

      const reportDate = new Date().toLocaleDateString(
        input.language === "fr" ? "fr-FR" : input.language === "ar" ? "ar-DZ" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      );

      // Parse allergies
      let allergies: string[] = [];
      try {
        const raw = child.allergies;
        if (Array.isArray(raw)) {
          allergies = raw as string[];
        } else if (typeof raw === "string") {
          allergies = JSON.parse(raw);
        }
      } catch {
        allergies = [];
      }

      // Generate PDF
      const pdfBuffer = await generateReportPDF({
        childName: child.name,
        birthDate: child.birthDate
          ? new Date(child.birthDate).toLocaleDateString(
              input.language === "fr" ? "fr-FR" : input.language === "ar" ? "ar-DZ" : "en-US"
            )
          : null,
        gender: child.gender ?? null,
        bloodType: child.bloodType ?? null,
        allergies,
        reportDate,
        language: input.language,
        symptoms: symptomList.map((s: typeof symptomList[number]) => ({
          symptomType: s.symptomType,
          severity: s.severity ?? 0,
          notes: s.notes ?? null,
          createdAt: s.createdAt ?? new Date(),
        })),
        meals: mealList.map((m: typeof mealList[number]) => ({
          foodName: m.foodName,
          mealType: m.unit ?? null,
          notes: m.notes ?? null,
          createdAt: m.createdAt ?? new Date(),
        })),
        doctors: doctorList.map((d: typeof doctorList[number]) => ({
          name: d.name,
          specialty: d.specialty ?? null,
          phone: d.phone ?? null,
          email: d.email ?? null,
        })),
      });

      // Send email
      const result = await sendReportEmail({
        to: input.recipientEmail,
        childName: child.name,
        language: input.language,
        pdfBuffer,
        reportDate,
      });

      if (!result.success) {
        throw new Error(result.error ?? "Failed to send email");
      }

      return { success: true, recipientEmail: input.recipientEmail };
    }),
});
