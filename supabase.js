const supabaseUrl = "https://pfetbqauimznmfaizwpp.supabase.co";
const apiKey = "sb_publishable_QWsTkETT_R8tsbNEidvnGA_OsPWleGU";
const chaveSessao = "devmulti-sessao";

function lerSessao() {
  return sessionStorage.getItem(chaveSessao) ?? localStorage.getItem(chaveSessao);
}

function guardarSessao(token, lembrar) {
  const storage = lembrar ? localStorage : sessionStorage;
  const outroStorage = lembrar ? sessionStorage : localStorage;
  storage.setItem(chaveSessao, token);
  outroStorage.removeItem(chaveSessao);
}

function limparSessao(token) {
  for (const storage of [sessionStorage, localStorage]) {
    if (storage.getItem(chaveSessao) === token) storage.removeItem(chaveSessao);
  }
}

async function consultarSupabase(funcao, parametros) {
  const resposta = await fetch(`${supabaseUrl}/rest/v1/rpc/${funcao}`, {
    method: "POST",
    headers: {
      "apikey": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(parametros)
  });

  if (!resposta.ok) {
    const erro = new Error(`Falha na consulta ao Supabase (${resposta.status}).`);
    erro.status = resposta.status;
    throw erro;
  }

  const conteudo = await resposta.text();
  if (conteudo) return JSON.parse(conteudo);
}
