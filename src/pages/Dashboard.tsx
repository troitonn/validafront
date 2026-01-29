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
      setMsg("✅ Filtros aplicados! Atualize o BI.");
    } catch (err: any) {
      setMsg("❌ Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#1e1e1e" }}>
      
      {/* SIDEBAR DE FILTROS */}
      <div style={{ 
        width: "320px", 
        minWidth: "320px",
        padding: "25px", 
        borderRight: "1px solid #333", 
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        zIndex: 10
      }}>
        <h2 style={{ color: "#fff", margin: "0 0 10px 0" }}>Filtros do BI</h2>
        {/* ... Seus inputs aqui (CNPJ, Datas, etc) ... */}
        <button onClick={aplicarFiltro} disabled={loading} style={{ padding: "12px", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
          {loading ? "Processando..." : "APLICAR FILTROS"}
        </button>
        {msg && <p style={{ color: msg.includes("✅") ? "#4caf50" : "#ff5252", fontSize: "13px" }}>{msg}</p>}
      </div>

      {/* ÁREA DO BI COM AJUSTE AUTOMÁTICO */}
      <div style={{ 
        flex: 1, 
        backgroundColor: "#000", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        overflow: "hidden" // Impede que o scroll apareça
      }}>
        <iframe
          title="Mercado Abilhão"
          src={urlBI}
          style={{ 
            // Estes valores garantem que o BI ocupe todo o espaço disponível
            // sem vazar da tela, mantendo a proporção.
            width: "100%", 
            height: "100%", 
            border: "none"
          }}
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default Dashboard;
