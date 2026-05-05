import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

const url = process.env.DATABASE_URL;
if (!url) { console.log('No DATABASE_URL'); process.exit(1); }

const conn = await mysql.createConnection(url);
const [rows] = await conn.execute('SHOW TABLES');
console.log('Tables:', rows.map(r => Object.values(r)[0]).join(', '));
await conn.end();
