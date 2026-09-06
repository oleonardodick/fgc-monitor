import type { CreateAccountInput, LoginDTO, LoginResponse, UserPublic } from "@fgc-monitor/shared";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const httpClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export async function login(credentials: LoginDTO): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>("/auth/login", credentials);
  return data;
}

export async function createAccount(input: CreateAccountInput): Promise<UserPublic> {
  const { data } = await httpClient.post<UserPublic>("/auth/register", input);
  return data;
}
