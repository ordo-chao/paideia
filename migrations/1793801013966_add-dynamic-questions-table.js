/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types
  pgm.createType('question_type_enum', [
      'text', 'textarea', 'number', 'email', 'phone', 'date', 'time',
      'datetime', 'select', 'multiselect', 'radio', 'checkbox',
      'checkboxes', 'file', 'rating', 'url'
  ]);

  pgm.createType('dynamic_questions_ask_timing_enum', [
    'quiz' , 'before_registration', 'after_registration', 'after_event'
  ]);

  // 2. Create the dynamic_questions table
  pgm.createTable('dynamic_questions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    assignment_id: { type: 'uuid', allowNull: false },

    question_text:        { type: 'varchar(255)', allowNull: false },
    placeholder:  { type: 'text', allowNull: false },
    help_text: { type: 'text', allowNull: false },

    question_type: {
      type: 'question_type_enum',
      notNull: true,
      default: 'text',
    },
    ask_timing: {
      type: 'dynamic_questions_ask_timing_enum',
      notNull: true,
      default: 'quiz',
    },
    points:   { type: 'integer', defaultValue: 50 },

    is_required: { type: 'boolean', defaultValue: false },
    is_active:    { type: 'boolean', defaultValue: false },
    display_order:           { type: 'integer', defaultValue: 1 },
    is_admin_only:           { type: 'boolean', defaultValue: false },

    options:        { type: 'jsonb' },
    validation_rules:        { type: 'jsonb' },
    conditional_logic:        { type: 'jsonb' },
    correct_answer:        { type: 'jsonb' },

    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  pgm.createIndex('dynamic_questions', 'deleted_at', {
    name: 'dynamic_questions_deleted_at_idx',
  });
};

export const down = (pgm) => {
  // Order matters: index → table → types
  pgm.dropIndex('dynamic_questions', 'deleted_at', {
    name: 'dynamic_questions_deleted_at_idx',
  });

  pgm.dropTable('dynamic_questions');   // drops all constraints automatically

  pgm.dropType('dynamic_questions_ask_timing_enum');
  pgm.dropType('question_type_enum');
};