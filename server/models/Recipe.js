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
  Instructions: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Ingredients: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ImageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CookTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Recipe;
