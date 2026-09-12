import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { AUTH_TOKEN_STORAGE_KEY, AUTH_UNAUTHORIZED_EVENT } from "../services/httpClient";

const AUTH_USER = {
  id: "1",
  name: "Ana Silva",
  email: "ana@example.com",
};

function AuthStateProbe() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <output data-testid="is-authenticated">{String(isAuthenticated)}</output>
      <output data-testid="user-email">{user?.email ?? ""}</output>
    </div>
  );
}

describe("AuthProvider", () => {
  it("encerra a sessão quando o httpClient dispara o evento de 401", () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "token-de-teste");
    localStorage.setItem("auth_user", JSON.stringify(AUTH_USER));

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>,
    );

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe("token-de-teste");

    act(() => {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    });

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("user-email")).toHaveTextContent("");
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
  });
});
