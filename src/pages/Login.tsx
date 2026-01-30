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
        <h2 style={styles.title}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#01222e",
    backgroundImage: `url("/3d-render-abstract-technology-with-flowing-particles.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backdropFilter: "blur(5px)",
  },
  card: {
    width: 350,
    padding: "40px 30px",
    borderRadius: "20px",
    backgroundColor: "rgba(255,255,255,0.05)", // vidro transparente
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    color: "#1ad3a9",
    marginBottom: "20px",
    fontWeight: 600,
    fontSize: "1.5rem",
  },
  error: {
    color: "#ff4d4f",
    marginBottom: "10px",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: "15px",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#1ad3a9",
    color: "#01222e",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

// Export padrão
export default Login;
