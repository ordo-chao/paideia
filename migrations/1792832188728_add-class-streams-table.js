/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 2. Create the class_streams table
  pgm.createTable('class_streams', {

    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    class_level_id: {
      type: 'uuid',
      notNull: true,
    },
    academic_year_id: {
      type: 'uuid',
      notNull: true
    },
    name:
    {
      type: 'varchar(255)',
      notNull: true
    },
    full_name: {
      type: 'varchar(255)',
      notNull: true
    },
    capacity: {
      type: 'integer',
      allowNull: false
    },
    class_teacher_id: {
      type: 'uuid',
      notNull: true
    },
    room_number: {
      type: 'varchar(255)',
      notNull: true
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });



  // 4. Index on deleted_at
  pgm.createIndex('class_streams', 'deleted_at', {
    name: 'class_streams_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('class_streams', 'deleted_at', { name: 'class_streams_deleted_at_idx' });
  pgm.dropTable('class_streams');
};