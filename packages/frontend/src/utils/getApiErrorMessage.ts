import type { AxiosError } from "axios";

/**
 * Extrai a mensagem retornada pela API (ex.: "E-mail já cadastrado").
 * Para erros sem resposta da API, retorna uma mensagem genérica.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Erro inesperado. Tente novamente.",
): string {
  if (error instanceof Error) {
    const apiError = error as AxiosError<{ message?: string }>;
    const message = apiError.response?.data?.message;
    if (message) {
      return message;
    }
  }
  return fallback;
}
