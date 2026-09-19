import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { loadStorageConfig } from "../config/storage.js";
import { createStorageProvider } from "../storage/storageFactory.js";
import type { IStorageProvider } from "../storage/types.js";

async function storagePlugin(fastify: FastifyInstance, _opts: object): Promise<void> {
  const config = loadStorageConfig();
  const provider = createStorageProvider(config);

  // Best-effort: garante que o bucket existe antes do primeiro uso
  // (MinIO não cria buckets automaticamente). Não derruba a aplicação
  // se o MinIO ainda estiver inicializando.
  try {
    await provider.ensureBucket?.();
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        "Storage: não foi possível garantir o bucket — verifique se o MinIO/S3 está acessível.",
        error,
      );
    }
  }

  fastify.decorate("storage", provider);

  fastify.addHook("onClose", async () => {
    await provider.destroy?.();
  });
}

export default fp(storagePlugin, {
  name: "storage",
});

declare module "fastify" {
  interface FastifyInstance {
    storage: IStorageProvider;
  }
}
