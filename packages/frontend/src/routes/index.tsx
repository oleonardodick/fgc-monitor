import type { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.js";
import Login from "../features/auth/pages/Login.js";
import Register from "../features/auth/pages/Register.js";
import Dashboard from "../features/dashboard/pages/Dashboard.js";
import Investments from "../features/investments/pages/Investments.js";
import { useAuth } from "../hooks/useAuth.js";
import NotFoundPage from "../pages/NotFoundPage.js";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/** Wrapper que centraliza o conteúdo das páginas públicas (login / registro). */
function CenteredPage({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
      {children}
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <CenteredPage>
        <Login />
      </CenteredPage>
    ),
  },
  {
    path: "/criar-conta",
    element: (
      <CenteredPage>
        <Register />
      </CenteredPage>
    ),
  },
  {
    // Rota sem path: funciona como layout para as páginas protegidas.
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <CenteredPage>
        <NotFoundPage />
      </CenteredPage>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/investimentos", element: <Investments /> },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
]);
