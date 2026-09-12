import { type LoginDTO, loginSchema } from "@fgc-monitor/shared";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { useZodForm } from "../hooks/useZodForm";

/**
 * Probe: formulário mínimo que usa `useZodForm(loginSchema)` e expone os
 * erros de campo e o valor enviado (para verificar o `z.output`).
 */
function LoginFormProbe() {
  const [submitted, setSubmitted] = useState<LoginDTO | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(loginSchema);

  return (
    <form onSubmit={handleSubmit((values) => setSubmitted(values))} noValidate>
      <input aria-label="E-mail" {...register("email")} />
      <input type="password" aria-label="Senha" {...register("password")} />
      {errors.email && <span role="alert">{errors.email.message}</span>}
      {errors.password && <span role="alert">{errors.password.message}</span>}
      <button type="submit">Enviar</button>
      {submitted && <output>{submitted.email}</output>}
    </form>
  );
}

describe("useZodForm", () => {
  it("valida os campos obrigatorios do schema no submit", async () => {
    render(<LoginFormProbe />);

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("E-mail é obrigatório")).toBeInTheDocument();
    expect(await screen.findByText("Senha é obrigatória")).toBeInTheDocument();
  });

  it("valida o formato do e-mail usando o schema compartilhado", async () => {
    render(<LoginFormProbe />);

    fireEvent.input(screen.getByLabelText("E-mail"), { target: { value: "invalido" } });
    fireEvent.input(screen.getByLabelText("Senha"), { target: { value: "qualquer" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Formato de e-mail inválido")).toBeInTheDocument();
    expect(screen.queryByText("E-mail é obrigatório")).not.toBeInTheDocument();
  });

  it("envia ao submit o valor transformado (z.output — trim do e-mail)", async () => {
    render(<LoginFormProbe />);

    fireEvent.input(screen.getByLabelText("E-mail"), {
      target: { value: "usuario@example.com " },
    });
    fireEvent.input(screen.getByLabelText("Senha"), { target: { value: "senha123" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("usuario@example.com")).toBeInTheDocument();
  });
});
