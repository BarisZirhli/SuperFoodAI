const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AiModel = sequelize.define('AiModel', {
  ModelId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ModelType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = AiModel;
