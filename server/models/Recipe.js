const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
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
    },
    {
      sequelize,
      modelName: "Recipe",
      tableName: "Recipes",
      timestamps: false,
    }
  );

  return Recipe;
};
