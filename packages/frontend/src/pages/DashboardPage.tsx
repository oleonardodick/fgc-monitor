import { useAuth } from "../hooks/useAuth.js";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-xl">
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-brand">FGC Monitor</p>
      <h1 className="mb-4 text-2xl font-semibold text-card-foreground">Dashboard</h1>
      <p className="mb-2 text-muted-foreground">Bem-vindo, {user?.name ?? "usuário"}!</p>
      <p className="mb-6 text-sm text-muted-foreground">{user?.email}</p>
      <button
        type="button"
        onClick={logout}
        className="rounded-lg bg-secondary px-4 py-2 text-sm text-secondary-foreground transition hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"
      >
        Sair
      </button>
    </section>
  );
}
