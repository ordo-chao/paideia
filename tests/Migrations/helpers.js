import pg from 'pg';

export function makePgmRecorder() {
  const calls = [];
  const record = (op, ...args) => calls.push({ op, args });

  const pgm = {
    createType: (name, values, opts) => record('createType', name, values, opts),
    dropType: (name, opts) => record('dropType', name, opts),
    createTable: (name, columns, opts) => record('createTable', name, columns, opts),
    dropTable: (name, opts) => record('dropTable', name, opts),
    renameTable: (from, to) => record('renameTable', from, to),
    addColumns: (table, columns) => record('addColumns', table, columns),
    dropColumns: (table, columns) => record('dropColumns', table, columns),
    renameColumn: (table, from, to) => record('renameColumn', table, from, to),
    alterColumn: (table, column, opts) => record('alterColumn', table, column, opts),
    addConstraint: (table, name, expr) => record('addConstraint', table, name, expr),
    dropConstraint: (table, name, opts) => record('dropConstraint', table, name, opts),
    createIndex: (table, columns, opts) => record('createIndex', table, columns, opts),
    dropIndex: (table, columns, opts) => record('dropIndex', table, columns, opts),
    sql: (query) => record('sql', query),
    func: (name) => ({ __func: name }),
  };

  return { pgm, calls };
}

export function makeTestClient() {
  return new pg.Client({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: Number(process.env.TEST_DB_PORT) || 5432,
    database: process.env.TEST_DB_NAME || 'paideia_test',
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
  });
}

export async function getColumns(client, table) {
  const { rows } = await client.query(
    `
    SELECT column_name, data_type, udt_name, is_nullable,
           column_default, character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
    ORDER BY ordinal_position
    `,
    [table]
  );
  return rows;
}

export async function getEnums(client, typeName) {
  const { rows } = await client.query(
    `
    SELECT e.enumlabel
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = $1
    ORDER BY e.enumsortorder
    `,
    [typeName]
  );
  return rows.map((r) => r.enumlabel);
}

export async function getCheckConstraints(client, table) {
  const { rows } = await client.query(
    `
    SELECT conname, pg_get_constraintdef(oid) AS def
    FROM pg_constraint
    WHERE conrelid = $1::regclass AND contype = 'c'
    ORDER BY conname
    `,
    [table]
  );
  return rows;
}

export async function getIndexes(client, table) {
  const { rows } = await client.query(
    `
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = $1
    ORDER BY indexname
    `,
    [table]
  );
  return rows;
}

export async function tableExists(client, table) {
  const { rows } = await client.query(
    `
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = $1
    `,
    [table]
  );
  return rows.length > 0;
}

// =============================================================
// Model loader — reads the attribute shape of a Sequelize model
// WITHOUT connecting to a real DB.
// =============================================================

// =============================================================
// Model loader — reads the attribute shape of a Sequelize model
// WITHOUT connecting to a real DB.
//
// `jestInstance` is passed in by the caller (from a *.test.js file)
// because `jest` is not available inside a plain module.
// =============================================================

export async function loadModelShape(jestInstance, modelFileName) {
  const defineCalls = [];

  jestInstance.unstable_mockModule('../../Utils/db.js', () => ({
    default: {
      define: (name, attributes, options) => {
        const model = { name, attributes, options, __fake: true };
        defineCalls.push(model);
        return model;
      },
      sync: () => Promise.resolve(),
    },
  }));

  const mod = await import(`../../Models/${modelFileName}`);
  const shape = defineCalls[0];
  if (!shape) {
    throw new Error(`${modelFileName} did not call sequelize.define()`);
  }
  return { ...shape, defaultExport: mod.default };
}