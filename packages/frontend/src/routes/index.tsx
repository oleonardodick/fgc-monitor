import type { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import LoginPage from "../pages/LoginPage.js";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-emerald-400">
          FGC Monitor
        </p>
        <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
        <p className="mb-2 text-slate-400">Bem-vindo, {user?.name ?? "usuário"}!</p>
        <p className="mb-6 text-sm text-slate-500">{user?.email}</p>
        <button
          onClick={logout}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
          type="submit"
        >
          Sair
        </button>
      </div>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
]);
