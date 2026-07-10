import React, { useState, useEffect } from "react";
import { api } from "./api";

const CSS = `
  :root{
    --dark:#1A1A1A; --card:#232323; --card2:#2A2A2A; --gold:#B5966A; --gold-dim:#4A3F30;
    --text:#F5F2ED; --text-dim:#A8A29A; --text-faint:#6E6A63; --red:#C0564F; --green:#7FA66B; --line:#333333;
  }
  *{ box-sizing:border-box; }
  html,body,#root{ margin:0; padding:0; height:100%; background:var(--dark); }
  .nera-app{ font-family:'Carlito','Calibri',sans-serif; color:var(--text); min-height:100vh; }
  .serif{ font-family:'Caladea','Cambria',serif; }
  .topbar{ display:flex; justify-content:space-between; align-items:center; padding:22px 48px; border-bottom:1px solid var(--line); }
  .brand{ display:flex; align-items:center; gap:12px; }
  .brand .mark{ width:34px; height:34px; border:1.5px solid var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--gold); font-weight:700; font-size:14px; }
  .brand .name{ font-size:15px; letter-spacing:0.14em; text-transform:uppercase; font-weight:700; }
  .login-wrap{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; padding:60px; text-align:center; }
  .kicker{ font-size:13px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; }
  .login-title{ font-size:36px; font-weight:700; margin:0 0 16px; max-width:720px; line-height:1.25; }
  .login-card{ width:420px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:36px; text-align:left; }
  .flabel{ font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; display:block; }
  .finput{ width:100%; background:#141414; border:1px solid var(--line); border-radius:6px; padding:14px 15px; color:var(--text); font-size:15px; margin-bottom:18px; font-family:inherit; }
  .fbtn{ width:100%; background:var(--gold); color:#1A1A1A; border:none; border-radius:6px; padding:15px; font-weight:700; font-size:15px; cursor:pointer; }
  .fbtn:disabled{ opacity:0.5; cursor:not-allowed; }
  .fnote{ margin-top:18px; padding-top:16px; border-top:1px solid var(--line); font-size:12.5px; color:var(--text-faint); line-height:1.6; }
  .err{ color:var(--red); font-size:13px; margin-top:10px; }
  .ok-msg{ color:var(--green); font-size:13px; margin-top:10px; }
  .nav{ display:flex; gap:4px; padding:14px 40px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
  .navbtn{ font-size:13.5px; padding:11px 18px; border-radius:6px; color:var(--text-dim); background:transparent; border:none; cursor:pointer; }
  .navbtn.active{ background:var(--gold-dim); color:var(--gold); font-weight:700; }
  .content{ padding:36px 48px; }
  .h1{ font-size:24px; font-weight:700; margin:0 0 6px; }
  .h2{ font-size:14px; color:var(--text-dim); margin:0 0 20px; }
  .row-between{ display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  table.tbl{ width:100%; border-collapse:collapse; }
  table.tbl th{ text-align:left; font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-faint); padding:12px 14px; border-bottom:1px solid var(--line); }
  table.tbl td{ padding:15px 14px; border-bottom:1px solid var(--line); font-size:14px; }
  .pill{ font-size:11px; padding:5px 13px; border-radius:20px; text-transform:uppercase; letter-spacing:0.03em; display:inline-block; }
  .pill.ativa{ background:rgba(127,166,107,0.18); color:var(--green); }
  .pill.agendada{ background:rgba(181,150,106,0.2); color:var(--gold); }
  .pill.encerrada{ background:rgba(255,255,255,0.08); color:var(--text-faint); }
  .pill.owner{ background:rgba(181,150,106,0.22); color:var(--gold); }
  .pill.operador{ background:rgba(255,255,255,0.08); color:var(--text-dim); }
  .pill.pendente{ background:rgba(181,150,106,0.15); color:var(--gold); }
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
  .field input, .field select, .field textarea{ width:100%; background:#141414; border:1px solid var(--line); border-radius:6px; padding:11px 13px; color:var(--text); font-size:14px; box-sizing:border-box; font-family:inherit; }
  .owner-badge{ font-size:10.5px; color:var(--gold); border:1px solid var(--gold); border-radius:20px; padding:3px 11px; letter-spacing:0.03em; text-transform:uppercase; }
  .statgrid{ display:flex; gap:14px; flex-wrap:wrap; margin-bottom:20px; }
  .statcard{ flex:1; min-width:130px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:16px 18px; }
  .statcard .v{ font-size:24px; font-weight:700; color:var(--gold); }
  .statcard .l{ font-size:10.5px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.04em; }
  .actionlink{ color:var(--gold); font-size:11.5px; cursor:pointer; }
  .actionlink.danger{ color:var(--red); }
  .toast{ position:fixed; bottom:20px; right:20px; background:var(--card2); border:1px solid var(--gold); color:var(--text); font-size:13px; padding:12px 18px; border-radius:8px; z-index:20; }
`;

function Toast({ mensagem }) {
  if (!mensagem) return null;
  return <div className="toast">{mensagem}</div>;
}

export default function AdminApp() {
  const [screen, setScreen] = useState("login-credenciais"); // login-credenciais | login-2fa | app
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginCodigo, setLoginCodigo] = useState("");
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
      await api.login(loginEmail, loginSenha);
      setScreen("login-2fa");
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handle2fa(e) {
    e.preventDefault();
    setErro(""); setCarregando(true);
    try {
      const dados = await api.confirmar2fa(loginEmail, loginCodigo);
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
      <div className="nera-app">
        <style>{CSS}</style>
        <div className="topbar"><div className="brand"><div className="mark">N</div><div className="name serif">Nera treinamento</div></div><div style={{ color: "var(--text-dim)", fontSize: 13 }}>equipe interna</div></div>
        <div className="login-wrap">
          <div className="kicker">Painel administrativo</div>
          <h1 className="login-title serif">Portal de gerenciamento Nera treinamento</h1>
          <div className="login-card">
            <form onSubmit={handleLogin}>
              <span className="flabel">E-mail</span>
              <input className="finput" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <span className="flabel">Senha</span>
              <input className="finput" type="password" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} />
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Verificando..." : "Continuar"}</button>
              {erro && <div className="err">{erro}</div>}
              <div className="fnote">3 tentativas de senha antes do bloqueio — depois, redefinição via e-mail do próprio admin.</div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN — 2FA ----------------
  if (screen === "login-2fa") {
    return (
      <div className="nera-app">
        <style>{CSS}</style>
        <div className="topbar"><div className="brand"><div className="mark">N</div><div className="name serif">Nera treinamento</div></div></div>
        <div className="login-wrap">
          <div className="kicker">Confirmação de identidade</div>
          <h1 className="login-title serif">Digite o código</h1>
          <div className="login-card">
            <form onSubmit={handle2fa}>
              <span className="flabel">Código de confirmação</span>
              <input className="finput" style={{ textAlign: "center", letterSpacing: 6, fontSize: 18 }} value={loginCodigo} onChange={(e) => setLoginCodigo(e.target.value)} placeholder="000000" />
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Confirmando..." : "Entrar no painel"}</button>
              {erro && <div className="err">{erro}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "turmas", label: "Turmas" },
    { key: "monitoramento", label: "Monitoramento" },
    { key: "cadastro", label: "Cadastro no dia" },
    { key: "conteudo", label: "Conteúdo" },
    { key: "relatorio", label: "Relatório" },
    ...(admin.papel === "owner" ? [{ key: "acesso", label: "Gestão de acesso" }] : []),
  ];

  return (
    <div className="nera-app">
      <style>{CSS}</style>
      <div className="topbar">
        <div className="brand"><div className="mark">N</div><div className="name serif">Nera treinamento</div></div>
        <div style={{ color: "var(--text-dim)", fontSize: 13 }}>{admin.nome} · {admin.papel === "owner" ? "Owner" : "Operador"}</div>
      </div>
      <div className="nav">
        {tabs.map((t) => <button key={t.key} className={"navbtn" + (tab === t.key ? " active" : "")} onClick={() => setTab(t.key)}>{t.label}</button>)}
      </div>

      {tab === "turmas" && <TelaTurmas avisar={avisar} />}
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
// TURMAS — com filtro por status
// =====================================================================
function TelaTurmas({ avisar }) {
  const [filtro, setFiltro] = useState("todas");
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [nome, setNome] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [linhasRaw, setLinhasRaw] = useState("Nome, E-mail, Empresa, CNPJ\nJoão Pedro, joao.pedro@empresa.com.br, Esquadrias Bella, 12.345.678/0001-90");
  const [conferencia, setConferencia] = useState(null);

  async function carregar() {
    setCarregando(true);
    try {
      const { turmas } = await api.listarTurmas(filtro);
      setTurmas(turmas);
    } catch (err) {
      avisar(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [filtro]);

  function parseLinhas(raw) {
    return raw.split("\n").slice(1) // ignora o cabeçalho digitado pelo usuário
      .map((l) => l.trim()).filter(Boolean)
      .map((linha) => {
        const [n, e, emp, cnpj] = linha.split(",").map((s) => (s || "").trim());
        return { nome: n, email: e, empresa: emp, cnpj };
      });
  }

  async function handleConferir() {
    try {
      const { validos, erros } = await api.conferirLista(parseLinhas(linhasRaw));
      setConferencia({ validos, erros });
    } catch (err) {
      avisar(err.message);
    }
  }

  async function handleConfirmar() {
    try {
      await api.criarTurma(nome, dataEvento, conferencia.validos);
      avisar(`Turma "${nome}" criada com ${conferencia.validos.length} participantes.`);
      setConferencia(null); setLinhasRaw(""); setNome(""); setDataEvento("");
      carregar();
    } catch (err) {
      avisar(err.message);
    }
  }

  return (
    <div className="content">
      <div className="row-between"><div><div className="h1 serif">Turmas</div><div className="h2">{turmas.length} turmas nesta visão</div></div></div>
      <div className="filterbar">
        {["todas", "ativa", "agendada", "encerrada"].map((f) => (
          <button key={f} className={"filterchip" + (filtro === f ? " active" : "")} onClick={() => setFiltro(f)}>
            {f === "todas" ? "Todas" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {carregando ? <div style={{ color: "var(--text-faint)" }}>Carregando...</div> : (
        <table className="tbl">
          <thead><tr><th>Turma</th><th>Data</th><th>Empresas</th><th>Participantes</th><th>Status</th></tr></thead>
          <tbody>
            {turmas.map((t) => (
              <tr key={t.id}>
                <td>{t.nome}</td><td>{new Date(t.data_evento).toLocaleDateString("pt-BR")}</td>
                <td>{t.empresas}</td><td>{t.participantes}</td>
                <td><span className={"pill " + t.status}>{t.status}</span></td>
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
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Lista (Nome, E-mail, Empresa, CNPJ — CNPJ opcional)</label>
          <textarea rows={4} value={linhasRaw} onChange={(e) => setLinhasRaw(e.target.value)} />
        </div>
        <button className="btn-ghost" onClick={handleConferir}>Conferir lista</button>

        {conferencia && (
          <div style={{ marginTop: 14 }}>
            <table className="tbl">
              <thead><tr><th>Nome</th><th>E-mail</th><th>Empresa</th><th>Status</th></tr></thead>
              <tbody>
                {conferencia.validos.map((v, i) => <tr key={"v" + i}><td>{v.nome}</td><td>{v.email}</td><td>{v.empresa}</td><td><span className="pill ativa">válido</span></td></tr>)}
                {conferencia.erros.map((er, i) => <tr key={"e" + i}><td>{er.nome}</td><td>{er.email}</td><td>—</td><td><span className="pill" style={{ background: "rgba(192,86,79,0.15)", color: "var(--red)" }}>{er.motivo}</span></td></tr>)}
              </tbody>
            </table>
            <button className="btn" style={{ marginTop: 10 }} disabled={conferencia.validos.length === 0} onClick={handleConfirmar}>
              Confirmar turma ({conferencia.validos.length} válidos)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// MONITORAMENTO — só turmas ativas
// =====================================================================
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
          <thead><tr><th>Participante</th><th>Empresa</th><th>Origem</th><th>Módulo</th><th>Progresso</th><th>XP</th><th>Streak</th><th>Status</th></tr></thead>
          <tbody>
            {dados.participantes.map((p, i) => (
              <tr key={i}>
                <td>{p.nome}</td><td>{p.empresa || "—"}</td>
                <td>{p.origem === "no_dia" ? <span className="pill agendada">No dia</span> : "Lista"}</td>
                <td>{String(p.moduloAtual).padStart(2, "0")}</td><td>{p.progresso}%</td>
                <td>{p.xpTotal}</td><td>{p.melhorStreak}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  const [bloqueado, setBloqueado] = useState(false);
  const [criando, setCriando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [rascunho, setRascunho] = useState({});

  async function carregar() {
    const r = await api.listarConteudo();
    setQuestoes(r.questoes);
    setBloqueado(r.bloqueadoParaEdicao);
  }
  useEffect(() => { carregar(); }, []);

  function novoRascunho() {
    return { moduloId: 1, topico: "", pergunta: "", cenario: "", alternativas: ["", "", "", ""], correta: 0, explicacao: "" };
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

  const porModulo = { 1: [], 2: [], 3: [] };
  questoes.forEach((q) => porModulo[q.modulo_id]?.push(q));

  return (
    <div className="content">
      <div className="row-between">
        <div><div className="h1 serif">Conteúdo dos módulos</div><div className="h2">{bloqueado ? "Edição bloqueada: existe turma com status Ativa" : "Criação e edição liberadas — sem turma ativa no momento"}</div></div>
        <button className="btn" disabled={bloqueado} onClick={() => { setRascunho(novoRascunho()); setCriando(true); }}>+ Nova questão</button>
      </div>

      {criando && (
        <FormularioQuestao rascunho={rascunho} setRascunho={setRascunho} onSalvar={salvarNova} onCancelar={() => setCriando(false)} />
      )}

      {[1, 2, 3].map((m) => (
        <div key={m} style={{ marginBottom: 20 }}>
          <div className="panel-title">Módulo {m}</div>
          {porModulo[m].map((q) => (
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

function FormularioQuestao({ rascunho, setRascunho, onSalvar, onCancelar, edicao }) {
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
              <option value={1}>1 — Fundamentos</option><option value={2}>2 — Desempenho Técnico</option><option value={3}>3 — Aplicação e Decisão</option>
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

  async function exportarCsv() {
    try {
      await api.baixarCsv(turmaId, `${relatorio.turma.replace(/\s+/g, "_")}_participantes.csv`);
    } catch (err) {
      avisar(err.message);
    }
  }

  async function enviarRh() {
    try {
      await api.enviarRh(turmaId);
      avisar("Relatório enviado ao RH.");
    } catch (err) {
      avisar(err.message);
    }
  }

  return (
    <div className="content">
      <div className="row-between">
        <div><div className="h1 serif">Relatório</div><div className="h2">Encerramento e exportação de dados</div></div>
        <select className="finput" style={{ width: 240, margin: 0 }} value={turmaId} onChange={(e) => { setTurmaId(e.target.value); setRelatorio(null); }}>
          {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </div>

      {!relatorio ? (
        <button className="btn" onClick={gerar}>Gerar relatório</button>
      ) : (
        <>
          <div className="row-between">
            <div />
            {admin.papel === "owner" ? (
              <button className="btn-owner" onClick={exportarCsv}>
                Exportar CSV — {relatorio.total} participantes <span className="owner-badge">Owner</span>
              </button>
            ) : (
              <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Exportação de CSV disponível apenas para Owner.</div>
            )}
          </div>
          <div className="statgrid">
            <div className="statcard"><div className="v">{relatorio.total}</div><div className="l">Participantes</div></div>
            <div className="statcard"><div className="v">{relatorio.concluiram}</div><div className="l">Concluíram</div></div>
            <div className="statcard"><div className="v">{relatorio.taxa}%</div><div className="l">Taxa de conclusão</div></div>
          </div>
          <div className="h2">O CSV exportado inclui todas as {relatorio.total} linhas de participantes (nome, e-mail, empresa, CNPJ, ranking, pontuação) — a tabela abaixo mostra só o pódio, como prévia.</div>
          <table className="tbl">
            <thead><tr><th>#</th><th>Nome</th><th>Empresa</th><th>XP</th><th>Streak</th></tr></thead>
            <tbody>
              {relatorio.podio.map((p, i) => <tr key={i}><td>{i + 1}º</td><td>{p.nome}</td><td>{p.empresa}</td><td>{p.xp_total}</td><td>{p.melhor_streak}</td></tr>)}
            </tbody>
          </table>
          <button className="btn" style={{ marginTop: 16 }} onClick={enviarRh}>Enviar ao RH</button>
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
