import request from "supertest";
const baseURL = "http://localhost:3000";

describe("E2E /api/image/getSignedUrl", () => {
  it("should return 400 if no imageName", async () => {
    const res = await request(baseURL).get("/api/image/getSignedUrl");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing imageName");
  });

  it("should return 200 and signedUrl if valid imageName", async () => {
    const res = await request(baseURL).get(
      "/api/image/getSignedUrl?imageName=test.png"
    );
    expect(res.status).toBe(200);
    expect(res.body.signedUrl).toBeDefined();
    expect(res.body.completedUrl).toBeDefined();
  });
});
