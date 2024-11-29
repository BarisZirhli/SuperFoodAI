const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class AiModel extends Model {
  static associate(models) {}
}

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
    modelName: "AiModel",
    tableName: "AiModels",
    timestamps: false,
  }
);

module.exports = AiModel;
