import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  IStorageProvider,
  S3StorageConfig,
  StorageDriver,
  StorageFile,
  StorageUploadResult,
} from "../types.js";

export interface S3StorageProviderDeps {
  /** Client S3 injetável para testes (padrão: criado a partir da config). */
  client?: S3Client;
  /** Função de assinatura de URL injetável para testes (padrão: getSignedUrl do AWS SDK). */
  signUrl?: typeof getSignedUrl;
}

/**
 * Adaptador de storage para endpoints S3-compatíveis (MinIO / AWS S3).
 * Implementa `IStorageProvider` — trocar de provider não afeta as regras de negócio.
 */
export class S3StorageProvider implements IStorageProvider {
  public readonly driver: StorageDriver = "minio";

  private readonly config: S3StorageConfig;
  private readonly client: S3Client;
  private readonly signUrl: typeof getSignedUrl;

  constructor(config: S3StorageConfig, deps: S3StorageProviderDeps = {}) {
    this.config = config;
    this.client = deps.client ?? createS3Client(config);
    this.signUrl = deps.signUrl ?? getSignedUrl;
  }

  async upload(file: StorageFile): Promise<StorageUploadResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: file.key,
        Body: file.body,
        ContentType: file.contentType,
        Metadata: file.metadata,
      }),
    );

    return { key: file.key };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
    );
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    return this.signUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
      { expiresIn: expiresInSeconds },
    );
  }

  async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.config.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.config.bucket }));
    }
  }

  destroy(): void {
    this.client.destroy();
  }
}

function createS3Client(config: S3StorageConfig): S3Client {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    // Obrigatório para endpoints S3-compatíveis (MinIO): endereçamento por path, não por host virtual.
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}
