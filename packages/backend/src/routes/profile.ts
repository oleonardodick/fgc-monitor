import type { FastifyInstance } from "fastify";
import { getProfile, getProfilePhoto, updateProfile } from "../controllers/profileController.js";

const userProfileResponse = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    hasPhoto: { type: "boolean" },
  },
  required: ["id", "name", "email", "hasPhoto"],
} as const;

const errorResponse = {
  type: "object",
  properties: {
    statusCode: { type: "number" },
    error: { type: "string" },
    message: { type: "string" },
  },
} as const;

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/users/me",
    {
      schema: {
        tags: ["users"],
        description: "Retorna o perfil do usuário autenticado (UC-010).",
        summary: "Obter perfil",
        response: {
          200: userProfileResponse,
          401: errorResponse,
          503: errorResponse,
        },
      },
    },
    getProfile,
  );

  fastify.patch(
    "/users/me",
    {
      schema: {
        tags: ["users"],
        description:
          "Atualiza o perfil do usuário autenticado: nome, e-mail e foto opcional (PNG/JPG, máx. 400x400) (UC-010).",
        summary: "Atualizar perfil",
        consumes: ["multipart/form-data"],
        body: {
          // Com a API "promise" do @fastify/multipart o body não é parseado
          // pelo parser (fica `undefined` → validado como `null` pelo Fastify).
          // `["object", "null"]` evita o erro "body must be object" mantendo
          // o schema real usado na documentação Swagger.
          type: ["object", "null"],
          required: ["name", "email"],
          properties: {
            name: { type: "string", minLength: 1, description: "Nome do usuário" },
            email: { type: "string", format: "email", description: "E-mail do usuário" },
            photo: {
              type: "string",
              format: "binary",
              description: "Foto de perfil (PNG/JPG, máx. 400x400 pixels)",
            },
          },
        },
        response: {
          200: userProfileResponse,
          400: errorResponse,
          401: errorResponse,
          409: errorResponse,
          413: errorResponse,
          503: errorResponse,
        },
      },
    },
    updateProfile,
  );

  fastify.get(
    "/users/me/photo",
    {
      schema: {
        tags: ["users"],
        description:
          "Retorna a foto de perfil do usuário autenticado (proxy do storage — UC-010, RN-003).",
        summary: "Obter foto de perfil",
        produces: ["image/png", "image/jpeg"],
        response: {
          200: { type: "string", format: "binary" },
          401: errorResponse,
          404: errorResponse,
          503: errorResponse,
        },
      },
    },
    getProfilePhoto,
  );
}
