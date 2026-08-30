# Criação de usuário

> Especificação das regras de negócio e segurança relacionadas à criação de usuários.

## 1. Objetivo

Definir as regras aplicáveis à criação de novos usuários no sistema.

## 2. Regras de criação

### RN-001 — Dados informados

Todos os campos devem estar informados para que uma conta seja criada corretamente.

### RN-002 — E-mail único

Não deve ser possível realizar a criação de uma nova conta com um e-mail já cadastrado.

### RN-003 — Senhas coincidindo

As duas senhas informadas devem ser iguais para que o cadastro seja realizado.

### RN-004 — Senhas coincidindo

O e-mail deve estar em um formato válido para que o cadastro seja realizado.

## 3. Regras de segurança

### RS-001 — Senha segura

A senha cadastrada somente é válida quando conter o seguinte:
* Entre 6 e 8 caracteres.
* Pelo menos 3 dos seguintes critérios:
    * 1 letra maiúscula.
    * 1 letra minúscula.
    * 1 número.
    * 1 caractere especial.

## 4. Casos de uso relacionados

- `UC-003 — Criar conta`