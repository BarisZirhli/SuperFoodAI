var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// API routes
var recipeRoutes = require("./routes/recipeRoutes.js");
var favouriteRecipeRoutes = require("./routes/favouriteRecipeRoutes");

var app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); 

// API usages
app.use("/api/recipes", recipeRoutes);
app.use("/api/favouriterecipes", favouriteRecipeRoutes);

// 404 Not Found Error
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handling
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

const { sequelize } = require("./models");

(async () => {
  try {
    await sequelize.sync({ force: process.env.NODE_ENV === "development" });
    console.log("Database synchronized successfully!");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

module.exports = app;
