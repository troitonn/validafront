import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginFake, isAuthenticated } from "./auth/auth.ts";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loginFake(user, password)) {
      navigate("/dashboard");
    } else {
      setError("Usuário ou senha inválidos");
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <div style={styles.header}>
          <span style={{ fontSize: "30px" }}>🔐</span>
          <h2 style={{ margin: 0, fontSize: "28px" }}>Login</h2>
        </div>

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

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0d1117",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#010409",
    padding: "40px 30px",
    borderRadius: "8px",
    width: "350px",
    color: "#fff",
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    border: "1px solid #30363d"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "10px"
  },
  input: {
    padding: "12px 15px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    background: "#161b22",
    color: "#fff",
    fontSize: "16px",
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
    fontSize: "16px",
    transition: "background 0.2s",
  },
  error: {
    color: "#f85149",
    fontSize: "14px",
    textAlign: "center" as const,
    margin: 0,
  },
};

export default App;
