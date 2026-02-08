import {useState} from "react";
import './Login.css'
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
    const [usuario,setUser] = useState('');
    const [contrasenia,setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, contrasenia }),
        });
    
        const data = await response.json();
    
        if (response.ok && data.ok) {
              // Guardar el nombre completo del usuario en localStorage
            localStorage.setItem("nombreCompleto", data.nombre);
            localStorage.setItem("role", data.rol);
            localStorage.setItem("userId", data.id);
            // Redirigir según el rol
            if (data.rol === "medico") {
            navigate("/medico");
            } else if (data.rol === "paciente") {
            navigate("/paciente");
            } else if (data.rol === "empleado") {
            navigate("/empleado");
            }
        } else {
            Swal.fire({
                title: "Autenticación",
                text: data.message || "Error de autenticación",
                icon: data.ok ? "success" : "error", // Icono basado en la respuesta
                confirmButtonText: "Aceptar",
            });
        }
        } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    }
    };

    return (
        <div className="login-page">
            <div className="login-background" />
            <div className="login-visual">
                <span className="login-visual__orb" />
                <span className="login-visual__orb login-visual__orb--secondary" />
                <span className="login-visual__orb login-visual__orb--tertiary" />
            </div>
            <div className="login-content">
                <h1 className="login-logo">citaCare</h1>
                <div className="login-card">
                    <h2 className="login-title">Inicio de Sesión</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <input
                            id="user"
                            type="text"
                            name="user"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUser(e.target.value)}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={contrasenia}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;