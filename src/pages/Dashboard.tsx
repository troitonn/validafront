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

  const urlBI = "https://app.powerbi.com/view?r=eyJrIjoiOGYzNDIzYmUtNTU5NC00ODU4LWE0Y2UtMWM1NTIzMWRlNGRhIiwidCI6IjdiODIyOGMyLTkxMWItNGIzZC1iY2EyLWJiNDJhZGQ2ZWM0MSJ9";
  const urlAutomate = "https://default7b8228c2-911b-4b3d-bca2-bb42add6ec41.41.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/2f97c85812e84355ae60b53d73ad420d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SMOi--lPXC-jaAlz8m70s3iTgtHn4Bq01xwg-ihBb_s";
  const urlProxyStatus = "https://valida-proxy.onrender.com/status-atualizacao";

  const handleDocumentChange = (val: string) => {
    const apenasNumeros = val.replace(/\D/g, "");
    setDocumento(apenasNumeros);
  };

  const handleSincronizarDados = async () => {
    if (!documento) {
      setMsg("⚠️ Digite um CNPJ ou CPF");
      return;
    }

    setLoading(true);
    setMsg("⏳ Enviando filtros...");
    setProgress(15);

    try {
      // 1. Envia os filtros para o Proxy (O Power BI consumirá via GET depois)
      const resFiltro = await fetch("https://valida-proxy.onrender.com/filtro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documento: documento,
          tipo: tipo,
          dtinicial: dtInicial || "",
          dtfinal: dtFinal || "",
        }),
      });

      if (!resFiltro.ok) throw new Error("Erro ao enviar filtros");

      setProgress(40);
      setMsg("🚀 Disparando Power Automate...");

      // 2. Dispara o Power Automate para iniciar o Refresh no Power BI
      await fetch(urlAutomate, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitante: "Dashboard" })
      });

      setProgress(60);
      setMsg("🔄 Sincronizando dados no Power BI...");

      // 3. Polling de status para monitorar a conclusão
      const checkStatus = setInterval(async () => {
        try {
          const res = await fetch(urlProxyStatus);
          const data = await res.json();

          if (data.status === "Completed") {
            clearInterval(checkStatus);
            setProgress(100);
            setMsg("✅ Power BI atualizado!");
            setUltimaGravacao(new Date().toLocaleTimeString("pt-BR"));
            setRefreshKey(prev => prev + 1); // Recarrega o Iframe
            setLoading(false);
            setTimeout(() => setProgress(0), 4000);
          } else if (data.status === "Failed") {
            clearInterval(checkStatus);
            setMsg("❌ Falha na atualização do BI.");
            setLoading(false);
            setProgress(0);
          } else {
            // Avanço cosmético enquanto aguarda o servidor
            setProgress(prev => (prev < 95 ? prev + 1 : prev));
          }
        } catch (e) {
          console.error("Erro ao verificar status");
        }
      }, 8000); // Verifica a cada 8 segundos

    } catch (err: any) {
      setMsg("❌ Erro: " + err.message);
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
            <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "6px" }}>CNPJ / CPF</label>
            <input 
              style={inputStyle} 
              value={documento} 
              onChange={(e) => handleDocumentChange(e.target.value)} 
              placeholder="Ex: 33429648000137" 
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
          
          {progress > 0 && (
            <div style={{ width: "100%", height: "6px", backgroundColor: "#30363d", borderRadius: "3px", marginBottom: "4px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#1ad3a9", transition: "width 0.4s ease-out" }}></div>
            </div>
          )}

          <button 
            onClick={handleSincronizarDados} 
            disabled={loading} 
            style={{ 
              padding: "14px", 
              backgroundColor: "#1ad3a9", 
              color: "#01222e", 
              border: "none", 
              borderRadius: "6px", 
              fontWeight: "bold", 
              cursor: loading ? "not-allowed" : "pointer", 
              fontSize: "13px" 
            }}
          >
            {loading ? "SINCRONIZANDO..." : "SINCRONIZAR DADOS"}
          </button>

          {ultimaGravacao && (
            <p style={{ fontSize: "10px", color: "#1ad3a9", textAlign: "center", margin: "5px 0" }}>
              Sincronizado em: {ultimaGravacao}
            </p>
          )}

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
