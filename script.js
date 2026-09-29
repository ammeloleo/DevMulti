const endpointevents = "https://pfetbqauimznmfaizwpp.supabase.co/rest/v1/usuario";
const endpointpostagens = "https://pfetbqauimznmfaizwpp.supabase.co/rest/v1/postagens";
const apiKey = "sb_publishable_QWsTkETT_R8tsbNEidvnGA_OsPWleGU";
const nomeh2 = document.getElementById("welcome-title");


async function fetchUsers() {
  try {
    const resposta = await fetch(endpointevents, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      }
    })

    users = await resposta.json();
    console.log("Users:", users);
    nomeh2.innerText = `Olá, ${users[0].nome}! 👋`;
    document.getElementById("profile-name").innerText = users[0].nome;
    document.getElementById("nomeAluno").innerText = users[0].nome;
    document.getElementById("profile-avatar").innerText = obterIniciais(users[0].nome);
    document.getElementById("profile-avatar-top").innerText = obterIniciais(users[0].nome);
    document.getElementById("profile-large").innerText = obterIniciais(users[0].nome);

    return users;

  }
  catch (error) {
    console.error("Erro:", error);
  }
}
fetchUsers();
async function fetchEvents() {
  try {
    const resposta = await fetch(endpointevents, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      }
    })


    const data = await resposta.json();

    console.log("Data:", data);

    const events = data[0].events;
    const works = events.filter(event => event.type === 'trabalho');

    console.log(works);

    console.log("Eventos:", events);
    renderEventList(events);
    document.getElementById("prev-month").onclick = () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(events) };
    document.getElementById("next-month").onclick = () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(events) };
    renderCalendar(events);
    renderUpcoming(events);
    renderWorks(works);



  }
  catch (error) {
    console.error("Erro:", error);
  }
}
fetchEvents();

async function fetchPosts() {
  try {
    const resposta = await fetch(endpointpostagens, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      }
    })


    const data = await resposta.json();

    console.log("Data:", data);

    const posts = data;

    console.log("Postagens:", posts);
    const users = await fetchUsers();
    renderPosts(posts, users);

  }
  catch (error) {
    console.error("Erro:", error);
  }
}
fetchPosts();

async function adicionarEvento(event, userId) {
  event.preventDefault();

  let date = document.getElementById("event-date-input").value;
  let type = document.getElementById("event-type").value;
  let title = document.getElementById("event-title-input").value;

  const novoEvento = { date, type, title };

  const response = await fetch(`${endpointevents}?id=eq.${userId}`, {
    method: "GET",
    headers: {
      "apikey": apiKey,
      "Authorization": `Bearer ${apiKey}`
    }
  });
  const data = await response.json();
  const usuario = data[0];

  const eventsAtualizados = [...(usuario.events || []), novoEvento];

  eventModal.classList.remove("open");

  await fetch(`${endpointevents}?id=eq.${userId}`, {
    method: "PATCH",
    headers: {
      "apikey": apiKey,
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ events: eventsAtualizados })
  });
  date.value = "";
  type.value = "";
  title.value = "";
  fetchEvents();
}
function adicionarPostagem(event) {
  event.preventDefault();

  const title = document.getElementById("post-title").value;
  const texto = document.getElementById("post-description").value;

  const novaPostagem = {
    titulo: title,
    text: texto,
    data: new Date().toISOString(),
    id_usuario: 1,
    curtidas: 0
  };

  fetch(endpointpostagens, {
    method: "POST",
    headers: {
      "apikey": apiKey,
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(novaPostagem)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Postagem adicionada:", data);
      fetchPosts();
      closeModals();
      showToast("Publicação criada com sucesso!");
    })
    .catch(error => {
      console.error("Erro ao adicionar postagem:", error);
    });
}

function obterIniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .map(palavra => palavra[0])
    .join('')
    .toUpperCase();
}

const titles = { inicio: ["Início", "Compartilhe, organize e acompanhe sua vida acadêmica."], trabalhos: ["Meus trabalhos", "Acompanhe suas atividades e projetos."], calendario: ["Calendário", "Provas, entregas e eventos da sua turma."], buddies: ["Buddies", "Encontre colegas e converse sobre a faculdade."], notificacoes: ["Notificações", "Atualizações da sua comunidade."], perfil: ["Perfil", "Informações pessoais e acadêmicas."] };

function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])); }
function showToast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200) }

async function renderPosts(posts, users) {
  const box = document.getElementById("posts-list");
  box.innerHTML = [...posts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map(p => {
      const user = users.find(u => u.id === p.id_usuario);

      const nomeExibicao = user ? user.nome : "";
      const termo = user ? user.termo : "";

      const initials = obterIniciais(nomeExibicao);

      return `
      <article class="post">
        <div class="post-top">
          <div class="avatar ${p.avatar}">${esc(initials)}</div>
          <div><strong>${esc(nomeExibicao)} </strong><small>${esc(p.data)}</small></div>
          <span class="category">${esc(termo)}º termo</span>
        </div>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.text)}</p>
        <div class="post-actions">
          <button class="action like-btn ${p.liked ? "liked" : ""}" data-id="${p.id}">♡ ${p.curtidas} curtidas</button>
          <button class="action share-btn" data-id="${p.id}">↗ Compartilhar</button>
        </div>
      </article>`;
    }).join("");
  document.querySelectorAll(".like-btn").forEach(b => b.onclick = () => { const p = posts.find(x => x.id == b.dataset.id); p.liked = !p.liked; p.likes += p.liked ? 1 : -1; renderPosts() });
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
  if (view === "calendario") renderCalendar(events);
  if (view === "buddies") renderBuddies();
}
document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => navigate(b.dataset.view)));

const postModal = document.getElementById("post-modal"), eventModal = document.getElementById("event-modal");
function openModal(m) { m.classList.add("open") }
function closeModals() { document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open")) }
document.querySelectorAll(".close-modal").forEach(b => b.onclick = closeModals);
document.getElementById("focus-post").onclick = () => openModal(postModal);
document.getElementById("new-event").onclick = () => openModal(eventModal);
document.getElementById("new-work").onclick = () => showToast("Novo trabalho: formulário pronto para integração!");
document.getElementById("filter-btn").onclick = () => showToast("Publicações ordenadas pelas mais recentes.");
document.getElementById("read-notifications").onclick = () => { document.querySelectorAll(".notification").forEach(n => n.classList.remove("unread")); document.querySelector(".badge").textContent = "0"; showToast("Notificações marcadas como lidas.") };


function openChat(name) { document.getElementById("chat-name").textContent = name; document.getElementById("chat-window").classList.add("open"); document.getElementById("chat-text").focus() }
document.getElementById("close-chat").onclick = () => document.getElementById("chat-window").classList.remove("open");
document.getElementById("chat-form").onsubmit = e => { e.preventDefault(); const i = document.getElementById("chat-text"), v = i.value.trim(); if (!v) return; const m = document.createElement("div"); m.className = "message sent"; m.textContent = v; document.getElementById("chat-messages").appendChild(m); i.value = ""; const box = document.getElementById("chat-messages"); box.scrollTop = box.scrollHeight; setTimeout(() => { const r = document.createElement("div"); r.className = "message received"; r.textContent = "Boa! Vou verificar e te respondo daqui a pouco 😊"; box.appendChild(r); box.scrollTop = box.scrollHeight }, 700) };

renderPosts(); renderUpcoming(); renderWorks(); renderBuddies(); renderCalendar();
