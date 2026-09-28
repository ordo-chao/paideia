import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Assignment = sequelize.define('assignments', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  class_subject_id: { type: DataTypes.UUID, allowNull: false },
  term_id: { type: DataTypes.UUID, allowNull: false },
  created_by: { type: DataTypes.UUID },

  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  instructions: { type: DataTypes.TEXT },

  assignment_type: {
    type: DataTypes.ENUM(
      'homework', 'quiz', 'project', 'discussion',
      'reading', 'essay', 'file_upload', 'coding'
    ),
    allowNull: false,
    defaultValue: 'homework',
  },
  submission_mode: {
    type: DataTypes.ENUM('online', 'file', 'url', 'quiz', 'mixed', 'none'),
    allowNull: false,
    defaultValue: 'online',
  },

  max_score: { type: DataTypes.INTEGER, defaultValue: 100 },
  weight: { type: DataTypes.FLOAT, defaultValue: 1.0 },
  passing_score: { type: DataTypes.INTEGER, defaultValue: 50 },

  assigned_on: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  available_from: { type: DataTypes.DATE },
  due_date: { type: DataTypes.DATE },
  available_until: { type: DataTypes.DATE },

  allow_late_submission: { type: DataTypes.BOOLEAN, defaultValue: true },
  allow_resubmission: { type: DataTypes.BOOLEAN, defaultValue: false },
  max_attempts: { type: DataTypes.INTEGER, defaultValue: 1 },
  is_graded: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_team_assignment: { type: DataTypes.BOOLEAN, defaultValue: false },

  quiz_config: { type: DataTypes.JSONB },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'closed', 'archived'),
    defaultValue: 'draft',
  },
}, 
 {
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
      {
        // unique: true,
        fields: ['class_subject_id', 'term_id' , 'id' , 'title']
      }
    ]
  }
);

export default Assignment;