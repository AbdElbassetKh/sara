import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getFoodEntriesByChildId, createFoodEntry, getChildById, getSymptomEntriesByChildId } from "../db";
import { invokeLLM } from "../_core/llm";

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const analyzeInsightsProcedure = protectedProcedure
  .input(z.object({ childId: z.number() }))
  .mutation(async ({ input }) => {
    const child = await getChildById(input.childId);
    if (!child) throw new Error("Child not found");

    const [meals, symptoms] = await Promise.all([
      getFoodEntriesByChildId(input.childId, 100),
      getSymptomEntriesByChildId(input.childId, 100),
    ]);

    const mealSummary = meals.slice(0, 30).map(m =>
      `${new Date(m.eatenAt).toLocaleDateString()} - ${m.foodName} (${(m.ingredients as string[] | null)?.join(', ') ?? ''})`
    ).join('\n');

    const symptomSummary = symptoms.slice(0, 30).map(s =>
      `${new Date(s.occurredAt).toLocaleDateString()} - ${s.symptomType} (severity: ${s.severity})`
    ).join('\n');

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a pediatric health AI. Analyze the child's meals and symptoms from the last 30 days. Identify patterns, probable trigger foods, and provide actionable recommendations. Return JSON.`,
        },
        {
          role: "user",
          content: `Child: ${child.name}, Age: ${calculateAge(child.birthDate)}, Known allergies: ${(child.allergies as string[] | null)?.join(', ') || 'None'}\n\nMeals (last 30 days):\n${mealSummary || 'No meals logged'}\n\nSymptoms (last 30 days):\n${symptomSummary || 'No symptoms logged'}\n\nProvide analysis.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "health_insights",
          strict: true,
          schema: {
            type: "object",
            properties: {
              riskLevel: { type: "string", enum: ["low", "medium", "high"] },
              triggerFoods: { type: "array", items: { type: "string" } },
              recommendations: { type: "string" },
              vaccineReminders: { type: "array", items: { type: "string" } },
              summary: { type: "string" },
            },
            required: ["riskLevel", "triggerFoods", "recommendations", "vaccineReminders", "summary"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No AI response");
    return JSON.parse(content) as {
      riskLevel: 'low' | 'medium' | 'high';
      triggerFoods: string[];
      recommendations: string;
      vaccineReminders: string[];
      summary: string;
    };
  });

export const mealsRouter = router({
  analyzeInsights: analyzeInsightsProcedure,

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

      const allergenAnalysis = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a pediatric allergist AI assistant. Analyze food ingredients for potential allergens based on the child's profile. Return a JSON response with allergens found, risk level (low/medium/high), and confidence score (0-100).`,
          },
          {
            role: "user",
            content: `Child Profile: Age ${calculateAge(child.birthDate)}, Known Allergies: ${(child.allergies as string[] | null)?.join(", ") || "None"}. Food: ${input.foodName}, Ingredients: ${input.ingredients.join(", ")}. Analyze for allergens and provide risk assessment.`,
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
