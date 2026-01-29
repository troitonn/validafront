import { useState } from "react";

const Dashboard = () => {
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState<"cnpj" | "cpf">("cnpj");
  const [dtInicial, setDtInicial] = useState("");
  const [dtFinal, setDtFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#1e1e1e", color: "#fff" }}>
      
      {/* SIDEBAR DE FILTROS - Largura Fixa para não quebrar */}
      <div style={{ 
        width: "300px", 
        minWidth: "300px",
        padding: "20px", 
        borderRight: "1px solid #333", 
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
        zIndex: 2
      }}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 10px 0" }}>Filtros do BI</h2>

        <div>
          <label style={{ fontSize: "12px", display: "block", marginBottom: "5px" }}>CNPJ / CPF</label>
          <input
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#2d2d2d", color: "#fff" }}
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            placeholder="Somente números"
          />
        </div>

        <div>
          <label style={{ fontSize: "12px", display: "block", marginBottom: "5px" }}>Tipo</label>
          <select 
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#2d2d2d", color: "#fff" }}
            value={tipo} 
            onChange={(e) => setTipo(e.target.value as any)}
          >
            <option value="cnpj">CNPJ</option>
            <option value="cpf">CPF</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", display: "block", marginBottom: "5px" }}>Inicial</label>
            <input 
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#2d2d2d", color: "#fff", fontSize: "12px" }}
              type="date" value={dtInicial} onChange={(e) => setDtInicial(e.target.value)} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", display: "block", marginBottom: "5px" }}>Final</label>
            <input 
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#2d2d2d", color: "#fff", fontSize: "12px" }}
              type="date" value={dtFinal} onChange={(e) => setDtFinal(e.target.value)} 
            />
          </div>
        </div>

        <button 
          onClick={aplicarFiltro} 
          disabled={loading}
          style={{
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          {loading ? "Processando..." : "APLICAR FILTROS"}
        </button>

        {msg && <p style={{ fontSize: "12px", textAlign: "center", color: msg.includes("✅") ? "#4caf50" : "#ff5252" }}>{msg}</p>}
      </div>

      {/* ÁREA DO BI - Ocupa o resto da tela e ajusta o conteúdo automaticamente */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#000",
        padding: "10px",
        overflow: "hidden" 
      }}>
        <iframe
          title="Mercado Abilhão"
          src={urlBI}
          style={{ 
            width: "100%", 
            height: "100%", 
            border: "none",
            borderRadius: "4px"
          }}
          allowFullScreen={true}
        ></iframe>
      </div>

    </div>
  );
};

export default Dashboard;
