const { addRating, getRating } = require("../controller/ratingController");
const FavoriteRecipe = require("../models/FavoriteRecipe");
const Rating = require("../models/Rating");

jest.mock("../models/FavoriteRecipe");
jest.mock("../models/Rating");

describe("Rating Controller", () => {
  describe("addRating", () => {
    it("should add rating successfully if the recipe is in the user's favorites and they haven't rated it", async () => {
      const req = {
        body: {
          userId: 1,
          recipeId: 1,
          rating: 5,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mocking the database interactions
      FavoriteRecipe.findOne.mockResolvedValue({}); // Recipe exists in favorites
      Rating.findOne.mockResolvedValue(null); // User hasn't rated yet
      Rating.create.mockResolvedValue({ UserId: 1, RecipeId: 1, Rating: 5 }); // Simulate successful rating creation

      await addRating(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: "Rating added successfully!",
        ratingFood: { UserId: 1, RecipeId: 1, Rating: 5 },
      });
    });

    it("should return 404 if the recipe is not in the user's favorite list", async () => {
      const req = {
        body: {
          userId: 1,
          recipeId: 1,
          rating: 5,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mocking the database interactions
      FavoriteRecipe.findOne.mockResolvedValue(null); // Recipe not in favorites

      await addRating(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Recipe is not in the user's favorite list.",
      });
    });

    it("should return 400 if the user has already rated the recipe", async () => {
      const req = {
        body: {
          userId: 1,
          recipeId: 1,
          rating: 5,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mocking the database interactions
      FavoriteRecipe.findOne.mockResolvedValue({}); // Recipe exists in favorites
      Rating.findOne.mockResolvedValue({}); // User has already rated

      await addRating(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "User has already rated this recipe.",
      });
    });

    it("should return 500 if there is a server error", async () => {
      const req = {
        body: {
          userId: 1,
          recipeId: 1,
          rating: 5,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mocking a server error
      FavoriteRecipe.findOne.mockRejectedValue(new Error("Database error"));

      await addRating(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Error: Database error",
        error: "Database error",
      });
    });
  });

  describe("getRating", () => {
    it("should return user's ratings successfully", async () => {
      const req = {
        params: {
          userId: 1,
          recipeId: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mocking the database interactions
      Rating.findAll.mockResolvedValue([{ Rating: 5 }]);

      await getRating(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User's favorite recipes ratings retrieved successfully.",
        ratings: [{ Rating: 5 }],
      });
    });

    it("should return 400 if userId is missing", async () => {
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getRating(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User ID is required" });
    });
  });
});
