describe("Add to Favorites Endpoint", () => {
    it("should add a recipe to favorites", async () => {
      const response = await request(app)
        .post("/favorites")
        .send({ userId: 1, recipeId: 101 });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Recipe added to favorites");
    });
  
    it("should return 404 if recipe not found", async () => {
      const response = await request(app)
        .post("/favorites")
        .send({ userId: 1, recipeId: 999 });
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Recipe not found");
    });
  });

  describe("Remove from Favorites Endpoint", () => {
    it("should remove a recipe from favorites", async () => {
      const response = await request(app)
        .delete("/favorites")
        .send({ userId: 1, recipeId: 101 });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Recipe removed from favorites");
    });
  
    it("should return 404 if recipe not found in favorites", async () => {
      const response = await request(app)
        .delete("/favorites")
        .send({ userId: 1, recipeId: 999 });
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Recipe not found in favorites");
    });
  });
  