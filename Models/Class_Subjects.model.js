import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const ClassSubjects = sequelize.define("class_subjects", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  class_stream_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  subject_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  periods_per_week: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  minutes_per_period:{
    type: DataTypes.INTEGER,
    allowNull: false,
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
        fields: ['class_stream_id', 'subject_id']
      }
    ]
  }
);
export default ClassSubjects;
