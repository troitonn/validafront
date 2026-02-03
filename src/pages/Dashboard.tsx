import { useState } from "react";
import { logout } from "../auth/auth.ts";

const Dashboard = () => {
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState<"cnpj" | "cpf">("cnpj");
  const [dtInicial, setDtInicial] = useState("");
  const [dtFinal, setDtFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ultimaGravacao, setUltimaGravacao] = useState<string | null>(null);

  const urlBI = "https://app.powerbi.com/view?r=eyJrIjoiMGZhOGJiZGEtOGEyZi00ZDBjLWI5YmQtOTA4OGE5Y2QxNDgwIiwidCI6IjdiODIyOGMyLTkxMWItNGIzZC1iY2EyLWJiNDJhZGQ2ZWM0MSJ9&pageName=0dcf58f005625d83d821";
  const urlAutomate = "https://default7b8228c2911b4b3dbca2bb42add6ec.41.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/2f97c85812e84355ae60b53d73ad420d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SMOi--lPXC-jaAlz8m70s3iTgtHn4Bq01xwg-ihBb_s";
  const urlProxyStatus = "https://valida-proxy.onrender.com/status-atualizacao";

  const handleDocumentChange = (val: string) => {
    const apenasNumeros = val.replace(/\D/g, "");
    setDocumento(apenasNumeros);
  };

  const aplicarFiltro = async () => {
    if (!documento) {
      setMsg("⚠️ Digite um CNPJ ou CPF");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      const response = await fetch("https://valida-proxy.onrender.com/filtro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documento: documento,
          tipo: tipo,
          dtinicial: dtInicial || "",
          dtfinal: dtFinal || "",
        }),
      });

      if (!response.ok) throw new Error("Erro ao aplicar filtro");

      const agora = new Date();
      setUltimaGravacao(agora.toLocaleTimeString("pt-BR"));
      setMsg("✅ Filtros aplicados!");
    } catch (err: any) {
      setMsg("❌ Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO ATUALIZADA: Monitoramento Real em vez de timer fixo
  const atualizarEPowerAutomate = async () => {
    setLoading(true);
    setMsg("⏳ Iniciando Power Automate...");
    setProgress(5);

    try {
      // 1. Dispara o Power Automate
      await fetch(urlAutomate, { method: "POST", mode: "no-cors" });
      setMsg("⏳ Sincronizando dados reais...");

      // 2. Loop de verificação (Polling)
      const checkStatus = setInterval(async () => {
        try {
          const res = await fetch(urlProxyStatus);
          const data = await res.json();

          if (data.status === "Completed") {
            clearInterval(checkStatus);
            setProgress(100);
            setRefreshKey(prevKey => prevKey + 1);
            setMsg("✅ Power BI atualizado!");
            setLoading(false);
            setTimeout(() => setProgress(0), 3000);
          } else if (data.status === "Failed") {
            clearInterval(checkStatus);
            setMsg("⚠️ O Power BI relatou erro.");
            setLoading(false);
            setProgress(0);
          } else {
            // Move a barra gradualmente enquanto espera
            setProgress(prev => (prev < 95 ? prev + 2 : prev));
          }
        } catch (e) {
          console.error("Erro ao consultar status");
        }
      }, 10000); // Consulta a cada 10 segundos

    } catch (err) {
      setMsg("⚠️ Falha ao conectar com o serviço.");
      setLoading(false);
      setProgress(0);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    backgroundColor: "#0d1117",
    color: "#fff",
    fontSize: "12px",
    boxSizing: "border-box",
    outline: "none",
    colorScheme: "dark"
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#0d1117", fontFamily: "sans-serif" }}>
      
      <aside style={{ width: "280px", minWidth: "280px", height: "100%", backgroundColor: "#161b22", borderRight: "1px solid #30363d", display: "flex", flexDirection: "column", padding: "20px", boxSizing: "border-box" }}>
        <h2 style={{ fontSize: "1.2rem", color: "#1ad3a9", margin: "0 0 25px 0", fontWeight: "600" }}>Filtros do BI</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", flex: 1 }}>
          <div>
            <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "6px" }}>CNPJ / CPF (Apenas números)</label>
            <input 
              style={{ ...inputStyle, cursor: "text" }} 
              value={documento} 
              onChange={(e) => handleDocumentChange(e.target.value)} 
              placeholder="Ex: 00000000000000" 
            />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "6px" }}>Tipo</label>
            <select style={inputStyle} value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
              <option value="cnpj">CNPJ</option>
              <option value="cpf">CPF</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "10px", color: "#8b949e", display: "block", marginBottom: "6px" }}>Data Inicial</label>
              <input style={inputStyle} type="date" value={dtInicial} onChange={(e) => setDtInicial(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "10px", color: "#8b949e", display: "block", marginBottom: "6px" }}>Data Final</label>
              <input style={inputStyle} type="date" value={dtFinal} onChange={(e) => setDtFinal(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "20px", borderTop: "1px solid #30363d", display: "flex", flexDirection: "column", gap: "8px" }}>
          
          {ultimaGravacao && (
            <div style={{ padding: "8px", backgroundColor: "rgba(26, 211, 169, 0.1)", borderRadius: "6px", marginBottom: "8px", border: "1px solid rgba(26, 211, 169, 0.2)" }}>
              <p style={{ fontSize: "11px", color: "#1ad3a9", margin: 0, textAlign: "center" }}>
                Último envio: <strong>{ultimaGravacao}</strong>
              </p>
            </div>
          )}

          {progress > 0 && (
            <div style={{ width: "100%", height: "6px", backgroundColor: "#30363d", borderRadius: "3px", marginBottom: "4px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#1ad3a9", transition: "width 0.5s linear" }}></div>
            </div>
          )}

          <button onClick={aplicarFiltro} disabled={loading} style={{ padding: "12px", backgroundColor: "#1ad3a9", color: "#01222e", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "13px" }}>
            {loading && progress === 0 ? "Gravando..." : "APLICAR FILTROS"}
          </button>

          <button onClick={atualizarEPowerAutomate} disabled={loading} style={{ padding: "10px", backgroundColor: "transparent", color: "#1ad3a9", border: "1px solid #30363d", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "12px", marginTop: "4px" }}>
            {loading && progress > 0 ? "Sincronizando..." : "🔄 Sincronizar Agora"}
          </button>

          <button 
            onClick={logout} 
            style={{ 
              padding: "10px", 
              backgroundColor: "transparent", 
              color: "#f85149", 
              border: "1px solid rgba(248, 81, 73, 0.3)", 
              borderRadius: "6px", 
              fontWeight: "bold", 
              cursor: "pointer", 
              fontSize: "12px", 
              marginTop: "10px" 
            }}
          >
            Sair do Sistema
          </button>

          <p style={{ fontSize: "10px", color: "#8b949e", textAlign: "center", margin: "8px 0 0 0", fontStyle: "italic", lineHeight: "1.2" }}>
            Status monitorado via API Microsoft.
          </p>
          
          {msg && <p style={{ fontSize: "12px", textAlign: "center", color: msg.includes("✅") ? "#3fb950" : "#f85149", margin: "10px 0 0 0" }}>{msg}</p>}
        </div>
      </aside>

      <main style={{ flex: 1, height: "100%", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <iframe key={refreshKey} title="Power BI Report" src={urlBI} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen></iframe>
      </main>
    </div>
  );
};

export default Dashboard;
