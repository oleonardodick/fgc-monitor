import type { LoginDTO, UserPublic } from "@fgc-monitor/shared";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import * as authService from "../features/auth/services/authService.js";
import { AUTH_TOKEN_STORAGE_KEY, AUTH_UNAUTHORIZED_EVENT } from "../services/httpClient.js";

interface AuthState {
  token: string | null;
  user: UserPublic | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login(credentials: LoginDTO): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadAuthState(): AuthState {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const userRaw = localStorage.getItem("auth_user");
    if (token && userRaw) {
      return { token, user: JSON.parse(userRaw) as UserPublic, isAuthenticated: true };
    }
  } catch {
    // corrupted data — ignore
  }
  return { token: null, user: null, isAuthenticated: false };
}

function persistAuth(token: string, user: UserPublic) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem("auth_user");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadAuthState);

  const login = useCallback(async (credentials: LoginDTO) => {
    const response = await authService.login(credentials);
    persistAuth(response.token, response.user);
    setState({ token: response.token, user: response.user, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({ token: null, user: null, isAuthenticated: false });
  }, []);

  // Token inválido/expirado detectado pelo httpClient (401) → encerrar sessão.
  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
