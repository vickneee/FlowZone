const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("User Signup API", () => {
  
  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
  });
  
  it("should create a new user", async () => {
    const user = {
      email: `test${Date.now()}@example.com`,
      password: "123456"
    };
    
    const res = await request(app)
    .post("/api/users/signup")
    .send(user);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("email");
  });
  
  it("should fail if email already exists", async () => {
    const user = {
      email: `duplicate${Date.now()}@example.com`,
      password: "123456"
    };
    
    // first signup
    await request(app)
    .post("/api/users/signup")
    .send(user);
    
    // second signup (should fail)
    const res = await request(app)
    .post("/api/users/signup")
    .send(user);
    
    expect(res.statusCode).toBe(400); // or 409 depending on your backend
  });
  
  it("should fail if password is missing", async () => {
    const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "fail@example.com"
    });
    
    expect(res.statusCode).toBe(400);
  });
  
});
