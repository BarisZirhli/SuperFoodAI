"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Ratings",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        UserId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        RecipeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Recipes",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        Rating: {
          type: Sequelize.FLOAT,
          allowNull: false,
          validate: {
            min: 0,
            max: 5
          }
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        timestamps: false,
        createdAt: false,
        updatedAt: false
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Ratings");
  }
};
