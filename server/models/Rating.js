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
<<<<<<< HEAD
    UserId: DataTypes.INTEGER,
    RecipeId: DataTypes.INTEGER,
    Rating: DataTypes.FLOAT
=======
    RatingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "MyUser",
        key: "UserId"
      }
    },

    RecipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Recipe",
        key: "RecipeId"
      }
    },
    Rating: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
>>>>>>> 4da531181753a0c7c7baf99fe43da1bf0fc21864
  },
  {
    sequelize,
    modelName: "Rating"
  }
);

module.exports = Rating;
