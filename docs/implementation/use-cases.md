# Use Cases

> Catálogo das funcionalidades do sistema.
>
> Este documento apresenta as funcionalidades disponíveis, seus objetivos, atores, prioridade e relacionamento com User Flows.
>
> **Regra:** detalhes de fluxo, validações, regras de negócio específicas e comportamento de erro devem ser documentados nos respectivos arquivos de User Flow ou em documentos específicos de regras de negócio.

---

## 1. Atores

| ID      | Ator          | Descrição                                                      |
| ------- | ------------- | -------------------------------------------------------------- |
| ACT-001 | Usuário       | Usuário autenticado que utiliza as funcionalidades do sistema. |
| ACT-002 | Sistema       | Processos executados automaticamente pelo sistema.             |

---

## 2. Funcionalidades

### 2.1 Autenticação

| ID     | Use Case        | Ator    | Prioridade | User Flow                                                            | Status    |
| ------ | --------------- | ------- | ---------- | -------------------------------------------------------------------- | --------- |
| UC-001 | Login           | Usuário | Alta       | [Login](./user-flows/autenticacao/UC-001-login.md)                     | Validado |
| UC-002 | Logout          | Usuário | Alta       | ---                                                                  | Validado |
| UC-003 | Criar conta     | Usuário | Alta       | [Criar conta](./user-flows/autenticacao/UC-003-criar-conta.md)         | Validado |
| UC-004 | Recuperar senha | Usuário | Média      | [Recuperar senha](./user-flows/autenticacao/UC-004-recuperar-senha.md) | A definir |

### 2.2 Usuários

| ID     | Use Case         | Ator    | Prioridade | User Flow                                                            | Status    |
| ------ | ---------------- | ------- | ---------- | ---------------------------------------------------------------------| --------- |
| UC-010 | Gerenciar perfil | Usuário | Média      | [Gerenciar perfil](./user-flows/usuarios/UC-010-gerenciar-perfil.md) | A definir |

### 2.3 Busca de taxas do Banco Central

| ID     | Use Case    | Ator    | Prioridade | User Flow                                                            | Status    |
| ------ | ----------- | ------- | ---------- | -------------------------------------------------------------------- | --------- |
| UC-020 | Atualizar Selic | Sistema | Alta       | [Buscar Selic](./user-flows/taxas/UC-020-atualizar-selic.md) | A definir |
| UC-021 | Atualizar IPCA  | Sistema | Alta       | [Buscar IPCA](./user-flows/taxas/UC-021-atualizar-ipca.md)   | A definir |

### 2.4 Cadastro de conglomerados

| ID     | Use Case                | Ator    | Prioridade | User Flow                                                                            | Status    |
| ------ | ----------------------- | ------- | ---------- | ------------------------------------------------------------------------------------ | --------- |
| UC-030 | Gerenciar conglomerados | Usuário | Alta       | [Gerenciar Conglomerado](./user-flows/conglomerados/UC-030-gerenciar-conglomerados.md) | A definir |

### 2.5 Cadastro de investimentos

| ID     | Use Case               | Ator    | Prioridade | User Flow                                                                           | Status    |
| ------ | ---------------------- | ------- | ---------- | ----------------------------------------------------------------------------------- | --------- |
| UC-040 | Cadastrar investimento | Usuário | Alta       | [Cadastrar Investimento](./user-flows/investimentos/UC-040-cadastrar-investimento.md) | A definir |
| UC-041 | Atualizar investimento | Usuário | Alta       | [Atualizar Investimento](./user-flows/investimentos/UC-041-atualizar-investimento.md) | A definir |
| UC-042 | Excluir investimento   | Usuário | Alta       | ---                                                                                 | A definir |
| UC-043 | Resgatar investimento  | Usuário | Alta       | [Resgatar Investimento](./user-flows/investimentos/UC-043-resgatar-investimento.md)   | A definir |

### 2.6 Cadastro de pagamentos do FGC

| ID     | Use Case             | Ator    | Prioridade | User Flow                                                                    | Status    |
| ------ | -------------------- | ------- | ---------- | ---------------------------------------------------------------------------- | --------- |
| UC-050 | Gerenciar pagamentos | Usuário | Alta       | [Gerenciar Pagamentos](./user-flows/pagamentos/UC-050-gerenciar-pagamentos.md) | A definir |

### 2.7 Cadastro de parâmetros

| ID     | Use Case              | Ator    | Prioridade | User Flow                                                                      | Status    |
| ------ | --------------------- | ------- | ---------- | ------------------------------------------------------------------------------ | --------- |
| UC-060 | Configurar parâmetros | Usuário | Alta       | [Configurar Parâmetros](./user-flows/parametros/UC-060-configurar-parametros.md) | A definir |

### 2.8 Monitoramento FGC
| ID     | Use Case                            | Ator    | Prioridade | User Flow                                                                           | Status    |
| ------ | ----------------------------------- | ------- | ---------- | ----------------------------------------------------------------------------------- | --------- |
| UC-070 | Consultar situação FGC              | Usuário | Alta       | [Consultar Situação](./user-flows/monitoramento/UC-070-consultar-situacao.md)         | A definir |
| UC-071 | Analizar exposição por conglomerado | Usuário | Alta       | [Exposição Conglomerado](./user-flows/monitoramento/UC-071-exposicao-conglomerado.md) | A definir |
| UC-072 | Analizar exposição por CPF          | Usuário | Alta       | [Exposição CPF](./user-flows/monitoramento/UC-072-exposicao-cpf.md)                   | A definir |
| UC-073 | Projetar exposição futura           | Sistema | Alta       | ---                                                                                 | A definir |
| UC-074 | Identificar risco de ultrapassagem  | Sistema | Alta       | ---                                                                                 | A definir |

### 2.9 Simulações
| ID     | Use Case                  | Ator    | Prioridade | User Flow                                                                    | Status    |
| ------ | ------------------------- | ------- | ---------- | ---------------------------------------------------------------------------- | --------- |
| UC-080 | Simular novo investimento | Usuario | Alta       | [Simular investimento](./user-flows/simulacoes/UC-080-simular-investimento.md) | A definir |
| UC-081 | Simular resgate           | Usuario | Alta       | [Simular resgate](./user-flows/simulacoes/UC-081-simular-resgate.md)           | A definir |

### 2.10 Alertas
| ID     | Use Case           | Ator    | Prioridade | User Flow | Status    |
| ------ | ------------------ | ------- | ---------- | --------- | --------- |
| UC-090 | Configurar alertas | Usuario | Média      | ---       | A definir |
| UC-091 | Consultar alertas  | Usuario | Média      | ---       | A definir |

### 2.11 Relatórios
| ID     | Use Case          | Ator    | Prioridade | User Flow                                                              | Status    |
| ------ | ----------------- | ------- | ---------- | ---------------------------------------------------------------------- | --------- |
| UC-100 | Exportar posição  | Usuario | Baixa      | [Exportar posição](./user-flows/relatorios/UC-100-exportar-posicao.md)   | A definir |
| UC-101 | Exportar projeção | Usuario | Baixa      | [Exportar projecao](./user-flows/relatorios/UC-100-exportar-projecao.md) | A definir |

---

## 3. Resumo por prioridade

### Alta

* UC-001 — Login
* UC-002 — Logout
* UC-003 — Criar conta
* UC-020 — Atualizar dados Selic
* UC-021 — Atualizar dados IPCA
* UC-030 — Gerenciar Conglomerado
* UC-040 — Cadastrar investimento
* UC-041 — Atualizar investimento
* UC-042 — Excluir investimento
* UC-043 — Resgatar investimento
* UC-050 — Configurar parâmetros
* UC-051 — Atualizar limites
* UC-070 — Consultar situação FGC 
* UC-071 — Analizar exposição por conglomerado 
* UC-072 — Analizar exposição por CPF
* UC-073 — Projetar exposição futura
* UC-074 — Identificar risco de ultrapassagem 
* UC-080 — Simular novo investimento 
* UC-081 — Simular resgate

### Média

* UC-004 — Recuperar senha
* UC-010 — Visualizar perfil
* UC-011 — Editar perfil
* UC-012 — Alterar senha
* UC-090 — Configurar alertas
* UC-091 — Consultar alertas

### Baixa

* UC-100 — Exportar posição 
* UC-101 — Exportar projeção 

---

## 4. Status

| Status               | Descrição                                                |
| -------------------- | -------------------------------------------------------- |
| `A definir`          | Funcionalidade identificada, mas ainda não especificada. |
| `Definido`           | Comportamento funcional definido.                        |
| `User Flow`          | User Flow documentado.                                   |
| `Em desenvolvimento` | Implementação em andamento.                              |
| `Implementado`       | Implementação concluída.                                 |
| `Validado`           | Funcionalidade validada.                                 |

---

## 5. Convenções

### IDs

Os casos de uso devem utilizar IDs estáveis:

```text
UC-001
UC-002
UC-003
...
```

O ID não deve ser alterado caso o nome da funcionalidade seja alterado.

### User Flows

User Flows devem utilizar o mesmo ID do Use Case:

```text
UC-001 → user-flows/UC-001-login.md
UC-003 → user-flows/UC-003-criar-conta.md
```

### Escopo

O `use-cases.md` deve responder principalmente:

> **"O que o sistema permite que seus usuários façam?"**

Os detalhes de **como a funcionalidade acontece** devem ficar nos User Flows.
