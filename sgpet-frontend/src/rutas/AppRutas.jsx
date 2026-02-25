// sgpet-frontend/src/rutas/AppRutas.jsx:
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../paginas/Login";
import NoAutorizado from "../paginas/NoAutorizado";
import RutaProtegida from "./RutaProtegida";

function AdminHome() {
    return <div style={{ padding: 20 }}>Panel ADMIN</div>;
}

function AppHome() {
    return <div style={{ padding: 20 }}>Panel Usuario</div>;
}

export default function AppRutas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/no-autorizado" element={<NoAutorizado />} />

                <Route
                    path="/admin"
                    element={
                        <RutaProtegida roles={["ADMIN"]}>
                            <AdminHome />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/app"
                    element={
                        <RutaProtegida roles={["DOCENTE", "ESTUDIANTE"]}>
                            <AppHome />
                        </RutaProtegida>
                    }
                />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}