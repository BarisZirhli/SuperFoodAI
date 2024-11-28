const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

class AiModel extends Sequelize.Model {}

AiModel.init(
  {
    ModelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ModelType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,            
    modelName: 'AiModel', 
    tableName: 'AiModels', 
    timestamps: false,    

    createdAt: false,
    updatedAt: false
  }
);

module.exports = AiModel;
