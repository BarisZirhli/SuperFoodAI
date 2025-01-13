const request = require("supertest");
const app = require("../src/app"); // Express uygulamanızı içe aktarın

describe("Login Endpoint", () => {
  it("should login successfully with valid credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "testuser", password: "password123" });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 for invalid credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "wronguser", password: "wrongpassword" });
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid username or password");
  });
});

describe("Register Endpoint", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/register")
        .send({ username: "newuser", password: "password123" });
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
    });
  
    it("should return 400 for missing fields", async () => {
      const response = await request(app)
        .post("/register")
        .send({ username: "" });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Missing required fields");
    });
  });
  