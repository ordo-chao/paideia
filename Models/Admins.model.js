// models/DynamicQuestion.js
import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Admins = sequelize.define(
  'admins',
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    position: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    office_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      }
    ]
  }
);

export default Admins;