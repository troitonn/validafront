import { useState } from "react";

const Dashboard = () => {
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState<"cnpj" | "cpf">("cnpj");
  const [dtInicial, setDtInicial] = useState("");
  const [dtFinal, setDtFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [progress, setProgress] = useState(0);

  // URLs
  const urlBI = "https://app.powerbi.com/reportEmbed?reportId=44029358-a74c-43ff-b041-0a01877077e3&autoAuth=true&ctid=7b8228c2-911b-4b3d-bca2-bb42add6ec41&actionBarEnabled=true";
  
  const urlAutomate = "https://default7b8228c2911b4b3dbca2bb42add6ec.41.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/2f97c85812e84355ae60b53d73ad420d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SMOi--lPXC-jaAlz8m70s3iTgtHn4Bq01xwg-ihBb_s";

  const startProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    return interval;
  };

  const aplicarFiltro = async () => {
    setLoading(true);
    setMsg("");
    try {
      const response = await fetch("https://valida-proxy.onrender.com/filtro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documento: documento.replace(/\D/g, ""),
          tipo,
          dtinicial: dtInicial,
          dtfinal: dtFinal,
        }),
      });
      if (!response.ok) throw new Error("Erro ao aplicar filtro");
      setMsg("✅ Filtros aplicados!");
    } catch (err: any) {
      setMsg("❌ Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const atualizarEPowerAutomate = async () => {
    setLoading(true);
    setMsg("⏳ Sincronizando dados...");
    const progressInterval = startProgress();

    try {
      // Dispara o Power Automate via POST em segundo plano
      await fetch(urlAutomate, {
        method: "POST",
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) // Envia corpo vazio para satisfazer o gatilho HTTP
      });

      // Aguarda 3 segundos para o processamento antes de dar o refresh no iframe
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setRefreshKey(prev => prev + 1);
        setMsg("✅ Relatório atualizado!");
        setLoading(false);
        setTimeout(() => setProgress(0), 2000);
      }, 3000);

    } catch (err) {
      setMsg("⚠️ Erro na sincronização");
      clearInterval(progressInterval);
      setLoading(false);
      setRefreshKey(prev => prev + 1);
    }
  };

  // Estilo padrão para inputs
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
    colorScheme: "dark",
    cursor: "pointer"
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#0d1117", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* SIDEBAR */}
      <aside style={{ 
        width: "280px", minWidth: "280px", height: "100%", backgroundColor: "#161b22", 
        borderRight: "1px solid #30363d", display: "flex", flexDirection: "column", padding: "20px", boxSizing: "border-box" 
      }}>
        <h2 style={{ fontSize: "1.2rem", color: "#58a6ff", margin: "0 0 25px 0", fontWeight: "600" }}>Filtros do BI</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", flex: 1 }}>
          <div>
            <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "6px" }}>CNPJ / CPF</label>
            <input
              style={{ ...inputStyle, cursor: "text" }}
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="00.000.000/0000-00"
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
              <input 
                style={inputStyle} 
                type="date" 
                value={dtInicial} 
                onChange={(e) => setDtInicial(e.target.value)}
                onClick={(e) => (e.target as any).showPicker?.()} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "10px", color: "#8b949e", display: "block", marginBottom: "6px" }}>Data Final</label>
              <input 
                style={inputStyle} 
                type="date" 
                value={dtFinal} 
                onChange={(e) => setDtFinal(e.target.value)}
                onClick={(e) => (e.target as any).showPicker?.()} 
              />
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "20px", borderTop: "1px solid #30363d", display: "flex", flexDirection: "column", gap: "8px" }}>
          
          {/* BARRA DE PROGRESSO */}
          {progress > 0 && (
            <div style={{ width: "100%", height: "4px", backgroundColor: "#30363d", borderRadius: "2px", marginBottom: "8px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#238636", transition: "width 0.4s linear" }}></div>
            </div>
          )}

          <button 
            onClick={aplicarFiltro} 
            disabled={loading}
            style={{ padding: "12px", backgroundColor: "#1f6feb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "13px" }}
          >
            {loading && progress === 0 ? "Processando..." : "APLICAR FILTROS"}
          </button>

          <button 
            onClick={atualizarEPowerAutomate}
            disabled={loading}
            style={{ padding: "10px", backgroundColor: "transparent", color: "#58a6ff", border: "1px solid #30363d", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "12px", marginTop: "4px" }}
          >
            {loading && progress > 0 ? "Sincronizando..." : "🔄 Recarregar e Atualizar PBIX"}
          </button>
          
          {msg && <p style={{ fontSize: "12px", textAlign: "center", color: msg.includes("✅") ? "#3fb950" : "#f85149", margin: "10px 0 0 0", lineHeight: "1.4" }}>{msg}</p>}
        </div>
      </aside>

      {/* ÁREA DO RELATÓRIO */}
      <main style={{ flex: 1, height: "100%", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <iframe
          key={refreshKey}
          title="Mercado Abilhão"
          src={urlBI}
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen={true}
        ></iframe>
      </main>

    </div>
  );
};

export default Dashboard;
