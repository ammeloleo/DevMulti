# 🎓 BLOG ACADÊMICO

**Plataforma web dinâmica para organização de estudos, gestão de eventos acadêmicos e publicação de conteúdos integrados com Supabase.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

> Projeto front-end responsivo integrado ao Supabase. O painel tem tema claro, com a mesma marca nas telas de acesso e no início.

---

## 📌 Sobre o Projeto

O **Blog Acadêmico** é uma solução completa para centralizar a rotina estudantil do curso de **Desenvolvimento de Software Multiplataforma (DSM)**. A aplicação reúne num só ambiente a criação de publicações da comunidade, gestão visual de entregas de trabalhos, calendário interativo de provas/eventos e consulta de perfil do aluno.

---

## 🎯 Destaques do Projeto

- ⚡ **Integração Real (BaaS):** Conexão com o Supabase para persistência e manipulação assíncrona de dados (Publicações e Eventos).
- 🎨 **Interface remodelada:** Navegação responsiva, pesquisa nas postagens recentes e seção própria para publicar.
- 📱 **Totalmente Responsivo:** Estrutura adaptável utilizando *CSS Grid* e *Flexbox* para navegação fluida em múltiplos dispositivos.

---

## ✨ Funcionalidades Principais

| Recurso | Descrição |
| :--- | :--- |
| **🏠 Início / Feed** | Feed de publicações dinâmicas dos alunos com inicialização automática de avatares, sistema de curtidas e filtro de mais recentes. |
| **📅 Calendário Interativo** | Navegação por meses com marcação visual de dias com compromissos (provas, trabalhos e eventos). |
| **📊 Meus Trabalhos** | Exibição em lista/cards das entregas e atividades pendentes filtradas por tipo. |
| **➕ Modal de Publicação** | Criação e envio de novas postagens em tempo real diretamente para a API. |
| **📌 Cadastro de Eventos** | Adição instantânea de novas provas ou prazos com atualização dinâmica da agenda. |
| **👤 Perfil do Aluno** | Nome, curso e semestre do cadastro. Nome de exibição, descrição e foto podem ser personalizados neste navegador, por conta. |

---

## 🛠️ Tecnologias e Ferramentas

| Categoria | Tecnologia / Ferramenta |
| :--- | :--- |
| **Front-end** | HTML5, CSS3 (Variáveis CSS e Dark Theme), JavaScript (ES6+ / Fetch API) |
| **Backend & Banco de Dados** | Supabase REST API (PostgreSQL) |
| **Editor / Ferramentas** | Visual Studio Code, Live Server, Git & GitHub |

---

## 📂 Estrutura do Repositório

```text
BLOG-ACADEMICO/
├── 📄 index.html      # Estrutura principal com visões SPA e modais
├── 📄 style.css        # Estilização completa, temas e responsividade
├── 📄 script.js       # Regras de negócio, manipulação do DOM e chamadas REST API
├── 🖼️ logo-blog.png    # Marca usada no painel e nas telas de acesso
├── 📁 documentos/     # Documentação técnica e configuração do Supabase
└── 📄 README.md        # Apresentação e índice da documentação
```

---

## 🔐 Configurar o login no Supabase

1. No **SQL Editor**, execute [autenticacao.sql](documentos/autenticacao.sql). Se já executou uma versão anterior, rode o arquivo atualizado para carregar o curso e habilitar a edição de perfil por conta. O script preserva os cadastros e valida o login dentro do banco.
2. Abra `login-estudante.html` ou `login-professor.html` pelo Live Server. Digite o e-mail de `email_user` e a senha já cadastrada em `HashSenha`. As duas telas abrem `index.html` com o perfil e a agenda desse cadastro.

O e-mail deve estar preenchido e identificar um único cadastro. Senhas antigas que já foram expostas devem ser trocadas antes de usar o sistema com dados reais.

## 🧪 Testes de QA

Com a configuração do Supabase aplicada, abra o app pelo Live Server e use uma conta de teste.

| Fluxo | O que testar | Resultado esperado |
| :--- | :--- | :--- |
| Login e saída | Entre com os dados da conta de teste, confira o perfil e clique em **Sair**. Tente abrir `index.html` novamente. | O perfil corresponde à conta usada. Depois da saída, o acesso direto volta ao login. |
| Publicações e pesquisa | Publique **Material de QA** e pesquise por **material** na tela inicial. | A nova publicação aparece no feed. A pesquisa encontra a postagem mesmo com diferença de maiúsculas e minúsculas. |
| Calendário | Cadastre **Entrega QA** com o tipo **Trabalho** e recarregue a página. | O evento continua na agenda e aparece em **Meus trabalhos**. |
| Perfil | Altere o nome de exibição e a descrição. Recarregue a página no mesmo navegador. | As alterações locais reaparecem para a mesma conta. |

O JavaScript passou na checagem de sintaxe e os fluxos principais passaram em uma simulação com respostas do Supabase. O [roteiro de QA](documentos/testes-qa.md) separa essas verificações dos testes que precisam ser feitos no navegador e no banco.

## 📚 Documentação

Consulte os documentos técnicos do projeto pelos atalhos abaixo:

| Documento | Conteúdo |
| :--- | :--- |
| [📄 Script SQL](documentos/scriptsql.md) | Estrutura SQL das tabelas de usuários, postagens e eventos. |
| [🗂️ Dicionário de Dados](documentos/dicionario-de-dados.md) | Campos, tipos, chaves e descrições das tabelas. |
| [🧪 Testes de QA](documentos/testes-qa.md) | Casos reproduzíveis, resultados esperados e registro das verificações executadas. |
| [🔌 API Funcional](documentos/api.md) | Endpoints REST do Supabase, parâmetros e códigos HTTP. |
| [🧩 Diagrama ER](documentos/diagrama-er.md) | Diagrama entidade-relacionamento do banco de dados. |
