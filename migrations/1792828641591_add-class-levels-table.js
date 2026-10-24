/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 2. Create the class_levels table
  pgm.createTable('class_levels', {

    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    level_order: {
      type: 'integer',
      notNull: true,
      unique: true
    },
    name:
    {
      type: 'varchar(255)',
      notNull: true
    },
    curriculum: {
      type: 'varchar(255)',
      notNull: true
    },
    description: {
      type: 'varchar(255)',
      allowNull: false
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });



  // 4. Index on deleted_at
  pgm.createIndex('class_levels', 'deleted_at', {
    name: 'class_levels_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('class_levels', 'deleted_at', { name: 'class_levels_deleted_at_idx' });
  pgm.dropTable('class_levels');
};