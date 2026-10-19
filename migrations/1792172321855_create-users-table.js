/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types first
  pgm.createType('gender_enum', ['male', 'female']);
  pgm.createType('role_enum', ['admin', 'teacher', 'student', 'parent', 'staff']);

  // 2. Create the users table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    first_name: { type: 'varchar(255)' },
    last_name: { type: 'varchar(255)' },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    gender: {
      type: 'gender_enum',
      notNull: true,
      default: 'male',
    },
    phone: { type: 'varchar(255)', notNull: true },
    password: { type: 'varchar(255)', notNull: true },
    role: {
      type: 'role_enum',
      notNull: true,
      default: 'student',
    },
    is_active: { type: 'boolean', notNull: true, default: true },
    last_seen: { type: 'timestamptz' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  // 3. CHECK constraints
  pgm.addConstraint('users', 'users_gender_check', {
    check: "gender IN ('male', 'female')",
  });
  pgm.addConstraint('users', 'users_role_check', {
    check: "role IN ('admin', 'teacher', 'student', 'parent', 'staff')",
  });

  // 4. Index on deleted_at
  pgm.createIndex('users', 'deleted_at', {
    name: 'users_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('users', 'deleted_at', { name: 'users_deleted_at_idx' });
  pgm.dropConstraint('users', 'users_role_check');
  pgm.dropConstraint('users', 'users_gender_check');
  pgm.dropTable('users');
  pgm.dropType('role_enum');
  pgm.dropType('gender_enum');
};