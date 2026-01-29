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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documento: documento.replace(/\D/g, ""),
          tipo,
          dtinicial: dtInicial,
          dtfinal: dtFinal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao aplicar filtro");
      }

      setMsg("✅ Filtros aplicados! Atualize o relatório no botão do Power BI.");
    } catch (err: any) {
      setMsg("❌ Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      
      {/* COLUNA DA ESQUERDA: Filtros */}
      <div style={{ 
        width: "350px", 
        padding: "30px", 
        borderRight: "1px solid #ddd", 
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        <h2 style={{ marginBottom: 10 }}>Filtros do BI</h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>CNPJ / CPF</label>
          <input
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            placeholder="Somente números"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Tipo</label>
          <select 
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            value={tipo} 
            onChange={(e) => setTipo(e.target.value as any)}
          >
            <option value="cnpj">CNPJ</option>
            <option value="cpf">CPF</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Data inicial</label>
          <input 
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            type="date" 
            value={dtInicial} 
            onChange={(e) => setDtInicial(e.target.value)} 
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Data final</label>
          <input 
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            type="date" 
            value={dtFinal} 
            onChange={(e) => setDtFinal(e.target.value)} 
          />
        </div>

        <button 
          onClick={aplicarFiltro} 
          disabled={loading}
          style={{
            padding: "15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Aplicando..." : "APLICAR FILTROS"}
        </button>

        {msg && (
          <p style={{ 
            fontSize: "14px", 
            color: msg.includes("✅") ? "green" : "red", 
            fontWeight: "bold",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #eee"
          }}>
            {msg}
          </p>
        )}
      </div>

      {/* COLUNA DA DIREITA: Power BI */}
      <div style={{ flex: 1, backgroundColor: "#eee", position: "relative" }}>
        <iframe
          title="Mercado Abilhão"
          src={urlBI}
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen={true}
        ></iframe>
      </div>

    </div>
  );
};

export default Dashboard;
