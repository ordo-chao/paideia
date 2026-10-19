/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 1. Create ENUM types first
  pgm.createType('parents_relationship_enum', ['father', 'mother' , 'guardian']);

  // 2. Create the parents table
  pgm.createTable('parents', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
    },
    alternate_phone: {
      type: 'varchar(255)',
      allowNull: false,
    },
    occupation: {type: 'varchar(255)',},
    relationship: {
      type: 'parents_relationship_enum',
      notNull: true,
      default: 'guardian',
    },
    alternate_email: {
      type: 'varchar(255)',
      allowNull: false,
    },
    address : {
      type: 'varchar(255)',
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });

  // 3. CHECK constraints
  pgm.addConstraint('parents', 'parents_relationship_check', {
    check: "relationship IN ('father', 'mother' , 'guardian')",
  });

  // 4. Index on deleted_at
  pgm.createIndex('parents', 'deleted_at', {
    name: 'parents_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('parents', 'deleted_at', { name: 'parents_deleted_at_idx' });
  pgm.dropConstraint('parents', 'parents_relationship_check');
  pgm.dropTable('parents');
  pgm.dropType('parents_relationship_enum');
};