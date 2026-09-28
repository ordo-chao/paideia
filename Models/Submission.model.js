import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Submission = sequelize.define('submissions', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  assignment_id: { type: DataTypes.UUID, allowNull: false },
  student_id: { type: DataTypes.UUID, allowNull: false },

  attempt_number: { type: DataTypes.INTEGER, defaultValue: 1 },
  content: { type: DataTypes.TEXT },
  external_url: { type: DataTypes.STRING },
  // TODO: check if I need quiz answers
  // quiz_answers: { type: DataTypes.JSONB },

  submitted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_late: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {
    type: DataTypes.ENUM('submitted', 'late', 'graded', 'returned', 'draft', 'missing'),
    defaultValue: 'submitted',
  },
  auto_score: { type: DataTypes.FLOAT },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    defaultScope: {
      attributes: { exclude: ['deleted_at'] }
    },
    scopes: {
      withDeleted: {
        attributes: { include: ['deleted_at' ] }
      },
    },
  indexes: [
    { unique: true, fields: ['assignment_id', 'student_id', 'attempt_number'] },
  ],
});

export default Submission;