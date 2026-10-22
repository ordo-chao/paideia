/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  // 2. Create the tokens table
  pgm.createTable('tokens', {

        id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_email: {
      type: 'varchar(255)',
      notNull: true
    },
    token: {
      type: 'varchar(500)',
      allowNull: false
    },
    verification_code: {
      type: 'varchar(55)',
      allowNull: false
    },
    expires_at:{
      type: 'date', 
      allowNull: false
    },
    is_used:{
      type: 'BOOLEAN',
      default: false
    },
    attempts:{
      type: 'INTEGER'
    },
    used_at: { 
      type: 'date', 
      allowNull: true 
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz' },
    deleted_at: { type: 'timestamptz' },
  });



  // 4. Index on deleted_at
  pgm.createIndex('tokens', 'deleted_at', {
    name: 'tokens_deleted_at_idx',
  });
};

export const down = (pgm) => {
  pgm.dropIndex('tokens', 'deleted_at', { name: 'tokens_deleted_at_idx' });
  pgm.dropTable('tokens');
};