import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

const url = process.env.DATABASE_URL;
if (!url) { console.log('No DATABASE_URL'); process.exit(1); }

const conn = await mysql.createConnection(url);

const statements = [
  // children
  `CREATE TABLE IF NOT EXISTS \`children\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`name\` varchar(255) NOT NULL,
    \`birthDate\` date NOT NULL,
    \`gender\` enum('boy','girl') NOT NULL,
    \`feedingType\` enum('breast','formula','mixed','solids'),
    \`allergies\` json DEFAULT '[]',
    \`bloodType\` varchar(10),
    \`emergencyContact\` json,
    \`photoUrl\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`children_id\` PRIMARY KEY(\`id\`)
  )`,
  // food_entries
  `CREATE TABLE IF NOT EXISTS \`food_entries\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`childId\` int NOT NULL,
    \`foodName\` varchar(255) NOT NULL,
    \`ingredients\` json DEFAULT '[]',
    \`amount\` decimal(10,2),
    \`unit\` varchar(50),
    \`eatenAt\` timestamp NOT NULL,
    \`notes\` text,
    \`photoUrl\` text,
    \`aiAnalysis\` json,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`food_entries_id\` PRIMARY KEY(\`id\`)
  )`,
  // symptom_entries
  `CREATE TABLE IF NOT EXISTS \`symptom_entries\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`childId\` int NOT NULL,
    \`foodEntryId\` int,
    \`symptomType\` varchar(100) NOT NULL,
    \`severity\` int NOT NULL,
    \`occurredAt\` timestamp NOT NULL,
    \`notes\` text,
    \`photoUrl\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`symptom_entries_id\` PRIMARY KEY(\`id\`)
  )`,
  // doctor_visits
  `CREATE TABLE IF NOT EXISTS \`doctor_visits\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`childId\` int NOT NULL,
    \`doctorName\` varchar(255) NOT NULL,
    \`specialty\` varchar(100),
    \`visitDate\` date NOT NULL,
    \`notes\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`doctor_visits_id\` PRIMARY KEY(\`id\`)
  )`,
  // prescriptions
  `CREATE TABLE IF NOT EXISTS \`prescriptions\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`childId\` int NOT NULL,
    \`doctorVisitId\` int,
    \`fileName\` varchar(255) NOT NULL,
    \`fileUrl\` text NOT NULL,
    \`fileKey\` varchar(255) NOT NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`prescriptions_id\` PRIMARY KEY(\`id\`)
  )`,
  // growth_records
  `CREATE TABLE IF NOT EXISTS \`growth_records\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`childId\` int NOT NULL,
    \`recordDate\` date NOT NULL,
    \`weightKg\` decimal(5,2),
    \`heightCm\` decimal(5,2),
    \`headCircCm\` decimal(5,2),
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`growth_records_id\` PRIMARY KEY(\`id\`)
  )`,
  // vaccines
  `CREATE TABLE IF NOT EXISTS \`vaccines\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`name\` varchar(255) NOT NULL,
    \`dueMonth\` int NOT NULL,
    \`description\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`vaccines_id\` PRIMARY KEY(\`id\`)
  )`,
  // child_vaccines (already exists but use IF NOT EXISTS)
  `CREATE TABLE IF NOT EXISTS \`child_vaccines\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`childId\` int NOT NULL,
    \`vaccineId\` int NOT NULL,
    \`status\` enum('pending','scheduled','done','delayed') DEFAULT 'pending',
    \`scheduledDate\` date,
    \`doneDate\` date,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`child_vaccines_id\` PRIMARY KEY(\`id\`)
  )`,
  // medical_documents
  `CREATE TABLE IF NOT EXISTS \`medical_documents\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`childId\` int NOT NULL,
    \`documentType\` enum('prescription','lab_result','health_card','vaccination_card','other') NOT NULL,
    \`fileName\` varchar(255) NOT NULL,
    \`fileUrl\` text NOT NULL,
    \`fileKey\` varchar(255) NOT NULL,
    \`uploadedAt\` date NOT NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`medical_documents_id\` PRIMARY KEY(\`id\`)
  )`,
  // notifications
  `CREATE TABLE IF NOT EXISTS \`notifications\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`childId\` int NOT NULL,
    \`type\` enum('vaccine_reminder','medication_reminder','appointment_reminder','symptom_alert','allergen_alert','other') NOT NULL,
    \`title\` varchar(255) NOT NULL,
    \`content\` text,
    \`isRead\` int DEFAULT 0,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`notifications_id\` PRIMARY KEY(\`id\`)
  )`,
];

for (const sql of statements) {
  const name = sql.match(/CREATE TABLE IF NOT EXISTS `([^`]+)`/)?.[1] ?? 'unknown';
  try {
    await conn.execute(sql);
    console.log(`✅ ${name}`);
  } catch (e) {
    console.error(`❌ ${name}: ${e.message}`);
  }
}

// Verify
const [rows] = await conn.execute('SHOW TABLES');
console.log('\nAll tables:', rows.map(r => Object.values(r)[0]).join(', '));
await conn.end();
