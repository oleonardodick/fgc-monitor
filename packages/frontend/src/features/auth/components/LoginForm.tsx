import type { LoginDTO } from "@fgc-monitor/shared";
import { type FormEvent, useState } from "react";
import { Button } from "../../../components/Button";
import { FormError } from "../../../components/FormError";
import { FormField } from "../../../components/FormField";

interface LoginFormProps {
  onSubmit: (credentials: LoginDTO) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export function LoginForm({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): LoginDTO | null {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Formato de e-mail inválido";
    }

    if (!password) {
      errors.password = "Senha é obrigatória";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0 ? { email: email.trim(), password } : null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const credentials = validate();
    if (credentials) {
      await onSubmit(credentials);
    }
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          clearFieldError("email");
        }}
        error={fieldErrors.email}
      />

      <FormField
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder="Sua senha"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clearFieldError("password");
        }}
        error={fieldErrors.password}
      />

      {errorMessage && <FormError>{errorMessage}</FormError>}

      <Button type="submit" variant="primary" isLoading={isSubmitting} loadingText="Entrando...">
        Entrar
      </Button>

      <div className="flex items-center justify-between text-sm">
        <a
          href="/recuperar-senha"
          className="text-slate-400 hover:text-slate-200 transition"
          onClick={(e) => {
            e.preventDefault();
            // TODO: UC-004 — Recuperar senha
          }}
        >
          Esqueci minha senha
        </a>
        <a
          href="/criar-conta"
          className="text-emerald-400 hover:text-emerald-300 transition"
          onClick={(e) => {
            e.preventDefault();
            // TODO: UC-003 — Criar conta
          }}
        >
          Criar conta
        </a>
      </div>
    </form>
  );
}
