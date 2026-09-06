import type { FastifyInstance } from "fastify";
import { createAccount, login } from "../controllers/authController.js";
import { createAccountBodyJsonSchema, loginBodyJsonSchema } from "../validators/auth.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        description: "Autentica um usuário e retorna um token JWT.",
        summary: "Login",
        body: loginBodyJsonSchema,
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  name: { type: "string" },
                },
                required: ["id", "email", "name"],
              },
            },
            required: ["token", "user"],
          },
          401: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          503: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      config: {
        isPublic: true,
      },
    },
    login,
  );

  fastify.post(
    "/auth/register",
    {
      schema: {
        tags: ["auth"],
        description: "Cria uma conta de usuário para utilizar o sistema.",
        summary: "Criar conta",
        body: createAccountBodyJsonSchema,
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              name: { type: "string" },
            },
            required: ["id", "email", "name"],
          },
          400: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          409: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          503: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      config: {
        isPublic: true,
      },
    },
    createAccount,
  );
}
