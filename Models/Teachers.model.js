import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Teachers = sequelize.define("teachers", {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  employee_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  qualification: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  specialization: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  employment_type: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status : {
    type: DataTypes.ENUM('active', 'transferred' , 'retired' , 'fired'),
    allowNull: false,
    defaultValue: 'active'
  },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  deleted_at: { type: DataTypes.DATE, allowNull: true },
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
        fields: ['user_id' , 'employee_id']
      }
    ]
  }
);
export default Teachers;
