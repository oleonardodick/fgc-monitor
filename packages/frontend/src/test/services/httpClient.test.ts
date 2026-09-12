import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_UNAUTHORIZED_EVENT,
  httpClient,
} from "../../services/httpClient";

function okResponse(config: InternalAxiosRequestConfig): AxiosResponse {
  return {
    data: {},
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
}

describe("httpClient", () => {
  const originalAdapter = httpClient.defaults.adapter;
  let capturedConfig: InternalAxiosRequestConfig | null;

  beforeEach(() => {
    capturedConfig = null;
    localStorage.clear();
    httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      capturedConfig = config;
      return okResponse(config);
    };
  });

  afterEach(() => {
    httpClient.defaults.adapter = originalAdapter;
  });

  it("usa VITE_API_URL como baseURL (ou localhost:3000 por padrão)", () => {
    expect(httpClient.defaults.baseURL).toBe(
      import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    );
  });

  it("envia o header Authorization quando existe um token em localStorage", async () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "token-de-teste");

    await httpClient.get("/investimentos");

    expect(capturedConfig?.headers.get("Authorization")).toBe("Bearer token-de-teste");
  });

  it("não envia o header Authorization quando não existe token", async () => {
    await httpClient.get("/health");

    expect(capturedConfig?.headers.has("Authorization")).toBe(false);
  });

  it("dispara AUTH_UNAUTHORIZED_EVENT e propaga o erro quando a API responde 401", async () => {
    const events: Event[] = [];
    const onEvent = (event: Event) => {
      events.push(event);
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onEvent);

    try {
      const unauthorized = new AxiosError("Request failed with status code 401");
      unauthorized.response = {
        data: { message: "Token de autenticação inválido ou ausente." },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config: {} as never,
      };
      httpClient.defaults.adapter = async () => {
        throw unauthorized;
      };

      const error = await httpClient.get("/investimentos").catch((caught) => caught);

      expect(events).toHaveLength(1);
      expect(error).toBe(unauthorized);
    } finally {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onEvent);
    }
  });
});
