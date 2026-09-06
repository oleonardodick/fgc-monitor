import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";

describe("LoginPage", () => {
  it("renders the login page title", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText("FGC Monitor")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
  });

  it("renders email and password fields", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("renders links to forgot password and create account", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText("Esqueci minha senha")).toBeInTheDocument();
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
  });
});
