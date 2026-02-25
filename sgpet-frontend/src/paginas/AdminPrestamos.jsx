// sgpet-frontend/src/paginas/AdminPrestamos.jsx:
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Encabezado from "../componentes/Encabezado";

export default function AdminPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/prestamos");
      setPrestamos(data);
    } catch (e) {
      setError("No fue posible cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  }

  async function aprobar(id) {
    if (!confirm("¿Aprobar este préstamo?")) return;
    try {
      await api.patch(`/prestamos/${id}/aprobar`);
      await cargar();
    } catch {
      alert("No se pudo aprobar.");
    }
  }

  async function rechazar(id) {
    if (!confirm("¿Rechazar este préstamo?")) return;
    try {
      await api.patch(`/prestamos/${id}/rechazar`);
      await cargar();
    } catch {
      alert("No se pudo rechazar.");
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      <Encabezado />

      <div style={styles.container}>
        <div style={styles.top}>
          <h2 style={styles.h2}>Préstamos</h2>
          <button style={styles.refresh} onClick={cargar}>
            ACTUALIZAR
          </button>
        </div>

        {loading && <p style={styles.muted}>Cargando...</p>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Equipo</th>
                  <th>Estado</th>
                  <th>Fecha Préstamo</th>
                  <th>Fecha Devolución</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {prestamos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>

                    <td>
                      {p.usuario
                        ? `${p.usuario.nombres} ${p.usuario.apellidos}`
                        : "—"}
                      <div style={styles.small}>{p.usuario?.email ?? ""}</div>
                    </td>

                    <td>
                      {p.equipo ? p.equipo.nombre : "—"}
                      <div style={styles.small}>{p.equipo?.codigo ?? ""}</div>
                    </td>

                    <td>
                      <span style={pill(p.estado)}>{p.estado}</span>
                    </td>

                    <td>{formatFecha(p.fechaPrestamo)}</td>
                    <td>{formatFecha(p.fechaDevolucion)}</td>

                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        style={styles.btnOk}
                        onClick={() => aprobar(p.id)}
                        disabled={p.estado !== "PENDIENTE"}
                        title="Solo PENDIENTE"
                      >
                        APROBAR
                      </button>
                      <button
                        style={styles.btnBad}
                        onClick={() => rechazar(p.id)}
                        disabled={p.estado !== "PENDIENTE"}
                        title="Solo PENDIENTE"
                      >
                        RECHAZAR
                      </button>
                    </td>
                  </tr>
                ))}

                {prestamos.length === 0 && (
                  <tr>
                    <td colSpan="7" style={styles.empty}>
                      No hay préstamos.
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
  // puede venir como string ISO
  const d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

const styles = {
  container: { padding: 18, maxWidth: 1200, margin: "0 auto" },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  h2: { margin: 0 },
  muted: { color: "rgba(231,236,243,0.65)" },
  error: {
    padding: 10,
    borderRadius: 10,
    background: "rgba(255, 77, 79, 0.12)",
    border: "1px solid rgba(255, 77, 79, 0.25)",
  },
  card: {
    background: "rgba(18, 26, 43, 0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  small: { fontSize: 12, color: "rgba(231,236,243,0.6)", marginTop: 2 },
  empty: { padding: 18, textAlign: "center" },
  btnOk: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(47,111,235,0.25)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
    marginRight: 8,
  },
  btnBad: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,77,79,0.18)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  refresh: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(11,18,32,0.55)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
};

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
