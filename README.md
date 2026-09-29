# 🎓 BLOG ACADÊMICO

**Plataforma web dinâmica para organização de estudos, gestão de eventos acadêmicos e publicação de conteúdos integrados com Supabase.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

> **Nota:** Projeto front-end responsivo integrado via API REST com o banco de dados **Supabase**, apresentando uma interface moderna em *Dark Theme*.

---

## 📌 Sobre o Projeto

O **Blog Acadêmico** é uma solução completa para centralizar a rotina estudantil do curso de **Desenvolvimento de Software Multiplataforma (DSM)**. A aplicação reúne num só ambiente a criação de publicações da comunidade, gestão visual de entregas de trabalhos, calendário interativo de provas/eventos e consulta de perfil do aluno.

---

## 🎯 Destaques do Projeto

- ⚡ **Integração Real (BaaS):** Conexão com o Supabase para persistência e manipulação assíncrona de dados (Publicações e Eventos).
- 🌙 **Interface Dark Modern:** Layout moderno projetado em tons escuros com realce em cores sutis (`#181818` & `#709eda`).
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
| **👤 Perfil do Aluno** | Exibição automatizada dos dados cadastrais (nome, curso, semestre e iniciais do avatar). |

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
└── 📄 README.md        # Documentação do projeto
