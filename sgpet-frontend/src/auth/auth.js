// sgpet-frontend/src/auth/auth.js:
export function saveSession({ access_token, usuario }) {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function clearSession() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario");
}

export function getUsuario() {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
}

export function getToken() {
    return localStorage.getItem("access_token");
}

export function isLoggedIn() {
    return !!getToken();
}

export function hasRole(roles = []) {
    const usuario = getUsuario();
    if (!usuario) return false;
    return roles.includes(usuario.rol);
}