/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {

  // 2. Create the class_subjects table
  pgm.createTable('class_subjects', {

    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    class_stream_id: {
      type: 'uuid',
      notNull: true,
    },
    subject_id: {
      type: 'uuid',
      notNull: true
    },
    teacher_id: {
      type: 'uuid',
      notNull: true
    },
    periods_per_week: {
      type: 'integer',
      allowNull: false
    },
    minutes_per_period :{
      type: 'integer',
      allowNull: false
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });



  // 4. Index on deleted_at
  pgm.createIndex('class_subjects', 'deleted_at', {
    name: 'class_subjects_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('class_subjects', 'deleted_at', { name: 'class_subjects_deleted_at_idx' });
  pgm.dropTable('class_subjects');
};