import { DataTypes } from "sequelize";
import sequelize from "../Utils/db.js";

const StudentParents = sequelize.define(
  "student_parents",
  {
    student_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },

    parent_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    id : {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },


    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",

    indexes: [
      {
        unique: true,
        fields: ["student_id", "parent_id"]
      }
    ]
  }
);

export default StudentParents;
