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
│   ├── store/                  # estado global da aplicação (Zustand, ex.: useUIStore)
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

- **Segurança**: Nenhum dado sensível deve estar exposto em URL ou header
das requisições. Todos devem ser tratados de forma segura.

## Design System

Os tokens visuais que devem ser utilizados neste projeto se encontram em:

[globals.css](../../packages/frontend/src/styles/globals.css)

Ao implementar novas telas ou componentes:

1. Utilize os tokens semânticos existentes.
2. Não invente novas cores ou valores visuais sem necessidade.
3. Não utilize valores hexadecimais diretamente nos componentes.
4. Não implemente light mode.
5. Mantenha o tema exclusivamente dark.

Exemplo:

```tsx
<Button className="bg-primary text-primary-foreground">
  Salvar investimento
</Button>
```

**Evite** a utilização de cores da seguinte forma:
```tsx
<Button className="bg-blue-600 text-white">
  Salvar investimento
</Button>
```

## Controle de estados

Esta aplicação utiliza **Zustand** para realizar o controle de estados.

## Layout de aplicação

Os componentes estruturais da aplicação vivem em `src/components/layout/` (ver
`packages/frontend/src/components/layout/`):

| Componente | Responsabilidade |
|---|---|
| `AppLayout.tsx` | Layout principal: `min-h-screen flex flex-col`, header fixo, `main` responsivo (`max-w-7xl mx-auto`) com `<Outlet />` e rodapé ao final. É o **default export** usado pelas páginas protegidas. |
| `Header.tsx` | Header fixo (`sticky top-0`). Desktop: logo, navegação central com `NavLink` e indicador ativo (sublinhado inferior + cor), ações à direita (notificações, perfil). Celular: logo, avatar e botão hamburger. |
| `MobileDrawer.tsx` | Drawer lateral animado (celular): overlay + painel deslizante com links de navegação, botão de fechar (X); fecha ao clicar num link, ao clicar fora ou com `Escape`. |
| `UserProfileMenu.tsx` | Avatar com iniciais + dropdown (nome/e-mail e `Sair`). Abre ao clicar, fecha com clique fora ou `Escape`. Usa `useAuth()`. |
| `Footer.tsx` | Rodapé ao final do layout com links horizontais (`Legal | Privacy | Terms | Contact`) e copyright. |
| `BrandLogo.tsx` | Logo `FGCMonitor` com badge/ícone do brand; link a `/dashboard`. |
| `navigation.ts` | Dados compartilhados: `NAVIGATION_ITEMS` (header/drawer) e `FOOTER_LINKS`. |

Helpers associados:

- `src/store/useUIStore.ts` — store Zustand do estado de UI:
  - `isMobileMenuOpen: boolean`
  - `toggleMobileMenu(): void`
  - `closeMobileMenu(): void`
  O `Header` e o `MobileDrawer` leem este store; o drawer se fecha sozinho
  quando um link de navegação é clicado (`closeMobileMenu`).
- `src/utils/getInitials.ts` — calcula as iniciais do usuário para o avatar.

### Integração com rotas

Em `src/routes/index.tsx`:

- Páginas públicas (`/login`, `/criar-conta`) ficam envoltas em `CenteredPage`,
  que centraliza o conteúdo (antes este papel era do `<main>` global em `App.tsx`).
- Páginas protegidas usam uma **rota sem `path`** (layout route) com
  `ProtectedRoute` + `AppLayout` e filhos com paths absolutos (`/dashboard`,
  `/investimentos`). `AppLayout` renderiza esses filhos no `<Outlet />`.

Nota: os testes unitários atualmente vivem em `src/test/` (espelhando `src/`),
como por exemplo `src/test/AppLayout.test.tsx`.

## O que NÃO colocar aqui

- Nenhuma lógica que dependa do Node.js (fs, path, process.env do servidor).
- Nenhuma regra de negócio que também seja usada pelo backend (deve ir para
  `packages/shared`).
- Nenhum acesso direto a banco de dados (óbvio, mas: toda comunicação com
  dados passa pela API via `services/`).
