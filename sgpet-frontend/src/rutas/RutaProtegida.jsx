// sgpet-frontend/src/rutas/RutaProtegida.jsx:
import { Navigate } from "react-router-dom";
import { isLoggedIn, hasRole } from "../auth/auth";

export default function RutaProtegida({ roles, children }) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (roles && roles.length > 0 && !hasRole(roles)) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return children;
}