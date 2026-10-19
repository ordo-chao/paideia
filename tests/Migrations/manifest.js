// Maps each table to:
//   - the migration file that creates it
//   - the Sequelize model that describes it
//   - the primary key column(s)
//
// Add a line for every new table. This is the ONLY per-table file you maintain.

export const TABLES = {
  users: {
    createMigration: '1792172321855_create-users-table.js',
    model: 'Users.model.js',
    pk: ['id'],
    // Columns Sequelize adds implicitly (timestamps, paranoid) that don't
    // appear in information_schema.columns under a different name.
    implicitColumns: {
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      deleted_at: 'deletedAt',
    },
  },
  // Add more tables here as you create migrations:
  //
  // students: {
  //   createMigration: '1792200000000_create-students-table.js',
  //   model: 'Students.model.js',
  //   pk: ['id'],
  //   implicitColumns: {
  //     created_at: 'createdAt',
  //     updated_at: 'updatedAt',
  //     deleted_at: 'deletedAt',
  //   },
  // },
};