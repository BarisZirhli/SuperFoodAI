const express = require("express");
const router = express.Router();
const { FavouriteRecipe } = require("../models");

router.get("/:userId", async (req, res) => {
  try {
    const favouriteRecipes = await FavouriteRecipe.findAll({
      where: { userId: req.params.userId },
    });
    res.json(favouriteRecipes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching favourite recipes", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const favouriteRecipe = await FavouriteRecipe.create(req.body);
    res.status(201).json(favouriteRecipe);
  } catch (error) {
    res.status(500).json({ message: "Error adding favourite recipe", error });
  }
});

router.delete("/:userId/:recipeId", async (req, res) => {
  try {
    const favouriteRecipe = await FavouriteRecipe.findOne({
      where: {
        userId: req.params.userId,
        recipeId: req.params.recipeId,
      },
    });

    if (favouriteRecipe) {
      await favouriteRecipe.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Favourite recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing favourite recipe", error });
  }
});

module.exports = router;
