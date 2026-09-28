import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const MaterialView = sequelize.define('material_views', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  material_id: { type: DataTypes.UUID, allowNull: false },
  student_id: { type: DataTypes.UUID, allowNull: false },
  viewed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  time_spent_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
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
  indexes: [{ unique: true, fields: ['material_id', 'student_id'] }],
});

export default MaterialView;