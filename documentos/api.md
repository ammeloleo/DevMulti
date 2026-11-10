# API Funcional

O aplicativo envia requisições POST às funções do Supabase em `/rest/v1/rpc/`. As funções validam a sessão antes de acessar as tabelas.

| Função | Parâmetros | Retorno |
| --- | --- | --- |
| `login_academico` | `email`, `senha`, `lembrar` | Token temporário de sessão ou valor nulo. |
| `inicio_academico` | `token` | Perfil, agenda e publicações recentes. |
| `adicionar_evento_academico` | `token`, `novo_evento` com `date`, `type` e `title` | Agenda atualizada da conta. |
| `publicar_academico` | `token`, `titulo`, `conteudo` | Cria a publicação com a conta da sessão como autora. |
| `sair_academico` | `token` | Encerra a sessão. |
