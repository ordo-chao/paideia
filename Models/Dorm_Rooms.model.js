import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Dorm_Rooms = sequelize.define(
  'dorm_rooms',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    dorm_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    room_number: {
      type: DataTypes.STRING,
      allowNull: true, // allow non-event payments in future
    },

    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',

    defaultScope: {
      attributes: { exclude: ['deleted_at'] },
    },

    scopes: {
      withDeleted: {
        attributes: { include: ['deleted_at'] },
      },
    },

    indexes: [
      {
        fields: ['dorm_id', 'room_number'],
        unique: true,
      }
    ]
  }
);

export default Dorm_Rooms;
