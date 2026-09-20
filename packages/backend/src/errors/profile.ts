export class UserNotFoundError extends Error {
  public statusCode: number;

  constructor() {
    super("Usuário não encontrado");
    this.name = "UserNotFoundError";
    this.statusCode = 404;
  }
}

export class EmailAlreadyInUseError extends Error {
  public statusCode: number;

  constructor() {
    super("E-mail já está em uso");
    this.name = "EmailAlreadyInUseError";
    this.statusCode = 409;
  }
}

export class InvalidProfileDataError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "InvalidProfileDataError";
    this.statusCode = 400;
  }
}

export class InvalidPhotoError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "InvalidPhotoError";
    this.statusCode = 400;
  }
}

export class ProfilePhotoNotFoundError extends Error {
  public statusCode: number;

  constructor() {
    super("Foto de perfil não encontrada");
    this.name = "ProfilePhotoNotFoundError";
    this.statusCode = 404;
  }
}

export class ProfileServiceError extends Error {
  public statusCode: number;

  constructor() {
    super("Serviço de perfil indisponível");
    this.name = "ProfileServiceError";
    this.statusCode = 503;
  }
}
