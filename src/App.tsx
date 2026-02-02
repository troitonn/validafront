import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Adicionado
import Dashboard from "./pages/Dashboard.js"
import { loginFake, isAuthenticated } from "./auth/auth.js"

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Se já estiver logado e tentar acessar a "/" (Login), manda direto pro Dash
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    if (loginFake(user, password)) {
      setError("");
      navigate("/dashboard"); // Redireciona via URL
    } else {
      setError("Usuário ou senha inválidos");
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>🔐 Login</h2>

        <input
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={styles.input}
          required
        />

        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}

// ... (seus estilos permanecem os mesmos abaixo)
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#020617",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    color: "#fff",
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#fff",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "bold" as const,
    marginTop: "10px",
  },
  error: {
    color: "#f87171",
    fontSize: "14px",
    textAlign: "center" as const,
    margin: "0",
  },
};

export default App;
