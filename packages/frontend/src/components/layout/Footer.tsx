import { cn } from "../../utils/merge";
import { FOOTER_LINKS } from "./navigation";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:py-10">
        <nav aria-label="Links do rodapé" className="flex flex-wrap items-center gap-1">
          {FOOTER_LINKS.map((link, index) => (
            <span key={link.href} className="inline-flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-muted-foreground/60">
                  |
                </span>
              )}
              <a
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  // TODO: rotas do footer (Legal, Privacidade, Termos, Contato)
                }}
                className={cn(
                  "rounded-sm px-2 py-1 text-sm text-muted-foreground transition hover:text-foreground",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                {link.label}
              </a>
            </span>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © 2026 FGCMonitor. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
