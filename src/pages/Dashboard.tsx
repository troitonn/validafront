import { useState } from "react";

const Dashboard = () => {
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState<"cnpj" | "cpf">("cnpj");
  const [dtInicial, setDtInicial] = useState("");
  const [dtFinal, setDtFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const urlBI = "https://app.powerbi.com/reportEmbed?reportId=44029358-a74c-43ff-b041-0a01877077e3&autoAuth=true&ctid=7b8228c2-911b-4b3d-bca2-bb42add6ec41";

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

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden", 
      backgroundColor: "#0d1117" 
    }}>
      
      {/* SIDEBAR FIXA - Não quebra mais o layout */}
      <aside style={{ 
        width: "260px", 
        minWidth: "260px", 
        height: "100%", 
        backgroundColor: "#161b22", 
        borderRight: "1px solid #30363d", 
        display: "flex", 
        flexDirection: "column", 
        padding: "20px",
        boxSizing: "border-box"
      }}>
        <h2 style={{ fontSize: "1.2rem", color: "#58a6ff", margin: "0 0 25px 0", fontWeight: "600" }}>Filtros do BI</h2>

        {/* ÁREA DOS INPUTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", flex: 1 }}>
          <div style={{ width: "100%" }}>
            <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "6px" }}>CNPJ / CPF</label>
            <input
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "#fff", outline: "none", boxSizing: "border-box" }}
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div style={{ width: "100%" }}>
            <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "6px" }}>Tipo</label>
            <select 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "#fff", cursor: "pointer", boxSizing: "border-box" }}
              value={tipo} 
              onChange={(e) => setTipo(e.target.value as any)}
            >
              <option value="cnpj">CNPJ</option>
              <option value="cpf">CPF</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "10px", color: "#8b949e", display: "block", marginBottom: "6px" }}>Data Inicial</label>
              <input style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} type="date" value={dtInicial} onChange={(e) => setDtInicial(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "10px", color: "#8b949e", display: "block", marginBottom: "6px" }}>Data Final</label>
              <input style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} type="date" value={dtFinal} onChange={(e) => setDtFinal(e.target.value)} />
            </div>
          </div>
        </div>

        {/* RODAPÉ COM BOTÕES - Distância e Divisória Ajustadas */}
        <div style={{ 
          paddingTop: "20px", 
          borderTop: "1px solid #30363d", 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px" 
        }}>
          <button 
            onClick={aplicarFiltro} 
            disabled={loading}
            style={{ 
              padding: "12px", 
              backgroundColor: "#1f6feb", 
              color: "#fff", 
              border: "none", 
              borderRadius: "6px", 
              fontWeight: "bold", 
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            {loading ? "Processando..." : "APLICAR FILTROS"}
          </button>

          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            style={{ 
              padding: "10px", 
              backgroundColor: "transparent", 
              color: "#58a6ff", 
              border: "1px solid #30363d", 
              borderRadius: "6px", 
              fontWeight: "bold", 
              cursor: "pointer", 
              fontSize: "12px",
              marginTop: "4px" // Distância extra entre os botões
            }}
          >
            🔄 Recarregar Relatório
          </button>
          
          {msg && <p style={{ fontSize: "12px", textAlign: "center", color: msg.includes("✅") ? "#3fb950" : "#f85149", margin: "10px 0 0 0" }}>{msg}</p>}
        </div>
      </aside>

      {/* ÁREA DO RELATÓRIO - Preenchimento total e isolado */}
      <main style={{ 
        flex: 1, 
        height: "100%", 
        backgroundColor: "#000",
        position: "relative"
      }}>
        <iframe
          key={refreshKey}
          title="Mercado Abilhão"
          src={urlBI}
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%", 
            height: "100%", 
            border: "none"
          }}
          allowFullScreen={true}
        ></iframe>
      </main>

    </div>
  );
};

export default Dashboard;
