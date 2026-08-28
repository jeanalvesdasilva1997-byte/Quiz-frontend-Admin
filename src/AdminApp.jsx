import React, { useState, useEffect } from "react";
import { api } from "./api";
import logoHabitatCebrace from "./assets/logo-habitat-cebrace.png";

const CSS = `
  :root{
    --dark:#FFFFFF; --card:#F7F6F3; --card2:#EFEDE7; --gold:#F5811E; --gold-dim:#F7973D;
    --text:#1A1A1A; --text-dim:#6B6660; --text-faint:#8A8377; --red:#ED1450; --green:#7FA66B; --line:#E3E0D9;
  }
  *{ box-sizing:border-box; }
  html,body,#root{ margin:0; padding:0; height:100%; background:var(--dark); }
  .app-shell{ font-family:Arial,Helvetica,sans-serif; color:var(--text); min-height:100vh; }
  .serif{ font-family:Arial,Helvetica,sans-serif; }
  .topbar{ display:flex; justify-content:space-between; align-items:center; padding:22px 48px; border-bottom:1px solid var(--line); }
  .brand{ display:flex; align-items:center; gap:12px; }
  .brand .mark{ height:34px; width:auto; display:block; }
  .brand .name{ font-size:15px; letter-spacing:0.02em; font-weight:700; color:var(--gold); }
  .login-wrap{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; padding:60px; text-align:center; }
  .kicker{ font-size:13px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; }
  .kicker.kicker-login{ font-size:16px; letter-spacing:0.02em; text-transform:none; }
  .login-title{ font-size:36px; font-weight:700; margin:0 0 16px; max-width:720px; line-height:1.25; }
  .login-card{ width:420px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:36px; text-align:left; }
  .flabel{ font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; display:block; }
  .finput{ width:100%; background:#F0EEE8; border:1px solid var(--line); border-radius:6px; padding:14px 15px; color:var(--text); font-size:15px; margin-bottom:18px; font-family:inherit; }
  .fbtn{ width:100%; background:var(--gold); color:#1A1A1A; border:none; border-radius:6px; padding:15px; font-weight:700; font-size:15px; cursor:pointer; }
  .fbtn:disabled{ opacity:0.5; cursor:not-allowed; }
  .fnote{ margin-top:18px; padding-top:16px; border-top:1px solid var(--line); font-size:12.5px; color:var(--text-faint); line-height:1.6; }
  .err{ color:var(--red); font-size:13px; margin-top:10px; }
  .ok-msg{ color:var(--green); font-size:13px; margin-top:10px; }
  .nav{ display:flex; gap:4px; padding:14px 40px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
  .navbtn{ font-size:13.5px; padding:11px 18px; border-radius:6px; color:var(--text-dim); background:transparent; border:none; cursor:pointer; }
  .navbtn.active{ background:rgba(245,129,30,0.12); color:var(--gold); font-weight:700; }
  .content{ padding:36px 48px; }
  .h1{ font-size:24px; font-weight:700; margin:0 0 6px; }
  .h2{ font-size:14px; color:var(--text-dim); margin:0 0 20px; }
  .row-between{ display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  table.tbl{ width:100%; border-collapse:collapse; }
  table.tbl th{ text-align:left; font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-faint); padding:12px 14px; border-bottom:1px solid var(--line); }
  table.tbl td{ padding:15px 14px; border-bottom:1px solid var(--line); font-size:14px; }
  .pill{ font-size:11px; padding:5px 13px; border-radius:20px; text-transform:uppercase; letter-spacing:0.03em; display:inline-block; }
  .pill.ativa{ background:rgba(127,166,107,0.18); color:var(--green); }
  .pill.agendada{ background:rgba(245,129,30,0.2); color:var(--gold); }
  .pill.encerrada{ background:rgba(0,0,0,0.05); color:var(--text-faint); }
  .pill.owner{ background:rgba(245,129,30,0.22); color:var(--gold); }
  .pill.operador{ background:rgba(0,0,0,0.05); color:var(--text-dim); }
  .pill.pendente{ background:rgba(245,129,30,0.15); color:var(--gold); }
  .btn{ background:var(--gold); color:#1A1A1A; border:none; border-radius:6px; padding:12px 20px; font-weight:700; font-size:14px; cursor:pointer; }
  .btn:disabled{ opacity:0.5; cursor:not-allowed; }
  .btn-ghost{ background:transparent; border:1px solid var(--line); color:var(--text-dim); border-radius:6px; padding:11px 18px; font-size:13.5px; font-weight:700; cursor:pointer; }
  .btn-owner{ background:transparent; border:1px solid var(--gold); color:var(--gold); border-radius:6px; padding:11px 18px; font-size:13.5px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:10px; }
  .filterbar{ display:flex; gap:8px; margin-bottom:22px; }
  .filterchip{ padding:9px 18px; border-radius:20px; font-size:13px; border:1px solid var(--line); color:var(--text-dim); background:transparent; cursor:pointer; }
  .filterchip.active{ background:var(--gold); color:#1A1A1A; border-color:var(--gold); font-weight:700; }
  .panel{ background:var(--card); border:1px solid var(--line); border-radius:10px; padding:24px 26px; margin-top:22px; }
  .panel.solid{ border-style:solid; }
  .panel-title{ font-size:12px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-faint); margin-bottom:14px; }
  .fieldrow{ display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px; }
  .field{ flex:1; min-width:180px; }
  .field label{ display:block; font-size:11px; color:var(--text-dim); margin-bottom:7px; text-transform:uppercase; letter-spacing:0.04em; }
  .field input, .field select, .field textarea{ width:100%; background:#F0EEE8; border:1px solid var(--line); border-radius:6px; padding:11px 13px; color:var(--text); font-size:14px; box-sizing:border-box; font-family:inherit; }
  .owner-badge{ font-size:10.5px; color:var(--gold); border:1px solid var(--gold); border-radius:20px; padding:3px 11px; letter-spacing:0.03em; text-transform:uppercase; }
  .statgrid{ display:flex; gap:14px; flex-wrap:wrap; margin-bottom:20px; }
  .statcard{ flex:1; min-width:130px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:16px 18px; }
  .statcard .v{ font-size:24px; font-weight:700; color:var(--gold); }
  .statcard .l{ font-size:10.5px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.04em; }
  .actionlink{ color:var(--gold); font-size:11.5px; cursor:pointer; }
  .actionlink.danger{ color:var(--red); }
  .toast{ position:fixed; bottom:20px; right:20px; background:var(--card2); border:1px solid var(--gold); color:var(--text); font-size:13px; padding:12px 18px; border-radius:8px; z-index:20; }
  .btn-danger{ background:var(--red); color:#fff; border:none; border-radius:6px; padding:12px 20px; font-weight:700; font-size:14px; cursor:pointer; }
  .btn-danger:disabled{ opacity:0.5; cursor:not-allowed; }
  .modal-backdrop{ position:fixed; inset:0; background:rgba(26,26,26,0.5); display:flex; align-items:center; justify-content:center; z-index:30; padding:20px; }
  .modal-card{ width:460px; max-width:100%; background:var(--dark); border:1px solid var(--line); border-radius:10px; padding:28px; }
  .modal-title{ font-size:19px; font-weight:700; margin:0 0 6px; }
  .modal-sub{ font-size:13.5px; color:var(--text-dim); margin:0 0 18px; }
  .modal-risks{ background:var(--card); border:1px solid var(--line); border-radius:8px; padding:16px 18px; margin:0 0 22px; list-style:none; }
  .modal-risks li{ font-size:13px; color:var(--text-dim); margin-bottom:10px; line-height:1.5; padding-left:18px; position:relative; }
  .modal-risks li:last-child{ margin-bottom:0; }
  .modal-risks li::before{ content:"⚠"; position:absolute; left:0; color:var(--red); }
  .modal-actions{ display:flex; gap:12px; justify-content:flex-end; }
`;

function Toast({ mensagem }) {
  if (!mensagem) return null;
  return <div className="toast">{mensagem}</div>;
}

export default function AdminApp() {
  // O front não tem roteador — o link de redefinição de senha do e-mail
  // chega como query string na raiz (?view=redefinir-senha&token=...&email=...),
  // não como um path próprio, porque isso funciona em qualquer hospedagem
  // estática sem precisar de rewrite de servidor (ver adminAuth.js).
  const [screen, setScreen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("view") === "redefinir-senha" && params.get("token") && params.get("email")
      ? "redefinir-senha"
      : "login-credenciais";
  }); // login-credenciais | esqueci-senha | redefinir-senha | app
  const [resetToken] = useState(() => new URLSearchParams(window.location.search).get("token") || "");
  const [resetEmail] = useState(() => new URLSearchParams(window.location.search).get("email") || "");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [admin, setAdmin] = useState(null); // { nome, papel }

  const [tab, setTab] = useState("turmas");
  const [toast, setToast] = useState("");

  function avisar(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErro(""); setCarregando(true);
    try {
      const dados = await api.login(loginEmail, loginSenha);
      setAdmin({ nome: dados.nome, papel: dados.papel });
      setScreen("app");
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  // ---------------- LOGIN — CREDENCIAIS ----------------
  if (screen === "login-credenciais") {
    return (
      <div className="app-shell">
        <style>{CSS}</style>
        <div className="topbar"><div className="brand"><img className="mark" src={logoHabitatCebrace} alt="Habitat by Cebrace" /><div className="name serif">Conversas de Conforto Habitat by Cebrace</div></div></div>
        <div className="login-wrap">
          <div className="kicker kicker-login">Painel administrativo</div>
          <h1 className="login-title serif">Gerenciamento de Usuários do Treinamento</h1>
          <div className="login-card">
            <form onSubmit={handleLogin}>
              <span className="flabel">E-mail</span>
              <input className="finput" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <span className="flabel">Senha</span>
              <input className="finput" type="password" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} />
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Entrando..." : "Entrar"}</button>
              {erro && <div className="err">{erro}</div>}
              <div className="fnote">
                3 tentativas de senha antes do bloqueio — depois, redefinição via e-mail do próprio admin.
                <br />
                <button
                  type="button"
                  onClick={() => { setErro(""); setScreen("esqueci-senha"); }}
                  style={{ background: "none", border: "none", padding: 0, marginTop: 8, color: "var(--gold)", cursor: "pointer", font: "inherit" }}
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ESQUECI MINHA SENHA — SOLICITAR ----------------
  if (screen === "esqueci-senha") {
    return <TelaEsqueciSenha voltar={() => setScreen("login-credenciais")} />;
  }

  // ---------------- REDEFINIR SENHA (link do e-mail) ----------------
  if (screen === "redefinir-senha") {
    return (
      <TelaRedefinirSenha
        email={resetEmail}
        token={resetToken}
        aoConcluir={() => { window.history.replaceState(null, "", window.location.pathname); setScreen("login-credenciais"); }}
      />
    );
  }

  const tabs = [
    { key: "turmas", label: "Turmas" },
    { key: "quiz", label: "Condução da Prova" },
    { key: "monitoramento", label: "Monitoramento" },
    { key: "cadastro", label: "Cadastro no dia" },
    { key: "conteudo", label: "Conteúdo" },
    { key: "relatorio", label: "Relatório" },
    ...(admin.papel === "owner" ? [{ key: "acesso", label: "Gestão de acesso" }] : []),
  ];

  return (
    <div className="app-shell">
      <style>{CSS}</style>
      <div className="topbar">
        <div className="brand"><img className="mark" src={logoHabitatCebrace} alt="Habitat by Cebrace" /><div className="name serif">Conversas de Conforto Habitat by Cebrace</div></div>
        <div style={{ color: "var(--text-dim)", fontSize: 13 }}>{admin.nome} · {admin.papel === "owner" ? "Owner" : "Operador"}</div>
      </div>
      <div className="nav">
        {tabs.map((t) => <button key={t.key} className={"navbtn" + (tab === t.key ? " active" : "")} onClick={() => setTab(t.key)}>{t.label}</button>)}
      </div>

      {tab === "turmas" && <TelaTurmas avisar={avisar} />}
      {tab === "quiz" && <TelaQuizAoVivo avisar={avisar} />}
      {tab === "monitoramento" && <TelaMonitoramento />}
      {tab === "cadastro" && <TelaCadastroNoDia avisar={avisar} />}
      {tab === "conteudo" && <TelaConteudo avisar={avisar} />}
      {tab === "relatorio" && <TelaRelatorio admin={admin} avisar={avisar} />}
      {tab === "acesso" && admin.papel === "owner" && <TelaAcesso admin={admin} avisar={avisar} />}

      <Toast mensagem={toast} />
    </div>
  );
}

// =====================================================================
// ESQUECI MINHA SENHA — solicita o link de redefinição
// =====================================================================
function TelaEsqueciSenha({ voltar }) {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSolicitar(e) {
    e.preventDefault();
    setErro(""); setCarregando(true);
    try {
      await api.solicitarResetSenha(email);
      setEnviado(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="app-shell">
      <style>{CSS}</style>
      <div className="topbar"><div className="brand"><img className="mark" src={logoHabitatCebrace} alt="Habitat by Cebrace" /><div className="name serif">Conversas de Conforto Habitat by Cebrace</div></div></div>
      <div className="login-wrap">
        <div className="kicker kicker-login">Esqueci minha senha</div>
        <h1 className="login-title serif">Redefinir senha de acesso</h1>
        <div className="login-card">
          {enviado ? (
            <div>
              <div className="ok-msg" style={{ marginBottom: 18 }}>Se o e-mail existir, um link de redefinição foi enviado. Confira sua caixa de entrada.</div>
              <button className="fbtn" onClick={voltar}>Voltar ao login</button>
            </div>
          ) : (
            <form onSubmit={handleSolicitar}>
              <span className="flabel">E-mail</span>
              <input className="finput" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Enviando..." : "Enviar link de redefinição"}</button>
              {erro && <div className="err">{erro}</div>}
              <div className="fnote">
                <button type="button" onClick={voltar} style={{ background: "none", border: "none", padding: 0, color: "var(--gold)", cursor: "pointer", font: "inherit" }}>
                  Voltar ao login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// REDEFINIR SENHA — chegada pelo link do e-mail (token + e-mail na URL)
// =====================================================================
function TelaRedefinirSenha({ email, token, aoConcluir }) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleRedefinir(e) {
    e.preventDefault();
    setErro("");
    if (novaSenha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }
    if (novaSenha !== confirmarSenha) { setErro("As senhas não coincidem."); return; }
    setCarregando(true);
    try {
      await api.redefinirSenha(email, token, novaSenha);
      aoConcluir();
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="app-shell">
      <style>{CSS}</style>
      <div className="topbar"><div className="brand"><img className="mark" src={logoHabitatCebrace} alt="Habitat by Cebrace" /><div className="name serif">Conversas de Conforto Habitat by Cebrace</div></div></div>
      <div className="login-wrap">
        <div className="kicker kicker-login">Redefinir senha</div>
        <h1 className="login-title serif">Defina uma nova senha</h1>
        <p className="login-sub login-sub-sm">Para <b style={{ color: "var(--text)" }}>{email}</b>.</p>
        <div className="login-card">
          <form onSubmit={handleRedefinir}>
            <span className="flabel">Nova senha</span>
            <input className="finput" type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Mínimo 6 caracteres" />
            <span className="flabel">Confirmar senha</span>
            <input className="finput" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
            <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Salvando..." : "Redefinir senha"}</button>
            {erro && <div className="err">{erro}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// TURMAS — com filtro por status
// =====================================================================
function TelaTurmas({ avisar }) {
  const [filtro, setFiltro] = useState("todas");
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [nome, setNome] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [campoNome, setCampoNome] = useState("");
  const [campoEmail, setCampoEmail] = useState("");
  const [campoEmpresa, setCampoEmpresa] = useState("");
  const [campoCnpj, setCampoCnpj] = useState("");
  const [conferencia, setConferencia] = useState(null);
  const [turmaParaAtivar, setTurmaParaAtivar] = useState(null);
  const [ativando, setAtivando] = useState(false);
  const [turmaParaEncerrar, setTurmaParaEncerrar] = useState(null);
  const [encerrando, setEncerrando] = useState(false);

  // Busca a lista completa uma única vez — as abas de status filtram no
  // próprio navegador, sem nova ida ao servidor a cada clique. Antes,
  // cada troca de aba disparava uma requisição nova (e a latência até o
  // banco deixava a troca visivelmente lenta, além de abrir espaço para
  // respostas chegarem fora de ordem e mostrarem o filtro errado).
  async function carregar() {
    setCarregando(true);
    try {
      const { turmas } = await api.listarTurmas("todas");
      setTurmas(turmas);
    } catch (err) {
      avisar(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, []);

  const turmasFiltradas = filtro === "todas" ? turmas : turmas.filter((t) => t.status === filtro);

  function handleAdicionarParticipante() {
    if (!campoNome.trim() || !campoEmail.trim()) { avisar("Informe nome e e-mail do participante."); return; }
    setParticipantes([...participantes, { nome: campoNome.trim(), email: campoEmail.trim(), empresa: campoEmpresa.trim(), cnpj: campoCnpj.trim() }]);
    setCampoNome(""); setCampoEmail(""); setCampoEmpresa(""); setCampoCnpj("");
  }

  function handleRemoverParticipante(index) {
    setParticipantes(participantes.filter((_, i) => i !== index));
  }

  async function handleConferir() {
    try {
      const { validos, erros } = await api.conferirLista(participantes);
      setConferencia({ validos, erros });
    } catch (err) {
      avisar(err.message);
    }
  }

  async function handleConfirmar() {
    try {
      await api.criarTurma(nome, dataEvento, conferencia.validos);
      avisar(`Turma "${nome}" criada com ${conferencia.validos.length} participantes.`);
      setConferencia(null); setParticipantes([]); setNome(""); setDataEvento("");
      carregar();
    } catch (err) {
      avisar(err.message);
    }
  }

  async function handleAtivar(turma) {
    setAtivando(true);
    try {
      await api.ativarTurma(turma.id);
      avisar(`Turma "${turma.nome}" ativada — participantes já podem acessar.`);
      setTurmaParaAtivar(null);
      carregar();
    } catch (err) {
      avisar(err.message);
    } finally {
      setAtivando(false);
    }
  }

  async function handleEncerrar(turma) {
    setEncerrando(true);
    try {
      await api.encerrarTurma(turma.id);
      avisar(`Turma "${turma.nome}" encerrada — pódio liberado para os participantes.`);
      setTurmaParaEncerrar(null);
      carregar();
    } catch (err) {
      avisar(err.message);
    } finally {
      setEncerrando(false);
    }
  }

  return (
    <>
    <div className="content">
      <div className="row-between"><div><div className="h1 serif">Turmas</div><div className="h2">{turmasFiltradas.length} turmas nesta visão</div></div></div>
      <div className="filterbar">
        {["todas", "ativa", "agendada", "encerrada"].map((f) => (
          <button key={f} className={"filterchip" + (filtro === f ? " active" : "")} onClick={() => setFiltro(f)}>
            {f === "todas" ? "Todas" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {carregando ? <div style={{ color: "var(--text-faint)" }}>Carregando...</div> : (
        <table className="tbl">
          <thead><tr><th>Turma</th><th>Data</th><th>Empresas</th><th>Participantes</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {turmasFiltradas.map((t) => (
              <tr key={t.id}>
                <td>{t.nome}</td><td>{new Date(t.data_evento).toLocaleDateString("pt-BR")}</td>
                <td>{t.empresas}</td><td>{t.participantes}</td>
                <td><span className={"pill " + t.status}>{t.status}</span></td>
                <td>
                  {t.status === "agendada" && <button className="btn-ghost" onClick={() => setTurmaParaAtivar(t)}>Ativar</button>}
                  {t.status === "ativa" && <button className="btn-ghost" onClick={() => setTurmaParaEncerrar(t)}>Encerrar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="panel">
        <div className="panel-title">Nova turma — upload da lista de participantes</div>
        <div className="fieldrow">
          <div className="field"><label>Nome da turma</label><input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Turma 05" /></div>
          <div className="field"><label>Data do evento</label><input type="date" value={dataEvento} onChange={(e) => setDataEvento(e.target.value)} /></div>
        </div>
        <div className="fieldrow">
          <div className="field"><label>Nome</label><input value={campoNome} onChange={(e) => setCampoNome(e.target.value)} /></div>
          <div className="field"><label>E-mail</label><input value={campoEmail} onChange={(e) => setCampoEmail(e.target.value)} /></div>
        </div>
        <div className="fieldrow">
          <div className="field"><label>Empresa</label><input value={campoEmpresa} onChange={(e) => setCampoEmpresa(e.target.value)} /></div>
          <div className="field"><label>CNPJ (se houver)</label><input value={campoCnpj} onChange={(e) => setCampoCnpj(e.target.value)} placeholder="00.000.000/0000-00" /></div>
        </div>
        <button className="btn-ghost" onClick={handleAdicionarParticipante}>Adicionar participante</button>

        {participantes.length > 0 && (
          <table className="tbl" style={{ marginTop: 14 }}>
            <thead><tr><th>Nome</th><th>E-mail</th><th>Empresa</th><th>CNPJ</th><th></th></tr></thead>
            <tbody>
              {participantes.map((p, i) => (
                <tr key={i}>
                  <td>{p.nome}</td><td>{p.email}</td><td>{p.empresa}</td><td>{p.cnpj}</td>
                  <td><button className="btn-ghost" onClick={() => handleRemoverParticipante(i)}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="btn-ghost" style={{ marginTop: 14 }} disabled={participantes.length === 0} onClick={handleConferir}>Conferir lista</button>

        {conferencia && (
          <div style={{ marginTop: 14 }}>
            <table className="tbl">
              <thead><tr><th>Nome</th><th>E-mail</th><th>Empresa</th><th>Status</th></tr></thead>
              <tbody>
                {conferencia.validos.map((v, i) => <tr key={"v" + i}><td>{v.nome}</td><td>{v.email}</td><td>{v.empresa}</td><td><span className="pill ativa">válido</span></td></tr>)}
                {conferencia.erros.map((er, i) => <tr key={"e" + i}><td>{er.nome}</td><td>{er.email}</td><td>—</td><td><span className="pill" style={{ background: "rgba(237,20,80,0.15)", color: "var(--red)" }}>{er.motivo}</span></td></tr>)}
              </tbody>
            </table>
            <button className="btn" style={{ marginTop: 10 }} disabled={conferencia.validos.length === 0} onClick={handleConfirmar}>
              Confirmar turma ({conferencia.validos.length} válidos)
            </button>
          </div>
        )}
      </div>
    </div>

    {turmaParaAtivar && (
      <div className="modal-backdrop" onClick={() => !ativando && setTurmaParaAtivar(null)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title serif">Ativar "{turmaParaAtivar.nome}"?</div>
          <div className="modal-sub">Antes de confirmar, veja o que acontece:</div>
          <ul className="modal-risks">
            <li>A janela de acesso dos participantes começa a contar agora e vale por 24 horas.</li>
            <li>A turma passa a aparecer em Monitoramento e em Condução da Prova, pronta pra iniciar a Fase 1.</li>
            <li>Os participantes já cadastrados na lista conseguem entrar a partir de agora.</li>
          </ul>
          <div className="modal-actions">
            <button className="btn-ghost" disabled={ativando} onClick={() => setTurmaParaAtivar(null)}>Cancelar</button>
            <button className="btn" disabled={ativando} onClick={() => handleAtivar(turmaParaAtivar)}>
              {ativando ? "Ativando..." : "Ativar turma"}
            </button>
          </div>
        </div>
      </div>
    )}

    {turmaParaEncerrar && (
      <div className="modal-backdrop" onClick={() => !encerrando && setTurmaParaEncerrar(null)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title serif">Encerrar "{turmaParaEncerrar.nome}"?</div>
          <div className="modal-sub">O treinamento ainda está em andamento para esta turma. Antes de confirmar, veja o que acontece:</div>
          <ul className="modal-risks">
            <li>A turma sai da lista de turmas ativas — você não consegue mais conduzir o quiz ao vivo (iniciar fases, avançar perguntas) nem os participantes respondem mais perguntas.</li>
            <li>Os participantes continuam conseguindo entrar (ou voltar a entrar) na plataforma pra ver o pódio final, mas só pelas próximas 12 horas — depois disso o acesso se encerra de vez.</li>
            <li>Essa ação não pode ser desfeita pela tela — a turma não volta a ficar Ativa.</li>
          </ul>
          <div className="modal-actions">
            <button className="btn-ghost" disabled={encerrando} onClick={() => setTurmaParaEncerrar(null)}>Cancelar</button>
            <button className="btn-danger" disabled={encerrando} onClick={() => handleEncerrar(turmaParaEncerrar)}>
              {encerrando ? "Encerrando..." : "Prosseguir com o encerramento"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

// =====================================================================
// MONITORAMENTO — só turmas ativas
// =====================================================================
function formatarStatus(status) {
  const semUnderscore = status.replace(/_/g, " ");
  return semUnderscore.charAt(0).toUpperCase() + semUnderscore.slice(1);
}

function TelaMonitoramento() {
  const [turmasAtivas, setTurmasAtivas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [dados, setDados] = useState(null);

  useEffect(() => {
    api.turmasAtivas().then((r) => {
      setTurmasAtivas(r.turmas);
      if (r.turmas.length > 0) setTurmaId(r.turmas[0].id);
    });
  }, []);

  useEffect(() => {
    if (!turmaId) return;
    let ativo = true;
    async function consultar() {
      try {
        const r = await api.monitorar(turmaId);
        if (ativo) setDados(r);
      } catch { /* silencioso — próximo ciclo tenta de novo */ }
    }
    consultar();
    const intervalo = setInterval(consultar, 4000); // Atualiza a cada 4s
    return () => { ativo = false; clearInterval(intervalo); };
  }, [turmaId]);

  return (
    <div className="content">
      <div className="row-between">
        <div><div className="h1 serif">Monitoramento</div><div className="h2">Atualiza a cada 4s</div></div>
        <select className="finput" style={{ width: 240, margin: 0 }} value={turmaId} onChange={(e) => setTurmaId(e.target.value)}>
          {turmasAtivas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </div>
      <div className="h2" style={{ marginTop: -12 }}>Somente turmas com status Ativa aparecem nesta lista.</div>

      {!dados ? <div style={{ color: "var(--text-faint)" }}>Carregando...</div> : (
        <table className="tbl">
          <thead><tr><th>Participante</th><th>Empresa</th><th>Origem</th><th>Fase 1</th><th>Fase 2</th><th>Streak</th><th>Status</th></tr></thead>
          <tbody>
            {dados.participantes.map((p, i) => (
              <tr key={i}>
                <td>{p.nome}</td><td>{p.empresa || "—"}</td>
                <td>{p.origem === "no_dia" ? <span className="pill agendada">No dia</span> : "Lista"}</td>
                <td>{p.xpFase1}</td><td>{p.xpFase2}</td>
                <td>{p.melhorStreak}</td>
                <td>{formatarStatus(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// =====================================================================
// CONDUÇÃO DA PROVA — quiz ao vivo (Fase 1 durante a apresentação,
// Fase 2 depois, liberada manualmente pelo admin/tutor)
// =====================================================================
function TelaQuizAoVivo({ avisar }) {
  const [turmasAtivas, setTurmasAtivas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [dados, setDados] = useState(null);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    api.turmasAtivas().then((r) => {
      setTurmasAtivas(r.turmas);
      if (r.turmas.length > 0) setTurmaId(r.turmas[0].id);
    });
  }, []);

  useEffect(() => {
    if (!turmaId) return;
    let ativo = true;
    async function consultar() {
      try {
        const r = await api.quizEstadoAdmin(turmaId);
        if (ativo) setDados(r);
      } catch { /* silencioso — próximo ciclo tenta de novo */ }
    }
    consultar();
    const intervalo = setInterval(consultar, 2500);
    return () => { ativo = false; clearInterval(intervalo); };
  }, [turmaId]);

  async function executar(acao) {
    setProcessando(true);
    try {
      await acao(turmaId);
      const r = await api.quizEstadoAdmin(turmaId);
      setDados(r);
    } catch (err) {
      avisar(err.message);
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="content">
      <div className="row-between">
        <div><div className="h1 serif">Condução da Prova</div><div className="h2">Atualiza a cada 2.5s</div></div>
        <select className="finput" style={{ width: 240, margin: 0 }} value={turmaId} onChange={(e) => { setTurmaId(e.target.value); setDados(null); }}>
          {turmasAtivas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </div>
      <div className="h2" style={{ marginTop: -12 }}>Somente turmas com status Ativa aparecem nesta lista.</div>

      {!dados ? <div style={{ color: "var(--text-faint)" }}>Carregando...</div> : (
        <>
          <div className="statgrid">
            <div className="statcard"><div className="v">{dados.fase === 0 ? "—" : dados.fase}</div><div className="l">Fase atual</div></div>
            <div className="statcard"><div className="v">{dados.indiceAtual != null ? dados.indiceAtual + 1 : "—"}/{dados.totalPerguntas}</div><div className="l">Pergunta</div></div>
            <div className="statcard"><div className="v">{dados.responderam}/{dados.totalParticipantes}</div><div className="l">Responderam</div></div>
            <div className="statcard"><div className="v">{dados.corretas}</div><div className="l">Acertaram</div></div>
          </div>

          <div className="panel">
            <div className="panel-title">Estado do quiz</div>
            {dados.quizEstado === "aguardando" && (
              <>
                <div style={{ marginBottom: 16 }}>A turma ainda não começou a Fase 1. Inicie quando o tutor estiver pronto para conduzir a primeira pergunta.</div>
                <button className="btn" disabled={processando} onClick={() => executar(api.quizIniciarFase1)}>
                  {processando ? "Iniciando..." : "Iniciar Fase 1"}
                </button>
              </>
            )}

            {dados.quizEstado === "pergunta_ativa" && dados.questaoAtual && (
              <>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-faint)", marginBottom: 8 }}>
                  {dados.questaoAtual.topico}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{dados.questaoAtual.pergunta}</div>
                {dados.questaoAtual.alternativas.map((alt, i) => (
                  <div key={i} style={{ fontSize: 13.5, padding: "8px 0", color: i === dados.questaoAtual.correta ? "var(--green)" : "var(--text-dim)", fontWeight: i === dados.questaoAtual.correta ? 700 : 400 }}>
                    {String.fromCharCode(65 + i)}. {alt}{i === dados.questaoAtual.correta ? " — correta" : ""}
                  </div>
                ))}
                <button className="btn" style={{ marginTop: 14 }} disabled={processando} onClick={() => executar(api.quizProximaPergunta)}>
                  {processando ? "Avançando..." : "Próxima pergunta"}
                </button>
              </>
            )}

            {dados.quizEstado === "fase1_concluida" && (
              <>
                <div style={{ marginBottom: 16 }}>
                  A Fase 1 terminou. {dados.podio1Liberado
                    ? "O pódio da Fase 1 já foi liberado para os participantes."
                    : "Os participantes veem só a pontuação individual até você liberar o pódio."}
                  {" "}Libere a Fase 2 depois que o tutor concluir a apresentação do conteúdo.
                </div>
                {!dados.podio1Liberado && (
                  <button className="btn-ghost" style={{ marginRight: 10 }} disabled={processando} onClick={() => executar(api.quizLiberarPodio1)}>
                    {processando ? "Liberando..." : "Liberar pódio da Fase 1"}
                  </button>
                )}
                <button className="btn" disabled={processando} onClick={() => executar(api.quizLiberarFase2)}>
                  {processando ? "Liberando..." : "Liberar Fase 2"}
                </button>
              </>
            )}

            {dados.quizEstado === "fase2_concluida" && (
              <>
                <div style={{ marginBottom: 16 }}>
                  A Fase 2 terminou. {dados.podio2Liberado
                    ? "O pódio final já foi liberado para os participantes."
                    : "Os participantes veem só a pontuação individual até você liberar o pódio final."}
                </div>
                {!dados.podio2Liberado && (
                  <button className="btn" disabled={processando} onClick={() => executar(api.quizLiberarPodio2)}>
                    {processando ? "Liberando..." : "Liberar pódio final"}
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// =====================================================================
// CADASTRO NO DIA — com seletor de turma
// =====================================================================
function TelaCadastroNoDia({ avisar }) {
  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.listarTurmas("todas").then((r) => {
      const disponiveis = r.turmas.filter((t) => t.status !== "encerrada");
      setTurmas(disponiveis);
      if (disponiveis.length > 0) setTurmaId(disponiveis[0].id);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!turmaId) { setErro("Selecione a turma."); return; }
    try {
      await api.cadastroNoDia(turmaId, nome, email, empresa, cnpj);
      avisar(`${nome} adicionado. Já pode fazer login com esse e-mail.`);
      setNome(""); setEmail(""); setEmpresa(""); setCnpj("");
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="content">
      <div className="h1 serif">Cadastro no dia</div>
      <div className="h2">Selecione a turma antes de adicionar o participante</div>
      <form className="panel solid" onSubmit={handleSubmit}>
        <div className="fieldrow">
          <div className="field">
            <label>Turma</label>
            <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)}>
              {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome} ({t.status})</option>)}
            </select>
          </div>
          <div className="field"><label>Nome</label><input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
          <div className="field"><label>E-mail</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        </div>
        <div className="fieldrow">
          <div className="field"><label>Empresa</label><input value={empresa} onChange={(e) => setEmpresa(e.target.value)} /></div>
          <div className="field"><label>CNPJ (se houver)</label><input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" /></div>
        </div>
        <button className="btn" type="submit">Adicionar e enviar código</button>
        {erro && <div className="err">{erro}</div>}
      </form>
    </div>
  );
}

// =====================================================================
// CONTEÚDO — listar, criar e editar questões
// =====================================================================
function TelaConteudo({ avisar }) {
  const [questoes, setQuestoes] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [bloqueado, setBloqueado] = useState(false);
  const [criando, setCriando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [rascunho, setRascunho] = useState({});
  const [criandoModulo, setCriandoModulo] = useState(false);
  const [rascunhoModulo, setRascunhoModulo] = useState({ nome: "", subtitulo: "" });

  async function carregar() {
    const r = await api.listarConteudo();
    setQuestoes(r.questoes);
    setModulos(r.modulos);
    setBloqueado(r.bloqueadoParaEdicao);
  }
  useEffect(() => { carregar(); }, []);

  function novoRascunho() {
    return { moduloId: modulos[0]?.id, topico: "", pergunta: "", cenario: "", alternativas: ["", "", "", ""], correta: 0, explicacao: "" };
  }

  async function salvarNova() {
    try {
      await api.criarQuestao(rascunho);
      avisar("Questão criada.");
      setCriando(false);
      carregar();
    } catch (err) {
      avisar(err.message);
    }
  }

  async function salvarEdicao(id) {
    try {
      await api.editarQuestao(id, rascunho);
      avisar("Questão atualizada.");
      setEditandoId(null);
      carregar();
    } catch (err) {
      avisar(err.message);
    }
  }

  async function salvarNovoModulo() {
    try {
      await api.criarModulo(rascunhoModulo.nome, rascunhoModulo.subtitulo);
      avisar("Módulo criado.");
      setCriandoModulo(false);
      setRascunhoModulo({ nome: "", subtitulo: "" });
      carregar();
    } catch (err) {
      avisar(err.message);
    }
  }

  const porModulo = {};
  modulos.forEach((m) => { porModulo[m.id] = []; });
  questoes.forEach((q) => porModulo[q.modulo_id]?.push(q));

  return (
    <div className="content">
      <div className="row-between">
        <div><div className="h1 serif">Conteúdo dos módulos</div><div className="h2">{bloqueado ? "Edição bloqueada: existe turma com status Ativa" : "Criação e edição liberadas — sem turma ativa no momento"}</div></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" disabled={bloqueado} onClick={() => setCriandoModulo(true)}>+ Novo módulo</button>
          <button className="btn" disabled={bloqueado} onClick={() => { setRascunho(novoRascunho()); setCriando(true); }}>+ Nova questão</button>
        </div>
      </div>

      {criandoModulo && (
        <div className="panel solid" style={{ marginTop: 16, marginBottom: 16 }}>
          <div className="fieldrow">
            <div className="field"><label>Nome do módulo</label><input value={rascunhoModulo.nome} onChange={(e) => setRascunhoModulo({ ...rascunhoModulo, nome: e.target.value })} /></div>
            <div className="field"><label>Subtítulo (opcional)</label><input value={rascunhoModulo.subtitulo} onChange={(e) => setRascunhoModulo({ ...rascunhoModulo, subtitulo: e.target.value })} /></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={salvarNovoModulo}>Salvar módulo</button>
            <button className="btn-ghost" onClick={() => { setCriandoModulo(false); setRascunhoModulo({ nome: "", subtitulo: "" }); }}>Cancelar</button>
          </div>
        </div>
      )}

      {criando && (
        <FormularioQuestao rascunho={rascunho} setRascunho={setRascunho} onSalvar={salvarNova} onCancelar={() => setCriando(false)} modulos={modulos} />
      )}

      {modulos.map((m) => (
        <div key={m.id} style={{ marginBottom: 20 }}>
          <div className="panel-title">Módulo {m.id} — {m.nome}</div>
          {porModulo[m.id].map((q) => (
            <div key={q.id} className="panel" style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 6 }}>{q.topico}</div>
              {editandoId === q.id ? (
                <FormularioQuestao rascunho={rascunho} setRascunho={setRascunho} onSalvar={() => salvarEdicao(q.id)} onCancelar={() => setEditandoId(null)} edicao />
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontSize: 13 }}>{q.pergunta}</div>
                  {!bloqueado && (
                    <span className="actionlink" onClick={() => {
                      setRascunho({ moduloId: q.modulo_id, topico: q.topico, pergunta: q.pergunta, cenario: q.cenario || "", alternativas: q.alternativas, correta: q.correta, explicacao: q.explicacao || "" });
                      setEditandoId(q.id);
                    }}>editar</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function FormularioQuestao({ rascunho, setRascunho, onSalvar, onCancelar, edicao, modulos = [] }) {
  function atualizarAlt(i, valor) {
    const novas = [...rascunho.alternativas];
    novas[i] = valor;
    setRascunho({ ...rascunho, alternativas: novas });
  }
  return (
    <div className="panel solid" style={{ marginTop: edicao ? 0 : 16 }}>
      <div className="fieldrow">
        {!edicao && (
          <div className="field"><label>Módulo</label>
            <select value={rascunho.moduloId} onChange={(e) => setRascunho({ ...rascunho, moduloId: Number(e.target.value) })}>
              {modulos.map((m) => <option key={m.id} value={m.id}>{m.id} — {m.nome}</option>)}
            </select>
          </div>
        )}
        <div className="field"><label>Tópico</label><input value={rascunho.topico} onChange={(e) => setRascunho({ ...rascunho, topico: e.target.value })} /></div>
      </div>
      <div className="field" style={{ marginBottom: 16 }}><label>Cenário (opcional)</label><textarea rows={2} value={rascunho.cenario} onChange={(e) => setRascunho({ ...rascunho, cenario: e.target.value })} /></div>
      <div className="field" style={{ marginBottom: 16 }}><label>Pergunta</label><textarea rows={2} value={rascunho.pergunta} onChange={(e) => setRascunho({ ...rascunho, pergunta: e.target.value })} /></div>
      {rascunho.alternativas.map((alt, i) => (
        <div className="fieldrow" key={i} style={{ alignItems: "center" }}>
          <div className="field" style={{ flex: "0 0 40px" }}>
            <input type="radio" checked={rascunho.correta === i} onChange={() => setRascunho({ ...rascunho, correta: i })} />
          </div>
          <div className="field"><input value={alt} onChange={(e) => atualizarAlt(i, e.target.value)} placeholder={`Alternativa ${i + 1}`} /></div>
        </div>
      ))}
      <div className="field" style={{ marginBottom: 16 }}><label>Explicação (exibida se o participante errar)</label><textarea rows={2} value={rascunho.explicacao} onChange={(e) => setRascunho({ ...rascunho, explicacao: e.target.value })} /></div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn" onClick={onSalvar}>Salvar</button>
        <button className="btn-ghost" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}

// =====================================================================
// RELATÓRIO — CSV completo, Owner-only
// =====================================================================
function TelaRelatorio({ admin, avisar }) {
  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [relatorio, setRelatorio] = useState(null);

  useEffect(() => { api.listarTurmas("todas").then((r) => { setTurmas(r.turmas); if (r.turmas.length) setTurmaId(r.turmas[0].id); }); }, []);

  async function gerar() {
    try {
      const r = await api.relatorio(turmaId);
      setRelatorio(r);
    } catch (err) {
      avisar(err.message);
    }
  }

  async function exportarXlsx() {
    try {
      await api.baixarXlsx(turmaId, `controle_${relatorio.turma.replace(/\s+/g, "_")}.xlsx`);
    } catch (err) {
      avisar(err.message);
    }
  }

  return (
    <div className="content">
      <div className="row-between">
        <div><div className="h1 serif">Relatório</div><div className="h2">Encerramento e exportação de dados</div></div>
        <select className="finput" style={{ width: 240, margin: 0 }} value={turmaId} onChange={(e) => { setTurmaId(e.target.value); setRelatorio(null); }}>
          {turmas.map((t) => {
            const sinal = t.status === "ativa" ? "🟢" : t.status === "agendada" ? "🟠" : "⚪";
            return <option key={t.id} value={t.id}>{sinal} {t.nome} — {formatarStatus(t.status)}</option>;
          })}
        </select>
      </div>

      {!relatorio ? (
        <button className="btn" onClick={gerar}>Gerar relatório</button>
      ) : (
        <>
          <div className="row-between">
            <div />
            {admin.papel === "owner" ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-owner" onClick={exportarXlsx}>
                  Exportar controle (XLSX) <span className="owner-badge">Owner</span>
                </button>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Exportação disponível apenas para Owner.</div>
            )}
          </div>
          <div className="statgrid">
            <div className="statcard"><div className="v">{relatorio.total}</div><div className="l">Participantes</div></div>
            <div className="statcard"><div className="v">{relatorio.concluiram}</div><div className="l">Concluíram</div></div>
            <div className="statcard"><div className="v">{relatorio.taxa}%</div><div className="l">Taxa de conclusão</div></div>
          </div>
          <div className="h2">A exportação inclui todos os {relatorio.total} participantes (nome, e-mail, empresa, status, ranking, pontuação) — a tabela abaixo mostra só o pódio, como prévia. O XLSX vem formatado, com cores e destaque do pódio.</div>
          <table className="tbl">
            <thead><tr><th>#</th><th>Nome</th><th>Empresa</th><th>Fase 1</th><th>Fase 2</th><th>Streak</th></tr></thead>
            <tbody>
              {relatorio.podio.map((p, i) => <tr key={i}><td>{i + 1}º</td><td>{p.nome}</td><td>{p.empresa}</td><td>{p.xp_fase1}</td><td>{p.xp_fase2}</td><td>{p.melhor_streak}</td></tr>)}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

// =====================================================================
// GESTÃO DE ACESSO — Owner only
// =====================================================================
function TelaAcesso({ admin, avisar }) {
  const [equipe, setEquipe] = useState([]);
  const [log, setLog] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePapel, setInvitePapel] = useState("operador");

  async function carregar() {
    const [e, l] = await Promise.all([api.listarEquipe(), api.logAuditoria()]);
    setEquipe(e.equipe);
    setLog(l.log);
  }
  useEffect(() => { carregar(); }, []);

  async function convidar(e) {
    e.preventDefault();
    try {
      await api.convidarAdmin(inviteEmail, invitePapel);
      avisar("Convite enviado.");
      setInviteEmail("");
      carregar();
    } catch (err) {
      avisar(err.message);
    }
  }

  async function remover(id) {
    try {
      await api.removerAdmin(id);
      carregar();
    } catch (err) {
      avisar(err.message);
    }
  }

  return (
    <div className="content">
      <div className="h1 serif">Gestão de acesso</div>
      <div className="h2">Visível apenas para Owner</div>

      <form className="panel solid" onSubmit={convidar}>
        <div className="panel-title">Convidar administrador</div>
        <div className="fieldrow" style={{ alignItems: "flex-end" }}>
          <div className="field"><label>E-mail</label><input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} /></div>
          <div className="field" style={{ flex: "0 0 160px" }}><label>Papel</label>
            <select value={invitePapel} onChange={(e) => setInvitePapel(e.target.value)}><option value="operador">Operador</option><option value="owner">Owner</option></select>
          </div>
          <button className="btn" type="submit">Enviar convite</button>
        </div>
      </form>

      <div className="panel-title" style={{ marginTop: 22 }}>Membros da equipe</div>
      <table className="tbl">
        <thead><tr><th>Nome</th><th>E-mail</th><th>Papel</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {equipe.map((a) => (
            <tr key={a.id}>
              <td>{a.nome}</td><td>{a.email}</td>
              <td><span className={"pill " + (a.papel === "owner" ? "owner" : "operador")}>{a.papel}</span></td>
              <td>{a.status === "ativo" ? <span className="pill ativa">Ativo</span> : <span className="pill pendente">Convite pendente</span>}</td>
              <td>{a.id !== admin.id && <span className="actionlink danger" onClick={() => remover(a.id)}>remover</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="panel-title" style={{ marginTop: 22 }}>Log de auditoria</div>
      <table className="tbl">
        <thead><tr><th>Quem</th><th>Ação</th><th>Alvo</th><th>Quando</th></tr></thead>
        <tbody>
          {log.map((l, i) => <tr key={i}><td>{l.quem}</td><td>{l.acao}</td><td>{l.alvo}</td><td>{new Date(l.quando).toLocaleString("pt-BR")}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
