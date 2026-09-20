import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EditProfile from "../features/profile/pages/EditProfile";
import * as profileService from "../features/profile/services/profileService";
import { AuthProvider } from "../hooks/useAuth";
import { AUTH_TOKEN_STORAGE_KEY } from "../services/httpClient";
import type { UserProfile } from "@fgc-monitor/shared";
import { useProfileStore } from "../features/profile/stores/useProfileStore";

const AUTH_USER = {
  id: "1",
  name: "Ana Silva",
  email: "ana@example.com",
};

const USER_PROFILE: UserProfile = {
  id: AUTH_USER.id,
  name: AUTH_USER.name,
  email: AUTH_USER.email,
  hasPhoto: false
}

function renderPage() {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/perfil/editar"]}>
        <EditProfile />
      </MemoryRouter>
    </AuthProvider>,
  );
}

async function fillForm(name: string, email: string) {
  fireEvent.input(await screen.findByLabelText("Nome"), { target: { value: name } });
  fireEvent.input(screen.getByLabelText("E-mail"), { target: { value: email } });
}

describe("EditProfile", () => {
  beforeEach(() => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "token-de-teste");
    localStorage.setItem("auth_user", JSON.stringify(AUTH_USER));
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:fake-foto");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    vi.spyOn(profileService, "getProfile").mockResolvedValue(USER_PROFILE);
    vi.spyOn(profileService, "getProfilePhotoBlob").mockResolvedValue(null);
    useProfileStore.setState({
      userProfile: USER_PROFILE,
      photoUrl: null
    })
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("preenche o formulário com os dados atuais do perfil", async () => {
    renderPage();

    expect(((await screen.findByLabelText("Nome")) as HTMLInputElement).value).toBe("Ana Silva");
    expect((screen.getByLabelText("E-mail") as HTMLInputElement).value).toBe("ana@example.com");
  });

  it("mostra as validações ao enviar um formulário em branco", async () => {
    renderPage();

    fireEvent.input(await screen.findByLabelText("Nome"), { target: { value: "" } });
    fireEvent.input(screen.getByLabelText("E-mail"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Nome é obrigatório")).toBeInTheDocument();
    expect(await screen.findByText("E-mail é obrigatório")).toBeInTheDocument();
  });

  it("rejeita foto em formato não permitido", async () => {
    renderPage();

    const file = new File(["animação"], "foto.gif", { type: "image/gif" });
    fireEvent.change(await screen.findByLabelText("Foto"), {
      target: { files: [file] },
    });

    expect(await screen.findByText("A foto deve estar no formato PNG ou JPG")).toBeInTheDocument();
  });

  it("pede confirmação (RN-004) e envia os dados ao confirmar", async () => {
    const updateProfileSpy = vi.spyOn(profileService, "updateProfile").mockResolvedValue({
      id: "1",
      name: "Novo Nome",
      email: "novo@example.com",
      hasPhoto: false,
    });

    renderPage();

    await fillForm("Novo Nome", "novo@example.com");
    fireEvent.click(await screen.findByRole("button", { name: "Salvar" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("Deseja realmente atualizar suas informações de perfil?");

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() => {
      expect(updateProfileSpy).toHaveBeenCalledWith({
        name: "Novo Nome",
        email: "novo@example.com",
        photo: undefined,
      });
    });

    // O store foi atualizado com os dados novos
    await waitFor(() => {
      expect(useProfileStore.getState().userProfile?.name).toEqual("Novo Nome")
      expect(useProfileStore.getState().userProfile?.email).toEqual("novo@example.com")
    })
  });

  it("desiste da atualização quando cancela a confirmação (FA-002)", async () => {
    const updateProfileSpy = vi.spyOn(profileService, "updateProfile");

    renderPage();

    await fillForm("Novo Nome", "novo@example.com");
    fireEvent.click(await screen.findByRole("button", { name: "Salvar" }));

    const dialog = await screen.findByRole("dialog");

    // Garante que vai buscar o botão de cancelar do Dialog
    const cancelButton = within(dialog).getByRole("button", {
      name: "Cancelar",
    });

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(updateProfileSpy).not.toHaveBeenCalled();
    expect(useProfileStore.getState().userProfile).toBe(USER_PROFILE);
  });

  it("mostra o erro da API e permanece na edição (EX-001)", async () => {
    const updateProfileSpy = vi
      .spyOn(profileService, "updateProfile")
      .mockRejectedValueOnce(new Error("Serviço indisponível"));

    renderPage();

    await fillForm("Novo Nome", "novo@example.com");
    fireEvent.click(await screen.findByRole("button", { name: "Salvar" }));
    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(await screen.findByText("Erro inesperado. Tente novamente.")).toBeInTheDocument();

    // Sem efeito colateral: nenhuma alteração persistida.
    expect(updateProfileSpy).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("auth_user")).toBe(JSON.stringify(AUTH_USER));
    expect(await screen.findByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });
});
