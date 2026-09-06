import assert from "node:assert/strict";
import { mock, test } from "node:test";
import type { LoginDTO, UserPublic } from "@fgc-monitor/shared";
import type { IBcryptPlugin } from "../../../plugins/bcrypt.js";
import type { IUserRepository } from "../../../repositories/userRepository.js";
import type { IJwtPlugin } from "../../../services/authService.js";
import { login } from "../../../services/authService.js";

function createValidUser() {
  return {
    id: "661c8a1b2e5f3a1d4c3b2a1a",
    email: "user@example.com",
    name: "Test User",
    passwordHash: "$2a$10$hashedpassword",
    active: true,
    createdAt: new Date(),
  };
}

function createDeps(overrides?: {
  findActiveByEmail?: IUserRepository["findActiveByEmail"];
  compare?: IBcryptPlugin["compare"];
  sign?: IJwtPlugin["sign"];
}) {
  return {
    userRepository: {
      findActiveByEmail:
        overrides?.findActiveByEmail ?? mock.fn(() => Promise.resolve(createValidUser())),
    } as IUserRepository,
    bcrypt: {
      compare: overrides?.compare ?? mock.fn(() => Promise.resolve(true)),
    } as IBcryptPlugin,
    jwt: {
      sign: overrides?.sign ?? mock.fn(() => "mock-jwt-token"),
    } as IJwtPlugin,
  };
}

const validCredentials: LoginDTO = {
  email: "user@example.com",
  password: "correct-password",
};

test("login: deve retornar token e dados do usuário quando credenciais são válidas", async () => {
  const user = createValidUser();
  const deps = createDeps({
    findActiveByEmail: mock.fn(() => Promise.resolve(user)),
    compare: mock.fn(() => Promise.resolve(true)),
    sign: mock.fn(() => "jwt-token-123"),
  });

  const result = await login(validCredentials, deps);

  assert.equal(result.token, "jwt-token-123");
  assert.equal(result.user.id, user.id);
  assert.equal(result.user.email, user.email);
  assert.equal(result.user.name, user.name);
});

test("login: deve lançar InvalidCredentialsError quando e-mail não existe", async () => {
  const deps = createDeps({
    findActiveByEmail: mock.fn(() => Promise.resolve(null)),
  });

  await assert.rejects(
    () => login(validCredentials, deps),
    (error: unknown) => {
      assert.equal((error as Error).message, "Credenciais inválidas");
      return true;
    },
  );
});

test("login: deve lançar InvalidCredentialsError quando senha está incorreta", async () => {
  const deps = createDeps({
    findActiveByEmail: mock.fn(() => Promise.resolve(createValidUser())),
    compare: mock.fn(() => Promise.resolve(false)),
  });

  await assert.rejects(
    () => login(validCredentials, deps),
    (error: unknown) => {
      assert.equal((error as Error).message, "Credenciais inválidas");
      return true;
    },
  );
});

test("login: deve lançar AuthenticationServiceError quando repositório lança erro", async () => {
  const deps = createDeps({
    findActiveByEmail: mock.fn(() => Promise.reject(new Error("DB error"))),
  });

  await assert.rejects(
    () => login(validCredentials, deps),
    (error: unknown) => {
      assert.equal((error as Error).message, "Serviço de autenticação indisponível");
      return true;
    },
  );
});
