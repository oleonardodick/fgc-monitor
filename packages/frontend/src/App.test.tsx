import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the app title", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    render(<App />);

    expect(screen.getByText("FGC Monitor")).toBeInTheDocument();
    expect(screen.getByText("Monorepo pronto")).toBeInTheDocument();
  });

  it("shows loading state while fetching health", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    render(<App />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("shows health data when fetch succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "ok",
          timestamp: "2026-08-29T12:00:00.000Z",
        }),
      }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/"status": "ok"/)).toBeInTheDocument();
    });
  });

  it("shows error when fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Erro: HTTP 500")).toBeInTheDocument();
    });
  });
});
