import type { CreateAccountDTO } from "@fgc-monitor/shared";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/Card.js";
import { RegisterForm } from "../features/auth/components/RegisterForm.js";
import { createAccount } from "../features/auth/services/authService.js";
import { getApiErrorMessage } from "../utils/getApiErrorMessage.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: CreateAccountDTO) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        await createAccount({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        navigate("/login");
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate],
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-emerald-400">
              FGC Monitor
            </p>
            <h1 className="text-2xl font-semibold">Criar conta</h1>
          </CardHeader>

          <CardContent>
            <RegisterForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
