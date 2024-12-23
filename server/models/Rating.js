const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define(
  "Rating",
  {
    RatingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "MyUser",
        key: "UserId"
      }
    },

    RecipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Recipe",
        key: "RecipeId"
      }
    },
    Rating: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Rating", // Model name
    timestamps: false // Automatically manage createdAt and updatedAt
  }
);

module.exports = Rating;
