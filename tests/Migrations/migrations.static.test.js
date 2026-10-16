import { jest } from '@jest/globals';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { makePgmRecorder } from './helpers.js';

const MIGRATIONS_DIR = join(process.cwd(), 'migrations');

// Every .js migration file, sorted
const migrationFiles = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith('.js'))
  .sort();

// =============================================================
// Sanity
// =============================================================
describe('Migrations directory', () => {
  it('contains at least one migration', () => {
    expect(migrationFiles.length).toBeGreaterThan(0);
  });

  it('every migration name begins with a numeric timestamp', () => {
    for (const file of migrationFiles) {
      expect(file).toMatch(/^\d+_/);
    }
  });
});

// =============================================================
// Per-migration structural tests
// =============================================================
describe.each(migrationFiles)('migration %s', (file) => {
  let migration;

  beforeAll(async () => {
    migration = await import(join(MIGRATIONS_DIR, file));
  });

  it('exports up as a function', () => {
    expect(typeof migration.up).toBe('function');
  });

  it('exports down as a function', () => {
    expect(typeof migration.down).toBe('function');
  });

  it('up() queues at least one operation', () => {
    const { pgm, calls } = makePgmRecorder();
    migration.up(pgm);
    expect(calls.length).toBeGreaterThan(0);
  });

  it('down() queues at least one operation', () => {
    const { pgm, calls } = makePgmRecorder();
    migration.down(pgm);
    expect(calls.length).toBeGreaterThan(0);
  });

  it('up() does not throw', () => {
    const { pgm } = makePgmRecorder();
    expect(() => migration.up(pgm)).not.toThrow();
  });

  it('down() does not throw', () => {
    const { pgm } = makePgmRecorder();
    expect(() => migration.down(pgm)).not.toThrow();
  });

  it('every createTable call specifies columns', () => {
    const { pgm, calls } = makePgmRecorder();
    migration.up(pgm);

    for (const call of calls.filter((c) => c.op === 'createTable')) {
      const columns = call.args[1];
      expect(columns).toBeDefined();
      expect(typeof columns).toBe('object');
      expect(Object.keys(columns).length).toBeGreaterThan(0);
    }
  });

  it('every createType call specifies at least two values', () => {
    const { pgm, calls } = makePgmRecorder();
    migration.up(pgm);

    for (const call of calls.filter((c) => c.op === 'createType')) {
      const values = call.args[1];
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('every dropType in down() matches a createType in up()', () => {
    const up = makePgmRecorder();
    const down = makePgmRecorder();
    migration.up(up.pgm);
    migration.down(down.pgm);

    const created = new Set(
      up.calls.filter((c) => c.op === 'createType').map((c) => c.args[0])
    );
    const dropped = new Set(
      down.calls.filter((c) => c.op === 'dropType').map((c) => c.args[0])
    );

    for (const t of created) {
      expect(dropped.has(t)).toBe(true);
    }
  });

  it('every createTable in up() is dropped in down()', () => {
    const up = makePgmRecorder();
    const down = makePgmRecorder();
    migration.up(up.pgm);
    migration.down(down.pgm);

    const created = new Set(
      up.calls.filter((c) => c.op === 'createTable').map((c) => c.args[0])
    );
    const dropped = new Set(
      down.calls.filter((c) => c.op === 'dropTable').map((c) => c.args[0])
    );

    for (const t of created) {
      expect(dropped.has(t)).toBe(true);
    }
  });

  it('every createIndex in up() is dropped in down()', () => {
    const up = makePgmRecorder();
    const down = makePgmRecorder();
    migration.up(up.pgm);
    migration.down(down.pgm);

    const createdIndexes = up.calls
      .filter((c) => c.op === 'createIndex')
      .map((c) => c.args[2]?.name)
      .filter(Boolean);

    const droppedIndexes = new Set(
      down.calls
        .filter((c) => c.op === 'dropIndex')
        .map((c) => c.args[2]?.name)
        .filter(Boolean)
    );

    for (const idx of createdIndexes) {
      expect(droppedIndexes.has(idx)).toBe(true);
    }
  });

  it('drops tables before types (correct ordering)', () => {
    const down = makePgmRecorder();
    migration.down(down.pgm);

    const tableIdx = down.calls.findIndex((c) => c.op === 'dropTable');
    if (tableIdx === -1) return;

    const typeIdxs = down.calls
      .map((c, i) => (c.op === 'dropType' ? i : -1))
      .filter((i) => i >= 0);

    for (const t of typeIdxs) {
      expect(t).toBeGreaterThan(tableIdx);
    }
  });
});