import assert from "node:assert/strict";
import { mock, test } from "node:test";
import type { CreateAccountInput, LoginDTO } from "@fgc-monitor/shared";
import type { IUserDocument } from "../../../models/user.js";
import type { IBcryptPlugin } from "../../../plugins/bcrypt.js";
import type { CreateUserData, IUserRepository } from "../../../repositories/userRepository.js";
import { createAccount, type IJwtPlugin, login } from "../../../services/authService.js";

function createValidUser(): IUserDocument {
  return {
    id: "661c8a1b2e5f3a1d4c3b2a1a",
    email: "user@example.com",
    name: "Test User",
    passwordHash: "$2a$10$hashedpassword",
    active: true,
    createdAt: new Date(),
  } as IUserDocument;
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

const validCreateAccountInput: CreateAccountInput = {
  name: "Test User",
  email: " USER@EXAMPLE.COM ",
  password: "Ab1@ef",
};

function createCreateAccountDeps(overrides?: {
  findByEmail?: IUserRepository["findByEmail"];
  create?: IUserRepository["create"];
  hash?: IBcryptPlugin["hash"];
}) {
  return {
    userRepository: {
      findByEmail: overrides?.findByEmail ?? mock.fn(() => Promise.resolve(null)),
      create: overrides?.create ?? mock.fn(() => Promise.resolve(createValidUser())),
    } as IUserRepository,
    bcrypt: {
      hash: overrides?.hash ?? mock.fn(() => Promise.resolve("$2a$10$hashedpassword")),
    } as IBcryptPlugin,
  };
}

test("createAccount: deve criar usuário e retornar dados públicos", async () => {
  const user = createValidUser();
  let createdData: unknown;
  const deps = createCreateAccountDeps({
    findByEmail: mock.fn(() => Promise.resolve(null)),
    create: mock.fn((data: CreateUserData) => {
      createdData = data;
      return Promise.resolve(user);
    }),
    hash: mock.fn(() => Promise.resolve("$2a$10$hashedpassword")),
  });

  const result = await createAccount(validCreateAccountInput, deps);

  assert.equal(result.id, user.id);
  assert.equal(result.email, user.email);
  assert.equal(result.name, user.name);

  const createData = createdData as { name: string; email: string; passwordHash: string };
  assert.equal(createData.name, "Test User");
  assert.equal(createData.email, "user@example.com");
  assert.equal(createData.passwordHash, "$2a$10$hashedpassword");
});

test("createAccount: deve lançar EmailAlreadyRegisteredError quando o e-mail já existe", async () => {
  const deps = createCreateAccountDeps({
    findByEmail: mock.fn(() => Promise.resolve(createValidUser())),
  });

  await assert.rejects(
    () => createAccount(validCreateAccountInput, deps),
    (error: unknown) => {
      assert.equal((error as Error).message, "E-mail já cadastrado");
      return true;
    },
  );
});

test("createAccount: deve lançar InvalidPasswordError quando a senha não atende aos critérios", async () => {
  const deps = createCreateAccountDeps();

  await assert.rejects(
    () => createAccount({ ...validCreateAccountInput, password: "abcdef" }, deps),
    (error: unknown) => {
      assert.equal((error as Error).message, "A senha deve atender aos critérios de segurança");
      return true;
    },
  );
});

test("createAccount: deve lançar CreateAccountServiceError quando o repositório lança erro", async () => {
  const deps = createCreateAccountDeps({
    findByEmail: mock.fn(() => Promise.reject(new Error("DB error"))),
  });

  await assert.rejects(
    () => createAccount(validCreateAccountInput, deps),
    (error: unknown) => {
      assert.equal((error as Error).message, "Serviço de criação de conta indisponível");
      return true;
    },
  );
});
