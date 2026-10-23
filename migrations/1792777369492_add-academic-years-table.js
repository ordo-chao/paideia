/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 2. Create the academic_years table
  pgm.createTable('academic_years', {

    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name:
    {
      type: 'varchar(255)',
      notNull: true
    },
    start_date: {
      type: 'date',
      notNull: true
    },
    end_date: {
      type: 'date',
      allowNull: false
    },
    is_current: {
      type: 'BOOLEAN',
      default: false
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });



  // 4. Index on deleted_at
  pgm.createIndex('academic_years', 'deleted_at', {
    name: 'academic_years_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('academic_years', 'deleted_at', { name: 'academic_years_deleted_at_idx' });
  pgm.dropTable('academic_years');
};