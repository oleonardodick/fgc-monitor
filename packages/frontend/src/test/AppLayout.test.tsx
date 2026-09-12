import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import AppLayout from "../components/layout/AppLayout";
import { AuthProvider } from "../hooks/useAuth";
import { useUIStore } from "../store/useUIStore";

const AUTH_USER = {
  id: "1",
  name: "Ana Silva",
  email: "ana@example.com",
};

function renderAppLayout() {
  localStorage.setItem("auth_token", "token-de-teste");
  localStorage.setItem("auth_user", JSON.stringify(AUTH_USER));

  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<p>Conteúdo do painel</p>} />
            <Route path="/investimentos" element={<p>Conteúdo de investimentos</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("AppLayout", () => {
  beforeEach(() => {
    useUIStore.setState({ isMobileMenuOpen: false });
    localStorage.clear();
  });

  it("renderiza a marca, os links de navegação e o rodapé", () => {
    renderAppLayout();

    expect(screen.getByRole("link", { name: "FGC Monitor — Dashboard" })).toBeInTheDocument();
    // Drawer fechado tem aria-hidden: os links acessíveis são os do header.
    expect(screen.getAllByRole("link", { name: "Dashboard" })).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: "Meus Investimentos" })).toHaveLength(1);

    expect(screen.getByRole("link", { name: "Legal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("renderiza o conteúdo da página dentro do container principal", () => {
    renderAppLayout();

    expect(screen.getByText("Conteúdo do painel")).toBeInTheDocument();
  });

  it("abre e fecha o menu lateral com os botões do header", () => {
    renderAppLayout();

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu de navegação" }));
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Fechar menu de navegação" }));
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("fecha o menu lateral ao clicar num link de navegação", () => {
    renderAppLayout();

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu de navegação" }));

    const links = screen.getAllByRole("link", { name: "Meus Investimentos" });
    expect(links).toHaveLength(2); // um no header, outro no drawer
    fireEvent.click(links[links.length - 1]); // o do drawer

    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("mostra o menu do perfil do usuário no header", () => {
    renderAppLayout();

    fireEvent.click(screen.getByRole("button", { name: /menu do perfil/i }));

    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
  });
});
