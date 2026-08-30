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
| _(a definir)_ | | | |

## `packages/backend` — Backend

### Banco de dados / persistência

| Pacote | Versão | Onde é usado | Propósito |
|Mongoose|9.9.4|`packages/backend/src/config`, `packages/backend/src/plugins`|ODM para conectar e modelar dados no MongoDB|
| _(a definir)_ | | | |

Este projeto utiliza como banco de dados o **MongoDB**, utilizando o **Mongoose**
como ODM para conexão.
Sua conexão deve ser inicializada em `packages/backend/src/config` e exposta como
plugin do Fastify em `packages/backend/src/plugins`.

### Outros pacotes do backend

| Pacote | Versão | Onde é usado | Propósito |
|fastify-plugin|6.0.0|---|---|
| _(a definir)_ | | | |

## `packages/shared`

| Pacote | Versão | Onde é usado | Propósito |
|---|---|---|---|
| _(a definir)_ | | | |

> Pacotes aqui precisam funcionar em qualquer ambiente JS (sem `window` nem
> APIs exclusivas do Node). Bibliotecas de validação (ex.: Zod, Yup) são o
> caso mais comum — ficam em `packages/shared/src/schemas`.

## Dependências específicas de uma única feature

Nem todo pacote precisa entrar nas tabelas acima. Se uma biblioteca é usada
por **uma única feature/módulo** e não é parte da stack geral do projeto
(ex.: uma lib de geração de PDF usada só na feature de "relatórios"), basta
documentar isso num pequeno comentário ou `README.md` dentro da própria
pasta da feature (`packages/backend/src/modules/relatorios/README.md`, por exemplo),
em vez de poluir esta tabela global. Use este arquivo apenas para o que é
transversal ao projeto.