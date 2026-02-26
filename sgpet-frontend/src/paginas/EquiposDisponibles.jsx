// sgpet-frontend/src/paginas/EquiposDisponibles.jsx:
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Encabezado from "../componentes/Encabezado";

export default function EquiposDisponibles() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");

  async function cargar() {
    setLoading(true);
    setError("");
    setMensaje("");
    try {
      const { data } = await api.get("/reportes/equipos-disponibles");
      setEquipos(data);
      setMensaje("Lista actualizada.");
      window.setTimeout(() => setMensaje(""), 1500);
    } catch {
      setError("No se pudieron cargar los equipos disponibles.");
    } finally {
      setLoading(false);
    }
  }

  async function solicitar(equipoId) {
    if (!fechaDevolucion) {
      alert("Selecciona una fecha de devolución.");
      return;
    }

    const idNum = Number(equipoId);
    setSubmittingId(idNum);

    try {
      await api.post("/prestamos/solicitar", {
        equipoId: idNum,
        fechaDevolucion: new Date(fechaDevolucion).toISOString(),
      });

      alert("Solicitud enviada. Espera aprobación del administrador.");
      setFechaDevolucion("");
      await cargar();
    } catch {
      alert("No se pudo solicitar el préstamo.");
    } finally {
      setSubmittingId(null);
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
          <h2 style={styles.h2}>Equipos Disponibles</h2>

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

        <div style={styles.row}>
          <div style={styles.muted}>Fecha devolución (para solicitar):</div>
          <input
            type="date"
            value={fechaDevolucion}
            onChange={(e) => setFechaDevolucion(e.target.value)}
            style={styles.date}
          />
        </div>

        {mensaje && <p style={styles.muted}>{mensaje}</p>}
        {loading && <p style={styles.muted}>Cargando...</p>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && (
          <div style={styles.grid}>
            {equipos.map((eq) => {
              const enviando = submittingId === eq.id;
              const sinFecha = !fechaDevolucion;

              return (
                <div key={eq.id} style={styles.card}>
                  <div style={styles.nombre}>{eq.nombre}</div>
                  <div style={styles.small}>{eq.codigo}</div>
                  <div style={styles.small}>
                    Categoría: {eq.categoria?.nombre ?? "—"}
                  </div>
                  <div style={styles.small}>Estado: {eq.estado}</div>

                  <button
                    style={{
                      ...styles.btnOk,
                      opacity: enviando || sinFecha ? 0.7 : 1,
                      cursor: enviando || sinFecha ? "not-allowed" : "pointer",
                    }}
                    onClick={() => solicitar(eq.id)}
                    disabled={enviando || sinFecha}
                    title={sinFecha ? "Selecciona una fecha de devolución" : ""}
                  >
                    {enviando ? "ENVIANDO..." : "SOLICITAR PRÉSTAMO"}
                  </button>
                </div>
              );
            })}

            {equipos.length === 0 && (
              <div style={styles.muted}>No hay equipos disponibles.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
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
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  date: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(11,18,32,0.65)",
    color: "white",
    outline: "none",
  },
  refresh: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(11,18,32,0.55)",
    color: "white",
    fontWeight: 800,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
  },
  card: {
    background: "rgba(18, 26, 43, 0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
  },
  nombre: { fontWeight: 900, marginBottom: 4 },
  small: { fontSize: 12, color: "rgba(231,236,243,0.65)", marginBottom: 2 },
  btnOk: {
    marginTop: 10,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(47,111,235,0.25)",
    color: "white",
    fontWeight: 900,
  },
};
