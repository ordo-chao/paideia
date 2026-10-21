/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types first
  pgm.createType('admins_status_enum', ['active', 'transferred' , 'retired' , 'fired']);

  // 2. Create the admins table
  pgm.createTable('admins', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
    },
    position: {
      type: 'varchar(255)',
      allowNull: false,
    },
    permissions: {
      type: 'JSONB',
      allowNull: false
    },
    office_number: {
      type: 'varchar(255)',
      allowNull: false
    },
    date_of_birth: { type: 'date', notNull: true },
    address: {type: 'varchar(255)',},
    status: {
      type: 'admins_status_enum',
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
  pgm.addConstraint('admins', 'admins_status_check', {
    check: "status IN ('active', 'transferred' , 'retired' , 'fired')",
  });

  // 4. Index on deleted_at
  pgm.createIndex('admins', 'deleted_at', {
    name: 'admins_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('admins', 'deleted_at', { name: 'admins_deleted_at_idx' });
  pgm.dropConstraint('admins', 'admins_status_check');
  pgm.dropTable('admins');
  pgm.dropType('admins_status_enum');
};