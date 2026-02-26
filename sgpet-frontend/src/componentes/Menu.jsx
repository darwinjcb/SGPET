// sgpet-frontend/src/componentes/Menu.jsx:
import { Link, useLocation } from "react-router-dom";
import { getUsuario } from "../auth/auth";

export default function Menu() {
  const u = getUsuario();
  const { pathname } = useLocation();

  const links =
    u?.rol === "ADMIN"
      ? [
          { to: "/admin", label: "PRÉSTAMOS" },
          { to: "/admin/devoluciones", label: "DEVOLUCIONES" },
          { to: "/admin/reportes", label: "REPORTES" },
        ]
      : [
          { to: "/app", label: "EQUIPOS" },
          { to: "/historial", label: "MI HISTORIAL" },
        ];

  return (
    <div style={styles.wrap}>
      {links.map((x) => {
        const active = pathname === x.to;
        return (
          <Link
            key={x.to}
            to={x.to}
            style={{
              ...styles.link,
              ...(active ? styles.active : {}),
            }}
          >
            {x.label}
          </Link>
        );
      })}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    gap: 10,
    padding: "12px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(11,18,32,0.35)",
    flexWrap: "wrap",
  },
  link: {
    textDecoration: "none",
    color: "rgba(231,236,243,0.85)",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(18, 26, 43, 0.60)",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    letterSpacing: 0.4,
  },
  active: {
    background: "rgba(47,111,235,0.22)",
    border: "1px solid rgba(47,111,235,0.40)",
    color: "white",
  },
};
