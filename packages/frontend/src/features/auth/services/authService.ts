import type { CreateAccountInput, LoginDTO, LoginResponse, UserPublic } from "@fgc-monitor/shared";
import { httpClient } from "../../../services/httpClient.js";

export async function login(credentials: LoginDTO): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>("/auth/login", credentials);
  return data;
}

export async function createAccount(input: CreateAccountInput): Promise<UserPublic> {
  const { data } = await httpClient.post<UserPublic>("/auth/register", input);
  return data;
}
