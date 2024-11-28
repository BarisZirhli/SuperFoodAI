const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Recipe = require('./Recipe')(sequelize, DataTypes);
const Rating = require('./Rating')(sequelize, DataTypes);
const FavoriteRecipe = require('./FavouriteRecipe')(sequelize, DataTypes);
const AIModel = require('./AiModel')(sequelize, DataTypes);

User.hasMany(Rating, { foreignKey: 'UserId' });
Rating.belongsTo(User, { foreignKey: 'UserId' });

Recipe.hasMany(Rating, { foreignKey: 'RecipeId' });
Rating.belongsTo(Recipe, { foreignKey: 'RecipeId' });

User.hasMany(FavoriteRecipe, { foreignKey: 'UserId' });
FavoriteRecipe.belongsTo(User, { foreignKey: 'UserId' });

Recipe.hasMany(FavoriteRecipe, { foreignKey: 'RecipeId' });
FavoriteRecipe.belongsTo(Recipe, { foreignKey: 'RecipeId' });

module.exports = { sequelize, User, Recipe, Rating, FavoriteRecipe, AIModel };