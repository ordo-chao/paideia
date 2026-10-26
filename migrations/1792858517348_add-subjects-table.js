/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types first
  pgm.createType('type_enum', ['core', 'elective']);
  // 2. Create the subjects table
  pgm.createTable('subjects', {

    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    code: {
      type: 'varchar(20)',
      notNull: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true
    },
    description:
    {
      type: 'varchar(255)',
      notNull: true
    },
    type: {
      type: 'type_enum',
      notNull: true,
      default: 'core',
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  // 3. CHECK constraints
  pgm.addConstraint('subjects', 'subjects_type_check', {
    check: "type IN ('core', 'elective')",
  });


  // 4. Index on deleted_at
  pgm.createIndex('subjects', 'deleted_at', {
    name: 'subjects_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('subjects', 'deleted_at', { name: 'subjects_deleted_at_idx' });
  pgm.dropTable('subjects');
  pgm.dropConstraint('subjects', 'subjects_type_check');
  pgm.dropType('type_enum');
};