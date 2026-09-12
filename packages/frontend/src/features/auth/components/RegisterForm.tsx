import { type CreateAccountDTO, createAccountSchema } from "@fgc-monitor/shared";
import { Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/Button";
import { FormError } from "../../../components/FormError";
import { FormField } from "../../../components/FormField";
import { PasswordInput } from "../../../components/PasswordInput";
import { useZodForm } from "../../../hooks/useZodForm";

interface RegisterFormProps {
  onSubmit: (data: CreateAccountDTO) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export function RegisterForm({ onSubmit, isSubmitting, errorMessage }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(createAccountSchema);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField
        label="Nome"
        type="text"
        autoComplete="name"
        placeholder="Seu nome"
        error={errors.name?.message}
        icon={User}
        iconPosition="right"
        {...register("name")}
      />

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
        autoComplete="new-password"
        placeholder="Sua senha"
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordInput
        label="Confirmar senha"
        autoComplete="new-password"
        placeholder="Repita sua senha"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
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
        <Link to="/login" className="text-link hover:text-link-hover transition">
          Já possuo uma conta
        </Link>
      </div>
    </form>
  );
}
