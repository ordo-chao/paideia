/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {


  // 2. Create the question_responses table
  pgm.createTable('question_responses', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    question_id: { 
      type: 'uuid',
      allowNull: true
     },
    submission_id: { 
      type: 'uuid',
      allowNull: true
    },
    response_value: { type: 'JSONB' },
    is_correct: { type: 'BOOLEAN' },
    awarded_points: { type: 'FLOAT' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });


  // 4. Index on deleted_at
  pgm.createIndex('question_responses', 'deleted_at', {
    name: 'question_responses_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('question_responses', 'deleted_at', { name: 'question_responses_deleted_at_idx' });
  pgm.dropTable('question_responses');
};