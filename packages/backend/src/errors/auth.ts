export class InvalidCredentialsError extends Error {
  public statusCode: number;

  constructor() {
    super("Credenciais inválidas");
    this.name = "InvalidCredentialsError";
    this.statusCode = 401;
  }
}

export class InactiveUserError extends Error {
  public statusCode: number;

  constructor() {
    super("Conta desativada");
    this.name = "InactiveUserError";
    this.statusCode = 403;
  }
}

export class AuthenticationServiceError extends Error {
  public statusCode: number;

  constructor() {
    super("Serviço de autenticação indisponível");
    this.name = "AuthenticationServiceError";
    this.statusCode = 503;
  }
}

export class EmailAlreadyRegisteredError extends Error {
  public statusCode: number;

  constructor() {
    super("E-mail já cadastrado");
    this.name = "EmailAlreadyRegisteredError";
    this.statusCode = 409;
  }
}

export class InvalidPasswordError extends Error {
  public statusCode: number;

  constructor() {
    super("A senha deve atender aos critérios de segurança");
    this.name = "InvalidPasswordError";
    this.statusCode = 400;
  }
}

export class CreateAccountServiceError extends Error {
  public statusCode: number;

  constructor() {
    super("Serviço de criação de conta indisponível");
    this.name = "CreateAccountServiceError";
    this.statusCode = 503;
  }
}
