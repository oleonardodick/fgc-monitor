export class StorageProviderError extends Error {
  public statusCode: number;

  constructor(message = "Serviço de armazenamento indisponível") {
    super(message);
    this.name = "StorageProviderError";
    this.statusCode = 503;
  }
}

export class UnsupportedStorageDriverError extends Error {
  public statusCode: number;

  constructor(driver: string) {
    super(`Driver de armazenamento não suportado: "${driver}"`);
    this.name = "UnsupportedStorageDriverError";
    this.statusCode = 500;
  }
}
