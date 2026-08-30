# Compartilhado — `packages/shared`

Biblioteca interna consumida tanto por `packages/frontend` quanto por `packages/backend`.

## Regra fundamental

Código colocado aqui **deve funcionar em qualquer ambiente JavaScript**:
não pode depender de APIs exclusivas do navegador (`window`, `document`,
`localStorage`) nem de APIs exclusivas do Node.js (`fs`, `path`,
`process.env` diretamente) ou de frameworks (`react`, `fastify`).

Se um trecho de código precisa de uma dessas dependências, ele **não
pertence a `shared`** — deve ir para `packages/frontend` ou `packages/backend`.

## Estrutura

```
packages/shared/
├── src/
│   ├── types/        # tipos e interfaces compartilhados (ex.: DTOs de request/response, entidades de domínio)
│   ├── constants/     # constantes de negócio usadas nos dois lados (enums, limites, chaves fixas)
│   ├── schemas/       # schemas de validação (ex.: Zod/Yup — lib escolhida deve estar em docs/tech-stack.md) usados tanto na validação de formulários (web) quanto na  validação de payloads (api)
│   ├── utils/          # funções puras utilitárias (formatação, cálculo, transformação de dados) sem dependência de ambiente
│   └── errors/         # estruturas/classes de erro compartilhadas (ex.: shape de um erro de API que o frontend sabe interpretar)
└── tests/               # testes unitários de tudo que está em src/ (funções puras, fáceis de testar)
```

## O que colocar aqui (exemplos)

- Tipo `User`, `Order`, `CreateUserDTO` usados tanto pelo Fastify (tipar o
  corpo da requisição) quanto pelo React (tipar a resposta da API).
- Schema de validação de e-mail/senha usado tanto num formulário do React
  quanto na validação de entrada de uma rota do Fastify.
- Constante `MAX_UPLOAD_SIZE_MB` usada para validar no frontend antes de
  enviar o arquivo e novamente no backend antes de aceitar o upload.
- Função pura `formatCurrency(value)` usada para exibir preços tanto no
  frontend quanto em um e-mail gerado pelo backend.
- Formato padronizado de erro da API (ex.: `{ code, message, details }`) que
  o frontend sabe interpretar de forma consistente.

## O que NÃO colocar aqui

- Componentes React.
- Rotas, controllers, plugins do Fastify.
- Qualquer coisa que acesse banco de dados, sistema de arquivos ou rede.
- Configuração de build específica de `web` ou `api`.

## Publicação/uso dentro do monorepo

`packages/shared` deve ser referenciado por `packages/frontend` e `packages/backend` como uma
dependência de workspace (ex.: `"@fgc-monitor/shared": "workspace:*"`.