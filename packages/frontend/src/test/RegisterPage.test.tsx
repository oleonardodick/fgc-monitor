import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RegisterPage from "../pages/RegisterPage";

describe("RegisterPage", () => {
  function renderPage() {
    render(
      <MemoryRouter initialEntries={["/criar-conta"]}>
        <RegisterPage />
      </MemoryRouter>,
    );
  }

  it("renders the register page title", () => {
    renderPage();

    expect(screen.getByText("FGC Monitor")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Criar conta" })).toBeInTheDocument();
  });

  it("renders name, email, password and confirm password fields", () => {
    renderPage();

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
  });

  it("renders the submit button and the link to login", () => {
    renderPage();

    expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
    expect(screen.getByText("Já possuo uma conta")).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(screen.getByText("Nome é obrigatorio")).toBeInTheDocument();
    expect(screen.getByText("E-mail é obrigatorio")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatoria")).toBeInTheDocument();
    expect(screen.getByText("Confirmar senha é obrigatoria")).toBeInTheDocument();
  });

  it("toggles password visibility between hidden and shown", () => {
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
});
