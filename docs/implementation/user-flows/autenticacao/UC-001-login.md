# UC-001 — Login

> User Flow referente ao caso de uso de autenticação de usuários.

## 1. Visão geral

### Objetivo

Permitir que um usuário existente se autentique no sistema para acessar funcionalidades protegidas.

### Ator

**Principal:** Usuário

### Pré-condições

* O usuário deve possuir uma conta cadastrada.
* O sistema deve estar disponível.

### Pós-condições

**Sucesso:**

* O usuário está autenticado.
* O usuário possui uma sessão válida.
* O usuário é direcionado para a área autenticada do sistema.

**Falha:**

* O usuário permanece não autenticado.
* Nenhuma sessão autenticada é criada.

---

# 2. User Flow

```mermaid
       flowchart TD
       A[Início] --> B[Acessa página de Login]
       B --> C[Informa credenciais]
       C --> D{Dados válidos?}
       D --> |Sim| E[Autentica usuário]
       E --> F[Direciona para dashboard]
       F --> G[Fim]
       D --> |Não| H[Exibe erro]
       H --> C
```
---

# 3. Fluxo principal

### Step 1 — Acessar Login

O usuário acessa a página de login.

---

### Step 2 — Informar credenciais

O usuário informa:

* E-mail.
* Senha.

O usuário seleciona **Entrar**.

---

### Step 3 — Validar dados

O sistema valida os dados informados.

#### Validações

* E-mail é obrigatório.
* E-mail deve possuir formato válido.
* Senha é obrigatória.

Caso os dados sejam inválidos, o fluxo segue para **FA-001 — Dados inválidos**.

---

### Step 4 — Autenticar usuário

O sistema envia as credenciais para autenticação.

O sistema verifica:

1. Se o usuário existe.
2. Se a senha está correta.
3. Se a conta pode realizar login.

---

### Step 5 — Criar sessão

Após a autenticação:

1. O sistema cria uma sessão autenticada.
2. Os tokens necessários são gerados.
3. O estado de autenticação do cliente é atualizado.

---

### Step 6 — Redirecionar usuário

O sistema direciona o usuário para a página inicial da área autenticada.

**Destino padrão:**

```text
/dashboard
```

O fluxo é concluído.

---

# 4. Regras de negócio

### RN-001 — Credenciais válidas

Apenas usuários com credenciais válidas podem acessar áreas protegidas.

### RN-002 — Autenticação inválida

Uma autenticação inválida não deve criar uma sessão autenticada.

# 5. Regras de segurança

### RS-001 — Mensagens de autenticação

Mensagens de erro não devem revelar informações que permitam identificar se um usuário está cadastrado ou se uma credencial específica está incorreta.

### RS-002 — Expiração da sessão

Sessões autenticadas devem possuir mecanismo de expiração.

# 6. Fluxos alternativos

## FA-001 — Dados inválidos

**Origem:** Step 3

1. O sistema identifica um ou mais campos inválidos.
2. O sistema apresenta o erro junto ao campo correspondente.
3. O usuário corrige os dados.
4. O usuário tenta realizar o login novamente.
5. O fluxo retorna ao Step 3.

---

## FA-002 — Credenciais inválidas

**Origem:** Step 4

Caso as credenciais não correspondam a um usuário válido:

1. O sistema rejeita a autenticação.
2. O sistema informa que as credenciais são inválidas.
3. O usuário permanece na página de login.
4. O usuário pode tentar novamente.

> Por segurança, o sistema não deve informar se o e-mail ou a senha especificamente estão incorretos.

---

## FA-003 — Usuário esqueceu a senha

**Origem:** página de login

1. O usuário seleciona **Esqueci minha senha**.
2. O sistema direciona para o fluxo de recuperação de senha.

**Próximo Use Case:**

`UC-004 — Recuperar senha`

---

# 5. Exceções

## EX-001 — Serviço de autenticação indisponível

Caso o serviço necessário para autenticação esteja indisponível:

1. O sistema não conclui a autenticação.
2. O sistema informa que não foi possível realizar o login naquele momento.
3. O usuário permanece na página de login.
4. Nenhuma sessão parcial deve ser criada.

---

## EX-002 — Erro inesperado

Caso ocorra um erro não previsto:

1. O sistema deverá seguir as regras descritas no arquivo [Erro Inesperado](../../exceptions/erro-inesperado.md).


---

# 6. Estados

O fluxo de login possui os seguintes estados principais:

```text
Não autenticado
       │
       ▼
Preenchendo credenciais
       │
       ▼
Validando
   ┌───┴────┐
   │        │
 inválido  válido
   │        │
   ▼        ▼
 Erro    Autenticado
            │
            ▼
        Área protegida
```

---

# 7. Interface do usuário

## Elementos da interface

| Elemento            | Tipo   | Obrigatório | Ação                 |
| ------------------- | ------ | ----------: | -------------------- |
| E-mail              | Input  |         Sim | Informar e-mail      |
| Senha               | Input  |         Sim | Informar senha       |
| Entrar              | Button |           — | Iniciar autenticação |
| Esqueci minha senha | Link   |           — | Iniciar recuperação  |
| Criar conta         | Link   |           — | Iniciar cadastro     |

## Estados da interface

### Estado inicial

- Campos de e-mail e senha vazios.
- Botão "Entrar" disponível.

### Preenchimento

- E-mail apresenta o valor informado pelo usuário.
- Senha permanece mascarada.

### Validação

Quando houver erro de validação:

- O campo inválido deve ser destacado.
- Uma mensagem de validação deve ser apresentada próxima ao campo.
- O usuário deve poder corrigir o valor.

### Autenticando

Durante a autenticação:

- O botão "Entrar" deve indicar que a operação está em andamento.
- O usuário não deve conseguir iniciar múltiplas autenticações simultaneamente.

### Credenciais inválidas

- Uma mensagem informando que as credenciais são inválidas deve ser apresentada.
- Os campos devem permanecer disponíveis para nova tentativa.
- O sistema não deve indicar se o e-mail ou a senha está incorreto individualmente.

### Erro de serviço

- Apresentar uma mensagem informando que não foi possível realizar o login.
- Permitir que o usuário tente novamente.

## Navegação

| Origem | Ação                      | Destino                   |
|--------|-------------------------- |-------------------------- |
| Login  | Esqueci minha senha       | UC-004 — Recuperar senha  |
| Login  | Criar conta               | UC-003 — Criar conta      |
| Login  | Autenticação bem-sucedida | `/dashboard`              |

## Responsividade

A interface deve ser utilizável em:

- Desktop
- Tablet
- Mobile

## Acessibilidade

- Todos os campos devem possuir identificação adequada.
- O formulário deve ser navegável pelo teclado.
- Mensagens de erro devem ser associadas aos respectivos campos.
- O foco deve ser visível.
- O botão e os links devem possuir estados de interação acessíveis.

## Fora do escopo

Este documento não define:

- Cores.
- Tipografia.
- Espaçamentos.
- Ícones.
- Layout final.
- Componentes específicos de uma biblioteca de UI.
- Tecnologia utilizada na implementação.

# 8. Critérios de aceite

### Login com sucesso

- [ ] Usuário consegue informar e-mail e senha.
- [ ] Sistema autentica credenciais válidas.
- [ ] Sistema cria uma sessão válida.
- [ ] Usuário é direcionado para `/dashboard`.

### Validação

- [ ] E-mail vazio é rejeitado.
- [ ] E-mail em formato inválido é rejeitado.
- [ ] Senha vazia é rejeitada.
- [ ] Mensagens de validação são apresentadas de forma clara.

### Credenciais inválidas

- [ ] Sistema rejeita credenciais inválidas.
- [ ] Sistema não informa se o e-mail ou senha está incorreto individualmente.
- [ ] Login inválido não cria sessão.

### Falhas

- [ ] Indisponibilidade do serviço é tratada.
- [ ] Erros inesperados são tratados.
- [ ] O usuário pode tentar novamente após uma falha.

---

# 9. Visibilidade da funcionalidade

Esta funcionalidade, assim como suas rotas, estarão disponíveis para todas as
pessoas, ou seja, não é necessário um token válido para acessar a rotina.

# 10. Referências

### Casos de uso relacionados

* `UC-003 — Criar conta`
* `UC-004 — Recuperar senha`
* `UC-002 — Logout`
