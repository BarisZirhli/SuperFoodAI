const express = require("express");
const router = express.Router();
const { addFavorite } = require("../controller/favoriteController");
const { getFavorites } = require("../controller/favoriteController");
const { getFavoriteDetails } = require("../controller/favoriteController");

router.post("/addFavorite", addFavorite);
router.get("/getFavorites/:userId", getFavorites);
router.get("/getFavoriteDetails/:userId", getFavoriteDetails);

module.exports = router;
