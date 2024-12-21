const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

class FavoriteRecipe extends Sequelize.Model {
  static associate(models) {
    // FavoriteRecipe belongs to User (UserId ile ilişki kurar)
    FavoriteRecipe.belongsTo(models.User, { foreignKey: 'UserId' });

    // FavoriteRecipe belongs to Recipe (RecipeId ile ilişki kurar)
    FavoriteRecipe.belongsTo(models.Recipe, { foreignKey: 'RecipeId' });
  }
}

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

