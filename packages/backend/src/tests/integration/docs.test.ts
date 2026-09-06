import assert from "node:assert/strict";
import { test } from "node:test";
import { buildServer } from "../../server.js";

test("GET /docs é público e não exige token", async (t) => {
  const app = await buildServer({ registerMongoose: false });

  t.after(async () => {
    await app.close();
  });

  const response = await app.inject({
    method: "GET",
    url: "/docs/",
  });

  assert.equal(response.statusCode, 200);
});

test("GET /docs/openapi.json é público e não exige token", async (t) => {
  const app = await buildServer({ registerMongoose: false });

  t.after(async () => {
    await app.close();
  });

  const response = await app.inject({
    method: "GET",
    url: "/docs/openapi.json",
  });

  assert.equal(response.statusCode, 200);
});
