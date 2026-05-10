const request = require("supertest");
const app = require("../app");

describe("User Login API", () => {
  
  const user = {
    email: `login${Date.now()}@example.com`,
    password: "123456"
  };
  
  it("should login successfully after signup", async () => {
    
    // 1. create user first
    await request(app)
    .post("/api/users/signup")
    .send(user);
    
    // 2. login
    const res = await request(app)
    .post("/api/users/signin")
    .send(user);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
  
  it("should fail login with wrong password", async () => {
    
    const user2 = {
      email: `wrong${Date.now()}@example.com`,
      password: "123456"
    };
    
    // create user
    await request(app)
    .post("/api/users/signup")
    .send(user2);
    
    // wrong login
    const res = await request(app)
    .post("/api/users/signin")
    .send({
      email: user2.email,
      password: "wrongpassword"
    });
    
    expect(res.statusCode).toBe(400); // or 401 depending on backend
  });
  
  it("should fail login if user does not exist", async () => {
    const res = await request(app)
    .post("/api/users/signin")
    .send({
      email: "notexist@example.com",
      password: "123456"
    });
    
    expect(res.statusCode).toBe(400); // or 404 depending on backend
  });
  
});
