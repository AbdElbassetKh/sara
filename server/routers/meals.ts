import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getFoodEntriesByChildId, createFoodEntry, getChildById } from "../db";
import { invokeLLM } from "../_core/llm";

export const mealsRouter = router({
  list: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ input }) => {
      return getFoodEntriesByChildId(input.childId, 50);
    }),

  create: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        foodName: z.string().min(1),
        ingredients: z.array(z.string()),
        amount: z.number().optional(),
        unit: z.string().optional(),
        notes: z.string().optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const child = await getChildById(input.childId);
      if (!child) throw new Error("Child not found");

      // Analyze ingredients with LLM
      const allergenAnalysis = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a pediatric allergist AI assistant. Analyze food ingredients for potential allergens based on the child's profile. Return a JSON response with allergens found, risk level (low/medium/high), and confidence score (0-100).`,
          },
          {
            role: "user",
            content: `Child Profile: Age ${calculateAge(child.birthDate)}, Known Allergies: ${child.allergies?.join(", ") || "None"}. Food: ${input.foodName}, Ingredients: ${input.ingredients.join(", ")}. Analyze for allergens and provide risk assessment.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "allergen_analysis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                allergens: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of detected allergens",
                },
                riskLevel: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Overall risk level",
                },
                confidence: {
                  type: "number",
                  description: "Confidence score 0-100",
                },
              },
              required: ["allergens", "riskLevel", "confidence"],
              additionalProperties: false,
            },
          },
        },
      });

      let aiAnalysis = { allergens: [], riskLevel: "low", confidence: 0 };
      try {
        const content = allergenAnalysis.choices[0]?.message.content;
        if (content && typeof content === "string") {
          aiAnalysis = JSON.parse(content);
        }
      } catch (e) {
        console.error("Failed to parse LLM response:", e);
      }

      return createFoodEntry({
        childId: input.childId,
        foodName: input.foodName,
        ingredients: input.ingredients,
        amount: input.amount ? String(input.amount) : undefined,
        unit: input.unit,
        eatenAt: new Date(),
        notes: input.notes,
        photoUrl: input.photoUrl,
        aiAnalysis,
      });
    }),
});

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
