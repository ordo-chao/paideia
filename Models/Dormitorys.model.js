import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Dormitorys = sequelize.define(
  'dormitorys',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female' , 'mixed'),
      allowNull: false
    },
    capacity:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    warden_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
     type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    defaultScope: {
      attributes: { exclude: ['created_at', 'updated_at', 'deleted_at' , 'scope'] }
    },
    indexes: [
      {
        fields: ['warden_id' , 'id' , 'name']
      }
    ]
  }
);

export default Dormitorys;
