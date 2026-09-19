import type { Readable } from "node:stream";

/**
 * Drivers de storage suportados pelo contrato.
 * A lista é extensível: para adicionar um novo provider, basta incluir o driver aqui,
 * criar o adaptador correspondente em `./providers` e registrá-lo no `./storageFactory`.
 */
export type StorageDriver = "minio" | "cloudinary" | "azure" | "gcs";

/** Corpo (payload) de um arquivo aceito pelo contrato de storage. */
export type StorageFileBody = Buffer | Uint8Array | Readable | string;

export interface StorageFile {
  /** Chave única do objeto no storage (caminho + nome, ex.: "users/123/avatar.png"). */
  key: string;
  /** Conteúdo do arquivo a ser gravado. */
  body: StorageFileBody;
  /** Tipo MIME do arquivo (ex.: "image/png"). */
  contentType?: string;
  /** Metadados customizados persistidos junto ao objeto. */
  metadata?: Record<string, string>;
}

export interface StorageUploadResult {
  /** Chave do objeto gravado. */
  key: string;
  /** URL pública do objeto, quando o provider a disponibilizar (ex.: Cloudinary). */
  url?: string;
}

/** Configuração do provider S3-compatível (MinIO / AWS S3). */
export interface S3StorageConfig {
  /** URL do endpoint S3-compatível (ex.: "http://localhost:9000"). */
  endpoint: string;
  /** Região do bucket (MinIO: qualquer valor válido, ex.: "us-east-1"). */
  region: string;
  /** Access Key ID (MinIO: root user). */
  accessKeyId: string;
  /** Secret Access Key (MinIO: root password). */
  secretAccessKey: string;
  /** Nome do bucket onde os objetos serão gravados. */
  bucket: string;
  /** Se `true`, usa HTTPS/TLS para se conectar ao endpoint. */
  useSsl: boolean;
}

/** Configuração completa do sistema de storage, por driver. */
export interface StorageConfig {
  /** Driver ativo (selecionado por `STORAGE_DRIVER`). */
  driver: StorageDriver;
  /** Configuração do provider S3-compatível. */
  s3: S3StorageConfig;
}

/**
 * Contrato abstrato de um provider de storage (padrão Strategy/Adapter).
 * As regras de negócio dependem apenas desta interface — nunca de um provider concreto.
 */
export interface IStorageProvider {
  readonly driver: StorageDriver;

  /** Grava um arquivo no storage. */
  upload(file: StorageFile): Promise<StorageUploadResult>;

  /** Remove um objeto do storage pela chave. */
  delete(key: string): Promise<void>;

  /** Gera uma URL assinada (temporária) para download de um objeto. */
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /** Garante que o destino (ex.: bucket) existe. Opcional — nem todo provider precisa. */
  ensureBucket?(): Promise<void>;

  /** Libera recursos do provider (fecha client HTTP etc.). Opcional. */
  destroy?(): void | Promise<void>;
}
