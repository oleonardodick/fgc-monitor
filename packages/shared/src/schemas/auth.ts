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

const PASSWORD_CRITERIA_MESSAGE = `A senha deve ter entre ${PASSWORD_MIN_LENGTH} e ${PASSWORD_MAX_LENGTH} caracteres e cumprir ao menos ${MIN_PASSWORD_CRITERIA} critérios de segurança`;

/**
 * E-mail comum a login/registro: primeiro exige valor (mensagem de campo
 * obrigatório) e depois valida o formato. A ordem via `pipe` garante a
 * prioridade das mensagens: vazio -> "E-mail é obrigatório",
 * inválido -> "Formato de e-mail inválido". O `.trim()` remove espaços
 * no valor enviado (ex.: o formulario envia o e-mail sem espaços).
 */
const emailSchema = z
  .string()
  .trim()
  .min(1, "E-mail é obrigatório")
  .pipe(z.email("Formato de e-mail inválido"));

export const loginSchema = z.object({
  email: emailSchema.describe("E-mail do usuário"),
  password: z.string().min(1, "Senha é obrigatória").describe("Senha do usuário"),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const createAccountSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório").describe("Nome do usuário"),
    email: emailSchema.describe("E-mail do usuário"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .refine(isPasswordValid, PASSWORD_CRITERIA_MESSAGE)
      .describe("Senha do usuário"),
    confirmPassword: z
      .string()
      .min(1, "Confirmar senha é obrigatória")
      .describe("Confirmação da senha"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
      });
    }
  });

export type CreateAccountDTO = z.infer<typeof createAccountSchema>;
