import {useState} from "react";
import './Login.css'
import { useNavigate } from "react-router-dom";

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
            // Redirigir según el rol
            if (data.rol === "medico") {
            navigate("/medico");
            } else if (data.rol === "paciente") {
            navigate("/paciente");
            } else if (data.rol === "empleado") {
            navigate("/empleado");
            }
        } else {
            alert(data.message || "Error de autenticación");
        }
        } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    }
    };
    return (
    <>
        <h1>CitaCare</h1>
        <div className="Container_log">
            <h2>Inicio de Sesion</h2>
            <form onSubmit={handleSubmit}>
                <input id="user" type="text" name="user" placeholder="Usuario" value={usuario} onChange={(e) => setUser(e.target.value)}/>
                <input type="password" name="password" placeholder="Contraseña" value={contrasenia} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Iniciar Sesion</button>
            </form>
        </div>
    </>
    );
}

export default Login;