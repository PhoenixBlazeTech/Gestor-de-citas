import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Header.css";




function Header({username}){
    const [menuOpen, setMenuOpen] = useState(false);
    const [nombreCompleto, setNombreCompleto] = useState("");
    const navigate = useNavigate(); // Hook para redirigir

    useEffect(() => {
        // Obtener el nombre completo del usuario desde localStorage
        const storedNombreCompleto = localStorage.getItem("nombreCompleto");
        if (storedNombreCompleto) {
            setNombreCompleto(storedNombreCompleto);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const handleLogout = () => {
      // Limpiar el localStorage y redirigir al login
        localStorage.clear();
        window.location.href = "/";
    };

    const handleConfiguracion = () => {
        navigate("/configuracion"); // Redirige a la página de configuración
    };

    return(
        <header className="Header">
        <div className="Logo">
            <img src="fav.png" alt="logo"/>
            <h1>CitaCare</h1>
        </div>
        <div className="user-menu">
            {/* Botón con la flecha dinámica */}
            <button onClick={toggleMenu} className="user-button">
                    {nombreCompleto}
                    <span className="dropdown-arrow">
                        {menuOpen ? "v" : "ʌ"}
                    </span>
                </button>
            {menuOpen && (
                <ul className="dropdown-menu">
                    <li>
                        <button onClick={handleConfiguracion}>
                            Configuración
                        </button>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Log Out</button>
                    </li>
                </ul>
            )}
            </div>
        </header>
    );
}

export default Header;