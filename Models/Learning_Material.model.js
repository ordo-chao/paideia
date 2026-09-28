import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const LearningMaterial = sequelize.define('learning_materials', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  class_subject_id: { type: DataTypes.UUID, allowNull: false },
  term_id: { type: DataTypes.UUID, allowNull: false },
  created_by: { type: DataTypes.UUID },

  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  material_type: {
    type: DataTypes.ENUM('note', 'video', 'pdf', 'link', 'slide', 'audio'),
    allowNull: false,
  },
  content_url: { type: DataTypes.STRING },
  content_text: { type: DataTypes.TEXT },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
  published_at: { type: DataTypes.DATE },
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
      {
        // unique: true,
        fields: ['class_subject_id', 'term_id' , 'id' , 'title']
      }
    ]
});

export default LearningMaterial;