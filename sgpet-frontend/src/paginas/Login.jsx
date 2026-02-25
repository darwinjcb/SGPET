// sgpet-frontend/src/paginas/Login.jsx:
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { saveSession } from "../auth/auth";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const { data } = await api.post("/auth/login", {
                email,
                password,
            });

            saveSession(data);

            if (data.usuario.rol === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/app");
            }
        } catch (err) {
            setError("Credenciales inválidas.");
        }
    }

    return (
        <div style={{ maxWidth: 380, margin: "60px auto" }}>
            <h2>SGPET - Login</h2>

            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 12 }}
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 12 }}
                />

                {error && <p>{error}</p>}

                <button style={{ width: "100%", padding: 10 }}>
                    Ingresar
                </button>
            </form>
        </div>
    );
}