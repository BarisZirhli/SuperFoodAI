const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

class FavoriteRecipe extends Sequelize.Model {}

FavoriteRecipe.init(
  {
    FavoriteRecipeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RecipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,            // Pass the sequelize instance
    modelName: 'FavoriteRecipe',  // Model name for Sequelize
    tableName: 'FavoriteRecipes', // Optional: specify table name if different from model name
    timestamps: false,     // Disable automatic createdAt/updatedAt columns if not needed
    createdAt: false,
    updatedAt: false
  }
);

module.exports = FavoriteRecipe;
