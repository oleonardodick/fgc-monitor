# Stack de tecnologias e pacotes

Este arquivo é a **fonte única da verdade** sobre quais bibliotecas/pacotes o
projeto usa, onde cada uma é usada e por quê.  Ao tentar utilizar um pacote,
**verifique antes se ele está instalado aqui**. 

## Como preencher

| Pacote                | Versão | Onde é usado (pasta)                                                      | Propósito                                 |
|-----------------------|--------|---------------------------------------------------------------------------|-------------------------------------------|
| _exemplo:_ `mongoose` | `^8.x` | `packages/backend/src/config`, `packges/backend/src/models`, `packages/backend/src/repositories` | ODM de acesso ao MongoDB                  |
| _exemplo:_ `zod`      | `^3.x` | `packages/shared/src/schemas` | Validação de dados usada tanto no backend (payloads) quanto no frontend (formulários) |

## `packages/frontend` — Frontend

| Pacote | Versão | Onde é usado | Propósito |
|---|---|---|---|
| `zod` | `4.5.4` | (dependência direta — ver nota abaixo) | Necessário para inferência de tipos dos schemas importados de `shared` (`z.infer`) |
| `react-hook-form` | `7.87.0` | `apps/web/src/hooks/useZodForm.ts`, `apps/web/src/features/**` | Gerenciamento de formulários |
| `@hookform/resolvers` | `5.9.1` | `apps/web/src/hooks/useZodForm.ts` | Ponte entre `react-hook-form` e os schemas Zod (`zodResolver`) |
| `axios` | `^1.20.0` | `apps/web/src/services/httpClient.ts`, `apps/web/src/features/**/services` | Cliente HTTP para comunicação com `apps/api` |
| `react-router-dom` | `7.18.3` | `apps/web/src/routes/` | Roteamento da aplicação (rotas aninhadas, lazy loading de páginas) |

> `useZodForm` é um hook genérico (`useForm` do react-hook-form + `zodResolver`
> + um schema de `packages/shared/src/schemas`) usado por várias features.
> Por isso fica em `src/hooks/`, e não dentro de uma `feature/` específica.

## `packages/backend` — Backend

### Banco de dados / persistência

| Pacote | Versão | Onde é usado | Propósito |
|`mongoose`|`9.9.4`|`packages/backend/src/config`, `packages/backend/src/plugins`|ODM para conectar e modelar dados no MongoDB|

Este projeto utiliza como banco de dados o **MongoDB**, utilizando o **Mongoose**
como ODM para conexão.
Sua conexão deve ser inicializada em `packages/backend/src/config` e exposta como
plugin do Fastify em `packages/backend/src/plugins`.

### Outros pacotes do backend

| Pacote | Versão | Onde é usado | Propósito |
|`@fastify/cors`|`^11.0.1`|`packages/backend/src/plugins`|Habilita CORS no servidor Fastify|
|`@fastify/swagger`|`9.8.1`|`packages/backend/src/plugins`|Geração dinâmica de spec OpenAPI a partir dos schemas das rotas|
|`@scalar/fastify-api-reference`|`1.67.0`|`packages/backend/src/plugins`|Interface visual interativa para documentação OpenAPI (rota `/docs`)|
|`fastify-plugin`|`6.0.0`|`packages/backend/src/plugins`|Necessário para disponibilizar plugins customizados para a aplicação.|
|`@fastify/jwt`|`^10.2.2`|`packages/backend/src/plugins`|Geração e validação de tokens JWT para autenticação|
|`bcryptjs`|`^3.0.3`|`packages/backend/src/plugins`|Hashing de senhas (bcrypt puro JS, sem compilação nativa)|
| `zod` | `4.5.4` | (dependência direta — ver nota abaixo) | Necessário para inferência de tipos dos schemas importados de `shared`, usados em `validators/` |

## `packages/shared`

 Pacote | Versão | Onde é usado | Propósito |
|---|---|---|---|
| `zod` | `4.5.4` | `packages/shared/src/schemas` | Define os schemas de validação compartilhados entre `web` e `api` |

> Pacotes aqui precisam funcionar em qualquer ambiente JS (sem `window` nem
> APIs exclusivas do Node). Bibliotecas de validação (ex.: Zod, Yup) são o
> caso mais comum — ficam em `packages/shared/src/schemas`.

### Nota sobre dependências "transversais" (ex.: Zod)

Quando um pacote (como o Zod) é usado por `shared` **e também** precisa ser
resolvido diretamente por `frontend`/`backend` (porque eles usam `z.infer<...>` sobre
os tipos importados, ou porque estendem/compõem schemas localmente), ele deve
ser declarado como dependência direta **nos três `package.json`**
(`shared`, `frontend` e `backend`) — mesmo em um monorepo com workspaces. Depender
apenas do hoisting do gerenciador de pacotes gera uma "phantom dependency":
o pacote funciona por acaso, não por declaração explícita, e pode quebrar se
o algoritmo de resolução do gerenciador mudar. A versão deve ser mantida
igual nos três `package.json` para evitar dois `zod` diferentes coexistindo
no bundle.

## Dependências específicas de uma única feature

Nem todo pacote precisa entrar nas tabelas acima. Se uma biblioteca é usada
por **uma única feature/módulo** e não é parte da stack geral do projeto
(ex.: uma lib de geração de PDF usada só na feature de "relatórios"), basta
documentar isso num pequeno comentário ou `README.md` dentro da própria
pasta da feature (`packages/backend/src/modules/relatorios/README.md`, por exemplo),
em vez de poluir esta tabela global. Use este arquivo apenas para o que é
transversal ao projeto.