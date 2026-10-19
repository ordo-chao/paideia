import dotenv from 'dotenv';
dotenv.config();

export default {
  databaseUrl: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  dir: 'migrations',
  migrationsTable: 'pgmigrations',
  direction: 'up',
  count: Infinity,
  verbose: true,
  checkOrder: true,
};