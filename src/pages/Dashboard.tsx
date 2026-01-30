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

  const urlBI = "https://app.powerbi.com/view?r=eyJrIjoiMGZhOGJiZGEtOGEyZi00ZDBjLWI5YmQtOTA4OGE5Y2QxNDgwIiwidCI6IjdiODIyOGMyLTkxMWItNGIzZC1iY2EyLWJiNDJhZGQ2ZWM0MSJ9&pageName=0dcf58f005625d83d821";

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

  // Nova função: barra fake de 90 segundos
  const atualizarFake = () => {
    setLoading(true);
    setMsg("⏳ Sincronizando...");

    const totalDuration = 90_000; // 90 segundos
    const intervalTime = 500; // 0,5s por tick
    const increment = (intervalTime / totalDuration) * 100;

    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setProgress(100);
          setMsg("✅ Sincronização completa!");
          setTimeout(() => {
            setProgress(0);
            setLoading(false);
            setRefreshKey(prev => prev + 1); // atualiza iframe
          }, 1000);
        }
        return next;
      });
    }, intervalTime);
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
    cursor: "pointer"
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#0d1117", fontFamily: "sans-serif" }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: "280px", minWidth: "280px", height: "100%", backgroundColor: "#161b22", borderRight: "1px solid #30363d", display: "flex", flexDirection: "column", padding: "20px", boxSizing: "border-box" }}>
        <h2 style={{ fontSize: "1.2rem", color: "#58a6ff", margin: "0 0 25px 0", fontWeight: "600" }}>Filtros do BI</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", flex: 1 }}>
          <div>
            <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "6px" }}>CNPJ / CPF</label>
            <input style={{ ...inputStyle, cursor: "text" }} value={documento} onChange={(e) => setDocumento(e.target.value)} placeholder="00.000.000/0000-00" />
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
              <input style={inputStyle} type="date" value={dtInicial} onChange={(e) => setDtInicial(e.target.value)} onClick={(e) => (e.target as any).showPicker?.()} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "10px", color: "#8b949e", display: "block", marginBottom: "6px" }}>Data Final</label>
              <input style={inputStyle} type="date" value={dtFinal} onChange={(e) => setDtFinal(e.target.value)} onClick={(e) => (e.target as any).showPicker?.()} />
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "20px", borderTop: "1px solid #30363d", display: "flex", flexDirection: "column", gap: "8px" }}>
          
          {progress > 0 && (
            <div style={{ width: "100%", height: "6px", backgroundColor: "#30363d", borderRadius: "3px", marginBottom: "4px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#238636", transition: "width 0.5s linear" }}></div>
            </div>
          )}

          <button onClick={aplicarFiltro} disabled={loading} style={{ padding: "12px", backgroundColor: "#1f6feb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "13px" }}>
            {loading && progress === 0 ? "Gravando..." : "APLICAR FILTROS"}
          </button>

          <button onClick={atualizarFake} disabled={loading} style={{ padding: "10px", backgroundColor: "transparent", color: "#58a6ff", border: "1px solid #30363d", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "12px", marginTop: "4px" }}>
            {loading && progress > 0 ? "Sincronizando..." : "🔄 Sincronizar Agora (Fake)"}
          </button>

          <p style={{ fontSize: "10px", color: "#8b949e", textAlign: "center", margin: "8px 0 0 0", fontStyle: "italic", lineHeight: "1.2" }}>
            Barra de progresso fake de 1min30s
          </p>
          
          {msg && <p style={{ fontSize: "12px", textAlign: "center", color: msg.includes("✅") ? "#3fb950" : "#f85149", margin: "10px 0 0 0" }}>{msg}</p>}
        </div>
      </aside>

      <main style={{ flex: 1, height: "100%", backgroundColor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <iframe key={refreshKey} title="Mercado Abilhão" src={urlBI} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen></iframe>
      </main>

    </div>
  );
};

export default Dashboard;
