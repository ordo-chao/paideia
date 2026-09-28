import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Comment = sequelize.define('comments', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  assignment_id: { type: DataTypes.UUID },
  submission_id: { type: DataTypes.UUID },
  parent_id: { type: DataTypes.UUID },

  author_user_id: { type: DataTypes.UUID },
  body: { type: DataTypes.TEXT, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
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

export default Comment;