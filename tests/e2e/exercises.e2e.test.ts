import request from "supertest";
const baseURL = "http://localhost:3000";

describe("E2E /api/exercises", () => {
  it("should return a list of exercises", async () => {
    const res = await request(baseURL).get("/api/exercises");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return at least one exercise if data exists", async () => {
    const res = await request(baseURL).get("/api/exercises");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    if (res.body.data.length > 0) {
      const item = res.body.data[0];
      expect(item).toHaveProperty("_id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("type");
      expect(item).toHaveProperty("description");
    }
  });
});
