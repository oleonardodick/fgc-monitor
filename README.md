# FGC Monitor

Monorepo Node.js com pnpm workspace.

## Pacotes

| Pacote | Descrição |
| --- | --- |
| `@fgc-monitor/frontend` | React + Vite + Tailwind CSS |
| `@fgc-monitor/backend` | API Fastify |
| `@fgc-monitor/shared` | Tipos e utilitários compartilhados |

## Pré-requisitos

- Node.js >= 22
- pnpm

## Setup

```bash
pnpm install

# Copie os arquivos de ambiente (já incluídos como .env de exemplo)
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

## Scripts

```bash
# Desenvolvimento (frontend + backend + shared em paralelo)
pnpm dev

# Build de todos os pacotes
pnpm build

# Lint com Biome
pnpm lint
pnpm lint:fix

# Testes (Vitest no frontend, Node test runner no backend)
pnpm test
```

## Portas

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Endpoints

- `GET /health` — status da API
