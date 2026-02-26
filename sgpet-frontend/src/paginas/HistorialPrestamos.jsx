// sgpet-frontend/src/paginas/HistorialPrestamos.jsx:
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Encabezado from "../componentes/Encabezado";
import Menu from "../componentes/Menu";

export default function HistorialPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/prestamos");
      setPrestamos(data);
    } catch {
      setError("No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      <Encabezado />
      <Menu /> {/* */}
      <div style={{ padding: 18, maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 12 }}>Mi Historial de Préstamos</h2>

        {loading && (
          <p style={{ color: "rgba(231,236,243,0.65)" }}>Cargando...</p>
        )}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Equipo</th>
                  <th>Estado</th>
                  <th>Fecha Préstamo</th>
                  <th>Fecha Devolución</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      {p.equipo?.nombre ?? "—"}
                      <div style={styles.small}>{p.equipo?.codigo ?? ""}</div>
                    </td>
                    <td>
                      <span style={pill(p.estado)}>{p.estado}</span>
                    </td>
                    <td>{formatFecha(p.fechaPrestamo)}</td>
                    <td>{formatFecha(p.fechaDevolucion)}</td>
                  </tr>
                ))}
                {prestamos.length === 0 && (
                  <tr>
                    <td colSpan="5" style={styles.empty}>
                      No tienes préstamos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function formatFecha(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

function pill(estado) {
  const base = {
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,0.14)",
    display: "inline-block",
  };
  const map = {
    PENDIENTE: { background: "rgba(255, 193, 7, 0.18)" },
    APROBADO: { background: "rgba(47, 111, 235, 0.25)" },
    RECHAZADO: { background: "rgba(255, 77, 79, 0.18)" },
    DEVUELTO: { background: "rgba(46, 204, 113, 0.18)" },
    VENCIDO: { background: "rgba(231, 76, 60, 0.18)" },
  };
  return {
    ...base,
    ...(map[estado] ?? { background: "rgba(255,255,255,0.08)" }),
  };
}

const styles = {
  card: {
    background: "rgba(18, 26, 43, 0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  small: { fontSize: 12, color: "rgba(231,236,243,0.6)", marginTop: 2 },
  empty: { padding: 18, textAlign: "center" },
  error: {
    padding: 10,
    borderRadius: 10,
    background: "rgba(255, 77, 79, 0.12)",
    border: "1px solid rgba(255, 77, 79, 0.25)",
  },
};
