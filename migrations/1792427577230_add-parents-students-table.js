/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types first
  pgm.createType('parents_students_relationship_enum', ['father', 'mother' , 'guardian']);

  // 2. Create the parents_students table
  pgm.createTable('parents_students', {
    parent_user_id: {
      type: 'uuid',
      primaryKey: true,
    },
        student_user_id: {
      type: 'uuid',
      primaryKey: true,
    },
    relationship: {
      type: 'parents_students_relationship_enum',
      notNull: true,
      default: 'guardian',
    },
    is_primary_contact: { type: 'boolean', defaultValue: false },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  // 3. CHECK constraints
  pgm.addConstraint('parents_students', 'parents_students_relationship_check', {
    check: "relationship IN ('father', 'mother' , 'guardian')",
  });

  // 4. Index on deleted_at
  pgm.createIndex('parents_students', 'deleted_at', {
    name: 'parents_students_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('parents_students', 'deleted_at', { name: 'parents_students_deleted_at_idx' });
  pgm.dropConstraint('parents_students', 'parents_students_relationship_check');
  pgm.dropTable('parents_students');
  pgm.dropType('parents_students_relationship_enum');
};