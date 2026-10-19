import { DataTypes } from 'sequelize';
import sequelize from '../Utils/db.js';

const Parents = sequelize.define("parents", {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  relationship: {
    type: DataTypes.ENUM("father", "mother", "guardian"),
    allowNull: false,
    defaultValue: "guardian",
  },
  alternate_phone: {
    type: DataTypes.STRING,
    unique: true,
  },
  occupation: {
    type: DataTypes.STRING,
  },
  alternate_email: {
    type: DataTypes.STRING,
    unique: true,
  },
  address : {
    type: DataTypes.STRING,
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
        fields: ['user_id', 'relationship']
      }
    ]
  }
);

export default Parents;
