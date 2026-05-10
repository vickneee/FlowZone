const request = require("supertest");
const app = require("../app");

describe("Auth Flow (Signup → Login → Protected Route)", () => {
  
  let token; // Shared variable
  
  it("should signup and login successfully", async () => {
    
    const user = {
      
      email: `flow${Date.now()}@example.com`,
      
      password: "123456"
      
    };
    
    await request(app)
    .post("/api/users/signup")
    .send(user);
    
    const login = await request(app)
    .post("/api/users/signin")
    .send(user);
    
    console.log("LOGIN BODY:", login.body);
    
    const token = login.body.token;
    
    expect(token).toBeDefined();
    
    const res = await request(app)
    .get("/api/tasks")
    .set("Authorization", `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    
  });
  
  it("should block access without token", async () => {
    const res = await request(app)
    .get("/api/tasks");
    
    expect(res.statusCode).toBe(401); // or 403 depending on backend
  });
  
});
