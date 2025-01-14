const { addRating } = require("../controller/ratingController");
const FavoriteRecipe = require("../models/FavoriteRecipe");
const Rating = require("../models/Rating");

jest.mock("../models/FavoriteRecipe", () => ({
  findOne: jest.fn(),
}));

jest.mock("../models/Rating", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("Rating Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addRating", () => {
    it("should add a rating if the recipe is in the user's favorite list and not already rated", async () => {
      FavoriteRecipe.findOne.mockResolvedValue({ UserId: 1, RecipeId: 2 });
      Rating.findOne.mockResolvedValue(null);
      Rating.create.mockResolvedValue({
        UserId: 1,
        RecipeId: 2,
        Rating: 5,
      });

      const req = { body: { userId: 1, recipeId: 2, ratingScore: 5 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await addRating(req, res);

      expect(FavoriteRecipe.findOne).toHaveBeenCalledWith({
        where: { UserId: 1, RecipeId: 2 },
      });
      expect(Rating.findOne).toHaveBeenCalledWith({
        where: { UserId: 1, RecipeId: 2 },
      });
      expect(Rating.create).toHaveBeenCalledWith({
        UserId: 1,
        RecipeId: 2,
        Rating: 5,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: "Rating added successfully!",
        ratingFood: { UserId: 1, RecipeId: 2, Rating: 5 },
      });
    });

    it("should return 404 if the recipe is not in the user's favorite list", async () => {
      FavoriteRecipe.findOne.mockResolvedValue(null);

      const req = { body: { userId: 1, recipeId: 2, ratingScore: 5 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await addRating(req, res);

      expect(FavoriteRecipe.findOne).toHaveBeenCalledWith({
        where: { UserId: 1, RecipeId: 2 },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Recipe is not in the user's favorite list.",
      });
    });

    it("should return 400 if the user has already rated the recipe", async () => {
      FavoriteRecipe.findOne.mockResolvedValue({ UserId: 1, RecipeId: 2 });
      Rating.findOne.mockResolvedValue({ UserId: 1, RecipeId: 2 });

      const req = { body: { userId: 1, recipeId: 2, ratingScore: 5 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await addRating(req, res);

      expect(FavoriteRecipe.findOne).toHaveBeenCalledWith({
        where: { UserId: 1, RecipeId: 2 },
      });
      expect(Rating.findOne).toHaveBeenCalledWith({
        where: { UserId: 1, RecipeId: 2 },
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "User has already rated this recipe.",
      });
    });

    it("should return 500 if an unexpected error occurs", async () => {
      FavoriteRecipe.findOne.mockRejectedValue(new Error("Database error"));

      const req = { body: { userId: 1, recipeId: 38, ratingScore: 4 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await addRating(req, res);

      expect(FavoriteRecipe.findOne).toHaveBeenCalledWith({
        where: { UserId: 1, RecipeId: 38 },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Error: Database error",
        error: "Database error",          
      });
    });
  });
});
