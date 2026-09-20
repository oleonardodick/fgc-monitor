import { getInitials } from "../../../utils/getInitials.js";
import { cn } from "../../../utils/merge.js";

interface ProfileAvatarProps {
  name: string;
  /** URL da foto (object URL ou pública). Quando ausente, exibe as iniciais. */
  photoUrl?: string | null;
  className?: string;
}

/**
 * Avatar de perfil: foto quando disponível, iniciais como fallback.
 * Conhecimento de negócio mínimo (usa `getInitials`), por isso vive na feature.
 */
export function ProfileAvatar({ name, photoUrl, className }: ProfileAvatarProps) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`Foto de ${name}`}
        className={cn("rounded-full object-cover shadow", className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-full bg-secondary text-5xl font-semibold text-secondary-foreground",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
