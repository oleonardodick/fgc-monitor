import cors from "@fastify/cors";
import type { HealthResponse } from "@fgc-monitor/shared";
import Fastify from "fastify";
import { loadEnvConfig } from "./config/env.js";
import { authenticate } from "./middlewares/auth.js";
import bcryptPlugin from "./plugins/bcrypt.js";
import jwtPlugin from "./plugins/jwt.js";
import mongoosePlugin from "./plugins/mongoose.js";
import scalarPlugin from "./plugins/scalar.js";
import swaggerPlugin from "./plugins/swagger.js";
import { authRoutes } from "./routes/auth.js";

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

  await app.register(swaggerPlugin);
  await app.register(scalarPlugin);
  await app.register(jwtPlugin);
  await app.register(bcryptPlugin);

  if (registerMongoose) {
    await app.register(mongoosePlugin);
  }

  // Global preValidation hook — protege todas as rotas, exceto as públicas
  app.addHook("preValidation", authenticate);

  // Rotas públicas (auth + health)
  await app.register(authRoutes);

  app.get(
    "/health",
    {
      schema: {
        tags: ["health"],
        description: "Verifica se a API está operacional.",
        summary: "Health check",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string", enum: ["ok"] },
              timestamp: { type: "string", format: "date-time" },
            },
            required: ["status", "timestamp"],
          },
        },
      },
      config: {
        isPublic: true,
      },
    },
    async (): Promise<HealthResponse> => {
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
      };
    },
  );

  return app;
}
