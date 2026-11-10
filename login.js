const loginForm = document.querySelector(".auth-form");
const loginButton = loginForm.querySelector(".submit-btn");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (loginButton.disabled) return;

  loginButton.disabled = true;
  loginMessage.textContent = "Entrando…";
  let autenticado = false;

  try {
    const email = loginForm.elements.email.value.trim();
    const senha = loginForm.elements.senha.value;
    const lembrar = loginForm.elements.lembrar.checked;
    const token = await consultarSupabase("login_academico", { email, senha, lembrar });
    if (!token) {
      loginMessage.textContent = "E-mail ou senha inválidos. Se tentou várias vezes, aguarde 15 minutos.";
      return;
    }

    guardarSessao(token, lembrar);
    autenticado = true;
    window.location.replace("index.html");
  } catch {
    loginMessage.textContent = "Não foi possível entrar. Tente novamente.";
  } finally {
    loginButton.disabled = autenticado;
  }
});

loginButton.disabled = false;
