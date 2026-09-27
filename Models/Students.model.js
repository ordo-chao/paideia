import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Students = sequelize.define(
  'students',
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
      defaultValue: 'male'
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enrollment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    current_grade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended' , 'graduated' , 'transferred' , 'dropped'),
      allowNull: false,
      defaultValue: 'active'
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medical_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  },
  {
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    freezeTableName: true,
    defaultScope: {
      attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] }
    },
    scopes: {
      withDeleted: {
        attributes: { include: ['deleted_at'] }
      }
    }
  }
);

export default Students;
