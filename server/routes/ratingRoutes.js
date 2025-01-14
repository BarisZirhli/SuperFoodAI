const express = require("express");
const router = express.Router();
const { addRating, getRating } = require("../controller/ratingController");

router.post("/addRating", addRating);
router.get("/getRating/:userId/:recipeId", getRating);

module.exports = router;