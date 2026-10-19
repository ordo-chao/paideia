/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types first
  pgm.createType('student_status_enum', ['active', 'suspended' , 'graduated' , 'transferred' , 'dropped']);

  // 2. Create the students table
  pgm.createTable('students', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
    },
    date_of_birth: { type: 'date', notNull: true },
    nationality: { type: 'varchar(255)' },
    address: {type: 'varchar(255)',},
    status: {
      type: 'student_status_enum',
      notNull: true,
      default: 'active',
    },
    photo_url: { type: 'varchar(255)', notNull: true },
    enrollment_date: { type: 'date', notNull: true },
    current_grade: {type: 'varchar(255)',notNull: true},
    allergies: { type: 'varchar(500)', notNull: true, default: true },
    medical_notes: { type: 'varchar(500)', notNull: true, default: '' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  // 3. CHECK constraints
  pgm.addConstraint('students', 'students_status_check', {
    check: "status IN ('active', 'suspended' , 'graduated' , 'transferred' , 'dropped')",
  });

  // 4. Index on deleted_at
  pgm.createIndex('students', 'deleted_at', {
    name: 'students_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('students', 'deleted_at', { name: 'students_deleted_at_idx' });
  pgm.dropConstraint('students', 'students_status_check');
  pgm.dropTable('students');
  pgm.dropType('student_status_enum');
};