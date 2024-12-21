"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Recipes", {
      RecipeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Ingredients: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      Instructions: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      CookTime: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Rating: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      Calories: {
        type: Sequelize.FLOAT,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Recipes");
  }
};
