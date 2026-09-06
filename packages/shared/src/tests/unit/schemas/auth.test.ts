import assert from "node:assert/strict";
import { test } from "node:test";
import {
  countPasswordCriteria,
  createAccountSchema,
  isPasswordValid,
} from "../../../schemas/auth.js";

test("countPasswordCriteria: cuenta los criterios satisfechos", () => {
  assert.equal(countPasswordCriteria(""), 0);
  assert.equal(countPasswordCriteria("abcdef"), 1);
  assert.equal(countPasswordCriteria("ABCDEF"), 1);
  assert.equal(countPasswordCriteria("123456"), 1);
  assert.equal(countPasswordCriteria("!@#$%^"), 1);
  assert.equal(countPasswordCriteria("Abcdef"), 2);
  assert.equal(countPasswordCriteria("Ab1@ef"), 4);
});

test("isPasswordValid: acepta senha de 6-8 caracteres con al menos 3 criterios", () => {
  assert.equal(isPasswordValid("Ab1@ef"), true);
  assert.equal(isPasswordValid("Abcdef1"), true);
  assert.equal(isPasswordValid("Abcdef1@"), true);
});

test("isPasswordValid: rechaza senhas que no cumplen los criterios", () => {
  assert.equal(isPasswordValid("abcdef"), false);
  assert.equal(isPasswordValid("Abcdef"), false);
  assert.equal(isPasswordValid("Abcd1"), false);
  assert.equal(isPasswordValid("Abcdef1@9"), false);
  assert.equal(isPasswordValid(""), false);
});

const validAccount = {
  name: "Test User",
  email: "user@example.com",
  password: "Ab1@ef",
  confirmPassword: "Ab1@ef",
};

test("createAccountSchema: acepta datos válidos", () => {
  const result = createAccountSchema.safeParse(validAccount);
  assert.equal(result.success, true);
});

test("createAccountSchema: rechaza nombre vacío", () => {
  const result = createAccountSchema.safeParse({ ...validAccount, name: " " });
  assert.equal(result.success, false);
});

test("createAccountSchema: rechaza e-mail inválido", () => {
  const result = createAccountSchema.safeParse({ ...validAccount, email: "not-an-email" });
  assert.equal(result.success, false);
});

test("createAccountSchema: rechaza senha fuera de los criterios", () => {
  const result = createAccountSchema.safeParse({
    ...validAccount,
    password: "abcdef",
    confirmPassword: "abcdef",
  });
  assert.equal(result.success, false);
});

test("createAccountSchema: rechaza senhas que no coinciden", () => {
  const result = createAccountSchema.safeParse({
    ...validAccount,
    confirmPassword: "different",
  });
  assert.equal(result.success, false);
});
