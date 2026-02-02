import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginFake } from "../auth/auth.ts";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginFake(user, password)) {
      navigate("/dashboard");
    } else {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#01222e",
        backgroundImage: `url("/3d-render-abstract-technology-with-flowing-particles.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* CSS para esconder o ícone de senha nativo do navegador */}
      <style>
        {`
          input::-ms-reveal,
          input::-ms-clear,
          input::-webkit-contacts-auto-fill-button,
          input::-webkit-credentials-auto-fill-button {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            position: absolute !important;
            right: 0 !important;
          }
        `}
      </style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(1, 34, 46, 0.4)",
          zIndex: 0,
        }}
      ></div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{
          position: "relative",
          zIndex: 10,
          width: 350,
          padding: "40px 30px",
          borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.05)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#1ad3a9", fontSize: "1.8rem", marginBottom: 20, fontWeight: 600, textAlign: "center" }}>
          Hub Somos a Unica
        </h2>

        {error && (
          <p style={{ color: "#ff4d4f", marginBottom: 15, fontSize: "0.9rem", textAlign: "center" }}>
            {error}
          </p>
        )}

        <div style={{ width: "100%", marginBottom: 15 }}>
          <input
            type="text"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ width: "100%", marginBottom: 20, position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="field_access_token" // Nome genérico para despistar o navegador
            id="field_access_token"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            style={{
               ...inputStyle,
               paddingRight: "45px" 
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#1ad3a9",
              cursor: "pointer",
              fontSize: "1.2rem",
              zIndex: 20, // Z-index alto para ficar acima de qualquer ícone do navegador
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0
            }}
          >
            {/* Mantendo apenas os seus cadeados originais */}
            {showPassword ? "🔓" : "🔒"}
          </button>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "none",
            backgroundColor: "#1ad3a9",
            color: "#01222e",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Entrar
        </button>

        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            lineHeight: "1.4"
          }}
        >
          Sistema desenvolvido para otimização dos relatórios
        </p>
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  backgroundColor: "rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

export default Login;
