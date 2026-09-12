import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/getInitials";
import { cn } from "../../utils/merge";

export function UserProfileMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    logout();
  }

  const name = user?.name ?? "Usuário";
  const initials = getInitials(user?.name);

  return (
    <div ref={containerRef} className="relative flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Menu do perfil de ${name}`}
        className="flex items-center gap-1.5 rounded-full bg-secondary py-1.5 pl-3 pr-2 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs">
          {initials}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-border bg-card py-2 shadow-xl">
          <div className="px-4 py-2">
            <p className="text-sm font-semibold text-card-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
          </div>
          <div className="mx-4 my-1 h-px bg-border" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-card-foreground transition hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
