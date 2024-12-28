const express = require("express");
const router = express.Router();
const addFavorite = require("../controller/favoriteController");

router.post("/like", addFavorite);

module.exports = router;
