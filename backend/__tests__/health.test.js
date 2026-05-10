const request = require("supertest");
const app = require("../app");

describe("Health check", () => {
  
  it("should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});
