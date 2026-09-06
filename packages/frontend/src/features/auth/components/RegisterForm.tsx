import {
  type CreateAccountDTO,
  isPasswordValid,
  MIN_PASSWORD_CRITERIA,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@fgc-monitor/shared";
import { Mail, User } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/Button";
import { FormError } from "../../../components/FormError";
import { FormField } from "../../../components/FormField";
import { PasswordInput } from "../../../components/PasswordInput";

const PASSWORD_CRITERIA_MESSAGE = `A senha deve ter entre ${PASSWORD_MIN_LENGTH} e ${PASSWORD_MAX_LENGTH} caracteres e cumprir ao menos ${MIN_PASSWORD_CRITERIA} critérios de segurança`;

interface RegisterFormProps {
  onSubmit: (data: CreateAccountDTO) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export function RegisterForm({ onSubmit, isSubmitting, errorMessage }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): CreateAccountDTO | null {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Nome é obrigatorio";
    }

    if (!email.trim()) {
      errors.email = "E-mail é obrigatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Formato de e-mail inválido";
    }

    if (!password) {
      errors.password = "Senha é obrigatoria";
    } else if (!isPasswordValid(password)) {
      errors.password = PASSWORD_CRITERIA_MESSAGE;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirmar senha é obrigatoria";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return null;
    }

    return { name: name.trim(), email: email.trim(), password, confirmPassword };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = validate();
    if (data) {
      await onSubmit(data);
    }
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        label="Nome"
        type="text"
        autoComplete="name"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          clearFieldError("name");
        }}
        error={fieldErrors.name}
        icon={User}
        iconPosition="right"
      />

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
        icon={Mail}
        iconPosition="right"
      />

      <PasswordInput
        label="Senha"
        autoComplete="new-password"
        placeholder="Sua senha"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clearFieldError("password");
        }}
        error={fieldErrors.password}
      />

      <PasswordInput
        label="Confirmar senha"
        autoComplete="new-password"
        placeholder="Repita sua senha"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          clearFieldError("confirmPassword");
        }}
        error={fieldErrors.confirmPassword}
      />

      {errorMessage && <FormError>{errorMessage}</FormError>}

      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        loadingText="Criando conta..."
      >
        Criar Conta
      </Button>

      <div className="flex items-center justify-center text-sm">
        <Link to="/login" className="text-slate-400 hover:text-slate-200 transition">
          Já possuo uma conta
        </Link>
      </div>
    </form>
  );
}
