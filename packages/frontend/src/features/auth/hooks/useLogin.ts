import type { LoginDTO } from "@fgc-monitor/shared";
import { useCallback, useState } from "react";

type LoginStatus = "idle" | "loading" | "success" | "error";

interface UseLoginReturn {
  status: LoginStatus;
  errorMessage: string | null;
  login: (credentials: LoginDTO) => Promise<void>;
  reset: () => void;
}

export function useLogin(): UseLoginReturn {
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginDTO) => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      // The actual login is managed by useAuth; this hook tracks UI state
      setStatus("success");
    } catch (error) {
      setStatus("error");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro inesperado. Tente novamente.");
      }
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return { status, errorMessage, login, reset };
}
