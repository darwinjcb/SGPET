// sgpet-frontend/src/paginas/AdminPrestamos.jsx:
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Encabezado from "../componentes/Encabezado";
import Menu from "../componentes/Menu";

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
    } catch {
      setError("No fue posible cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  }

  async function aprobar(id) {
    if (!confirm("¿Aprobar este préstamo?")) return;
    try {
      await api.patch(`/prestamos/${id}/aprobar`, {}); // ✅ por DTO
      await cargar();
    } catch {
      alert("No se pudo aprobar.");
    }
  }

  async function rechazar(id) {
    if (!confirm("¿Rechazar este préstamo?")) return;
    try {
      await api.patch(`/prestamos/${id}/rechazar`, {}); // ✅ por DTO
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
      <Menu /> {/* */}
      <div style={styles.container}>
        <div style={styles.top}>
          <h2 style={styles.h2}>Préstamos</h2>

          <button
            style={{
              ...styles.refresh,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={cargar}
            disabled={loading}
          >
            {loading ? "CARGANDO..." : "ACTUALIZAR"}
          </button>
        </div>

        {loading && <p style={styles.muted}>Cargando...</p>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Usuario</th>
                  <th style={styles.th}>Equipo</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Fecha Préstamo</th>
                  <th style={styles.th}>Fecha Devolución</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {prestamos.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>{p.id}</td>

                    <td style={styles.td}>
                      {p.usuario
                        ? `${p.usuario.nombres} ${p.usuario.apellidos}`
                        : "—"}
                      <div style={styles.small}>{p.usuario?.email ?? ""}</div>
                    </td>

                    <td style={styles.td}>
                      {p.equipo ? p.equipo.nombre : "—"}
                      <div style={styles.small}>{p.equipo?.codigo ?? ""}</div>
                    </td>

                    <td style={styles.td}>
                      <span style={pill(p.estado)}>{p.estado}</span>
                    </td>

                    <td style={styles.td}>{formatFecha(p.fechaPrestamo)}</td>
                    <td style={styles.td}>{formatFecha(p.fechaDevolucion)}</td>

                    <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                      {p.estado === "PENDIENTE" ? (
                        <>
                          <button
                            style={styles.btnOk}
                            onClick={() => aprobar(p.id)}
                          >
                            APROBAR
                          </button>
                          <button
                            style={styles.btnBad}
                            onClick={() => rechazar(p.id)}
                          >
                            RECHAZAR
                          </button>
                        </>
                      ) : (
                        <span style={styles.sinAcciones}>Sin acciones</span>
                      )}
                    </td>
                  </tr>
                ))}

                {prestamos.length === 0 && (
                  <tr>
                    <td colSpan="7" style={styles.empty}>
                      No se encontraron préstamos.
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
  th: {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: 0.4,
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(231,236,243,0.8)",
  },
  td: {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    verticalAlign: "top",
  },
  tr: {},
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
  sinAcciones: {
    fontSize: 12,
    color: "rgba(231,236,243,0.6)",
  },
  refresh: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(11,18,32,0.55)",
    color: "white",
    fontWeight: 800,
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
