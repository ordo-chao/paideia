import { jest } from '@jest/globals';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import {
  makeTestClient,
  getColumns,
  getEnums,
  getCheckConstraints,
  loadModelShape,
} from './helpers.js';
import { TABLES } from './manifest.js';

// =============================================================
// Environment gate
// =============================================================
const hasTestDb = Boolean(process.env.TEST_DB_PASSWORD);
const describeIfDb = (!process.env.SKIP_MIGRATION_TESTS && hasTestDb)
  ? describe
  : describe.skip;

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

// =============================================================
// Load every model shape up front
// =============================================================
const models = {};

for (const [tableName, spec] of Object.entries(TABLES)) {
  const shape = await loadModelShape(jest, spec.model);
  models[tableName] = shape;
}

// =============================================================
// DB connection + schema setup
// =============================================================
let client;

beforeAll(async () => {
  if (!hasTestDb) return;

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

  // Run migrations so the schema exists for our tests
  execSync(`${MIGRATE_BIN} up`, {
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    stdio: 'pipe',
  });
}, 60000);

afterAll(async () => {
  if (client) await client.end();
});

// =============================================================
// Static parity — model attributes vs. the model file's options
// (No DB needed)
// =============================================================
describe.each(Object.entries(TABLES))(
  'Static parity: %s',
  (tableName, spec) => {
    const model = models[tableName];

    it('model name matches the table name', () => {
      expect(model.name).toBe(tableName);
    });

    it('paranoid / deletedAt are consistent if enabled', () => {
      if (model.options?.paranoid) {
        expect(model.options.deletedAt).toBe('deleted_at');
        expect(model.attributes.deleted_at).toBeDefined();
      }
    });

    it('has a defaultScope excluding password if password exists', () => {
      if (!model.attributes.password) return;
      expect(model.options?.defaultScope?.attributes?.exclude).toContain(
        'password'
      );
    });
  }
);

// =============================================================
// Live parity — DB columns vs. model attributes
// =============================================================
describeIfDb('Live parity: DB vs. model', () => {
  describe.each(Object.entries(TABLES))(
    'table "%s"',
    (tableName, spec) => {
      const model = models[tableName];

      it('DB column set matches model attribute set', async () => {
        const dbCols = await getColumns(client, tableName);
        const dbNames = dbCols.map((c) => c.column_name).sort();
        const modelNames = Object.keys(model.attributes).sort();
        expect(dbNames).toEqual(modelNames);
      });

      it('NOT NULL matches for every column', async () => {
        const dbCols = await getColumns(client, tableName);

        for (const [colName, attr] of Object.entries(model.attributes)) {
          const db = dbCols.find((c) => c.column_name === colName);
          expect(db).toBeDefined();

          const modelNotNull = attr.allowNull === false;
          const dbNotNull = db.is_nullable === 'NO';
          const isPk = attr.primaryKey === true;

          if (isPk) {
            expect(dbNotNull).toBe(true);
          } else {
            expect(dbNotNull).toBe(modelNotNull);
          }
        }
      });

      it('every model ENUM column is a matching Postgres ENUM', async () => {
        const dbCols = await getColumns(client, tableName);

        for (const [colName, attr] of Object.entries(model.attributes)) {
          const hasEnumValues = Array.isArray(attr.type?.values);
          if (!hasEnumValues) continue;

          const db = dbCols.find((c) => c.column_name === colName);
          expect(db).toBeDefined();
          expect(db.data_type).toBe('USER-DEFINED');

          const dbValues = await getEnums(client, db.udt_name);
          expect(dbValues).toEqual(attr.type.values);
        }
      });

      it('every validate.isIn has a matching CHECK constraint', async () => {
        const checks = await getCheckConstraints(client, tableName);

        for (const [colName, attr] of Object.entries(model.attributes)) {
          const isIn = attr.validate?.isIn;
          if (!isIn) continue;

          const check = checks.find(
            (c) =>
              c.def.includes(colName) ||
              c.conname.toLowerCase().includes(colName)
          );
          expect(check).toBeDefined();

          const allowed = isIn.args?.[0] || isIn;
          for (const v of allowed) {
            expect(check.def).toContain(`'${v}'`);
          }
        }
      });
    }
  );
});

// =============================================================
// Global enum sanity
// =============================================================
describeIfDb('Global parity checks', () => {
  it('every enum in the DB has at least 2 values', async () => {
    const { rows } = await client.query(`
      SELECT t.typname, array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels
      FROM pg_type t
      JOIN pg_enum e ON e.enumtypid = t.oid
      GROUP BY t.typname
    `);
    for (const { labels } of rows) {
      expect(labels.length).toBeGreaterThanOrEqual(2);
    }
  });
});