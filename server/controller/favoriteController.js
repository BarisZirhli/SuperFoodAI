const favoriteRecipe = require("../models/FavoriteRecipe");
const recipe = require("../models/recipe");

const addFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    const existingFavorite = await favoriteRecipe.findOne({
      where: {
        UserId: userId,
        RecipeId: recipeId,
      },
    });

    if (existingFavorite) {
      return res.status(400).send({
        message: "This recipe is already in the favorites.",
      });
    }

    const favoriteFood = await favoriteRecipe.create({
      UserId: userId,
      RecipeId: recipeId,
    });

    return res.status(201).send({
      message: "Recipe added to favorites successfully!",
      favoriteFood,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).send({
      message: "An error occurred while adding to favorites.",
      error: error.message,
    });
  }
};

const getFavorites = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ message: "UserId is required." });
  }

  try {
    const favorites = await favoriteRecipe.findAll({
      where: {
        UserId: userId,
      },
    });

    if (!favorites || favorites.length === 0) {
      return res.status(404).send({
        message: "No favorite recipes found for this user.",
      });
    }

    return res.status(200).send({
      message: "Favorite recipes retrieved successfully.",
      favorites,
    });
  } catch (error) {
    console.error("Error retrieving favorites:", error.message);
    return res.status(500).send({
      message: "An error occurred while retrieving favorite recipes.",
      error: error.message,
    });
  }
};

const getFavoriteDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const favoriteRecipes = await favoriteRecipe.findAll({
      where: { UserId: userId },
      attributes: ["RecipeId"],
    });

    const recipeIds = favoriteRecipes.map((fav) => fav.RecipeId);

    if (recipeIds.length === 0) {
      return res.status(200).json([]);
    }

    const recipes = await recipe.findAll({
      where: {
        id: recipeIds,
      },
      attributes: [
        "id",
        "name",
        "ingredients",
        "instructions",
        "cookTime",
        "imageUrl",
        "calories",
        "avgRate",
      ],
    });

    return res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching favorite details:", error);
    return res.status(500).json({
      message: "Failed to fetch favorite details.",
      error: error.message,
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    const existingFavorite = await favoriteRecipe.findOne({
      where: {
        UserId: userId,
        RecipeId: recipeId,
      },
    });

    if (!existingFavorite) {
      return res.status(404).send({
        message: "The recipe is not in the user's favorites.",
      });
    }

    await favoriteRecipe.destroy({
      where: {
        UserId: userId,
        RecipeId: recipeId,
      },
    });

    return res.status(200).send({
      message: "Recipe removed from favorites successfully!",
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return res.status(500).send({
      message: "An error occurred while removing the recipe from favorites.",
      error: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  getFavoriteDetails,
  removeFavorite,
};