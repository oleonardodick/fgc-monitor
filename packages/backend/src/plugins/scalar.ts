import scalar from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function scalarPlugin(fastify: FastifyInstance, _opts: object) {
  await fastify.register(scalar, {
    routePrefix: "/docs",
    configuration: {
      title: "FGC Monitor - Documentação da API",
    },
  });
}

export default fp(scalarPlugin, {
  name: "scalar",
});
