import request from "supertest";
const baseURL = "http://localhost:3000";

describe("E2E /api/exercise", () => {
  it("should return 400 if no id is provided", async () => {
    const res = await request(baseURL).get("/api/exercise");
    expect(res.status).toBe(400);
  });

  it("should return null, 404, or 400 if invalid ObjectId", async () => {
    const res = await request(baseURL).get("/api/exercise?exerciseId=123");
    expect(res.status).toBe(400);
  });

  it("should return data if valid exerciseId", async () => {
    // Replace with a valid ID from your DB
    const validId = "669b7af39ea15883e6c46b27";
    const res = await request(baseURL).get(
      `/api/exercise?exerciseId=${validId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});
