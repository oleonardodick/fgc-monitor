import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Profile from "../features/profile/pages/Profile";
import * as profileService from "../features/profile/services/profileService";
import { AuthProvider } from "../hooks/useAuth";
import { AUTH_TOKEN_STORAGE_KEY } from "../services/httpClient";

const AUTH_USER = {
  id: "1",
  name: "Ana Silva",
  email: "ana@example.com",
};

describe("Profile", () => {
  beforeEach(() => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "token-de-teste");
    localStorage.setItem("auth_user", JSON.stringify(AUTH_USER));
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:fake-foto");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  function renderPage() {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/perfil"]}>
          <Profile />
        </MemoryRouter>
      </AuthProvider>,
    );
  }

  it("exibe nome, e-mail e o link para editar o perfil", async () => {
    vi.spyOn(profileService, "getProfile").mockResolvedValue({
      id: "1",
      name: "Ana Silva",
      email: "ana@example.com",
      hasPhoto: false,
    });

    renderPage();

    expect(await screen.findByRole("heading", { name: "Perfil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editar perfil" })).toBeInTheDocument();
    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
  });

  it("exibe a foto quando o usuário possui foto de perfil", async () => {
    vi.spyOn(profileService, "getProfile").mockResolvedValue({
      id: "1",
      name: "Ana Silva",
      email: "ana@example.com",
      hasPhoto: true,
    });
    vi.spyOn(profileService, "getProfilePhotoBlob").mockResolvedValue(
      new Blob(["imagem"], { type: "image/png" }),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByAltText("Foto de Ana Silva")).toHaveAttribute("src", "blob:fake-foto");
    });
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    vi.spyOn(profileService, "getProfile").mockRejectedValue(new Error("network down"));

    renderPage();

    expect(await screen.findByText("Erro inesperado. Tente novamente.")).toBeInTheDocument();
  });
});
