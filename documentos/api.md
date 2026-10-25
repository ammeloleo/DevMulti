# API Funcional

## Endpoints Supabase REST

| Método | Endpoint | Descrição / parâmetros | Código HTTP |
| --- | --- | --- | --- |
| `GET` | `/rest/v1/usuario` | Consulta a lista de usuários ou busca por ID (`?id=eq.{id}`). | `200 OK` |
| `GET` | `/rest/v1/postagens` | Retorna todas as postagens publicadas. | `200 OK` |
| `POST` | `/rest/v1/postagens` | Cria uma publicação. Envia: `titulo`, `text`, `data`, `id_usuario` e `curtidas`. | `201 Created` |
| `PATCH` | `/rest/v1/postagens?id=eq.{id}` | Atualiza uma postagem específica, como ao incrementar `curtidas`. | `200 OK` |
| `DELETE` | `/rest/v1/postagens?id=eq.{id}` | Remove uma postagem pelo ID. | `204 No Content` |
| `GET` | `/rest/v1/eventos` | Consulta os eventos cadastrados no calendário. | `200 OK` |
| `POST` | `/rest/v1/eventos` | Cadastra um novo evento no calendário acadêmico. | `201 Created` |
