const express = require("express");
const router = express.Router();
const { addRating } = require("../controller/ratingController");

router.post("/addRating", addRating);

module.exports = router;
