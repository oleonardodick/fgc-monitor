import type { CreateAccountInput, LoginDTO } from "@fgc-monitor/shared";

export type { LoginDTO as LoginBody };

export type CreateAccountBody = CreateAccountInput;

/**
 * JSON Schema for Fastify's AJV validation.
 * Compatível com JSON Schema draft-07.
 */
export const loginBodyJsonSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
      description: "E-mail do usuário",
    },
    password: {
      type: "string",
      minLength: 1,
      description: "Senha do usuário",
    },
  },
  additionalProperties: false,
} as const;

/**
 * JSON Schema for Fastify's AJV validation.
 * Compatível com JSON Schema draft-07.
 */
export const createAccountBodyJsonSchema = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
      description: "Nome do usuário",
    },
    email: {
      type: "string",
      format: "email",
      description: "E-mail do usuário",
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 8,
      description: "Senha do usuário",
    },
  },
  additionalProperties: false,
} as const;
