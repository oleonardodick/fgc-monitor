import type { UserProfile } from "@fgc-monitor/shared";
import type { AxiosError } from "axios";
import { httpClient } from "../../../services/httpClient.js";

export interface UpdateProfileFormData {
  name: string;
  email: string;
  photo?: File;
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await httpClient.get<UserProfile>("/users/me");
  return data;
}

export async function updateProfile(input: UpdateProfileFormData): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("email", input.email);
  if (input.photo) {
    formData.append("photo", input.photo);
  }

  const { data } = await httpClient.patch<UserProfile>("/users/me", formData, {
    // Importante: `httpClient` define `Content-Type: application/json` por padrão.
    // Para `FormData`, axios precisa calcular o boundary — a content-type deve ser
    // `multipart/form-data` (sem boundary; axios o agrega automaticamente).
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Busca a foto de perfil como Blob (proxy do backend — RN-003).
 * Retorna `null` quando a foto não existe (404).
 */
export async function getProfilePhotoBlob(): Promise<Blob | null> {
  try {
    const { data } = await httpClient.get<Blob>("/users/me/photo", {
      responseType: "blob",
    });
    return data;
  } catch (error) {
    if ((error as AxiosError).response?.status === 404) {
      return null;
    }
    throw error;
  }
}
