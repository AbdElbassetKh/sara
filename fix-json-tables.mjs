import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS \`children\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`name\` varchar(255) NOT NULL,
    \`birthDate\` date NOT NULL,
    \`gender\` enum('boy','girl') NOT NULL,
    \`feedingType\` enum('breast','formula','mixed','solids'),
    \`allergies\` json,
    \`bloodType\` varchar(10),
    \`emergencyContact\` json,
    \`photoUrl\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`children_id\` PRIMARY KEY(\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`food_entries\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`childId\` int NOT NULL,
    \`foodName\` varchar(255) NOT NULL,
    \`ingredients\` json,
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

const [rows] = await conn.execute('SHOW TABLES');
console.log('\nAll tables:', rows.map(r => Object.values(r)[0]).join(', '));
await conn.end();
