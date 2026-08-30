import cors from "@fastify/cors";
import type { HealthResponse } from "@fgc-monitor/shared";
import Fastify from "fastify";
import { loadEnvConfig } from "./config/env.js";
import mongoosePlugin from "./plugins/mongoose.js";

export interface BuildServerOptions {
  /**
   * Whether to register the Mongoose plugin (connects to MongoDB).
   * Set to false for tests that don't need a database connection.
   * @default true
   */
  registerMongoose?: boolean;
}

export async function buildServer(options?: BuildServerOptions) {
  const { registerMongoose = true } = options ?? {};
  const config = loadEnvConfig();

  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: config.corsOrigin,
  });

  if (registerMongoose) {
    await app.register(mongoosePlugin);
  }

  app.get("/health", async (): Promise<HealthResponse> => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  });

  return app;
}
