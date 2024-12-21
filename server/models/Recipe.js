const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");

class Recipe extends Sequelize.Model {
  static associate(models) {
    Recipe.hasMany(models.Rating, { foreignKey: "RecipeId" });
    Recipe.hasMany(models.FavoriteRecipe, { foreignKey: "RecipeId" });
  }
}

Recipe.init(
  {
    RecipeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    CookTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Calories: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
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