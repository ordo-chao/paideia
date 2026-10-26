import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Subjects = sequelize.define(
  'subjects',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('core', 'elective'),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: { type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW},
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  },
  {
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    freezeTableName: true,
    scopes: {
      withDeleted: {
        attributes: { include: ['deleted_at'] }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['code']
      }
    ]
  }
);

export default Subjects;
