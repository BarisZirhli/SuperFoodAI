const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');  // Ensure the sequelize instance is correctly imported

class Rating extends Sequelize.Model {
  static associate(models) {
    // Rating belongs to User (UserId ile ilişki kurar)
    Rating.belongsTo(models.User, { foreignKey: 'UserId' });

    // Rating belongs to Recipe (RecipeId ile ilişki kurar)
    Rating.belongsTo(models.Recipe, { foreignKey: 'RecipeId' });
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
    modelName: 'Rating',  
    tableName: 'Ratings', 
    timestamps: false,  
    createdAt: false,
    updatedAt: false  
  }
);

module.exports = Rating;
