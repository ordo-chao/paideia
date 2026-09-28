import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Announcement = sequelize.define('announcements', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  class_subject_id: { type: DataTypes.UUID },
  class_stream_id: { type: DataTypes.UUID },
  author_id: { type: DataTypes.UUID },
  title: { type: DataTypes.STRING, allowNull: false },
  body: { type: DataTypes.TEXT, allowNull: false },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal',
  },
  published_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expires_at: { type: DataTypes.DATE },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'published_at',
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

export default Announcement;