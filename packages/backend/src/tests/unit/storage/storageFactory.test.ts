import assert from "node:assert/strict";
import { test } from "node:test";
import { UnsupportedStorageDriverError } from "../../../errors/storage.js";
import { S3StorageProvider } from "../../../storage/providers/s3StorageProvider.js";
import { createStorageProvider } from "../../../storage/storageFactory.js";
import type { StorageConfig } from "../../../storage/types.js";

function createConfig(driver: StorageConfig["driver"] = "minio"): StorageConfig {
  return {
    driver,
    s3: {
      endpoint: "http://localhost:9000",
      region: "us-east-1",
      accessKeyId: "minioadmin",
      secretAccessKey: "minioadmin",
      bucket: "fgc-monitor",
      useSsl: false,
    },
  };
}

test("createStorageProvider: retorna um S3StorageProvider para o driver 'minio'", () => {
  const provider = createStorageProvider(createConfig("minio"));

  assert.ok(provider instanceof S3StorageProvider);
  assert.equal(provider.driver, "minio");
});

test("createStorageProvider: lança UnsupportedStorageDriverError para driver válido mas não implementado", () => {
  assert.throws(
    () => createStorageProvider(createConfig("cloudinary")),
    (error: unknown) => {
      assert.ok(error instanceof UnsupportedStorageDriverError);
      assert.match((error as Error).message, /cloudinary/);
      assert.equal((error as UnsupportedStorageDriverError).statusCode, 500);
      return true;
    },
  );
});
