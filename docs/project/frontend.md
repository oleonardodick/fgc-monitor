# Frontend — `packages/frontend`

Aplicação React em **Vite**.

## Estrutura

```
packages/frontend/
├── public/                     # arquivos estáticos servidos diretamente (favicon, index.html, etc.)
├── src/
│   ├── assets/                 # imagens, fontes, ícones e outros arquivos estáticos importados no código
│   ├── components/
│   │   ├── common/             # componentes de UI genéricos e reutilizáveis (Button, Input, Modal, Card...)
│   │   └── layout/             # componentes estruturais da aplicação (Header, Sidebar, Footer, PageLayout...)
│   ├── features/               # um subdiretório por domínio de negócio (ex.: auth/, orders/, users/)
│   ├── hooks/                  # hooks customizados reutilizáveis (useAuth, useDebounce, usePagination...)
│   ├── pages/                  # componentes de página, um por rota (ou por grupo de rotas)
│   ├── routes/                 # configuração de rotas da aplicação (react-router ou similar)
│   ├── services/               # camada de comunicação HTTP com apps/api (clients, chamadas de API)
│   ├── store/                  # estado global da aplicação (Redux/Zustand/Context, conforme decidido futuramente)
│   ├── types/                  # tipos TypeScript exclusivos do frontend (não compartilhados)
│   └── utils/                  # funções utilitárias específicas do frontend
└── tests/
    ├── unit/                   # testes unitários (componentes, hooks, utils isolados)
    └── integration/            # testes de integração (fluxos entre múltiplos componentes/páginas)
```

## Convenções específicas

- **`features/<nome-da-feature>/`**: cada feature deve ser autocontida,
  podendo ter suas próprias subpastas internas, por exemplo:
  ```
  features/auth/
  ├── components/     # componentes usados apenas por essa feature
  ├── hooks/          # hooks usados apenas por essa feature
  ├── services/       # chamadas de API específicas dessa feature
  └── types/          # tipos específicos dessa feature (não compartilhados globalmente)
  ```
  Essas subpastas só devem ser criadas quando necessárias — não crie
  estrutura vazia "por precaução".

- **`components/common/`** só deve conter componentes **sem conhecimento de
  negócio** (ex.: um `Button` não sabe o que é um "Pedido"). Qualquer
  componente que conheça uma regra de negócio pertence a uma `feature`.

- **`services/`** (raiz de `src/`) é para clients HTTP genéricos (ex.:
  configuração do axios/fetch, interceptors). Chamadas específicas de uma
  feature (ex.: `getOrders()`) devem ficar em `features/<feature>/services/`.

- Tipos que também são usados pelo backend **não** devem ir em
  `src/types/` — devem vir de `packages/shared`.

## O que NÃO colocar aqui

- Nenhuma lógica que dependa do Node.js (fs, path, process.env do servidor).
- Nenhuma regra de negócio que também seja usada pelo backend (deve ir para
  `packages/shared`).
- Nenhum acesso direto a banco de dados (óbvio, mas: toda comunicação com
  dados passa pela API via `services/`).
