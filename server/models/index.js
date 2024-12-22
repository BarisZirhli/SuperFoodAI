const sequelize = require("../config/database");
const Item = require("./item");
const OrderItem = require("./OrderItem");
const MyUser = require("./MyUser");
const Rating = require("./Rating");
const Recipe = require("./MyRecipe");

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({
      alter: true
    });
    console.log("Models synchronized!");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

module.exports = {
  sequelize,
  Rating,
  Item,
  OrderItem,
  Recipe,
  MyUser,
  syncDB
};