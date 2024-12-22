const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },

    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Items",
        key: "id"
      }
    }
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: "OrderItem", // Model name
    timestamps: false // Automatically manage createdAt and updatedAt
  }
);
module.exports = OrderItem;
