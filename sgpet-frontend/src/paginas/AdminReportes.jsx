// sgpet-frontend/src/paginas/AdminReportes.jsx:
import { useEffect, useState } from "react";
import Encabezado from "../componentes/Encabezado";
import { api } from "../api/axios";
import Menu from "../componentes/Menu";

export default function AdminReportes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [prestamosRetraso, setPrestamosRetraso] = useState([]);
  const [equiposMantenimiento, setEquiposMantenimiento] = useState([]);
  const [top, setTop] = useState(5);
  const [equiposMasPrestados, setEquiposMasPrestados] = useState([]);
  const [usuariosMasPrestamos, setUsuariosMasPrestamos] = useState([]);

  async function cargarTodo() {
    setLoading(true);
    setError("");
    try {
      const [a, r, m, emp, ump] = await Promise.all([
        api.get("/reportes/prestamos-activos"),
        api.get("/reportes/prestamos-retraso"),
        api.get("/reportes/equipos-mantenimiento"),
        api.get(`/reportes/equipos-mas-prestados?top=${top}`),
        api.get(`/reportes/usuarios-mas-prestamos?top=${top}`),
      ]);

      setPrestamosActivos(a.data ?? []);
      setPrestamosRetraso(r.data ?? []);
      setEquiposMantenimiento(m.data ?? []);
      setEquiposMasPrestados(emp.data ?? []);
      setUsuariosMasPrestamos(ump.data ?? []);
    } catch (e) {
      setError("No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top]);

  return (
    <div>
      <Encabezado />
      <Menu /> {/* */}
      <div style={styles.container}>
        <div style={styles.topbar}>
          <div>
            <h2 style={{ margin: 0 }}>Reportes</h2>
            <div style={styles.sub}>
              Resumen operativo del sistema (solo ADMIN)
            </div>
          </div>

          <div style={styles.actions}>
            <label style={styles.labelInline}>
              TOP:
              <select
                value={top}
                onChange={(e) => setTop(Number(e.target.value))}
                style={styles.select}
                disabled={loading}
              >
                {[3, 5, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={cargarTodo}
              style={styles.btnSecondary}
              disabled={loading}
            >
              {loading ? "CARGANDO..." : "ACTUALIZAR"}
            </button>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.grid}>
          <Seccion
            titulo="Préstamos activos"
            subtitulo="Préstamos en estado APROBADO (en curso)"
            items={prestamosActivos}
            empty="No hay préstamos activos."
            renderItem={(p) => (
              <Fila
                left={`#${p.id} • ${p.usuario?.nombres ?? ""} ${
                  p.usuario?.apellidos ?? ""
                }`}
                right={`${p.equipo?.nombre ?? "—"} • Dev: ${fmt(p.fechaDevolucion)}`}
                badge={p.estado}
              />
            )}
          />

          <Seccion
            titulo="Préstamos en retraso"
            subtitulo="Préstamos vencidos / fuera de fecha"
            items={prestamosRetraso}
            empty="No hay préstamos en retraso."
            renderItem={(p) => (
              <Fila
                left={`#${p.id} • ${p.usuario?.nombres ?? ""} ${
                  p.usuario?.apellidos ?? ""
                }`}
                right={`${p.equipo?.nombre ?? "—"} • Dev: ${fmt(p.fechaDevolucion)}`}
                badge={p.estado}
              />
            )}
          />

          <Seccion
            titulo="Equipos en mantenimiento"
            subtitulo="Equipos no disponibles por daños o revisión"
            items={equiposMantenimiento}
            empty="No hay equipos en mantenimiento."
            renderItem={(e) => (
              <Fila
                left={`${e.nombre ?? "—"}`}
                right={`${e.codigo ?? ""} • Estado: ${e.estado ?? "—"}`}
                badge="MANTENIMIENTO"
              />
            )}
          />

          <div style={styles.card}>
            <div style={styles.cardHead}>
              <div>
                <div style={styles.cardTitle}>Rankings (TOP {top})</div>
                <div style={styles.cardSub}>
                  Equipos más prestados y usuarios con más préstamos
                </div>
              </div>
            </div>

            <div style={styles.split}>
              <div>
                <div style={styles.miniTitle}>Equipos más prestados</div>
                {equiposMasPrestados?.length ? (
                  <ol style={styles.ol}>
                    {equiposMasPrestados.map((x, idx) => (
                      <li key={idx} style={styles.li}>
                        <span>
                          {x.nombre ?? x.equipo?.nombre ?? "—"}{" "}
                          <span style={styles.muted}>
                            {x.codigo ?? x.equipo?.codigo ?? ""}
                          </span>
                        </span>
                        <span style={styles.count}>
                          {x.total ?? x.cantidad ?? x.count ?? "—"}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div style={styles.emptyMini}>Sin datos.</div>
                )}
              </div>

              <div>
                <div style={styles.miniTitle}>Usuarios con más préstamos</div>
                {usuariosMasPrestamos?.length ? (
                  <ol style={styles.ol}>
                    {usuariosMasPrestamos.map((x, idx) => (
                      <li key={idx} style={styles.li}>
                        <span>
                          {(x.nombres ?? x.usuario?.nombres ?? "—") +
                            " " +
                            (x.apellidos ?? x.usuario?.apellidos ?? "")}
                          <span style={styles.muted}>
                            {" "}
                            {x.email ?? x.usuario?.email ?? ""}
                          </span>
                        </span>
                        <span style={styles.count}>
                          {x.total ?? x.cantidad ?? x.count ?? "—"}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div style={styles.emptyMini}>Sin datos.</div>
                )}
              </div>
            </div>

            <div style={styles.note}>
              Nota: Si algún ranking muestra “—”, es porque tu backend devuelve
              nombres de campos distintos. Si pasa, me mandas una captura del
              JSON y lo ajusto en 1 minuto.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Seccion({ titulo, subtitulo, items, empty, renderItem }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        <div>
          <div style={styles.cardTitle}>{titulo}</div>
          <div style={styles.cardSub}>{subtitulo}</div>
        </div>
        <div style={styles.badgeCount}>{items?.length ?? 0}</div>
      </div>

      <div style={styles.list}>
        {items?.length ? (
          items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)
        ) : (
          <div style={styles.empty}>{empty}</div>
        )}
      </div>
    </div>
  );
}

function Fila({ left, right, badge }) {
  return (
    <div style={styles.row}>
      <div>
        <div style={styles.rowLeft}>{left}</div>
        <div style={styles.rowRight}>{right}</div>
      </div>
      <span style={pill(badge)}>{badge}</span>
    </div>
  );
}

function fmt(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString();
}

function pill(estado) {
  const base = {
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,0.14)",
    display: "inline-block",
    whiteSpace: "nowrap",
  };

  const map = {
    APROBADO: { background: "rgba(47, 111, 235, 0.25)" },
    PENDIENTE: { background: "rgba(255, 193, 7, 0.18)" },
    RECHAZADO: { background: "rgba(255, 77, 79, 0.18)" },
    DEVUELTO: { background: "rgba(46, 204, 113, 0.18)" },
    VENCIDO: { background: "rgba(231, 76, 60, 0.18)" },
    MANTENIMIENTO: { background: "rgba(155, 89, 182, 0.20)" },
  };

  return {
    ...base,
    ...(map[estado] ?? { background: "rgba(255,255,255,0.08)" }),
  };
}

const styles = {
  container: { padding: 18, maxWidth: 1200, margin: "0 auto" },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  sub: { fontSize: 12, color: "rgba(231,236,243,0.65)", marginTop: 4 },
  actions: { display: "flex", gap: 10, alignItems: "center" },
  labelInline: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 800,
    color: "rgba(231,236,243,0.85)",
  },
  select: {
    padding: "10px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(11,18,32,0.65)",
    color: "white",
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 12,
  },
  card: {
    background: "rgba(18, 26, 43, 0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    overflow: "hidden",
  },
  cardHead: {
    padding: 14,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  cardTitle: { fontWeight: 900, letterSpacing: 0.2 },
  cardSub: { fontSize: 12, color: "rgba(231,236,243,0.65)", marginTop: 4 },
  badgeCount: {
    minWidth: 34,
    height: 34,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(11,18,32,0.55)",
  },
  list: { padding: 10, display: "grid", gap: 8 },
  row: {
    padding: 10,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  rowLeft: { fontWeight: 800 },
  rowRight: { fontSize: 12, color: "rgba(231,236,243,0.65)", marginTop: 3 },
  empty: { padding: 12, color: "rgba(231,236,243,0.65)" },
  error: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    background: "rgba(255, 77, 79, 0.12)",
    border: "1px solid rgba(255, 77, 79, 0.25)",
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
  split: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    padding: 14,
  },
  miniTitle: { fontWeight: 900, marginBottom: 8 },
  ol: { margin: 0, paddingLeft: 18, display: "grid", gap: 8 },
  li: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
  },
  count: {
    fontWeight: 900,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(11,18,32,0.55)",
    whiteSpace: "nowrap",
  },
  muted: { color: "rgba(231,236,243,0.55)", fontSize: 12 },
  emptyMini: { padding: 10, color: "rgba(231,236,243,0.65)" },
  note: {
    padding: 14,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    fontSize: 12,
    color: "rgba(231,236,243,0.6)",
  },
};
