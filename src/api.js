// =====================================================================
// api.js — Cliente de API do módulo admin
// =====================================================================

const BASE_URL = import.meta.env.VITE_API_URL || "https://api.neratreinamento.com.br";

async function chamar(caminho, opcoes = {}) {
  const resp = await fetch(`${BASE_URL}${caminho}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  if (opcoes.raw) return resp; // usado no export de CSV (resposta não é JSON)
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const erro = new Error(dados.erro || "Erro na requisição.");
    erro.status = resp.status;
    throw erro;
  }
  return dados;
}

export const api = {
  // autenticação
  login: (email, senha) => chamar("/admin/login", { method: "POST", body: JSON.stringify({ email, senha }) }),
  solicitarResetSenha: (email) => chamar("/admin/solicitar-reset-senha", { method: "POST", body: JSON.stringify({ email }) }),
  redefinirSenha: (email, token, novaSenha) =>
    chamar("/admin/redefinir-senha", { method: "POST", body: JSON.stringify({ email, token, novaSenha }) }),

  // turmas
  listarTurmas: (status) => chamar(`/admin/turmas${status && status !== "todas" ? `?status=${status}` : ""}`),
  conferirLista: (linhas) => chamar("/admin/turmas/conferir", { method: "POST", body: JSON.stringify({ linhas }) }),
  criarTurma: (nome, dataEvento, participantes) =>
    chamar("/admin/turmas", { method: "POST", body: JSON.stringify({ nome, dataEvento, participantes }) }),
  ativarTurma: (id) => chamar(`/admin/turmas/${id}/ativar`, { method: "POST" }),
  encerrarTurma: (id) => chamar(`/admin/turmas/${id}/encerrar`, { method: "POST" }),

  // quiz ao vivo (condução da prova)
  quizEstadoAdmin: (turmaId) => chamar(`/admin/turmas/${turmaId}/quiz`),
  quizIniciarFase1: (turmaId) => chamar(`/admin/turmas/${turmaId}/quiz/iniciar-fase1`, { method: "POST" }),
  quizProximaPergunta: (turmaId) => chamar(`/admin/turmas/${turmaId}/quiz/proxima`, { method: "POST" }),
  quizLiberarFase2: (turmaId) => chamar(`/admin/turmas/${turmaId}/quiz/liberar-fase2`, { method: "POST" }),
  quizLiberarPodio1: (turmaId) => chamar(`/admin/turmas/${turmaId}/quiz/liberar-podio1`, { method: "POST" }),
  quizLiberarPodio2: (turmaId) => chamar(`/admin/turmas/${turmaId}/quiz/liberar-podio2`, { method: "POST" }),

  // cadastro no dia / liberação manual
  cadastroNoDia: (turmaId, nome, email, empresa, cnpj) =>
    chamar("/admin/cadastro-no-dia", { method: "POST", body: JSON.stringify({ turmaId, nome, email, empresa, cnpj }) }),
  liberarManualmente: (participanteId) =>
    chamar("/admin/liberar-manualmente", { method: "POST", body: JSON.stringify({ participanteId }) }),

  // monitoramento (só turmas ativas)
  turmasAtivas: () => chamar("/admin/turmas-ativas"),
  monitorar: (turmaId) => chamar(`/admin/monitoramento/${turmaId}`),

  // conteúdo
  listarConteudo: () => chamar("/admin/conteudo"),
  criarQuestao: (dados) => chamar("/admin/conteudo", { method: "POST", body: JSON.stringify(dados) }),
  editarQuestao: (id, dados) => chamar(`/admin/conteudo/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  criarModulo: (nome, subtitulo) => chamar("/admin/modulos", { method: "POST", body: JSON.stringify({ nome, subtitulo }) }),

  // relatório
  relatorio: (turmaId) => chamar(`/admin/relatorio/${turmaId}`),
  baixarXlsx: async (turmaId, nomeArquivo) => {
    const resp = await chamar(`/admin/relatorio/${turmaId}/xlsx`, { raw: true });
    if (!resp.ok) throw new Error("Não foi possível gerar o XLSX (verifique se você tem papel Owner).");
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo || "controle_participantes.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  },

  // gestão de acesso
  listarEquipe: () => chamar("/admin/equipe"),
  convidarAdmin: (email, papel) => chamar("/admin/equipe/convidar", { method: "POST", body: JSON.stringify({ email, papel }) }),
  removerAdmin: (id) => chamar(`/admin/equipe/${id}`, { method: "DELETE" }),
  logAuditoria: (limite = 50) => chamar(`/admin/log-auditoria?limite=${limite}`),
};
