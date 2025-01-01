const express = require("express");
const router = express.Router();
const {addFavorite} = require("../controller/favoriteController");
const {getFavorites} = require("../controller/favoriteController");

router.post("/like", addFavorite);
router.get("/getFavorites", getFavorites);


module.exports = router;
