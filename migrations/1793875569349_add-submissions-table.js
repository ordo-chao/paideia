/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types
  pgm.createType('submissions_status_enum', [
    'submitted', 'late', 'graded', 'returned', 'draft', 'missing',
  ]);

  // 2. Create the submissions table
  pgm.createTable('submissions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    assignment_id: { type: 'uuid', allowNull: false },
    student_id:          { type: 'uuid', allowNull: false },

    attempt_number: { type: 'integer', defaultValue: 1 },
    content:        { type: 'text' },
    external_url:   { type: 'varchar(255)' },

    submitted_at:   { type: 'timestamptz', defaultValue: pgm.func('now()') },
    is_late:        { type: 'boolean', defaultValue: false },
    status: {
      type: 'submissions_status_enum',
      defaultValue: 'submitted',
    },
    auto_score:     { type: 'float' },

    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  pgm.createIndex('submissions', 'deleted_at', {
    name: 'submissions_deleted_at_idx',
  });
};

export const down = (pgm) => {
  // Order matters: index → table → types
  pgm.dropIndex('submissions', 'deleted_at', {
    name: 'submissions_deleted_at_idx',
  });

  pgm.dropTable('submissions');   // drops all constraints automatically

  // Drop ALL enum types that were created
  pgm.dropType('submissions_status_enum');
};