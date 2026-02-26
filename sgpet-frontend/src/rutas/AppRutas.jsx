// sgpet-frontend/src/rutas/AppRutas.jsx:
// sgpet-frontend/src/rutas/AppRutas.jsx:
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../paginas/Login";
import NoAutorizado from "../paginas/NoAutorizado";
import RutaProtegida from "./RutaProtegida";
import EquiposDisponibles from "../paginas/EquiposDisponibles";
import HistorialPrestamos from "../paginas/HistorialPrestamos";
import AdminDevoluciones from "../paginas/AdminDevoluciones";
import AdminPrestamos from "../paginas/AdminPrestamos";
import AdminReportes from "../paginas/AdminReportes";

export default function AppRutas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* ✅ Panel principal ADMIN */}
        <Route
          path="/admin"
          element={
            <RutaProtegida roles={["ADMIN"]}>
              <AdminPrestamos />
            </RutaProtegida>
          }
        />

        {/* ✅ NUEVA RUTA: ADMIN DEVOLUCIONES */}
        <Route
          path="/admin/devoluciones"
          element={
            <RutaProtegida roles={["ADMIN"]}>
              <AdminDevoluciones />
            </RutaProtegida>
          }
        />

        {/* ✅ NUEVA RUTA: ADMIN REPORTES */}
        <Route
          path="/admin/reportes"
          element={
            <RutaProtegida roles={["ADMIN"]}>
              <AdminReportes />
            </RutaProtegida>
          }
        />

        {/* ✅ Usuarios DOCENTE y ESTUDIANTE */}
        <Route
          path="/app"
          element={
            <RutaProtegida roles={["DOCENTE", "ESTUDIANTE"]}>
              <EquiposDisponibles />
            </RutaProtegida>
          }
        />

        {/* ✅ Historial */}
        <Route
          path="/historial"
          element={
            <RutaProtegida roles={["DOCENTE", "ESTUDIANTE"]}>
              <HistorialPrestamos />
            </RutaProtegida>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div style={{ padding: 20 }}>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}
