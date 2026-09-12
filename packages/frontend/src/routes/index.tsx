import type { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.js";
import { useAuth } from "../hooks/useAuth.js";
import DashboardPage from "../pages/DashboardPage.js";
import InvestimentosPage from "../pages/InvestimentosPage.js";
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
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
        <LoginPage />
      </CenteredPage>
    ),
  },
  {
    path: "/criar-conta",
    element: (
      <CenteredPage>
        <RegisterPage />
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
      {index: true, element: <DashboardPage />},
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/investimentos", element: <InvestimentosPage /> },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
]);
