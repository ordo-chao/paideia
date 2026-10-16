import { jest } from '@jest/globals';
import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  makeTestClient,
  getColumns,
  tableExists,
} from './helpers.js';
import { TABLES } from './manifest.js';

const hasTestDb = Boolean(process.env.TEST_DB_PASSWORD);
const describeIfDb = (!process.env.SKIP_MIGRATION_TESTS && hasTestDb)
  ? describe
  : describe.skip;

const MIGRATIONS_DIR = join(process.cwd(), 'migrations');
const MIGRATE_BIN = resolve(process.cwd(), 'node_modules/.bin/node-pg-migrate');

function buildTestDbUrl() {
  const {
    TEST_DB_USER = 'postgres',
    TEST_DB_PASSWORD,
    TEST_DB_HOST = 'localhost',
    TEST_DB_PORT = 5432,
    TEST_DB_NAME = 'paideia_test',
  } = process.env;

  if (!TEST_DB_PASSWORD) {
    throw new Error('TEST_DB_PASSWORD is required');
  }

  return `postgres://${TEST_DB_USER}:${encodeURIComponent(TEST_DB_PASSWORD)}@${TEST_DB_HOST}:${TEST_DB_PORT}/${TEST_DB_NAME}`;
}

const TEST_DB_URL = hasTestDb ? buildTestDbUrl() : '';

let client;

describeIfDb('Migrations (live)', () => {
  beforeAll(async () => {
    client = makeTestClient();
    await client.connect();

    // Clean slate
    await client.query('DROP TABLE IF EXISTS pgmigrations CASCADE');
    for (const t of Object.keys(TABLES)) {
      await client.query(`DROP TABLE IF EXISTS "${t}" CASCADE`);
    }

    const { rows: enumRows } = await client.query(`
      SELECT t.typname
      FROM pg_type t
      JOIN pg_enum e ON e.enumtypid = t.oid
      GROUP BY t.typname
    `);
    for (const { typname } of enumRows) {
      await client.query(`DROP TYPE IF EXISTS "${typname}" CASCADE`);
    }

    execSync(`${MIGRATE_BIN} up`, {
      env: { ...process.env, DATABASE_URL: TEST_DB_URL },
      stdio: 'pipe',
    });
  }, 60000);

  afterAll(async () => {
    if (client) {
      for (const t of Object.keys(TABLES)) {
        await client.query(`DROP TABLE IF EXISTS "${t}" CASCADE`);
      }
      await client.query('DROP TABLE IF EXISTS pgmigrations CASCADE');
      await client.end();
    }
  });

  it('creates the pgmigrations tracking table', async () => {
    expect(await tableExists(client, 'pgmigrations')).toBe(true);
  });

  it('records one row per migration file', async () => {
    const { rows } = await client.query('SELECT name FROM pgmigrations');
    const recorded = rows.map((r) => r.name).sort();

    const expected = readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.js'))
      .map((f) => f.replace(/\.js$/, ''))
      .sort();

    expect(recorded).toEqual(expected);
  });

  describe.each(Object.entries(TABLES))('table "%s"', (tableName, spec) => {
    it('exists', async () => {
      expect(await tableExists(client, tableName)).toBe(true);
    });

    it('has columns', async () => {
      const cols = await getColumns(client, tableName);
      expect(cols.length).toBeGreaterThan(0);
    });

    it('has a primary key', async () => {
      const { rows } = await client.query(
        `SELECT conname FROM pg_constraint
         WHERE conrelid = $1::regclass AND contype = 'p'`,
        [tableName]
      );
      expect(rows.length).toBe(1);
    });

    it('every primary key column exists in the table', async () => {
      const cols = await getColumns(client, tableName);
      const names = new Set(cols.map((c) => c.column_name));
      for (const pk of spec.pk) {
        expect(names.has(pk)).toBe(true);
      }
    });
  });

  describe('Rollback', () => {
    beforeAll(async () => {
      execSync(`${MIGRATE_BIN} down --count 999`, {
        env: { ...process.env, DATABASE_URL: TEST_DB_URL },
        stdio: 'pipe',
      });
    }, 60000);

    it('removes every table listed in the manifest', async () => {
      for (const t of Object.keys(TABLES)) {
        expect(await tableExists(client, t)).toBe(false);
      }
    });

    afterAll(async () => {
      execSync(`${MIGRATE_BIN} up`, {
        env: { ...process.env, DATABASE_URL: TEST_DB_URL },
        stdio: 'pipe',
      });
    }, 60000);
  });
});