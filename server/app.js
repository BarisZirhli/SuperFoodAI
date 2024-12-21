var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 404 Not Found Error
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handling
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

// Import Sequelize and Database Connection
const { sequelize } = require("../server/models"); // Adjust if necessary

// Set environment manually or from process.env
const environment = process.env.NODE_ENV || "development";

(async () => {
  try {
    // Synchronizing the database
    await sequelize.sync({ force: environment === "development" });
    console.log("Database synchronized successfully!");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

module.exports = app;
