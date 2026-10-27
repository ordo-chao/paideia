import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Enrollments = sequelize.define("enrollments", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  class_stream_id: {
    type: DataTypes.UUID,
  },

  enrolled_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive', 'completed'),
    allowNull: false,
    defaultValue: 'active',
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
        fields: ['student_id', 'class_stream_id', 'academic_year_id']
      }
    ]
  }
);

export default Enrollments;
