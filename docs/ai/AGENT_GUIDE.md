# Guia para Agentes de IA Codificadores

Este arquivo é o **ponto de entrada** para qualquer agente de IA que for
implementar código neste repositório. Leia este arquivo por completo antes de
criar ou modificar qualquer arquivo.

## 1. Contexto do projeto

Este é um **monorepo** com três pacotes principais:

1. **`packages/frontend`** — aplicação frontend em **React** (SPA).
2. **`packages/backend`** — aplicação backend em **Node.js** usando o framework
   **Fastify**.
3. **`packages/shared`** — biblioteca interna com código, tipos e regras que
   precisam ser **idênticos** tanto no frontend quanto no backend (ex.: tipos
   de DTOs, schemas de validação, constantes de negócio, mensagens de erro
   padronizadas).

## 2. Regra de ouro: onde cada coisa vai

Antes de criar qualquer arquivo, pergunte-se:

> "Este código depende de `window`, `document`, React, DOM ou de alguma API
> exclusiva do navegador?" → **`packages/frontend`**
>
> "Este código depende do Node.js, do sistema de arquivos, de banco de dados,
> do Fastify, de variáveis de ambiente do servidor?" → **`packages/backend`**
>
> "Este código é uma regra de negócio, tipo, schema de validação ou constante
> que **tanto o frontend quanto o backend precisam usar exatamente igual**?"
> → **`packages/shared`**

Nunca duplique tipos ou regras de validação entre `packages/frontend` e `packages/backend`.
Se uma regra de negócio (ex.: "senha deve ter no mínimo 8 caracteres") é usada
nos dois lados, ela deve viver em `packages/shared` e ser importada por ambos.

## 3. Mapa de diretórios (resumo)

Veja o detalhamento completo em:
- [`frontend.md`](../project/frontend.md) para `apps/web`
- [`backend.md`](../project/backend.md) para `apps/api`
- [`shared.md`](../project/shared.md) para `packages/shared`
- [`architecture.md`](../project/architecture.md) para a visão geral e fluxo de dados
- [`tech-stack.md`](../project/tech-stack.md) para **banco de dados e pacotes usados** (ex.: Mongoose, Zod) — o que já está instalado e onde cada um é usado
- [`conventions.md`](../project/conventions.md) para convenções de código e commits

```
packages/frontend/src/
├── assets/          # imagens, fontes, ícones estáticos
├── components/
│   ├── common/      # componentes genéricos e reutilizáveis (Button, Input...)
│   └── layout/       # componentes estruturais (Header, Sidebar, Footer...)
├── features/         # módulos de funcionalidade (ex.: features/auth, features/orders)
├── hooks/             # hooks customizados (useAuth, useDebounce...)
├── pages/             # componentes de página/rota
├── routes/            # definição de rotas da aplicação
├── services/          # chamadas HTTP / integração com a API
├── store/             # estado global (Redux, Zustand, Context, etc.)
├── styles/            # estilos globais, temas, variáveis CSS
├── types/             # tipos TypeScript específicos do frontend
└── utils/             # funções utilitárias específicas do frontend

packages/api/src/
├── config/            # configuração da aplicação (env, banco, servidor)
├── plugins/           # plugins do Fastify (auth, cors, swagger, etc.)
├── modules/           # módulos de domínio (organização por feature)
├── routes/            # definição de rotas HTTP (registro de endpoints)
├── controllers/       # camada que recebe request/response e chama services
├── services/          # regras de negócio da aplicação
├── repositories/      # acesso a dados (banco de dados, ORM, queries)
├── models/            # entidades/modelos de dados
├── middlewares/        # middlewares/hooks do Fastify
├── validators/        # validação de entrada (pode reusar schemas de shared)
├── errors/            # classes de erro customizadas da API
├── utils/             # funções utilitárias específicas do backend
├── types/             # tipos TypeScript específicos do backend
└── jobs/              # tarefas agendadas / filas / workers

packages/shared/src/
├── types/             # tipos e interfaces compartilhados (DTOs, entidades)
├── constants/         # constantes de negócio (enums, valores fixos)
├── schemas/           # schemas de validação compartilhados (ex.: Zod)
├── utils/             # funções puras utilitárias sem dependência de ambiente
└── errors/            # classes/estruturas de erro compartilhadas
```

## 4. Regras que o agente deve sempre seguir

- **Não duplicar regras de negócio** entre `frontend` e `backend` — usar `shared`.
- **Não importar código de `packages/backend` dentro de `packages/frontend`** nem
  vice-versa. A única ponte entre os dois é `packages/shared` (e a comunicação
  HTTP em tempo de execução).
- **Toda nova funcionalidade no backend** deve seguir o fluxo
  `routes → controllers → services → repositories`, nessa direção. Controllers
  não acessam o banco diretamente; repositories não implementam regra de
  negócio.
- **Toda nova funcionalidade no frontend** que representa um domínio de
  negócio (ex.: autenticação, investimentos, usuários) deve ser organizada como uma
  pasta dentro de `features/`, e não solta em `components/`.
- **Testes** ficam em `tests/unit` e `tests/integration` dentro de cada
  pacote (`packages/frontend`, `packages/backend`, `packages/shared`), espelhando a estrutura
  do código-fonte testado. Toda nova funcionalidade deve possuir ao menos testes unitários.
- Ao criar um arquivo, **verifique antes se já existe uma pasta apropriada**
  para ele na estrutura definida aqui. Não crie pastas novas na raiz de `src/`
  sem necessidade — prefira encaixar em uma pasta já existente ou consultar o
  documento correspondente (`frontend.md` / `backend.md` / `shared.md`).
- Consulte `conventions.md` para nomenclatura de arquivos.
- **Perguntar** sempre que necessário para obter o melhor resultado.

## 6. O que este agente NÃO deve fazer

- Não criar arquivos de configuração de infraestrutura (Docker, CI) sem que
  isso seja explicitamente solicitado.
- Não realizar commits automaticamente.
- Não baixar nenhuma biblioteca de terceiros. Utilizar apenas as que já estiverem
  no projeto. Avaliar o arquivo `tech-stack.md` para ver quais bibliotecas são usadas.
  Caso alguma nova deva ser instalada, a alteração deve ser cancelada
  e o desenvolvedor deve ser avisado para tomar a decisão técnica de qual
  biblioteca utilizar.
- Não misturar responsabilidades entre camadas do backend (ex.: lógica de
  negócio dentro de um `controller`, ou query SQL dentro de um `service`).
- Não tomar decisões importantes no projeto sem questionar o desenvolvedor.
