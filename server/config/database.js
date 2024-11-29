const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:1234@localhost:5432/SuperFoodDb",
  {
    dialect: "postgres",
    logging: false,
  }
);
module.exports = sequelize;
