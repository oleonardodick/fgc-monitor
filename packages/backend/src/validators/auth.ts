import type { LoginDTO } from "@fgc-monitor/shared";

export type { LoginDTO as LoginBody };

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
