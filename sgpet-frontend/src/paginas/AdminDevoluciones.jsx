// sgpet-frontend/src/paginas/AdminDevoluciones.jsx:
import { useEffect, useMemo, useState } from "react";
import Encabezado from "../componentes/Encabezado";
import { api } from "../api/axios";

const ESTADOS = ["BUENO", "CON_DANOS", "NO_FUNCIONAL"];

export default function AdminDevoluciones() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prestamoId, setPrestamoId] = useState("");
  const [estadoEquipoAlDevolver, setEstadoEquipoAlDevolver] = useState("BUENO");
  const [observacion, setObservacion] = useState("");

  async function cargarPrestamos() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/prestamos");
      // Solo prestamos que tenga sentido devolver
      const filtrados = Array.isArray(data)
        ? data.filter((p) => p.estado === "APROBADO" || p.estado === "VENCIDO")
        : [];
      setPrestamos(filtrados);
    } catch {
      setError("No se pudieron cargar los préstamos para devolución.");
    } finally {
      setLoading(false);
    }
  }

  const prestamoSeleccionado = useMemo(() => {
    const idNum = Number(prestamoId);
    if (!idNum) return null;
    return prestamos.find((p) => p.id === idNum) ?? null;
  }, [prestamoId, prestamos]);

  async function registrar(e) {
    e.preventDefault();

    if (!prestamoId) {
      alert("Selecciona un préstamo.");
      return;
    }

    try {
      await api.post("/devoluciones", {
        prestamoId: Number(prestamoId),
        estadoEquipoAlDevolver,
        observacion: observacion ? observacion : undefined,
      });

      alert("Devolución registrada correctamente.");
      setPrestamoId("");
      setEstadoEquipoAlDevolver("BUENO");
      setObservacion("");
      await cargarPrestamos();
    } catch {
      alert("No se pudo registrar la devolución.");
    }
  }

  useEffect(() => {
    cargarPrestamos();
  }, []);

  return (
    <div>
      <Encabezado />

      <div style={{ padding: 18, maxWidth: 1000, margin: "0 auto" }}>
        <div style={styles.top}>
          <h2 style={{ margin: 0 }}>Registrar Devolución</h2>
          <button
            onClick={cargarPrestamos}
            style={styles.btnSecondary}
            disabled={loading}
          >
            {loading ? "CARGANDO..." : "ACTUALIZAR"}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.card}>
          <form onSubmit={registrar} style={{ display: "grid", gap: 10 }}>
            <label style={styles.label}>Préstamo (APROBADO / VENCIDO)</label>

            <select
              value={prestamoId}
              onChange={(e) => setPrestamoId(e.target.value)}
              style={styles.input}
            >
              <option value="">-- Selecciona un préstamo --</option>
              {prestamos.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} • {p.usuario?.nombres} {p.usuario?.apellidos} •{" "}
                  {p.equipo?.nombre}
                </option>
              ))}
            </select>

            {prestamoSeleccionado && (
              <div style={styles.info}>
                <div>
                  <b>Usuario:</b> {prestamoSeleccionado.usuario?.nombres}{" "}
                  {prestamoSeleccionado.usuario?.apellidos} (
                  {prestamoSeleccionado.usuario?.email})
                </div>
                <div>
                  <b>Equipo:</b> {prestamoSeleccionado.equipo?.nombre} (
                  {prestamoSeleccionado.equipo?.codigo})
                </div>
                <div>
                  <b>Estado préstamo:</b> {prestamoSeleccionado.estado}
                </div>
              </div>
            )}

            <label style={styles.label}>Estado del equipo al devolver</label>
            <select
              value={estadoEquipoAlDevolver}
              onChange={(e) => setEstadoEquipoAlDevolver(e.target.value)}
              style={styles.input}
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <label style={styles.label}>Observación (opcional)</label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
              placeholder="Ej: equipo con rayones leves..."
            />

            <button type="submit" style={styles.btnPrimary}>
              REGISTRAR DEVOLUCIÓN
            </button>

            <div style={styles.note}>
              BUENO → equipo vuelve DISPONIBLE • CON_DANOS/NO_FUNCIONAL → pasa a
              MANTENIMIENTO
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
    flexWrap: "wrap",
  },
  card: {
    background: "rgba(18, 26, 43, 0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
  },
  label: { fontWeight: 700, color: "rgba(231,236,243,0.9)" },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(11,18,32,0.65)",
    color: "white",
    outline: "none",
  },
  btnPrimary: {
    marginTop: 6,
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(180deg, #2f6feb, #1f4fbf)",
    color: "white",
    fontWeight: 900,
    letterSpacing: 0.6,
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(11,18,32,0.55)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  error: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    background: "rgba(255, 77, 79, 0.12)",
    border: "1px solid rgba(255, 77, 79, 0.25)",
  },
  info: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    fontSize: 13,
    lineHeight: 1.45,
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    color: "rgba(231,236,243,0.6)",
  },
};
