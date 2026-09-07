import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import * as authService from "../features/auth/services/authService";
import { AuthProvider } from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";

describe("LoginPage", () => {
  function renderPage() {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/Login"]}>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    );
  }

  it("renderiza o título da página", () => {
    renderPage();

    expect(screen.getByText("FGC Monitor")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
  });

  it("renderiza os campos de e-mail e senha", () => {
    renderPage();

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("renderiza o botão para entrar e os links para criar uma conta e trocar a senha", () => {
    renderPage();

    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText("Esqueci minha senha")).toBeInTheDocument();
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
  });

  it("mostra as validações quando enviado um formulário em branco", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByText("E-mail é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
  });

  it("exibe e esconde o dado da senha", () => {
    renderPage();

    const senha = screen.getByLabelText("Senha") as HTMLInputElement;
    expect(senha.type).toBe("password");

    const senhaContainer = senha.closest("div");
    expect(senhaContainer).not.toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: /mostrar senha/i })[0]);
    expect(senha.type).toBe("text");

    fireEvent.click(screen.getAllByRole("button", { name: /ocultar senha/i })[0]);
    expect(senha.type).toBe("password");
  });

  it("mostra o erro retornado pela API quando a requisição falha", async () => {
    const apiError = new AxiosError("Request failed with status code 401");
    apiError.response = {
      data: { message: "Credenciais inválidas" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {} as never,
    };

    const loginSpy = vi.spyOn(authService, "login").mockRejectedValueOnce(apiError);

    renderPage();

    fireEvent.input(screen.getByLabelText("E-mail"), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Senha"), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    const alert = await waitFor(() => screen.getByRole("alert"));
    expect(alert).toHaveTextContent("Credenciais inválidas");

    // Lock in the previous fix: the generic Axios message must NOT leak into the UI.
    expect(screen.queryByText(/request failed with status code/i)).not.toBeInTheDocument();

    expect(loginSpy).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "wrong-password",
    });
  });

  it("retorna uma mensagem genérica quando não existe mensagem retornada pela API", async () => {
    const apiError = new AxiosError("Request failed with status code 500");
    apiError.response = {
      data: {},
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {} as never,
    };

    vi.spyOn(authService, "login").mockRejectedValueOnce(apiError);

    renderPage();

    fireEvent.input(screen.getByLabelText("E-mail"), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Senha"), {
      target: { value: "any-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Erro inesperado. Tente novamente.")).toBeInTheDocument();
    });
  });
});
