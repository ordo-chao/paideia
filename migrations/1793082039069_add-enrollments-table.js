/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types first
  pgm.createType('status_enum', ['active', 'inactive', 'completed']);

  // 2. Create the enrollments table
  pgm.createTable('enrollments', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    student_id: { 
      type: 'uuid',
      allowNull: true
     },
    class_stream_id: { 
      type: 'uuid',
      allowNull: true
    },
    status: {
      type: 'status_enum',
      notNull: true,
      default: 'inactive',
    },
    enrolled_on: { 
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()')
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  // 3. CHECK constraints
  pgm.addConstraint('enrollments', 'enrollments_status_check', {
    check: "status IN ('active', 'inactive', 'completed')",
  });

  // 4. Index on deleted_at
  pgm.createIndex('enrollments', 'deleted_at', {
    name: 'enrollments_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('enrollments', 'deleted_at', { name: 'enrollments_deleted_at_idx' });
  pgm.dropConstraint('enrollments', 'enrollments_status_check');
  pgm.dropTable('enrollments');
  pgm.dropType('status_enum');
};