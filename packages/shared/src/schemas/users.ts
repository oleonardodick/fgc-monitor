import { z } from "zod";
import { emailSchema } from "./auth.js";

/**
 * Schema de atualização de perfil (UC-010 — Gerenciar Perfil).
 * Nome e e-mail são obrigatórios; a foto é enviada à parte (multipart) e
 * validada no backend.
 */
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").describe("Nome do usuário"),
  email: emailSchema.describe("E-mail do usuário"),
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
