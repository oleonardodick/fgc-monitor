import assert from "node:assert/strict";
import { test } from "node:test";
import { loadEnvConfig } from "../../../config/env.js";

test("env: deve carregar JWT_SECRET quando definido", () => {
  process.env.JWT_SECRET = "test-secret-value";

  const config = loadEnvConfig();

  assert.equal(config.jwtSecret, "test-secret-value");
  assert.equal(config.jwtExpiresIn, "7d");
  assert.equal(config.bcryptSaltRounds, 10);
});

test("env: deve lançar erro quando JWT_SECRET está ausente", () => {
  delete process.env.JWT_SECRET;

  assert.throws(
    () => loadEnvConfig(),
    (error: unknown) => {
      assert.match((error as Error).message, /JWT_SECRET is required/);
      return true;
    },
  );
});
