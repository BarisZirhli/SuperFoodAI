const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("SuperFoodDb", "postgres", "mitaka", {
  host: "localhost",
  dialect: "postgres"
});

module.exports = sequelize;
