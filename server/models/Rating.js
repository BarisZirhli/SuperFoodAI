const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  RatingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CreatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Rating;