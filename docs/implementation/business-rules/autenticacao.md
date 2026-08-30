# Autenticação

> Especificação das regras de negócio e segurança relacionadas à autenticação de usuários.

## 1. Objetivo

Definir as regras aplicáveis à autenticação e ao estabelecimento de sessões de usuários.

## 2. Regras de autenticação

### RN-001 — Credenciais válidas

Apenas usuários com credenciais válidas podem acessar áreas protegidas.

### RN-002 — Autenticação inválida

Uma autenticação inválida não deve criar uma sessão autenticada.

## 3. Regras de segurança

### RS-001 — Mensagens de autenticação

Mensagens de erro não devem revelar informações que permitam identificar se um usuário está cadastrado ou se uma credencial específica está incorreta.

### RS-002 — Expiração da sessão

Sessões autenticadas devem possuir mecanismo de expiração.

## 4. Casos de uso relacionados

- `UC-001 — Login`
- `UC-002 — Logout`
- `UC-003 — Criar conta`
- `UC-004 — Recuperar senha`