import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Grade = sequelize.define('grades', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  student_id: { type: DataTypes.UUID, allowNull: false },
  class_subject_id: { type: DataTypes.UUID, allowNull: false },
  term_id: { type: DataTypes.UUID, allowNull: false },
  assignment_id: { type: DataTypes.UUID, allowNull: false },
  submission_id: { type: DataTypes.UUID, allowNull: false },

  score: { type: DataTypes.FLOAT },
  max_score: { type: DataTypes.FLOAT },
  percentage: { type: DataTypes.FLOAT },
  letter_grade: { type: DataTypes.STRING },
  is_passing: { type: DataTypes.BOOLEAN },

  graded_by: { type: DataTypes.UUID },
  graded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'graded_at',
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
  indexes: [{ unique: true, fields: ['submission_id'] }],
});

export default Grade;