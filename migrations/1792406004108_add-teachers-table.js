/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types first
  pgm.createType('teachers_status_enum', ['active', 'transferred' , 'retired' , 'fired']);

  // 2. Create the teachers table
  pgm.createTable('teachers', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
    },
    employee_id: {
      type: 'varchar(255)',
      allowNull: false,
    },
    date_of_birth: { type: 'date', notNull: true },
    address: {type: 'varchar(255)',},
    status: {
      type: 'teachers_status_enum',
      notNull: true,
      default: 'active',
    },
    photo_url: { type: 'varchar(255)', notNull: true },
    start_date: { type: 'date', notNull: true },
    end_date: { type: 'date', notNull: true },
    qualification: {type: 'varchar(555)',notNull: true},
    specialization: { type: 'varchar(500)', notNull: true, default: '' },
    employment_type: { type: 'varchar(500)', notNull: true, default: '' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  // 3. CHECK constraints
  pgm.addConstraint('teachers', 'teachers_status_check', {
    check: "status IN ('active', 'transferred' , 'retired' , 'fired')",
  });

  // 4. Index on deleted_at
  pgm.createIndex('teachers', 'deleted_at', {
    name: 'teachers_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('teachers', 'deleted_at', { name: 'teachers_deleted_at_idx' });
  pgm.dropConstraint('teachers', 'teachers_status_check');
  pgm.dropTable('teachers');
  pgm.dropType('teachers_status_enum');
};