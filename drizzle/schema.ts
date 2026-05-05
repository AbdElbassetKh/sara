import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Children profiles
export const children = mysqlTable("children", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  birthDate: date("birthDate").notNull(),
  gender: mysqlEnum("gender", ["boy", "girl"]).notNull(),
  feedingType: mysqlEnum("feedingType", ["breast", "formula", "mixed", "solids"]),
  allergies: json("allergies").$type<string[]>().default([]),
  bloodType: varchar("bloodType", { length: 10 }),
  emergencyContact: json("emergencyContact").$type<{ name: string; phone: string }>(),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Child = typeof children.$inferSelect;
export type InsertChild = typeof children.$inferInsert;

// Food entries
export const foodEntries = mysqlTable("food_entries", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  foodName: varchar("foodName", { length: 255 }).notNull(),
  ingredients: json("ingredients").$type<string[]>().default([]),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 50 }),
  eatenAt: timestamp("eatenAt").notNull(),
  notes: text("notes"),
  photoUrl: text("photoUrl"),
  aiAnalysis: json("aiAnalysis").$type<{ allergens: string[]; riskLevel: string; confidence: number }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FoodEntry = typeof foodEntries.$inferSelect;
export type InsertFoodEntry = typeof foodEntries.$inferInsert;

// Symptom entries
export const symptomEntries = mysqlTable("symptom_entries", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  foodEntryId: int("foodEntryId"),
  symptomType: varchar("symptomType", { length: 100 }).notNull(),
  severity: int("severity").notNull(), // 1-10
  occurredAt: timestamp("occurredAt").notNull(),
  notes: text("notes"),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SymptomEntry = typeof symptomEntries.$inferSelect;
export type InsertSymptomEntry = typeof symptomEntries.$inferInsert;

// Doctor visits
export const doctorVisits = mysqlTable("doctor_visits", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  doctorName: varchar("doctorName", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 100 }),
  visitDate: date("visitDate").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DoctorVisit = typeof doctorVisits.$inferSelect;
export type InsertDoctorVisit = typeof doctorVisits.$inferInsert;

// Prescriptions
export const prescriptions = mysqlTable("prescriptions", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  doctorVisitId: int("doctorVisitId"),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = typeof prescriptions.$inferInsert;

// Growth records
export const growthRecords = mysqlTable("growth_records", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  recordDate: date("recordDate").notNull(),
  weightKg: decimal("weightKg", { precision: 5, scale: 2 }),
  heightCm: decimal("heightCm", { precision: 5, scale: 2 }),
  headCircCm: decimal("headCircCm", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GrowthRecord = typeof growthRecords.$inferSelect;
export type InsertGrowthRecord = typeof growthRecords.$inferInsert;

// Vaccines reference
export const vaccines = mysqlTable("vaccines", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  dueMonth: int("dueMonth").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Vaccine = typeof vaccines.$inferSelect;
export type InsertVaccine = typeof vaccines.$inferInsert;

// Child vaccines status
export const childVaccines = mysqlTable("child_vaccines", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  vaccineId: int("vaccineId").notNull(),
  status: mysqlEnum("status", ["pending", "scheduled", "done", "delayed"]).default("pending"),
  scheduledDate: date("scheduledDate"),
  doneDate: date("doneDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChildVaccine = typeof childVaccines.$inferSelect;
export type InsertChildVaccine = typeof childVaccines.$inferInsert;

// Medical documents
export const medicalDocuments = mysqlTable("medical_documents", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  documentType: mysqlEnum("documentType", ["prescription", "lab_result", "health_card", "vaccination_card", "other"]).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(),
  uploadedAt: date("uploadedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MedicalDocument = typeof medicalDocuments.$inferSelect;
export type InsertMedicalDocument = typeof medicalDocuments.$inferInsert;

// Notifications
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  childId: int("childId").notNull(),
  type: mysqlEnum("type", ["vaccine_reminder", "medication_reminder", "appointment_reminder", "symptom_alert", "allergen_alert", "other"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  isRead: int("isRead").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
// ─── NEW TABLES for Premium/Freemium, Daily Check-ins, Feedback ──────────────

// User subscription / premium status
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["free", "monthly", "yearly"]).default("free").notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled", "pending"]).default("active").notNull(),
  premiumUntil: timestamp("premiumUntil"),
  aiAnalysesUsedToday: int("aiAnalysesUsedToday").default(0),
  aiAnalysesResetAt: timestamp("aiAnalysesResetAt").defaultNow(),
  paymentRef: varchar("paymentRef", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Daily check-ins
export const dailyCheckins = mysqlTable("daily_checkins", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  userId: int("userId").notNull(),
  checkinDate: date("checkinDate").notNull(),
  hasSymptoms: int("hasSymptoms").default(0).notNull(), // 0=no, 1=yes
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type InsertDailyCheckin = typeof dailyCheckins.$inferInsert;

// User feedback / ratings
export const feedbacks = mysqlTable("feedbacks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  appVersion: varchar("appVersion", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;

// Payment history (simulated for MVP)
export const paymentHistory = mysqlTable("payment_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // in DZD
  currency: varchar("currency", { length: 10 }).default("DZD"),
  plan: mysqlEnum("plan", ["monthly", "yearly"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionRef: varchar("transactionRef", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type InsertPaymentHistory = typeof paymentHistory.$inferInsert;

// Doctor appointments
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  userId: int("userId").notNull(),
  doctorName: varchar("doctorName", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 100 }),
  appointmentDate: timestamp("appointmentDate").notNull(),
  location: varchar("location", { length: 255 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["upcoming", "completed", "cancelled"]).default("upcoming").notNull(),
  reminderSent: int("reminderSent").default(0),
  reminderAt: timestamp("reminderAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
