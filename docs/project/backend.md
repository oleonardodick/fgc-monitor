# Backend — `packages/backend`

Aplicação Node.js com **Fastify**.

## Estrutura

```
packages/backend/
├── src/
│   ├── config/                # carregamento e validação de variáveis de ambiente, configuração de servidor/banco
│   ├── plugins/               # plugins do Fastify (cors, helmet, swagger, autenticação, conexão com banco...)
│   ├── modules/               # organização opcional por domínio completo (rota+controller+service+repo), usar quando fizer sentido — ver architecture.md
│   ├── routes/                # definição e registro dos endpoints HTTP
│   ├── controllers/           # recebem request/reply do Fastify, chamam services, formatam a resposta
│   ├── services/              # regras de negócio da aplicação (não conhecem HTTP)
│   ├── repositories/          # acesso a dados (queries, ORM, cache)
│   ├── models/                # entidades/modelos de dados da aplicação
│   ├── middlewares/           # hooks/middlewares do Fastify (autenticação, logging, rate-limit...)
│   ├── validators/            # validação de payloads de entrada (pode reutilizar schemas de packages/shared)
│   ├── errors/                # classes de erro customizadas da API (ex.: NotFoundError, ValidationError)
│   ├── utils/                 # funções utilitárias específicas do backend
│   ├── types/                 # tipos TypeScript exclusivos do backend (não compartilhados)
│   └── jobs/                  # tarefas agendadas, filas, workers em background
└── tests/
    ├── unit/                  # testes unitários (services, utils, validators isolados)
    └── integration/           # testes de integração (rotas completas, banco de dados de teste)
```

## Fluxo de uma requisição

```
routes/  →  controllers/  →  services/  →  repositories/
```

- **`routes/`**: apenas declara o endpoint (método, path, schema de
  validação, controller associado). Não deve conter lógica.
- **`controllers/`**: traduz a requisição HTTP em uma chamada de `service` e
  formata a resposta. Não deve conter regra de negócio nem acessar dados
  diretamente.
- **`services/`**: contém toda a regra de negócio. Não deve receber/conhecer
  objetos `request`/`reply` do Fastify — deve ser testável de forma
  totalmente isolada do HTTP.
- **`repositories/`**: única camada que acessa a fonte de dados (banco,
  cache, serviços externos). Não deve conter regra de negócio.

## Banco de dados
 
A escolha do banco de dados e do driver/ORM/ODM (ex.: MongoDB + Mongoose,
PostgreSQL + Prisma) **não é definida neste arquivo**. Ela deve ser:
 
1. Registrada em [`docs/project/tech-stack.md`](../project/tech-stack.md) (pacote, versão,
   onde é usado);
2. Justificada em [`docs/project/architecture.md`](../project/architecture.md), seção
   "Decisões técnicas" (por que essa escolha).
A conexão em si deve ser inicializada em `src/config/` e exposta ao resto da
aplicação como um plugin do Fastify em `src/plugins/`, quando fizer sentido.

## Convenções específicas

- **Validação de entrada**: sempre que uma regra de validação também for
  necessária no frontend (ex.: formato de e-mail, tamanho de senha), o schema
  deve ser definido em `packages/shared/src/schemas` e importado aqui em
  `validators/`. Validações puramente de infraestrutura da API (ex.: formato
  de um header interno) podem viver só em `validators/`.

- **`modules/`** é uma organização alternativa/complementar às pastas por
  camada (`routes/`, `controllers/`, etc.). Use `modules/<dominio>/` quando o
  número de arquivos por camada crescer muito e organizar por domínio ficar
  mais claro que organizar por camada técnica. Registre essa decisão em
  `docs/architecture.md` quando ela for tomada.

- **Erros**: use classes de `errors/` para erros de negócio previsíveis
  (ex.: `UserNotFoundError`). Erros inesperados devem ser tratados por um
  handler global de erros configurado em `plugins/`.

- **Documentação**: Toda nova rota deve possuir sua documentação feita utilizando
o **Swagger** como ferramenta de documentação. Pra a visualização dessa documentação,
foi adicionado o Scalar neste projeto.

- **Segurança**: Todas as rotas acessadas deverão ter controle de token ativo, a menos que
exteja explicitamente descrito que a rota não precisa possuir este controle.

- **Identificador**: É expressamente **proibido** utilizar IDs sequenciais para qualquer
cadastro nesta aplicação.


## O que NÃO colocar aqui

- Nenhum código que dependa do DOM, `window`, `document` ou de bibliotecas
  exclusivas de frontend (React, etc.).
- Nenhuma regra de negócio duplicada de `packages/shared` — se a regra
  também precisa existir no frontend, ela pertence a `shared`.
- Nenhuma query de banco fora de `repositories/`.
