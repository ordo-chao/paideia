import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const ParentStudent = sequelize.define(
  'parents_students',
  {
    parent_user_id: { type: DataTypes.UUID, primaryKey: true },
    student_user_id: { type: DataTypes.UUID, primaryKey: true },
    relationship: { type: DataTypes.ENUM('father','mother','guardian'), allowNull: false },
    is_primary_contact: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
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
        unique: true,
        fields: ['name']
      }
    ]
  }
);

export default ParentStudent;
