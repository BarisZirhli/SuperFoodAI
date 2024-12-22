const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Recipe = sequelize.define(
  "MyRecipe",
  {
    RecipeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Ingredients: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    CookTime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RecipeRating: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Calories: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Recipe",
    tableName: "Recipes",
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
);
module.exports = Recipe;
