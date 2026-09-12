/**
 * Retorna as iniciais de um nome para usar no avatar do usuário.
 * Sem nome, retorna "U" como fallback.
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) {
    return "U";
  }

  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase() || "U";
}
