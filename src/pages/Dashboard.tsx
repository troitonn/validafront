import { useState } from "react";

const Dashboard = () => {
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState<"cnpj" | "cpf">("cnpj");
  const [dtInicial, setDtInicial] = useState("");
  const [dtFinal, setDtFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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

      setMsg("✅ Filtros aplicados com sucesso! Pode atualizar o Power BI.");
    } catch (err: any) {
      setMsg("❌ Erro ao aplicar filtro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h2>Filtros do BI</h2>

      <label>CNPJ / CPF</label>
      <input
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        placeholder="Somente números"
      />

      <label>Tipo</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
        <option value="cnpj">CNPJ</option>
        <option value="cpf">CPF</option>
      </select>

      <label>Data inicial</label>
      <input type="date" value={dtInicial} onChange={(e) => setDtInicial(e.target.value)} />

      <label>Data final</label>
      <input type="date" value={dtFinal} onChange={(e) => setDtFinal(e.target.value)} />

      <button onClick={aplicarFiltro} disabled={loading}>
        {loading ? "Aplicando..." : "Aplicar filtro"}
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
};

export default Dashboard;
