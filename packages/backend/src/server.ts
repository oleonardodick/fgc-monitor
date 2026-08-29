import cors from "@fastify/cors";
import type { HealthResponse } from "@fgc-monitor/shared";
import Fastify from "fastify";

export async function buildServer() {
  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  });

  app.get("/health", async (): Promise<HealthResponse> => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  });

  return app;
}
