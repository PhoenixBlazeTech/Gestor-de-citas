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
            <button
                onClick={toggleMenu}
                className={`user-button ${menuOpen ? "is-open" : ""}`}
            >
                <span className="user-avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </span>
                <span className="user-name">{nombreCompleto || "Usuario"}</span>
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