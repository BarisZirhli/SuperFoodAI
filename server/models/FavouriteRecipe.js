const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoriteRecipe = sequelize.define('FavoriteRecipe', {
  FavoriteRecipeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = FavoriteRecipe;
