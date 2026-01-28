import { useState } from "react";

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user === "admin" && password === "123456") {
      localStorage.setItem("auth", "true");
      onLogin();
    } else {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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

        <button style={styles.button}>Entrar</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 8,
    width: 300,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;
