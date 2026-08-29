import type { HealthResponse } from "@fgc-monitor/shared";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<HealthResponse>;
      })
      .then(setHealth)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-emerald-400">
          FGC Monitor
        </p>
        <h1 className="mb-4 text-3xl font-semibold">Monorepo pronto</h1>
        <p className="mb-6 text-slate-400">
          Frontend com Vite + React + Tailwind conectado ao backend Fastify.
        </p>

        <div className="rounded-lg bg-slate-950/60 p-4 text-left font-mono text-sm">
          <p className="mb-2 text-slate-500">GET /health</p>
          {error && <p className="text-red-400">Erro: {error}</p>}
          {!error && !health && <p className="text-slate-400">Carregando...</p>}
          {health && (
            <pre className="overflow-x-auto text-emerald-300">
              {JSON.stringify(health, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
