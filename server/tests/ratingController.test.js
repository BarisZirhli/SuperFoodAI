const request = require("supertest");
const app = require("../src/app"); // Express uygulamanızın giriş noktası

describe("Add Rating Endpoint", () => {
  it("should successfully add a rating to a recipe", async () => {
    const response = await request(app)
      .post("/addRating")
      .send({
        userId: 1,
        recipeId: 101,
        rating: 5, // 1 ile 5 arasında bir puan
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Rating added successfully");
    expect(response.body).toHaveProperty("recipeId", 101);
    expect(response.body).toHaveProperty("rating", 5);
  });

  it("should return 400 for invalid rating values", async () => {
    const response = await request(app)
      .post("/addRating")
      .send({
        userId: 1,
        recipeId: 101,
        rating: 6, // Geçersiz rating (örneğin: max değer 5)
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Rating value must be between 1 and 5");
  });

  it("should return 404 if recipe does not exist", async () => {
    const response = await request(app)
      .post("/addRating")
      .send({
        userId: 1,
        recipeId: 9999, // Geçersiz tarif ID
        rating: 4,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Recipe not found");
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post("/addRating")
      .send({
        userId: 1,
        recipeId: 101, // Rating eksik
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });
});
