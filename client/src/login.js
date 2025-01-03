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
    <div className="Content">
        <h1>CitaCare</h1>
        <div className="Container_log">
            <h2>Inicio de Sesion</h2>
            <form onSubmit={handleSubmit}>
                <input id="user" type="text" name="user" placeholder="Usuario" value={usuario} onChange={(e) => setUser(e.target.value)}/>
                <input type="password" name="password" placeholder="Contraseña" value={contrasenia} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Iniciar Sesion</button>
            </form>
        </div>
    </div>
    );
}

export default Login;