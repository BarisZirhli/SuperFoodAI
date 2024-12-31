const favoriteRecipe = require("../models/FavoriteRecipe");

const addFavorite = async (req, res, next) => {
  const body = req.body;

  try {
    const { userId, recipeId } = body;

    const existingFavorite = await favoriteRecipe.findOne({
      where: {
        userId: userId,
        recipeId: recipeId
      }
    });

    if (existingFavorite) {
      return res.status(400).send({
        message: "This recipe is already in the favorites."
      });
    }

    const favoriteFood = await favoriteRecipe.create({
      userId: userId,
      recipeId: recipeId
    });

    return res.status(201).send({
      message: "Recipe added to favorites successfully!",
      favoriteFood
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).send({
      message: "An error occurred while adding the recipe to favorites."
    });
  }
};

const getFavorites = async (req, res) => {
  const { userId } = req.params; 

  try {
    const favorites = await favoriteRecipe.findAll({
      where: {
        userId: userId,
      },
    });

    if (favorites.length === 0) {
      return res.status(404).send({
        message: "No favorite recipes found for this user.",
      });
    }

    return res.status(200).send({
      message: "Favorite recipes retrieved successfully.",
      favorites,
    });
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    return res.status(500).send({
      message: "An error occurred while retrieving favorite recipes.",
    });
  }
};


module.exports = {addFavorite, getFavorites};