import { UnsupportedStorageDriverError } from "../errors/storage.js";
import { S3StorageProvider } from "./providers/s3StorageProvider.js";
import type { IStorageProvider, StorageConfig } from "./types.js";

/**
 * Seleciona e instancia o provider ativo (padrão Strategy).
 *
 * Ponto de extensão para novos providers: implemente `IStorageProvider` em
 * `./providers`, importe a classe aqui e adicione um novo `case` no switch.
 * Nenhuma regra de negócio precisa ser alterada ao trocar de provider.
 */
export function createStorageProvider(config: StorageConfig): IStorageProvider {
  switch (config.driver) {
    case "minio":
      return new S3StorageProvider(config.s3);

    // case "cloudinary":
    //   return new CloudinaryStorageProvider(config.cloudinary);
    // case "azure":
    //   return new AzureBlobStorageProvider(config.azure);
    // case "gcs":
    //   return new GoogleCloudStorageProvider(config.gcs);

    default:
      throw new UnsupportedStorageDriverError(config.driver);
  }
}
