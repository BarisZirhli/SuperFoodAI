const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  RatingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull : false
  },
  RecipeId: {
    type: DataTypes.INTEGER,
    allowNull:false
  },
  Rating: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  }
});

module.exports = Rating;