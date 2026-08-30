# UC-001 — Login

> Especificação da interface para o fluxo de login do sistema.

## 1. Objetivo

Permitir que o usuário informe suas credenciais e inicie uma sessão autenticada.

## 2. Elementos da interface

| Elemento            | Tipo   | Obrigatório | Ação                 |
| ------------------- | ------ | ----------: | -------------------- |
| E-mail              | Input  |         Sim | Informar e-mail      |
| Senha               | Input  |         Sim | Informar senha       |
| Entrar              | Button |           — | Iniciar autenticação |
| Esqueci minha senha | Link   |           — | Iniciar recuperação  |
| Criar conta         | Link   |           — | Iniciar cadastro     |

## 3. Estados da interface

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

## 4. Navegação

| Origem | Ação                      | Destino                   |
|--------|-------------------------- |-------------------------- |
| Login  | Esqueci minha senha       | UC-004 — Recuperar senha  |
| Login  | Criar conta               | UC-003 — Criar conta      |
| Login  | Autenticação bem-sucedida | `/dashboard`              |

## 5. Responsividade

A interface deve ser utilizável em:

- Desktop
- Tablet
- Mobile

## 6. Acessibilidade

- Todos os campos devem possuir identificação adequada.
- O formulário deve ser navegável pelo teclado.
- Mensagens de erro devem ser associadas aos respectivos campos.
- O foco deve ser visível.
- O botão e os links devem possuir estados de interação acessíveis.

## 7. Fora do escopo

Este documento não define:

- Cores.
- Tipografia.
- Espaçamentos.
- Ícones.
- Layout final.
- Componentes específicos de uma biblioteca de UI.
- Tecnologia utilizada na implementação.