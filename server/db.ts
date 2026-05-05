import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, children, InsertChild, foodEntries, InsertFoodEntry, symptomEntries, InsertSymptomEntry, growthRecords, InsertGrowthRecord, vaccines, childVaccines, InsertChildVaccine, medicalDocuments, InsertMedicalDocument, notifications, InsertNotification, doctorVisits, InsertDoctorVisit } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Children queries
export async function getChildrenByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(children).where(eq(children.userId, userId));
}

export async function getChildById(childId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createChild(data: InsertChild) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(children).values(data);
  return result;
}

export async function updateChild(childId: number, data: Partial<InsertChild>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(children).set(data).where(eq(children.id, childId));
}

// Food entries queries
export async function getFoodEntriesByChildId(childId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(foodEntries).where(eq(foodEntries.childId, childId)).limit(limit);
}

export async function createFoodEntry(data: InsertFoodEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(foodEntries).values(data);
}

// Symptom entries queries
export async function getSymptomEntriesByChildId(childId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(symptomEntries).where(eq(symptomEntries.childId, childId)).limit(limit);
}

export async function createSymptomEntry(data: InsertSymptomEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(symptomEntries).values(data);
}

// Growth records queries
export async function getGrowthRecordsByChildId(childId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(growthRecords).where(eq(growthRecords.childId, childId));
}

export async function createGrowthRecord(data: InsertGrowthRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(growthRecords).values(data);
}

// Vaccines queries
export async function getAllVaccines() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vaccines);
}

export async function getChildVaccinesByChildId(childId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(childVaccines).where(eq(childVaccines.childId, childId));
}

export async function createChildVaccine(data: InsertChildVaccine) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(childVaccines).values(data);
}

// Medical documents queries
export async function getMedicalDocumentsByChildId(childId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(medicalDocuments).where(eq(medicalDocuments.childId, childId));
}

export async function createMedicalDocument(data: InsertMedicalDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(medicalDocuments).values(data);
}

// Notifications queries
export async function getNotificationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(notifications).values(data);
}

// Doctor visits queries
export async function getDoctorVisitsByChildId(childId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(doctorVisits).where(eq(doctorVisits.childId, childId));
}

export async function createDoctorVisit(data: InsertDoctorVisit) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(doctorVisits).values(data);
}
