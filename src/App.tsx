import { useState } from "react";
import Dashboard from "./pages/Dashboard";

function App() {
  const [logged, setLogged] = useState(
    localStorage.getItem("logged") === "true"
  );

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (user === "admin" && password === "123456") {
      localStorage.setItem("logged", "true");
      setLogged(true);
    } else {
      setError("Usuário ou senha inválidos");
    }
  }

  if (logged) {
    return <Dashboard />;
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>🔐 Login</h2>

        <input
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button}>Entrar</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    background: "#020617",
    padding: 30,
    borderRadius: 8,
    width: 300,
    color: "#fff",
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  input: {
    padding: 10,
    borderRadius: 4,
    border: "none",
  },
  button: {
    padding: 10,
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "#fff",
  },
  error: {
    color: "#f87171",
    fontSize: 14,
  },
};

export default App;
