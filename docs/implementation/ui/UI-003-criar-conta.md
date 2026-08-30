# UC-001 — Login

> Especificação da interface para o fluxo de criação de usuários no sistema.

## 1. Objetivo

Permitir que o usuário informe seus dados e crie sua conta.

## 2. Elementos da interface

| Elemento            | Tipo   | Obrigatório | Ação                       |
| ------------------- | ------ | ----------: | -------------------------- |
| Nome                | Input  |         Sim | Informar nome              |
| E-mail              | Input  |         Sim | Informar e-mail            |
| Senha               | Input  |         Sim | Informar senha             |
| Confirmar senha     | Input  |         Sim | Informar novamente a senha |
| Criar Conta         | Button |           — | Iniciar cadastro           |
| Já possuo uma conta | Link   |           — | Iniciar login              |

## 3. Estados da interface

### Estado inicial

- Campos de nome, e-mail e senha vazios.
- Botão "Criar Conta" disponível.

### Preenchimento

- Nome apresenta o valor informado pelo usuário.
- E-mail apresenta o valor informado pelo usuário.
- Senha permanece mascarada.
- Confirmar senha permanece mascarada.

### Validação

Quando houver erro de validação:

- O campo inválido deve ser destacado.
- Uma mensagem de validação deve ser apresentada próxima ao campo.
- O usuário deve poder corrigir o valor.

### Criando conta

Durante a criação da conta:

- O botão "Criar conta" deve indicar que a operação está em andamento.
- O usuário não deve conseguir criar múltiplos usuários simultaneamente.

### Dados inválidos

- Cada campo deve apresentar sua mensagem de dado inválido.
- Os campos devem permanecer disponíveis para nova tentativa.

### Erro de serviço

- Apresentar uma mensagem informando que não foi possível realizar o cadastro.
- Permitir que o usuário tente novamente.

## 4. Navegação

| Origem              | Ação                        | Destino  |
|-------------------- |---------------------------- |--------- |
| Cadastro de usuário | Criação bem sucedida        | `/login` |
| Cadastro de usuário | Usuário já possui uma conta | `/login` |

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