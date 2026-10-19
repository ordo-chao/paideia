import { execSync } from 'node:child_process';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME;
const adminUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/postgres`;

async function reset() {
  const client = new pg.Client({ connectionString: adminUrl });
  await client.connect();

  console.log(`Dropping and recreating database "${dbName}"...`);
  await client.query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`);
  await client.query(`CREATE DATABASE "${dbName}"`);
  await client.end();

  console.log('Running migrations...');
  execSync('npm run migrate:up', { stdio: 'inherit' });

  console.log('Done.');
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});