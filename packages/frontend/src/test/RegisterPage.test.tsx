import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Register from "../features/auth/pages/Register";
import * as authService from "../features/auth/services/authService";

describe("REgister", () => {
  function renderPage() {
    render(
      <MemoryRouter initialEntries={["/criar-conta"]}>
        <Register />
      </MemoryRouter>,
    );
  }

  function fillValidForm() {
    fireEvent.input(screen.getByLabelText("Nome"), {
      target: { value: "Fulano da Silva" },
    });
    fireEvent.input(screen.getByLabelText("E-mail"), {
      target: { value: "fulano@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Senha"), {
      target: { value: "@Senha12" },
    });
    fireEvent.input(screen.getByLabelText("Confirmar senha"), {
      target: { value: "@Senha12" },
    });
  }

  it("renderiza o título da página", () => {
    renderPage();

    expect(screen.getByText("FGC Monitor")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Criar conta" })).toBeInTheDocument();
  });

  it("renderiza os campos de nome, e-mail, senha e confirmar senha", () => {
    renderPage();

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
  });

  it("renderiza o botão de criar conta e o link de já possuo uma conta", () => {
    renderPage();

    expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
    expect(screen.getByText("Já possuo uma conta")).toBeInTheDocument();
  });

  it("mostra as validações quando enviado um formulário em branco", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText("Nome é obrigatório")).toBeInTheDocument();
    expect(await screen.findByText("E-mail é obrigatório")).toBeInTheDocument();
    expect(await screen.findByText("Senha é obrigatória")).toBeInTheDocument();
    expect(await screen.findByText("Confirmar senha é obrigatória")).toBeInTheDocument();
  });

  it("mostra as validações quando enviado dados errados no formulário", async () => {
    renderPage();

    fireEvent.input(screen.getByLabelText("E-mail"), {
      target: { value: "wrongMail" },
    });
    fireEvent.input(screen.getByLabelText("Senha"), {
      target: { value: "wrongPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText("Formato de e-mail inválido")).toBeInTheDocument();
    expect(
      await screen.findByText(
        "A senha deve ter entre 6 e 8 caracteres e cumprir ao menos 3 critérios de segurança",
      ),
    ).toBeInTheDocument();
  });

  it("mostra a validação quando as senhas enviadas não são iguais", async () => {
    renderPage();

    fireEvent.input(screen.getByLabelText("Senha"), {
      target: { value: "@Senha12" },
    });

    fireEvent.input(screen.getByLabelText("Confirmar senha"), {
      target: { value: "@Senha45" },
    });

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText("As senhas não coincidem")).toBeInTheDocument();
  });

  it("exibe e esconde o dado da senha", () => {
    renderPage();

    const senha = screen.getByLabelText("Senha") as HTMLInputElement;
    expect(senha.type).toBe("password");

    // O formulário tem dois campos de senha (Senha e Confirmar senha).
    // Pegamos o toggle que está dentro do mesmo wrapper do input "Senha".
    const senhaContainer = senha.closest("div");
    expect(senhaContainer).not.toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: /mostrar senha/i })[0]);
    expect(senha.type).toBe("text");

    fireEvent.click(screen.getAllByRole("button", { name: /ocultar senha/i })[0]);
    expect(senha.type).toBe("password");
  });

  it("mostra o erro retornado pela API quando a requisição falha", async () => {
    const apiError = new AxiosError("Request failed with status code 409");
    apiError.response = {
      data: { message: "E-mail já cadastrado" },
      status: 409,
      statusText: "Conflict",
      headers: {},
      config: {} as never,
    };

    const createAccountSpy = vi.spyOn(authService, "createAccount").mockRejectedValueOnce(apiError);

    renderPage();
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    const alert = await waitFor(() => screen.getByRole("alert"));
    expect(alert).toHaveTextContent("E-mail já cadastrado");

    // O fallback genérico do Axios nunca deve aparecer para o usuário.
    expect(screen.queryByText(/request failed with status code/i)).not.toBeInTheDocument();

    expect(createAccountSpy).toHaveBeenCalledWith({
      name: "Fulano da Silva",
      email: "fulano@example.com",
      password: "@Senha12",
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

    vi.spyOn(authService, "createAccount").mockRejectedValueOnce(apiError);

    renderPage();
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText("Erro inesperado. Tente novamente.")).toBeInTheDocument();
    });
  });
});
