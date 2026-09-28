import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Feedback = sequelize.define('feedback', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  grade_id: { type: DataTypes.UUID },
  submission_id: { type: DataTypes.UUID },
  teacher_id: { type: DataTypes.UUID },
  parent_id: { type: DataTypes.UUID },

  comment: { type: DataTypes.TEXT },
  audio_note_url: { type: DataTypes.STRING },
  is_private: { type: DataTypes.BOOLEAN, defaultValue: true },
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
});

export default Feedback;