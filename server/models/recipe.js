"use strict"
const sequelize = require("../config/database");
const { Model, DataTypes } = require("sequelize");
class Recipe extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    Recipe.hasMany(models.Rating, { foreignKey: "RecipeId" });
  }
}
Recipe.init(
  {
    name: DataTypes.STRING,
    ingredients: DataTypes.TEXT,
    instructions: DataTypes.TEXT,
    cookTime: DataTypes.INTEGER,
    calories : DataTypes.DECIMAL,
  },
  {
    sequelize,
    modelName: "Recipe",
  }
);
module.exports = Recipe;
