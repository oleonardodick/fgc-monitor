import type { LoginDTO, UserProfile, UserPublic } from "@fgc-monitor/shared";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import * as authService from "../features/auth/services/authService.js";
import { getProfilePhotoBlob } from "../features/profile/services/profileService.js";
import { useProfileStore } from "../features/profile/stores/useProfileStore.js";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadAuthState);
  const { setProfile, setPhotoUrl, clearProfile } = useProfileStore();

  const login = useCallback(
    async (credentials: LoginDTO) => {
      const response = await authService.login(credentials);
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
      setState({ token: response.token, user: response.user, isAuthenticated: true });
      const blob = await getProfilePhotoBlob();
      setPhotoUrl(blob ? URL.createObjectURL(blob) : null);
      const userProfile: UserProfile = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        hasPhoto: blob !== null
      }
      setProfile(userProfile)
    },
    [setPhotoUrl, setProfile],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    clearProfile();
    setState({ token: null, user: null, isAuthenticated: false });
  }, [clearProfile]);

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
