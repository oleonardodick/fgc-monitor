import { type LoginDTO, loginSchema } from "@fgc-monitor/shared";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/Button";
import { FormError } from "../../../components/FormError";
import { FormField } from "../../../components/FormField";
import { PasswordInput } from "../../../components/PasswordInput";
import { useZodForm } from "../../../hooks/useZodForm";

interface LoginFormProps {
  onSubmit: (credentials: LoginDTO) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export function LoginForm({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(loginSchema);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        icon={Mail}
        iconPosition="right"
        {...register("email")}
      />

      <PasswordInput
        label="Senha"
        autoComplete="current-password"
        placeholder="Sua senha"
        error={errors.password?.message}
        {...register("password")}
      />

      {errorMessage && <FormError>{errorMessage}</FormError>}

      <Button type="submit" variant="primary" isLoading={isSubmitting} loadingText="Entrando...">
        Entrar
      </Button>

      <div className="flex items-center justify-between text-sm">
        <a
          href="/recuperar-senha"
          className="text-muted-foreground hover:text-muted-foreground/180 transition"
          onClick={(e) => {
            e.preventDefault();
            // TODO: UC-004 — Recuperar senha
          }}
        >
          Esqueci minha senha
        </a>
        <Link to="/criar-conta" className="text-link hover:text-link-hover transition">
          Criar conta
        </Link>
      </div>
    </form>
  );
}
