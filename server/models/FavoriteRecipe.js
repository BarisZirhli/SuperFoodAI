("use strict");
const sequelize = require("../config/database");
const { Model, DataTypes } = require("sequelize");

class FavoriteRecipe extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
FavoriteRecipe.init(
  {
    FavoriteRecipeId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    RecipeId: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: "FavoriteRecipe"
  }
);

module.exports = FavoriteRecipe;
