/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types
  pgm.createType('assignment_type_enum', [
    'homework', 'quiz', 'project', 'discussion',
    'reading', 'essay', 'file_upload', 'coding',
  ]);

  pgm.createType('assignments_submission_mode_enum', [
    'online', 'file', 'url', 'quiz', 'mixed', 'none',
  ]);

  pgm.createType('assignments_status_enum', [
    'draft', 'published', 'closed', 'archived',
  ]);

  // 2. Create the assignments table
  pgm.createTable('assignments', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    class_subject_id: { type: 'uuid', allowNull: false },
    term_id:          { type: 'uuid', allowNull: false },
    teacher_id:       { type: 'uuid', allowNull: false },

    title:        { type: 'varchar(255)', allowNull: false },
    description:  { type: 'text', allowNull: false },
    instructions: { type: 'text', allowNull: false },

    assignment_type: {
      type: 'assignment_type_enum',
      notNull: true,
      default: 'homework',
    },
    submission_mode: {
      type: 'assignments_submission_mode_enum',
      notNull: true,
      default: 'online',
    },
    status: {
      type: 'assignments_status_enum',
      notNull: true,
      default: 'draft',
    },

    max_score:       { type: 'integer', defaultValue: 100 },
    weight:          { type: 'float',   defaultValue: 1.0 },
    passing_score:   { type: 'integer', defaultValue: 50 },

    assigned_on:     { type: 'date', defaultValue: pgm.func('now()') },
    available_from:  { type: 'date' },
    due_date:        { type: 'date' },
    available_until: { type: 'date' },

    allow_late_submission: { type: 'boolean', defaultValue: false },
    allow_resubmission:    { type: 'boolean', defaultValue: false },
    max_attempts:           { type: 'integer', defaultValue: 1 },

    is_graded:          { type: 'boolean', defaultValue: false },
    is_team_assignment: { type: 'boolean', defaultValue: false },
    quiz_config:        { type: 'jsonb' },

    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  pgm.createIndex('assignments', 'deleted_at', {
    name: 'assignments_deleted_at_idx',
  });
};

export const down = (pgm) => {
  // Order matters: index → table → types
  pgm.dropIndex('assignments', 'deleted_at', {
    name: 'assignments_deleted_at_idx',
  });

  pgm.dropTable('assignments');   // drops all constraints automatically

  // Drop ALL enum types that were created
  pgm.dropType('assignments_status_enum');
  pgm.dropType('assignments_submission_mode_enum');
  pgm.dropType('assignment_type_enum');
};