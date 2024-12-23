"use strict";
const sequelize = require("../config/database");
const { Model, DataTypes } = require("sequelize");
class Rating extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Rating.init(
  {
    UserId: DataTypes.INTEGER,
    RecipeId: DataTypes.INTEGER,
    Rating: DataTypes.FLOAT
  },
  {
    sequelize,
    modelName: "Rating"
  }
);

module.exports = Rating;
