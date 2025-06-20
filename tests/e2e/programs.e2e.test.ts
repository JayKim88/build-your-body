import request from "supertest";
const baseURL = "http://localhost:3000";

describe("E2E /api/programs", () => {
  it("should return 500 if no email (user not found)", async () => {
    const res = await request(baseURL).get("/api/programs");
    expect(res.status).toBe(500);
  });
});
