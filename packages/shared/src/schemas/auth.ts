import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 8;
export const MIN_PASSWORD_CRITERIA = 3;

const UPPERCASE_PATTERN = /[A-Z]/;
const LOWERCASE_PATTERN = /[a-z]/;
const DIGIT_PATTERN = /[0-9]/;
const SPECIAL_CHAR_PATTERN = /[^A-Za-z0-9]/;

/**
 * Cuenta cuántos criterios de seguridad cumple la senha (RS-001):
 * mayúscula, minúscula, número y carácter especial.
 */
export function countPasswordCriteria(password: string): number {
  let count = 0;
  if (UPPERCASE_PATTERN.test(password)) count++;
  if (LOWERCASE_PATTERN.test(password)) count++;
  if (DIGIT_PATTERN.test(password)) count++;
  if (SPECIAL_CHAR_PATTERN.test(password)) count++;
  return count;
}

/**
 * RS-001 — Senha segura: entre 6 y 8 caracteres y al menos 3 de los 4
 * criterios de seguridad definidos.
 */
export function isPasswordValid(password: string): boolean {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH &&
    countPasswordCriteria(password) >= MIN_PASSWORD_CRITERIA
  );
}

export const loginSchema = z.object({
  email: z.email("Formato de e-mail inválido").describe("E-mail do usuário"),
  password: z.string().min(1, "Senha é obrigatória").describe("Senha do usuário"),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const createAccountSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório").describe("Nome do usuário"),
    email: z.email("Formato de e-mail inválido").describe("E-mail do usuário"),
    password: z
      .string()
      .min(1, "Senha é obrigatoria")
      .refine(isPasswordValid, "A senha deve atender aos critérios de segurança")
      .describe("Senha do usuário"),
    confirmPassword: z
      .string()
      .min(1, "Confirmar senha é obrigatoria")
      .describe("Confirmação da senha"),
  })
  .refine((data) => data.password === data.confirmPassword, "As senhas não coinciden");

export type CreateAccountDTO = z.infer<typeof createAccountSchema>;
