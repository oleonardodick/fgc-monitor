import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileField } from "../components/FileField";

describe("FileField", () => {
  it("renderiza o label associado ao input de arquivo e o botão", () => {
    render(<FileField label="Foto" buttonLabel="Buscar foto" accept="image/png,image/jpeg" />);

    const input = screen.getByLabelText("Foto");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", "image/png,image/jpeg");
    expect(screen.getByRole("button", { name: "Buscar foto" })).toBeInTheDocument();
  });

  it("abre o seletor de arquivos ao clicar no botão", () => {
    render(<FileField label="Foto" buttonLabel="Buscar foto" />);

    const input = screen.getByLabelText("Foto") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click").mockImplementation(() => undefined);

    fireEvent.click(screen.getByRole("button", { name: "Buscar foto" }));

    expect(clickSpy).toHaveBeenCalled();
  });

  it("dispara onChange ao selecionar um arquivo e exibe a mensagem de erro", () => {
    const onChange = vi.fn();
    render(
      <FileField
        label="Foto"
        buttonLabel="Buscar foto"
        error="A foto deve estar no formato PNG ou JPG"
        onChange={onChange}
      />,
    );

    const file = new File(["imagem"], "foto.gif", { type: "image/gif" });
    fireEvent.change(screen.getByLabelText("Foto"), { target: { files: [file] } });

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByText("A foto deve estar no formato PNG ou JPG")).toBeInTheDocument();
  });

  it("desabilita o botão quando o campo está desabilitado", () => {
    render(<FileField label="Foto" buttonLabel="Buscar foto" disabled />);

    expect(screen.getByRole("button", { name: "Buscar foto" })).toBeDisabled();
  });
});
