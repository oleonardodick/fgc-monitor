import { UnsupportedStorageDriverError } from "../errors/storage.js";
import type { S3StorageConfig, StorageConfig, StorageDriver } from "../storage/types.js";

const SUPPORTED_DRIVERS: readonly StorageDriver[] = ["minio", "cloudinary", "azure", "gcs"];
const DEFAULT_DRIVER: StorageDriver = "minio";
const DEFAULT_S3_REGION = "us-east-1";

/**
 * Carrega e valida a configuração de storage a partir das variáveis de ambiente.
 * Lança erros descritivos quando variáveis obrigatórias estão ausentes ou inválidas.
 */
export function loadStorageConfig(): StorageConfig {
  const driver = parseDriver(process.env.STORAGE_DRIVER);

  if (driver === "minio") {
    return { driver, s3: loadS3Config() };
  }

  // Driver válido no contrato, mas ainda sem adaptador implementado.
  throw new UnsupportedStorageDriverError(driver);
}

function parseDriver(rawDriver: string | undefined): StorageDriver {
  const candidate = (rawDriver ?? DEFAULT_DRIVER).trim().toLowerCase();

  if (!SUPPORTED_DRIVERS.includes(candidate as StorageDriver)) {
    throw new Error(
      `STORAGE_DRIVER inválido: "${rawDriver}". ` +
        `Valores suportados: ${SUPPORTED_DRIVERS.join(", ")}.`,
    );
  }

  return candidate as StorageDriver;
}

function loadS3Config(): S3StorageConfig {
  const accessKeyId = process.env.S3_ACCESS_KEY;
  const secretAccessKey = process.env.S3_SECRET_KEY;
  const bucket = process.env.S3_BUCKET;
  const endpointRaw = process.env.S3_ENDPOINT;

  const missing: string[] = [];
  if (!accessKeyId) missing.push("S3_ACCESS_KEY");
  if (!secretAccessKey) missing.push("S3_SECRET_KEY");
  if (!bucket) missing.push("S3_BUCKET");
  if (!endpointRaw) missing.push("S3_ENDPOINT");

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente de storage obrigatórias ausentes: ${missing.join(", ")}. ` +
        "Defina-as em .env ou exporte-as como variáveis de ambiente.",
    );
  }

  const useSsl = process.env.S3_USE_SSL === "true";

  return {
    endpoint: buildEndpoint(endpointRaw as string, useSsl),
    region: process.env.S3_REGION ?? DEFAULT_S3_REGION,
    accessKeyId: accessKeyId as string,
    secretAccessKey: secretAccessKey as string,
    bucket: bucket as string,
    useSsl,
  };
}

/**
 * Normaliza o endpoint. Se o valor já trouxer protocolo (`http(s)://`), mantém;
 * caso contrário, prefixa com `https://` ou `http://` conforme `useSsl`.
 */
function buildEndpoint(rawEndpoint: string, useSsl: boolean): string {
  const trimmed = rawEndpoint.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `${useSsl ? "https://" : "http://"}${trimmed}`;
}
