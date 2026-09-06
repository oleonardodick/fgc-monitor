import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import * as authService from "../features/auth/services/authService";
import { AuthProvider } from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";

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

  it("shows the API error message when login fails with 401", async () => {
    const apiError = new AxiosError("Request failed with status code 401");
    apiError.response = {
      data: { message: "Credenciais inválidas" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {} as never,
    };

    const loginSpy = vi.spyOn(authService, "login").mockRejectedValueOnce(apiError);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );

    fireEvent.input(screen.getByLabelText("E-mail"), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Senha"), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
    });

    expect(loginSpy).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "wrong-password",
    });
  });
});
