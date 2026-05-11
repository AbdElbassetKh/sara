import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getFoodEntriesByChildId, getChildById, getSymptomEntriesByChildId } from "../db";
import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { children } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// ─── Ownership check helper ───────────────────────────────────────────────────
async function assertChildOwnership(userId: number, childId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
  const rows = await db
    .select({ id: children.id })
    .from(children)
    .where(and(eq(children.id, childId), eq(children.userId, userId)))
    .limit(1);
  if (rows.length === 0) throw new TRPCError({ code: "FORBIDDEN", message: "Child not found or access denied" });
}

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
    .query(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
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
    .mutation(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
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

  // ─── 3. SYMPTOM TIME SERIES ───────────────────────────────────────────────────────────────────────────────────
  /**
   * Returns daily symptom counts and average severity for the last N days.
   * Used for the LineChart on the Insights page.
   */
  getSymptomTimeSeries: protectedProcedure
    .input(z.object({ childId: z.number(), days: z.number().min(7).max(90).default(30) }))
    .query(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
      const symptoms = await getSymptomEntriesByChildId(input.childId, 500);
      const meals    = await getFoodEntriesByChildId(input.childId, 500);

      const result: { date: string; symptoms: number; avgSeverity: number; meals: number }[] = [];

      for (let i = input.days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const daySymptoms = symptoms.filter(s => new Date(s.occurredAt).toISOString().split('T')[0] === dateStr);
        const dayMeals    = meals.filter(m => new Date(m.eatenAt).toISOString().split('T')[0] === dateStr);

        const avgSev = daySymptoms.length > 0
          ? Math.round((daySymptoms.reduce((acc, s) => acc + s.severity, 0) / daySymptoms.length) * 10) / 10
          : 0;

        result.push({ date: dateStr, symptoms: daySymptoms.length, avgSeverity: avgSev, meals: dayMeals.length });
      }

      return result;
    }),

  // ─── 4. SYMPTOM FREQUENCY BY TYPE ─────────────────────────────────────────────────────────────────────────────
  /**
   * Returns symptom frequency grouped by type, sorted by count.
   * Used for the BarChart / RadarChart on the Insights page.
   */
  getSymptomFrequency: protectedProcedure
    .input(z.object({ childId: z.number(), days: z.number().min(7).max(90).default(30) }))
    .query(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const symptoms = await getSymptomEntriesByChildId(input.childId, 500);
      const filtered = symptoms.filter(s => new Date(s.occurredAt) >= since);

      const freqMap = new Map<string, { count: number; totalSeverity: number }>();
      for (const s of filtered) {
        const key = s.symptomType;
        const existing = freqMap.get(key);
        if (existing) {
          existing.count++;
          existing.totalSeverity += s.severity;
        } else {
          freqMap.set(key, { count: 1, totalSeverity: s.severity });
        }
      }

      return Array.from(freqMap.entries())
        .map(([type, { count, totalSeverity }]) => ({
          type,
          count,
          avgSeverity: Math.round((totalSeverity / count) * 10) / 10,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // top 10
    }),

  // ─── 5. MEAL × SYMPTOM HEATMAP DATA ─────────────────────────────────────────────────────────────────────────────
  /**
   * Returns a matrix of food × symptom co-occurrences (within 4h window).
   * Used for the heatmap on the Insights page.
   * Returns top 6 foods × top 6 symptoms for readability.
   */
  getMealSymptomHeatmap: protectedProcedure
    .input(z.object({ childId: z.number(), days: z.number().min(7).max(90).default(30) }))
    .query(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const [allMeals, allSymptoms] = await Promise.all([
        getFoodEntriesByChildId(input.childId, 500),
        getSymptomEntriesByChildId(input.childId, 500),
      ]);

      const meals    = allMeals.filter(m => new Date(m.eatenAt) >= since);
      const symptoms = allSymptoms.filter(s => new Date(s.occurredAt) >= since);

      // Build co-occurrence map: food × symptom → count
      const coMap = new Map<string, number>();
      const foodCounts  = new Map<string, number>();
      const symptomCounts = new Map<string, number>();

      for (const meal of meals) {
        const mealTime = new Date(meal.eatenAt).getTime();
        const windowEnd = mealTime + 4 * 60 * 60 * 1000;
        const food = meal.foodName.trim();

        for (const s of symptoms) {
          const st = new Date(s.occurredAt).getTime();
          if (st >= mealTime && st <= windowEnd) {
            const symptom = s.symptomType.trim();
            const key = `${food}|||${symptom}`;
            coMap.set(key, (coMap.get(key) ?? 0) + 1);
            foodCounts.set(food, (foodCounts.get(food) ?? 0) + 1);
            symptomCounts.set(symptom, (symptomCounts.get(symptom) ?? 0) + 1);
          }
        }
      }

      // Top 6 foods and top 6 symptoms by co-occurrence count
      const topFoods    = Array.from(foodCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0]);
      const topSymptoms = Array.from(symptomCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0]);

      // Build matrix
      const matrix = topFoods.map(food => ({
        food,
        values: topSymptoms.map(symptom => ({
          symptom,
          count: coMap.get(`${food}|||${symptom}`) ?? 0,
        })),
      }));

      return { foods: topFoods, symptoms: topSymptoms, matrix };
    }),

  // ─── 4. NATURAL LANGUAGE CHAT ─────────────────────────────────────────────
  /**
   * The user asks a question in natural language (any language).
   * The LLM answers based on the child's last 30 days of data.
   * Always responds in the same language as the question.
   */
  chat: protectedProcedure
    .input(z.object({
      childId: z.number(),
      question: z.string().min(1).max(500),
      language: z.enum(['ar', 'fr', 'en']).default('ar'),
    }))
    .mutation(async ({ ctx, input }) => {
      await assertChildOwnership(ctx.user.id, input.childId);
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const [child, meals, symptoms] = await Promise.all([
        getChildById(input.childId),
        getFoodEntriesByChildId(input.childId, 200),
        getSymptomEntriesByChildId(input.childId, 200),
      ]);

      if (!child) throw new Error('Child not found');

      // Filter to last 30 days
      const recentMeals = meals.filter(m => new Date(m.eatenAt) >= since);
      const recentSymptoms = symptoms.filter(s => new Date(s.occurredAt) >= since);

      // Build concise data summary
      const mealSummary = recentMeals.slice(0, 50).map(m => {
        const date = new Date(m.eatenAt).toLocaleDateString();
        const ingredients = Array.isArray(m.ingredients) ? m.ingredients.join(', ') : m.foodName;
        return `${date}: ${ingredients}`;
      }).join('\n');

      const symptomSummary = recentSymptoms.slice(0, 50).map(s => {
        const date = new Date(s.occurredAt).toLocaleDateString();
        return `${date}: ${s.symptomType} (severity ${s.severity}/10)`;
      }).join('\n');

      const langInstruction = input.language === 'ar'
        ? 'Respond in Arabic (العربية). Be concise and use simple words suitable for parents.'
        : input.language === 'fr'
        ? 'Respond in French. Be concise and use simple words suitable for parents.'
        : 'Respond in English. Be concise and use simple words suitable for parents.';

      const systemPrompt = `You are a helpful pediatric nutrition assistant for the AlleNest app. You help parents understand their child's food allergies and symptoms.

Child: ${child.name}, ${ageInMonths(new Date(child.birthDate))} months old.

Recent meals (last 30 days):
${mealSummary || 'No meals recorded'}

Recent symptoms (last 30 days):
${symptomSummary || 'No symptoms recorded'}

${langInstruction}
IMPORTANT: Always remind parents to consult a doctor for medical decisions. Do not diagnose.`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input.question },
        ],
      });

      const answer = response.choices?.[0]?.message?.content ?? '';
      return { answer };
    }),
});
