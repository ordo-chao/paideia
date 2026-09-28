import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const RubricCriterion = sequelize.define('rubric_criteria', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  rubric_id: { type: DataTypes.UUID, allowNull: false },
  criterion: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  max_points: { type: DataTypes.FLOAT, allowNull: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
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
});

export default RubricCriterion;