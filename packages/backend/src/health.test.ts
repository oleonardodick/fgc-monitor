import assert from "node:assert/strict";
import { test } from "node:test";
import { buildServer } from "./server.js";

test("GET /health returns status ok", async (t) => {
  const app = await buildServer();

  t.after(async () => {
    await app.close();
  });

  const response = await app.inject({
    method: "GET",
    url: "/health",
  });

  assert.equal(response.statusCode, 200);

  const body = response.json<{ status: string; timestamp: string }>();
  assert.equal(body.status, "ok");
  assert.match(body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});
