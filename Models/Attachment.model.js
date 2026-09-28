import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Attachment = sequelize.define('attachments', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  material_id: { type: DataTypes.UUID },
  assignment_id: { type: DataTypes.UUID },
  submission_id: { type: DataTypes.UUID },
  feedback_id: { type: DataTypes.UUID },
  // For dynamic question attachments
  question_id: { type: DataTypes.UUID },
  answer_id: { type: DataTypes.UUID },

  file_name: { type: DataTypes.STRING, allowNull: false },
  file_url: { type: DataTypes.STRING, allowNull: false },
  file_size: { type: DataTypes.INTEGER },
  mime_type: { type: DataTypes.STRING },
  uploaded_by: { type: DataTypes.UUID },
},  
{
    freezeTableName: true,
    timestamps: true,
    createdAt: 'uploaded_at',
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
        unique: true,
        fields: ['question_id', 'answer_id', 'file_url']
      }
    ]
  });

export default Attachment;