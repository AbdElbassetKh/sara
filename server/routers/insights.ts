import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getFoodEntriesByChildId, getChildById, getSymptomEntriesByChildId } from "../db";
import { invokeLLM } from "../_core/llm";

// ─── Helper: calculate age in months ─────────────────────────────────────────
function ageInMonths(birthDate: Date): number {
  const now = new Date();
  return (now.getFullYear() - birthDate.getFullYear()) * 12 +
    (now.getMonth() - birthDate.getMonth());
}

// ─── 1. RULE-BASED CORRELATION DETECTION ─────────────────────────────────────
/**
 * Detects food-symptom correlations using a simple rule:
 * If the same food is followed by the same symptom type within 4 hours,
 * at least THRESHOLD times → flag as a correlation.
 *
 * Returns an array of correlations sorted by count descending.
 */
const CORRELATION_THRESHOLD = 3;
const WINDOW_HOURS = 4;

export const insightsRouter = router({

  detectCorrelations: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ input }) => {
      const [meals, symptoms] = await Promise.all([
        getFoodEntriesByChildId(input.childId, 200),
        getSymptomEntriesByChildId(input.childId, 200),
      ]);

      // Map: "foodName|symptomType" → count
      const correlationMap = new Map<string, { food: string; symptom: string; count: number; avgSeverity: number; severitySum: number }>();

      for (const meal of meals) {
        const mealTime = new Date(meal.eatenAt).getTime();
        const windowEnd = mealTime + WINDOW_HOURS * 60 * 60 * 1000;

        // Find symptoms that occurred within WINDOW_HOURS after this meal
        const linkedSymptoms = symptoms.filter(s => {
          const st = new Date(s.occurredAt).getTime();
          return st >= mealTime && st <= windowEnd;
        });

        for (const symptom of linkedSymptoms) {
          const key = `${meal.foodName.toLowerCase().trim()}|${symptom.symptomType.toLowerCase().trim()}`;
          const existing = correlationMap.get(key);
          if (existing) {
            existing.count++;
            existing.severitySum += symptom.severity;
            existing.avgSeverity = existing.severitySum / existing.count;
          } else {
            correlationMap.set(key, {
              food: meal.foodName,
              symptom: symptom.symptomType,
              count: 1,
              avgSeverity: symptom.severity,
              severitySum: symptom.severity,
            });
          }
        }
      }

      // Filter by threshold and sort by count descending
      const correlations = Array.from(correlationMap.values())
        .filter(c => c.count >= CORRELATION_THRESHOLD)
        .sort((a, b) => b.count - a.count || b.avgSeverity - a.avgSeverity)
        .map(c => ({
          food: c.food,
          symptom: c.symptom,
          count: c.count,
          avgSeverity: Math.round(c.avgSeverity * 10) / 10,
        }));

      return correlations;
    }),

  // ─── 2. ADVANCED AI ANALYSIS ───────────────────────────────────────────────
  /**
   * Calls the built-in LLM (GPT-4o-mini) with the last 30 days of data.
   * Returns:
   *  - riskLevel: 'low' | 'medium' | 'high'
   *  - suspectFood: string (most suspicious food with confidence %)
   *  - suspectFoodConfidence: number (0-100)
   *  - mainSymptoms: string[] (top 3 symptoms observed)
   *  - adviceAr: string (personalized advice in Arabic)
   *  - adviceFr: string (personalized advice in French)
   *  - adviceEn: string (personalized advice in English)
   *  - summary: string (brief summary in Arabic)
   */
  analyzeWithAI: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .mutation(async ({ input }) => {
      const child = await getChildById(input.childId);
      if (!child) throw new Error("Child not found");

      const since30days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [allMeals, allSymptoms] = await Promise.all([
        getFoodEntriesByChildId(input.childId, 200),
        getSymptomEntriesByChildId(input.childId, 200),
      ]);

      // Filter last 30 days
      const meals = allMeals.filter(m => new Date(m.eatenAt) >= since30days);
      const symptoms = allSymptoms.filter(s => new Date(s.occurredAt) >= since30days);

      const mealSummary = meals.map(m => {
        const ingredients = Array.isArray(m.ingredients) ? (m.ingredients as string[]).join(', ') : '';
        return `${new Date(m.eatenAt).toLocaleDateString('fr-FR')} ${new Date(m.eatenAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} — ${m.foodName}${ingredients ? ` (${ingredients})` : ''}`;
      }).join('\n') || 'Aucun repas enregistré';

      const symptomSummary = symptoms.map(s =>
        `${new Date(s.occurredAt).toLocaleDateString('fr-FR')} ${new Date(s.occurredAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} — ${s.symptomType} (sévérité: ${s.severity}/10)${s.notes ? ` — ${s.notes}` : ''}`
      ).join('\n') || 'Aucun symptôme enregistré';

      const childAge = ageInMonths(child.birthDate);
      const ageLabel = childAge < 12
        ? `${childAge} mois`
        : `${Math.floor(childAge / 12)} ans ${childAge % 12} mois`;

      const knownAllergies = Array.isArray(child.allergies) && child.allergies.length > 0
        ? (child.allergies as string[]).join(', ')
        : 'Aucune allergie connue';

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Tu es un assistant pédiatrique spécialisé en allergologie. Analyse les données de santé d'un enfant sur les 30 derniers jours. Identifie les corrélations entre aliments et symptômes. Fournis des conseils personnalisés, bienveillants et pratiques. Réponds UNIQUEMENT en JSON valide selon le schéma demandé.`,
          },
          {
            role: "user",
            content: `Enfant: ${child.name}, Âge: ${ageLabel}, Allergies connues: ${knownAllergies}\n\nRepas (30 derniers jours):\n${mealSummary}\n\nSymptômes (30 derniers jours):\n${symptomSummary}\n\nAnalyse et fournis:\n1. Niveau de risque global\n2. L'aliment le plus suspect avec ton niveau de confiance (0-100)\n3. Les 3 principaux symptômes observés\n4. Conseils personnalisés en arabe, français et anglais\n5. Un résumé court en arabe pour les parents`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "advanced_health_insights",
            strict: true,
            schema: {
              type: "object",
              properties: {
                riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                suspectFood: { type: "string" },
                suspectFoodConfidence: { type: "number" },
                mainSymptoms: { type: "array", items: { type: "string" } },
                adviceAr: { type: "string" },
                adviceFr: { type: "string" },
                adviceEn: { type: "string" },
                summary: { type: "string" },
              },
              required: ["riskLevel", "suspectFood", "suspectFoodConfidence", "mainSymptoms", "adviceAr", "adviceFr", "adviceEn", "summary"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (!content || typeof content !== 'string') throw new Error("No AI response");

      return JSON.parse(content) as {
        riskLevel: 'low' | 'medium' | 'high';
        suspectFood: string;
        suspectFoodConfidence: number;
        mainSymptoms: string[];
        adviceAr: string;
        adviceFr: string;
        adviceEn: string;
        summary: string;
      };
    }),
});
