import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { foodCategories, foodItems, symptomTypes } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const foodCatalogRouter = router({

  /** List all food categories ordered by sortOrder */
  listCategories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(foodCategories).orderBy(foodCategories.sortOrder);
  }),

  /** List food items, optionally filtered by categoryId */
  listItems: publicProcedure
    .input(z.object({ categoryId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      if (input.categoryId) {
        return db.select().from(foodItems).where(eq(foodItems.categoryId, input.categoryId));
      }
      return db.select().from(foodItems);
    }),

  /** List all symptom types */
  listSymptomTypes: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(symptomTypes).orderBy(symptomTypes.category);
  }),
});
