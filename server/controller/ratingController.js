const FavoriteRecipe = require("../models/FavoriteRecipe");
const Rating = require("../models/Rating");

const addRating = async (req, res) => {
  try {
    const { userId, recipeId, rating } = req.body;
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

    const existingRating = await Rating.findOne({
      where: {
        UserId: userId,
        RecipeId: recipeId,
      },
    });

    if (existingRating) {
      return res.status(400).send({
        message: "User has already rated this recipe.",
      });
    }

    const ratingFood = await Rating.create({
      UserId: userId,
      RecipeId: recipeId,
      Rating: rating,
    });

    return res.status(201).send({
      message: "Rating added successfully!",
      ratingFood,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error}`,
      error: error.message,
    });
  }
};

const getRating = async (req, res) => {
  try {
    const {userId,recipeId} = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const ratings = await Rating.findAll({
      where: {
        UserId: userId,
        RecipeId: recipeId
      },
      attributes: ["Rating"],
    });


    return res.status(200).json({
      message: "User's favorite recipes ratings retrieved successfully.",
      ratings,
    });
  } catch (error) {
    console.error("Error fetching favorite ratings:", error);
    return res.status(500).json({
      message: "Failed to fetch favorite ratings.",
      error: error.message,
    });
  }
};

module.exports = {
  addRating,
  getRating,
};
