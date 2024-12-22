const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MyUser = sequelize.define(
  "MyUser",
  {
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Height: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Gender: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
);

module.exports = MyUser;
