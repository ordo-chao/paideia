import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const DynamicQuestion = sequelize.define('dynamic_questions', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

  // Scope: attach to a class subject, an assignment, or both
  class_subject_id: { type: DataTypes.UUID, allowNull: true },
  assignment_id: { type: DataTypes.UUID, allowNull: true },

  question_text: { type: DataTypes.TEXT, allowNull: false },
  question_type: {
    type: DataTypes.ENUM(
      'text', 'textarea', 'number', 'email', 'phone', 'date', 'time',
      'datetime', 'select', 'multiselect', 'radio', 'checkbox',
      'checkboxes', 'file', 'rating', 'url'
    ),
    allowNull: false,
    defaultValue: 'text',
  },
  options: { type: DataTypes.JSONB },
  validation_rules: { type: DataTypes.JSONB },
  placeholder: { type: DataTypes.STRING },
  help_text: { type: DataTypes.TEXT },
  is_required: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 },

  ask_timing: {
    type: DataTypes.ENUM('before_registration', 'after_registration', 'after_event'),
    defaultValue: 'before_registration',
  },
  conditional_logic: { type: DataTypes.JSONB },
  is_admin_only: { type: DataTypes.BOOLEAN, defaultValue: false },

  // For quiz auto-grading
  correct_answer: { type: DataTypes.JSONB },
  points: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
  indexes: [
    { fields: ['class_subject_id'] },
    { fields: ['assignment_id'] },
  ],
});

export default DynamicQuestion;