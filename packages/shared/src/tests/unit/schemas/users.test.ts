import assert from "node:assert/strict";
import { test } from "node:test";
import { updateProfileSchema } from "../../../schemas/users.js";

test("updateProfileSchema: aceita nome e e-mail válidos e aplica trim", () => {
  const result = updateProfileSchema.safeParse({
    name: "  Leonardo  ",
    email: "  LEO@example.com ",
  });

  assert.equal(result.success, true);
  if (!result.success) {
    return;
  }
  assert.equal(result.data.name, "Leonardo");
  // O schema só aplica trim; a normalização (minúsculas) acontece no repositório.
  assert.equal(result.data.email, "LEO@example.com");
});

test("updateProfileSchema: rejeita nome vazio", () => {
  const result = updateProfileSchema.safeParse({ name: "  ", email: "leo@example.com" });

  assert.equal(result.success, false);
  if (result.success) {
    return;
  }
  assert.equal(result.error.issues[0]?.message, "Nome é obrigatório");
});

test("updateProfileSchema: rejeita e-mail vazio", () => {
  const result = updateProfileSchema.safeParse({ name: "Leonardo", email: " " });

  assert.equal(result.success, false);
  if (result.success) {
    return;
  }
  assert.equal(result.error.issues[0]?.message, "E-mail é obrigatório");
});

test("updateProfileSchema: rejeita e-mail com formato inválido", () => {
  const result = updateProfileSchema.safeParse({ name: "Leonardo", email: "nao-e-email" });

  assert.equal(result.success, false);
  if (result.success) {
    return;
  }
  assert.equal(result.error.issues[0]?.message, "Formato de e-mail inválido");
});
