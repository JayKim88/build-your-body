import request from "supertest";
const baseURL = "http://localhost:3000";

describe("E2E /api/communities/getData", () => {
  it("should return an array of communities", async () => {
    const res = await request(baseURL).get("/api/communities/getData");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
