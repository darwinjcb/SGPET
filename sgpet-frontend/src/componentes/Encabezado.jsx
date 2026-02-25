// sgpet-frontend/src/componentes/Encabezado.jsx:
import { useNavigate } from "react-router-dom";
import { clearSession, getUsuario } from "../auth/auth";

export default function Encabezado() {
  const nav = useNavigate();
  const usuario = getUsuario();

  function salir() {
    clearSession();
    nav("/login", { replace: true });
  }

  return (
    <div style={styles.header}>
      <div>
        <div style={styles.brand}>SGPET</div>
        <div style={styles.sub}>
          {usuario
            ? `${usuario.nombres} ${usuario.apellidos} • ${usuario.rol}`
            : ""}
        </div>
      </div>

      <button onClick={salir} style={styles.btn}>
        CERRAR SESIÓN
      </button>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(18, 26, 43, 0.85)",
    backdropFilter: "blur(10px)",
  },
  brand: { fontWeight: 900, letterSpacing: 0.8 },
  sub: { fontSize: 12, color: "rgba(231,236,243,0.65)", marginTop: 2 },
  btn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(11,18,32,0.55)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
};
