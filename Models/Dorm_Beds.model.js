import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const DormBeds = sequelize.define("dorm_beds", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  bed_label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_occupied: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
        fields: ['room_id' , 'bed_label']
      }
    ]
  }
);
export default DormBeds;
