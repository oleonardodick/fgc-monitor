export interface EnvConfig {
  port: number;
  host: string;
  corsOrigin: string;
  mongodbUri: string | undefined;
}

export function loadEnvConfig(): EnvConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? "0.0.0.0",
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    mongodbUri: process.env.MONGODB_URI,
  };
}
