import assert from "node:assert/strict";
import { test } from "node:test";
import { loadStorageConfig } from "../../../config/storage.js";
import { UnsupportedStorageDriverError } from "../../../errors/storage.js";

const STORAGE_ENV_KEYS = [
  "STORAGE_DRIVER",
  "S3_ENDPOINT",
  "S3_REGION",
  "S3_ACCESS_KEY",
  "S3_SECRET_KEY",
  "S3_BUCKET",
  "S3_USE_SSL",
] as const;

function setStorageEnv(values: Record<string, string>): void {
  for (const key of STORAGE_ENV_KEYS) {
    delete process.env[key];
  }
  for (const [key, value] of Object.entries(values)) {
    process.env[key] = value;
  }
}

function clearStorageEnv(): void {
  for (const key of STORAGE_ENV_KEYS) {
    delete process.env[key];
  }
}

test("loadStorageConfig: carrega a configuração MinIO a partir das variáveis de ambiente", () => {
  try {
    setStorageEnv({
      STORAGE_DRIVER: "minio",
      S3_ENDPOINT: "http://localhost:9000",
      S3_REGION: "us-east-1",
      S3_ACCESS_KEY: "minioadmin",
      S3_SECRET_KEY: "minioadmin",
      S3_BUCKET: "fgc-monitor",
      S3_USE_SSL: "false",
    });

    const config = loadStorageConfig();

    assert.equal(config.driver, "minio");
    assert.equal(config.s3.endpoint, "http://localhost:9000");
    assert.equal(config.s3.region, "us-east-1");
    assert.equal(config.s3.accessKeyId, "minioadmin");
    assert.equal(config.s3.secretAccessKey, "minioadmin");
    assert.equal(config.s3.bucket, "fgc-monitor");
    assert.equal(config.s3.useSsl, false);
  } finally {
    clearStorageEnv();
  }
});

test("loadStorageConfig: usa padrões para driver, região e SSL quando não informados", () => {
  try {
    setStorageEnv({
      S3_ENDPOINT: "localhost:9000",
      S3_ACCESS_KEY: "minioadmin",
      S3_SECRET_KEY: "minioadmin",
      S3_BUCKET: "fgc-monitor",
    });

    const config = loadStorageConfig();

    assert.equal(config.driver, "minio");
    assert.equal(config.s3.endpoint, "http://localhost:9000");
    assert.equal(config.s3.region, "us-east-1");
    assert.equal(config.s3.useSsl, false);
  } finally {
    clearStorageEnv();
  }
});

test("loadStorageConfig: adiciona https ao endpoint quando useSsl é true e não há protocolo", () => {
  try {
    setStorageEnv({
      S3_ENDPOINT: "s3.meu-dominio.com",
      S3_ACCESS_KEY: "minioadmin",
      S3_SECRET_KEY: "minioadmin",
      S3_BUCKET: "fgc-monitor",
      S3_USE_SSL: "true",
    });

    const config = loadStorageConfig();

    assert.equal(config.s3.endpoint, "https://s3.meu-dominio.com");
    assert.equal(config.s3.useSsl, true);
  } finally {
    clearStorageEnv();
  }
});

test("loadStorageConfig: lança erro quando variáveis S3 obrigatórias estão ausentes", () => {
  try {
    setStorageEnv({ STORAGE_DRIVER: "minio" });

    assert.throws(
      () => loadStorageConfig(),
      (error: unknown) => {
        assert.match((error as Error).message, /S3_ACCESS_KEY/);
        assert.match((error as Error).message, /S3_SECRET_KEY/);
        assert.match((error as Error).message, /S3_BUCKET/);
        assert.match((error as Error).message, /S3_ENDPOINT/);
        return true;
      },
    );
  } finally {
    clearStorageEnv();
  }
});

test("loadStorageConfig: lança erro para STORAGE_DRIVER inválido", () => {
  try {
    setStorageEnv({
      STORAGE_DRIVER: "dropbox",
      S3_ENDPOINT: "http://localhost:9000",
      S3_ACCESS_KEY: "minioadmin",
      S3_SECRET_KEY: "minioadmin",
      S3_BUCKET: "fgc-monitor",
    });

    assert.throws(
      () => loadStorageConfig(),
      (error: unknown) => {
        assert.match((error as Error).message, /STORAGE_DRIVER/);
        return true;
      },
    );
  } finally {
    clearStorageEnv();
  }
});

test("loadStorageConfig: lança UnsupportedStorageDriverError para driver válido mas não implementado", () => {
  try {
    setStorageEnv({
      STORAGE_DRIVER: "cloudinary",
      S3_ENDPOINT: "http://localhost:9000",
      S3_ACCESS_KEY: "minioadmin",
      S3_SECRET_KEY: "minioadmin",
      S3_BUCKET: "fgc-monitor",
    });

    assert.throws(
      () => loadStorageConfig(),
      (error: unknown) => {
        assert.ok(error instanceof UnsupportedStorageDriverError);
        assert.match((error as Error).message, /cloudinary/);
        return true;
      },
    );
  } finally {
    clearStorageEnv();
  }
});
