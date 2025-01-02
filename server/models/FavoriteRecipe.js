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
    FavoriteRecipe.belongsTo(models.user, { foreignKey: "userId"});
    FavoriteRecipe.belongsTo(models.recipe, { foreignKey: 'recipeId'});
  }
}

FavoriteRecipe.init(
  {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RecipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "FavoriteRecipe",
    timestamps: false,
  }
);

module.exports = FavoriteRecipe;