import { buildServer } from "./server.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

async function main() {
  const app = await buildServer();
  await app.listen({ port: PORT, host: HOST });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
