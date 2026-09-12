import axios, { type AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Chave usada para persistir o token de autenticação no localStorage. */
export const AUTH_TOKEN_STORAGE_KEY = "auth_token";

/** Evento disparado quando a API retorna um 401 (token inválido/expirado). */
export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

/** Cliente HTTP genérico para comunicação com a API. */
export const httpClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Injeta o token de autenticação nas rotas protegidas.
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Notifica quando o token é inválido ou expirou (resposta 401).
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }
    throw error;
  },
);
