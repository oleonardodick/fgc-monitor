import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/Card.js";
import { LoginForm } from "../features/auth/components/LoginForm.js";
import { useAuth } from "../hooks/useAuth.js";
import { getApiErrorMessage } from "../utils/getApiErrorMessage.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        await login(credentials);
        navigate("/dashboard");
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [login, navigate],
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-emerald-400">
              FGC Monitor
            </p>
            <h1 className="text-2xl font-semibold">Entrar</h1>
          </CardHeader>

          <CardContent>
            <LoginForm
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
