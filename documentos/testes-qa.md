# Testes de QA do Blog Acadêmico

## Preparação

1. Aplique [autenticacao.sql](autenticacao.sql) no ambiente de teste e use dois cadastros fictícios na tabela `usuario`, com e-mails distintos e senhas de teste. Use perfis com nomes diferentes para identificar qual conta está conectada.
2. Abra `login-estudante.html` pelo Live Server. Para testar o acesso sem sessão, use uma janela anônima nova.
3. Ao registrar um resultado, anote o código do caso, o ambiente e o que apareceu na tela. Remova senhas e tokens de capturas e registros da rede.

## Login e sessão

| Caso | Passos | Resultado esperado |
| :--- | :--- | :--- |
| QA-01 · Login nas duas telas | Entre com a primeira conta em **Estudante** e confira o perfil. Saia, abra **Professor** e repita. | As duas telas abrem `index.html` com o nome, curso e termo da conta. |
| QA-02 · Senha incorreta | Informe o e-mail correto com uma senha diferente. Em um cadastro de teste isolado, use uma senha que comece com zero e repita omitindo o zero. | A página exibe **E-mail ou senha inválidos** e permite tentar novamente. A senha com o zero só funciona quando digitada por inteiro. |
| QA-03 · Limite de tentativas | Em uma conta de teste sem falhas recentes, faça cinco tentativas incorretas em sequência. Tente a senha correta antes de completar 15 minutos desde a primeira tentativa e novamente após esse período. | A tentativa correta é recusada durante o bloqueio. Depois que a janela expira, a senha correta abre o painel. |
| QA-04 · Painel protegido e saída | Abra `index.html` sem sessão. Em seguida, entre, clique em **Sair** e abra `index.html` de novo. | As duas tentativas de acesso sem sessão voltam para a tela de estudante. A saída encerra a sessão usada pelo painel. |
| QA-05 · Manter conectado | Entre marcando **Manter conectado**, feche a aba e abra o app em uma aba nova no mesmo navegador. Saia e repita com a opção desmarcada. | A aba nova mantém o acesso na primeira tentativa. Na segunda, o painel pede login novamente. |

## Publicações, calendário e perfil

| Caso | Passos | Resultado esperado |
| :--- | :--- | :--- |
| QA-06 · Publicar e recarregar | Em **Publicações**, envie o título **Material de QA** e a descrição **Revisão de JavaScript**. Volte ao início e recarregue a página. | A nova publicação aparece entre as recentes, atribuída à conta conectada. Após recarregar, ela continua no feed enquanto estiver entre as três mais recentes. |
| QA-07 · Pesquisar no feed | Com **Material de QA** no feed, pesquise por `MATERIAL` e depois por `zz-qa-sem-resultado`. Clique em **Mais recentes**. | A primeira busca encontra a postagem. A segunda mostra o aviso de que nenhuma postagem recente corresponde à busca. O botão limpa a pesquisa e volta a exibir o feed. |
| QA-08 · Agenda por conta | Em **Calendário**, adicione **Entrega QA** com tipo **Trabalho** e **Prova QA** com tipo **Prova** no mês exibido. Recarregue, confira a agenda e abra **Meus trabalhos**. Depois entre com a segunda conta. | Os dois eventos continuam na agenda da primeira conta. Só **Entrega QA** aparece em **Meus trabalhos**. A segunda conta abre a própria agenda. |
| QA-09 · Edição local por conta | No perfil da primeira conta, altere o nome de exibição e a descrição. Salve e recarregue. Depois saia e entre com a segunda conta no mesmo navegador. | As alterações reaparecem na primeira conta. A segunda conta exibe o próprio perfil. |
| QA-10 · Validação da foto | No perfil, salve uma imagem PNG de até 2 MB. Depois tente salvar uma imagem maior que 2 MB. | A primeira imagem aparece no avatar. O arquivo maior é recusado e a foto salva permanece. |

## Verificações executadas

| Verificação | Resultado | Alcance |
| :--- | :--- | :--- |
| Sintaxe de `login.js`, `supabase.js` e `script.js` | Passou com `node --check`. | Detecta erros de sintaxe nos arquivos JavaScript. |
| Execução dos scripts com respostas simuladas do Supabase | Passou em login nas duas telas, envio da senha como texto, erro de credenciais, acesso sem sessão, resposta de sessão expirada, perfil, pesquisa, envio de publicação e evento, edição local e saída. | Exercita os scripts e verifica as requisições e reações da interface em um ambiente simulado. |
| Roteiro no navegador com Supabase | Pendente. | Confirma a aplicação do SQL, as permissões, o bloqueio de tentativas, a persistência no banco e o fluxo no navegador. |
