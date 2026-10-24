// Models/Token.js
import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Token = sequelize.define('tokens', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  verification_code: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  indexes: [
    {
      fields: ['token'],
    },
    {
      fields: ['user_email'],
    },
    {
      fields: ['expires_at'],
    },
  ],
});

export default Token;