/**
 * Limites e formatos aceitos para a foto de perfil (RN-003 — Foto de perfil).
 * Usados tanto pelo frontend (pré-validação do formulário) quanto pelo backend
 * (validação definitiva no momento do upload).
 */
export const PROFILE_PHOTO_MAX_DIMENSION_PX = 400;

export const ALLOWED_PROFILE_PHOTO_MIME_TYPES: readonly string[] = ["image/png", "image/jpeg"];

/** Teto de segurança para o tamanho em bytes do upload (não especificado no UC-010). */
export const MAX_PROFILE_PHOTO_BYTES = 2 * 1024 * 1024;
