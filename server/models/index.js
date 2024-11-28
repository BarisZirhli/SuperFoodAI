const { sequelize } = require('../config/database');
const User = require('./User');
const Recipe = require('./Recipe');
const Rating = require('./Rating');
const FavoriteRecipe = require('./FavouriteRecipe');
const AIModel = require('./AiModel');

// Define associations
User.hasMany(Rating, { foreignKey: 'UserId' });
Rating.belongsTo(User, { foreignKey: 'UserId' });

Recipe.hasMany(Rating, { foreignKey: 'RecipeId' });
Rating.belongsTo(Recipe, { foreignKey: 'RecipeId' });

User.hasMany(FavoriteRecipe, { foreignKey: 'UserId' });
FavoriteRecipe.belongsTo(User, { foreignKey: 'UserId' });

Recipe.hasMany(FavoriteRecipe, { foreignKey: 'RecipeId' });
FavoriteRecipe.belongsTo(Recipe, { foreignKey: 'RecipeId' });

module.exports = { sequelize, User, Recipe, Rating, FavoriteRecipe, AIModel };
