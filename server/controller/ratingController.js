const FavoriteRecipe = require("../models/FavoriteRecipe");
const Rating = require("../models/Rating");

const addRating = async (req, res) => {
  try {
    const { userId, recipeId, ratingScore } = req.body;
    const existingUserFavoriteList = await FavoriteRecipe.findOne({
      where: {
        UserId: userId,
        RecipeId: recipeId,
      },
    });

    if (!existingUserFavoriteList) {
      return res.status(404).send({
        message: "Recipe is not in the user's favorite list.",
      });
    }

    const ratingFood = await Rating.create({
      UserId: userId,
      RecipeId: recipeId,
      Rating: ratingScore,
    });

    return res.status(201).send({
      message: "Rating added successfully!",
      ratingFood,
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    return res.status(500).send({
      message: `${error}`,
      error: error.message,
    });
  }
};

module.exports = {
  addRating,
};
