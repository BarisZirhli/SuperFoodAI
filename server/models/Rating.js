const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Rating extends Model {
  static associate(models) {
    Rating.belongsTo(models.User, { foreignKey: "UserId" });

    Rating.belongsTo(models.Recipe, { foreignKey: "RecipeId" });
  }
}

Rating.init(
  {
    RatingId: {
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
    Rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Rating",
    tableName: "Ratings",
    timestamps: false,
  }
);

module.exports = Rating;
