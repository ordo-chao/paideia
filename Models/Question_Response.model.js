import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const QuestionResponse = sequelize.define('question_responses', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  question_id: { type: DataTypes.UUID, allowNull: false },
  submission_id: { type: DataTypes.UUID, allowNull: true },

  response_value: { type: DataTypes.JSONB },

  // Auto-grade result for quiz questions
  is_correct: { type: DataTypes.BOOLEAN },
  awarded_points: { type: DataTypes.FLOAT },
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['submission_id' , 'question_id'] },
  ],
});

export default QuestionResponse;