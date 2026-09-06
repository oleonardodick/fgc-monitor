# Arquitetura

## Visão geral

```
┌────────────────────┐        HTTP/JSON         ┌───────────────────────┐
│ packages/frontend  │ ───────────────────────▶ │  packages/backend     │
│   (React SPA)      │ ◀─────────────────────── │  (Node.js + Fastify)  │
└──────────┬─────────┘                          └───────────┬───────────┘
           │                                                │
           │              importa tipos/schemas             │
           └────────────────────────┬───────────────────────┘
                                    ▼
                          ┌───────────────────┐
                          │  packages/shared  │
                          │ (tipos, schemas,  │
                          │ constantes, utils)│
                          └───────────────────┘
```

- `packages/frontend` e `packages/backend` **nunca se importam diretamente**. A única forma de
  comunicação em tempo de execução é via **HTTP** (API REST servida pelo
  Fastify e consumida pelo React).
- Ambos podem importar de `packages/shared` em **tempo de compilação**, para
  compartilhar tipos, schemas de validação e constantes — evitando duplicação
  e divergência de regras entre front e back.

## Camadas do backend (`packages/backend`)

Fluxo de uma requisição:

```
Request HTTP
   │
   ▼
routes/          → define o endpoint e associa ao controller
   │
   ▼
controllers/     → extrai dados da request, chama o service, formata a response
   │
   ▼
services/        → contém a regra de negócio
   │
   ▼
repositories/    → acessa a fonte de dados (banco, cache, API externa)
```

Regras:
- `controllers/` não deve conter regra de negócio nem acessar dados
  diretamente.
- `services/` não deve conhecer detalhes de HTTP (não recebe `request`/`reply`
  do Fastify).
- `repositories/` não deve conter regra de negócio, apenas queries/acesso a
  dados.
- `modules/` pode ser usado para agrupar um domínio completo (rota,
  controller, service, repository, tipos) quando o projeto crescer e a
  organização puramente por camada (`routes/`, `controllers/`...) deixar de
  escalar. A decisão de quando migrar para `modules/` deve ser registrada na
  seção "Decisões técnicas" abaixo.
- Não deve ser utilizado o type any em nenhum código. Toda tipificação deve estar
  corretamente definida.

## Camadas do frontend (`packages/frontend`)

```
routes/         → mapeia URLs para pages
   │
   ▼
pages/          → compõe features e components para montar uma tela
   │
   ▼
features/       → lógica e componentes específicos de um domínio de negócio
   │
   ▼
components/     → componentes de UI reutilizáveis (common) e estruturais (layout)
```

- `services/` centraliza toda comunicação HTTP com `packages/backend`.
- `store/` guarda estado global; estado local de UI deve ficar no próprio
  componente/hook sempre que possível.
- `hooks/` contém lógica reutilizável entre componentes/features.

## packages/shared

Deve conter **apenas** código sem dependência de ambiente (não pode importar
`react`, `fastify`, `window`, `document`, drivers de banco, etc.). Veja
detalhes em [`shared.md`](./shared.md).

## Decisões técnicas

> Esta seção deve ser atualizada por quem (humano ou agente de IA) tomar uma
> decisão técnica relevante durante a implementação, para que o histórico de
> decisões fique visível para os próximos agentes.

| Data | Decisão                                                                                                                              | Motivo                  |
|----- |--------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| ———— | Estrutura inicial de pastas definida (camadas: routes/controllers/services/repositories no backend; features/components no frontend) | Padrão amplamente adotado, favorece separação de responsabilidades e testabilidade |
| 2026-09-05 | Adicionado @fastify/jwt + bcryptjs como plugins Fastify para autenticação. AuthService com injeção de dependência manual para testabilidade. | Login (UC-001) — service precisa ser testável sem depender do banco real |
| 2026-09-06 | UC-003 — Criar conta: rota pública `POST /auth/register` cria usuário (`name`/`email`/`password`), responde `201` com `UserPublic` (sem token) e o frontend redirige a `/login`. Regra de senha segura (RS-001) centralizada em `packages/shared` (`isPasswordValid`) e reutilizada por frontend e backend; erros `400`/`409`/`503` mapeados em `errors/auth.ts`. | Implementação do UC-003 seguindo o padrão do Login (UC-001), sem auto-login pós-cadastro |
