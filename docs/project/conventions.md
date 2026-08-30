# Convenções do projeto

Estas convenções se aplicam a `packages/frontend`, `packages/backend` e `packages/shared`,
salvo indicação contrária.

## Nomenclatura de arquivos e pastas

- Pastas: `kebab-case` (ex.: `user-profile/`).
- Componentes React: `PascalCase` para o arquivo e para o componente (ex.:
  `UserCard.tsx` exportando `UserCard`).
- Hooks: `camelCase` prefixado com `use` (ex.: `useAuth.ts`).
- Services, utils, repositories, controllers, etc. (backend e frontend):
  `camelCase` (ex.: `userService.ts`, `orderRepository.ts`).
- Tipos e interfaces: `PascalCase` (ex.: `User`, `CreateOrderDTO`).
- Constantes: `SCREAMING_SNAKE_CASE` para valores fixos (ex.:
  `MAX_UPLOAD_SIZE_MB`).
- Arquivos de teste: mesmo nome do arquivo testado, com sufixo `.test.ts`.

## Organização de imports

1. Módulos externos (bibliotecas de terceiros).
2. Módulos de `packages/shared`.
3. Módulos internos do próprio pacote (`packages/frontend` ou `packages/backend`), do mais
   genérico para o mais específico.

## Commits

Recomenda-se seguir o padrão **Conventional Commits**:

```
<tipo>(<escopo opcional>): <descrição curta>

[corpo opcional]
```

Tipos comuns: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`,
`perf`.

Exemplos:
```
feat(api): adiciona endpoint de criação de pedidos
fix(web): corrige validação de e-mail no formulário de cadastro
docs: atualiza guia de estrutura do monorepo
```

## Branches

Sugestão de padrão (ajustar conforme fluxo de trabalho da equipe):

```
main                → produção
develop              → integração
feature/<nome>       → novas funcionalidades
fix/<nome>            → correções
```

## Código

- TypeScript em modo estrito (`strict: true`) em todos os pacotes.
- Preferir funções puras em `utils/` e `shared/`.
- Evitar lógica de negócio em componentes React, controllers do Fastify ou
  repositórios — cada camada deve ter uma única responsabilidade (ver
  `architecture.md`).
- Toda função/módulo exportado publicamente de `packages/shared` deve ter
  tipagem explícita (evitar `any`).
- O formatador escolhido para este projeto é o Biome. Todo o código deve ser
formatado conforme as regras especificadas no arquivo [`biome.json`](../../biome.json)

## Testes

- Testes unitários espelham a estrutura de `src/` dentro de `tests/unit/`.
- Testes de integração ficam em `tests/integration/` e testam fluxos
  completos (ex.: uma rota de ponta a ponta, uma página completa).
- Toda nova regra de negócio em `services/` (backend) ou `shared/` deve vir
  acompanhada de teste unitário.

## Documentação

- Toda decisão técnica relevante (escolha de biblioteca, padrão de
  arquitetura) deve ser registrada na tabela "Decisões técnicas" em
  `docs/project/architecture.md`.
- Ao adicionar uma nova pasta de topo dentro de `src/` de qualquer pacote,
  atualizar o documento correspondente (`frontend.md`, `backend.md` ou
  `shared.md`) explicando seu propósito.
