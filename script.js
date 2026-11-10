const appShell = document.querySelector(".app-shell");
const sessionStatus = document.getElementById("session-status");
const signOutButton = document.getElementById("sign-out");
const blogSearch = document.getElementById("blog-search-input");
const profileModal = document.getElementById("profile-modal");
const profileForm = document.getElementById("profile-form");
let tokenSessao;
let perfilAtual;
let postsRecentes = [];
let events = [];

async function iniciarAplicacao() {
  try {
    tokenSessao = lerSessao();
    if (!tokenSessao) {
      voltarAoLogin();
      return;
    }

    await carregarInicio();
    sessionStatus.hidden = true;
    appShell.hidden = false;
    if (window.location.hash.startsWith("#post-")) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  } catch (error) {
    if (error.status === 401) {
      voltarAoLogin();
      return;
    }
    console.error("Erro ao iniciar a aplicação:", error);
    mostrarErroSessao("Não foi possível carregar sua sessão. Tente novamente.");
  }
}

function voltarAoLogin() {
  if (tokenSessao) limparSessao(tokenSessao);
  tokenSessao = undefined;
  appShell.hidden = true;
  window.location.replace("login-estudante.html");
}

function mostrarErroSessao(mensagem) {
  document.getElementById("session-message").textContent = mensagem;
  document.getElementById("session-login").hidden = false;
}

function renderPerfil(usuario) {
  const profile = lerPerfilLocal();
  const nome = profile.name || usuario.nome || "Seu perfil";
  const curso = usuario.curso || "Não informado";
  document.getElementById("profile-name").textContent = nome;
  document.getElementById("nomeAluno").textContent = nome;
  document.getElementById("profile-course").textContent = curso;
  document.getElementById("profile-course-cover").textContent = curso;
  document.getElementById("profile-term").textContent = usuario.termo ?? "Não informado";
  document.getElementById("profile-description").textContent =
    profile.description || "Conte um pouco sobre você, seus interesses acadêmicos e áreas de estudo.";

  const imagem = /^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(profile.image) ? profile.image : "";
  for (const id of ["profile-avatar", "profile-avatar-top", "profile-large"]) {
    const avatar = document.getElementById(id);
    avatar.style.backgroundImage = imagem ? `url("${imagem}")` : "";
    avatar.classList.toggle("has-profile-image", Boolean(imagem));
    avatar.textContent = imagem ? "" : obterIniciais(nome);
  }
}

function lerPerfilLocal() {
  if (!perfilAtual?.id) return {};
  try {
    return JSON.parse(localStorage.getItem(`blog-academico-profile:${perfilAtual.id}`)) || {};
  } catch {
    return {};
  }
}

document.getElementById("edit-profile-btn").addEventListener("click", () => {
  if (!perfilAtual?.id) {
    showToast("Atualize o script do Supabase para editar o perfil.");
    return;
  }
  const profile = lerPerfilLocal();
  profileForm.reset();
  document.getElementById("profile-edit-name").value = profile.name || perfilAtual.nome || "";
  document.getElementById("profile-edit-description").value = profile.description || "";
  openModal(profileModal);
});

profileForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!perfilAtual?.id || !tokenSessao) return;
  const button = profileForm.querySelector(".primary-btn");
  if (button.disabled) return;

  const name = document.getElementById("profile-edit-name").value.trim();
  if (!name) {
    showToast("Digite um nome para o perfil.");
    return;
  }
  const description = document.getElementById("profile-edit-description").value.trim();
  const file = document.getElementById("profile-edit-image").files[0];
  if (file && (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 2 * 1024 * 1024)) {
    showToast("Escolha uma imagem JPG, PNG, WebP ou GIF de até 2 MB.");
    return;
  }

  button.disabled = true;
  const id = perfilAtual.id;
  const token = tokenSessao;
  try {
    let image = lerPerfilLocal().image || "";
    if (file) {
      image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    if (token !== tokenSessao) return;
    localStorage.setItem(`blog-academico-profile:${id}`, JSON.stringify({ name, description, image }));
    renderPerfil(perfilAtual);
    closeModals();
    showToast("Perfil atualizado neste navegador.");
  } catch {
    showToast("Não foi possível salvar o perfil. Tente novamente ou escolha uma imagem menor.");
  } finally {
    button.disabled = false;
  }
});

function renderEvents(eventos) {
  events = Array.isArray(eventos) ? eventos : [];
  renderEventList(events);
  renderCalendar(events);
  renderUpcoming(events);
  renderWorks(events.filter(event => event.type === "trabalho"));
}

async function carregarInicio() {
  const { perfil, publicacoes } = await consultarSupabase("inicio_academico", { token: tokenSessao });
  perfilAtual = perfil;
  postsRecentes = publicacoes;
  renderPerfil(perfil);
  renderEvents(perfil.events);
  renderPosts();
}

async function adicionarEvento(event) {
  event.preventDefault();
  if (!tokenSessao) return;

  const form = event.currentTarget;
  const button = form.querySelector(".primary-btn");
  if (button.disabled) return;
  button.disabled = true;

  const date = document.getElementById("event-date-input").value;
  const type = document.getElementById("event-type").value;
  const title = document.getElementById("event-title-input").value.trim();

  try {
    const eventos = await consultarSupabase("adicionar_evento_academico", {
      token: tokenSessao,
      novo_evento: { date, type, title }
    });
    renderEvents(eventos);
    form.reset();
    closeModals();
    showToast("Evento criado com sucesso!");
  } catch (error) {
    if (error.status === 401) {
      voltarAoLogin();
      return;
    }
    console.error("Erro ao adicionar evento:", error);
    showToast("Não foi possível adicionar o evento.");
  } finally {
    button.disabled = false;
  }
}

async function adicionarPostagem(event) {
  event.preventDefault();
  if (!tokenSessao) return;

  const form = event.currentTarget;
  const button = form.querySelector(".primary-btn");
  if (button.disabled) return;
  button.disabled = true;

  const titulo = form.elements.titulo.value.trim();
  const conteudo = form.elements.conteudo.value.trim();
  if (!titulo || !conteudo) {
    button.disabled = false;
    showToast("Preencha o título e a descrição.");
    return;
  }

  try {
    await consultarSupabase("publicar_academico", { token: tokenSessao, titulo, conteudo });
    form.reset();
    blogSearch.value = "";
    navigate("inicio");
    showToast("Publicação criada com sucesso!");
  } catch (error) {
    if (error.status === 401) {
      voltarAoLogin();
      return;
    }
    console.error("Erro ao adicionar postagem:", error);
    showToast("Não foi possível criar a publicação.");
    return;
  } finally {
    button.disabled = false;
  }

  try {
    await carregarInicio();
  } catch (error) {
    if (error.status === 401) voltarAoLogin();
    else showToast("Publicação criada. Recarregue para atualizar o feed.");
  }
}

function obterIniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(palavra => palavra[0])
    .join('')
    .toUpperCase();
}

const titles = { inicio: ["Início", "Compartilhe, organize e acompanhe sua vida acadêmica."], publicacoes: ["Publicações", "Compartilhe materiais e ideias com a turma."], trabalhos: ["Meus trabalhos", "Acompanhe suas atividades e projetos."], calendario: ["Calendário", "Provas, entregas e eventos da sua turma."], perfil: ["Perfil", "Informações pessoais e acadêmicas."] };

function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])); }
function showToast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200) }

function renderPosts() {
  const termoBusca = blogSearch.value.trim().toLocaleLowerCase("pt-BR");
  const posts = postsRecentes.filter(post => [post.titulo, post.text, post.autor]
    .some(valor => String(valor ?? "").toLocaleLowerCase("pt-BR").includes(termoBusca)));
  const vazio = document.getElementById("posts-empty");
  vazio.hidden = posts.length > 0;
  vazio.textContent = termoBusca ? "Nenhuma postagem recente corresponde à pesquisa." : "Nenhuma postagem recente.";
  const box = document.getElementById("posts-list");
  box.innerHTML = posts.map(p => {
    const nomeExibicao = p.autor || "Autor indisponível";
    const termo = p.termo;
    const initials = obterIniciais(nomeExibicao);

    return `
      <article class="post" id="post-${esc(p.id)}">
        <div class="post-top">
          <div class="avatar">${esc(initials)}</div>
          <div><strong>${esc(nomeExibicao)} </strong><small>${p.data ? esc(new Date(p.data).toLocaleDateString("pt-BR")) : ""}</small></div>
          ${termo ? `<span class="category">${esc(termo)}º termo</span>` : ""}
        </div>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.text)}</p>
        <div class="post-actions">
          <button class="action like-btn ${p.liked ? "liked" : ""}" data-id="${esc(p.id)}">♡ ${esc(p.curtidas ?? 0)} curtidas</button>
          <button class="action share-btn" data-id="${esc(p.id)}">↗ Compartilhar</button>
        </div>
      </article>`;
  }).join("");
  document.querySelectorAll(".like-btn").forEach(b => b.onclick = () => {
    const post = posts.find(p => String(p.id) === b.dataset.id);
    post.liked = !post.liked;
    post.curtidas = (post.curtidas ?? 0) + (post.liked ? 1 : -1);
    renderPosts();
  });
  document.querySelectorAll(".share-btn").forEach(button => button.onclick = async () => {
    const url = new URL(window.location.href);
    url.hash = `post-${button.dataset.id}`;
    try {
      await navigator.clipboard.writeText(url.href);
      showToast("Link da postagem copiado.");
    } catch {
      showToast("Não foi possível copiar o link.");
    }
  });
}


function renderUpcoming(events) {
  const box = document.getElementById("upcoming-events");
  box.innerHTML = events.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(0, 9).map(e => {
    const d = new Date(e.date + "T12:00:00");
    return `<div class="event-row"><div class="date-box"><b>${String(d.getDate()).padStart(2, "0")}</b><small>${d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</small></div><div><strong>${esc(e.title)}</strong><small>${e.type === "prova" ? "Avaliação" : e.type === "trabalho" ? "Entrega" : "Evento acadêmico"}</small></div></div>`
  }).join("");
}

function renderWorks(works) {
  const container = document.getElementById("work-grid");
  container.innerHTML = "";

  works.forEach(e => {
    const d = new Date(e.date + "T12:00:00");

    const item = document.createElement("div");
    item.className = "event-item";

    item.innerHTML = `<strong>${esc(e.title)}</strong><small>${d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</small><br><span class="event-tag">${e.type}</span>`;

    container.appendChild(item);
  });
}


let calendarDate = new Date(2026, 10, 1);
function renderCalendar(events) {
  const title = document.getElementById("calendar-title"), days = document.getElementById("calendar-days");
  title.textContent = calendarDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const y = calendarDate.getFullYear(), m = calendarDate.getMonth(), first = new Date(y, m, 1).getDay(), last = new Date(y, m + 1, 0).getDate(), prevLast = new Date(y, m, 0).getDate();
  let html = "";
  for (let i = 0; i < 42; i++) {
    const n = i - first + 1;
    let day = n, cls = "day";
    if (n <= 0) { day = prevLast + n; cls += " muted" } else if (n > last) { day = n - last; cls += " muted" }
    const iso = (n > 0 && n <= last) ? `${y}-${String(m + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}` : "";
    if (iso === new Date().toISOString().slice(0, 10)) cls += " today";
    if (events.some(e => e.date === iso)) cls += " selected";
    html += `<div class="${cls}"><span class="day-number">${day}</span>${events.some(e => e.date === iso) ? '<i class="dot"></i>' : ""}</div>`;
  }
  days.innerHTML = html;
}
function renderEventList(events) {
  const sorted = events.slice().sort((a, b) => a.date.localeCompare(b.date));
  document.getElementById
    ("event-list").innerHTML = sorted.map(e => { const d = new Date(e.date + "T12:00:00"); return `<div class="event-item"><strong>${esc(e.title)}</strong><small>${d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</small><br><span class="event-tag">${e.type}</span></div>` }).join("");
}

function navigate(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active-view"));
  document.getElementById("view-" + view).classList.add("active-view");
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  document.getElementById("page-title").textContent = titles[view][0];
  document.getElementById("page-subtitle").textContent = titles[view][1];
  document.getElementById("page-title").parentElement.classList.toggle("home-heading-hidden", view === "inicio");
  if (view === "calendario") renderCalendar(events);
}
document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => navigate(b.dataset.view)));

const eventModal = document.getElementById("event-modal");
function openModal(m) { m.classList.add("open") }
function closeModals() { document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open")) }
document.querySelectorAll(".close-modal").forEach(b => b.onclick = closeModals);
document.getElementById("new-event").onclick = () => openModal(eventModal);
document.getElementById("event-form").addEventListener("submit", adicionarEvento);
document.getElementById("publication-page-form").addEventListener("submit", adicionarPostagem);
document.getElementById("filter-btn").onclick = () => {
  blogSearch.value = "";
  renderPosts();
};
blogSearch.addEventListener("input", () => {
  navigate("inicio");
  renderPosts();
});


function openChat(name) { document.getElementById("chat-name").textContent = name; document.getElementById("chat-window").classList.add("open"); document.getElementById("chat-text").focus() }
document.getElementById("close-chat").onclick = () => document.getElementById("chat-window").classList.remove("open");
document.getElementById("chat-form").onsubmit = e => { e.preventDefault(); const i = document.getElementById("chat-text"), v = i.value.trim(); if (!v) return; const m = document.createElement("div"); m.className = "message sent"; m.textContent = v; document.getElementById("chat-messages").appendChild(m); i.value = ""; const box = document.getElementById("chat-messages"); box.scrollTop = box.scrollHeight; setTimeout(() => { const r = document.createElement("div"); r.className = "message received"; r.textContent = "Boa! Vou verificar e te respondo daqui a pouco 😊"; box.appendChild(r); box.scrollTop = box.scrollHeight }, 700) };

document.getElementById("prev-month").onclick = () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar(events);
};
document.getElementById("next-month").onclick = () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar(events);
};

signOutButton.onclick = async () => {
  signOutButton.disabled = true;
  try {
    await consultarSupabase("sair_academico", { token: tokenSessao });
    voltarAoLogin();
  } catch (error) {
    console.error("Erro ao sair:", error);
    showToast("Não foi possível sair. Tente novamente.");
    signOutButton.disabled = false;
  }
};

window.addEventListener("pageshow", event => {
  if (event.persisted) window.location.reload();
});
window.addEventListener("storage", event => {
  if (event.key === chaveSessao && lerSessao() !== tokenSessao) window.location.reload();
});
iniciarAplicacao();
