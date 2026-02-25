// sgpet-frontend/src/paginas/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { saveSession } from "../auth/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      saveSession(data);

      if (data.usuario.rol === "ADMIN") navigate("/admin");
      else navigate("/app");
    } catch {
      setError("Credenciales inválidas.");
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Sistema de Gestión de Préstamo de Equipos Tecnológicos
        </h1>
        <p style={styles.subtitle}>Acceso al sistema</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ej. usuario@correo.com"
            style={styles.input}
            autoFocus
          />

          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            style={styles.input}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            INGRESAR
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.muted}>SGPET • React + NestJS</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "rgba(18, 26, 43, 0.88)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: 22,
    lineHeight: 1.25,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "rgba(231,236,243,0.75)",
    marginBottom: 18,
  },
  form: {
    display: "grid",
    gap: 10,
  },
  label: {
    fontWeight: 600,
    color: "rgba(231,236,243,0.9)",
    marginTop: 6,
  },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(11,18,32,0.65)",
    color: "white",
    outline: "none",
  },
  button: {
    marginTop: 10,
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(180deg, #2f6feb, #1f4fbf)",
    color: "white",
    fontWeight: 800,
    letterSpacing: 0.8,
    cursor: "pointer",
  },
  error: {
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    background: "rgba(255, 77, 79, 0.12)",
    border: "1px solid rgba(255, 77, 79, 0.25)",
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  muted: {
    color: "rgba(231,236,243,0.6)",
    fontSize: 12,
  },
};
