const {
  Model,
  DataTypes
} = require("sequelize");
const sequelize = require("../config/database");

class FavoriteRecipe extends Model {
  // Define associations here
  static associate(models) {
    FavoriteRecipe.belongsTo(models.User, {
      foreignKey: "UserId"
    });
    FavoriteRecipe.belongsTo(models.Recipe, {
      foreignKey: "RecipeId"
    });
  }
}

FavoriteRecipe.init({
  FavoriteRecipeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  RecipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: "FavoriteRecipe",
  tableName: "FavoriteRecipes",
  timestamps: false,
});

module.exports = FavoriteRecipe;