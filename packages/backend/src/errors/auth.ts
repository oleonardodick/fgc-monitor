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
