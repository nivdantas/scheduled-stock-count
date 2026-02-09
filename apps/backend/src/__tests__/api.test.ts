import { describe, expect, test, beforeAll } from "bun:test";

const API_URL = "http://localhost:3000";

describe("API Integration", () => {
  test("GET /contagens/:id deve retornar 404 para ID inexistente", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await fetch(`${API_URL}/contagens/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
