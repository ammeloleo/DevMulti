# Documentação de Testes de QA

## 1. Testes unitários — Jest

Validação de funções auxiliares e regras de negócio no front-end, assegurando a formatação das datas do calendário e a sanitização contra injeções de HTML (XSS).

## 2. Testes de integração — Supertest / Fetch API

Validação do ciclo completo de envio de requisições HTTP (`GET`, `POST`, `PATCH` e `DELETE`) aos endpoints REST do Supabase, com verificação do retorno no formato JSON.

## 3. Evidência de funcionamento

As chamadas realizadas com JavaScript nativo (`fetch`) retornam os status `200 OK` e `201 Created`, com a persistência e a recuperação corretas dos dados no PostgreSQL do Supabase.
