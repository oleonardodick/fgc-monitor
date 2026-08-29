# Erro inesperado

> Especificação da exceção disparada quando algum erro de servidor acontece.

## 1. Objetivo

Especificar o que o sistema deverá realizar internamente e o que deverá apresentar ao usuário caso algum erro interno do servidor aconteça.

## 3. Tratamentos internos

1. Deve ser criado um log deste erro.
2. O processo selecionado deve ser abortado.
3. Uma mensagem genérica ao usuário, sem conter dados do erro apresentado.

## 4. Tratamentos visuais

1. Deverá apresentar a mensagem genérica ao usuário.
2. Deverá retornar para a página de login.