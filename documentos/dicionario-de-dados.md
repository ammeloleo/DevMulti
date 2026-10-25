# Dicionário de Dados

## Tabela `usuario`

| Campo | Tipo de dado | Nulo | Chave | Descrição |
| --- | --- | --- | --- | --- |
| `id` | `BIGINT` | Não | PK | Identificador único do usuário. |
| `nome` | `VARCHAR(255)` | Não | — | Nome completo do estudante. |
| `termo` | `VARCHAR(50)` | Sim | — | Termo/semestre atual do aluno. |
| `eventos` | `JSONB` | Sim | — | Objeto JSON contendo eventos personalizados. |

## Tabela `postagens`

| Campo | Tipo de dado | Nulo | Chave | Descrição |
| --- | --- | --- | --- | --- |
| `id` | `BIGINT` | Não | PK | Identificador único da publicação. |
| `titulo` | `TEXT` | Não | — | Título do trabalho ou postagem. |
| `texto` | `TEXT` | Não | — | Conteúdo completo da publicação. |
| `data` | `TIMESTAMP` | Não | — | Data e hora de criação da postagem. |
| `curtidas` | `INTEGER` | Não | — | Número de curtidas (padrão: `0`). |
| `id_usuario` | `BIGINT` | Sim | FK | Referência ao usuário autor (`usuario.id`). |

## Tabela `eventos`

| Campo | Tipo de dado | Nulo | Chave | Descrição |
| --- | --- | --- | --- | --- |
| `id` | `BIGINT` | Não | PK | Identificador único do evento. |
| `titulo` | `VARCHAR(255)` | Não | — | Título do evento ou prova. |
| `date` | `DATE` | Não | — | Data agendada para o evento. |
| `tipo` | `VARCHAR(50)` | Não | — | Tipo: `prova`, `entrega`, `docente` ou `outro`. |
| `id_usuario` | `BIGINT` | Sim | FK | Referência ao usuário associado ao evento. |
