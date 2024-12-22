const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Item = sequelize.define(
  "Item",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  },

  {
    sequelize,
    modelName: "Item",
    timestamps: false
  }
);

module.exports = Item;
