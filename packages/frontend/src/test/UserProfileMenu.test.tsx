import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { UserProfileMenu } from "../components/layout/UserProfileMenu";
import { AuthProvider } from "../hooks/useAuth";

function renderProfileMenu() {
  localStorage.setItem("auth_token", "token-de-teste");
  localStorage.setItem(
    "auth_user",
    JSON.stringify({ id: "1", name: "Ana Silva", email: "ana@example.com" }),
  );

  render(
    <AuthProvider>
      <UserProfileMenu />
    </AuthProvider>,
  );
}

describe("UserProfileMenu", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("mostra as iniciais do usuário no avatar", () => {
    renderProfileMenu();

    expect(screen.getByText("AS")).toBeInTheDocument();
  });

  it("abre o dropdown ao clicar e mostra os dados do usuário", () => {
    renderProfileMenu();

    fireEvent.click(screen.getByRole("button", { name: /menu do perfil/i }));

    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
  });

  it("faz logout ao clicar em Sair", () => {
    renderProfileMenu();

    fireEvent.click(screen.getByRole("button", { name: /menu do perfil/i }));
    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    // Sem usuário autenticado, o avatar volta ao fallback "U".
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("fecha o dropdown ao clicar fora", () => {
    renderProfileMenu();

    fireEvent.click(screen.getByRole("button", { name: /menu do perfil/i }));
    fireEvent.pointerDown(document);

    expect(screen.queryByText("Ana Silva")).not.toBeInTheDocument();
  });
});
