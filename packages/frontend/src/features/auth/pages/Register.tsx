import type { CreateAccountDTO } from "@fgc-monitor/shared";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../../components/Card";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { RegisterForm } from "../components/RegisterForm";
import { createAccount } from "../services/authService";

export default function Register() {
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
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader className="text-center">
          <p className="mb-1 text-sm font-medium uppercase tracking-widest text-brand">
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
  );
}
