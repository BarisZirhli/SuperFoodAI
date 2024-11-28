const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoriteRecipe = sequelize.define('FavoriteRecipe', {
  FavoriteRecipeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull:false
  },
  RecipeId: {
    type: DataTypes.INTEGER,
    allowNull:false
  },
});

module.exports = FavoriteRecipe;
