import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const RubricScore = sequelize.define('rubric_scores', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  grade_id: { type: DataTypes.UUID, allowNull: false },
  criterion_id: { type: DataTypes.UUID, allowNull: false },
  points: { type: DataTypes.FLOAT, allowNull: false },
  comment: { type: DataTypes.TEXT },
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
  indexes: [{ unique: true, fields: ['grade_id', 'criterion_id'] }],
});

export default RubricScore;