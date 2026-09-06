import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Formato de e-mail inválido").describe("E-mail do usuário"),
  password: z.string().min(1, "Senha é obrigatória").describe("Senha do usuário"),
});

export type LoginDTO = z.infer<typeof loginSchema>;
