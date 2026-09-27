// models/ClassStreams.js
import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const ClassStreams = sequelize.define(
  'class_streams',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    class_level_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    academic_year_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    class_teacher_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    room_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['class_level_id', 'academic_year_id']
      }
    ]
  }
);

export default ClassStreams;