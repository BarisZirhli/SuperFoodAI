const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
  RecipeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Ingredients: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  Steps: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  Calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  PreparationTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Recipe;
