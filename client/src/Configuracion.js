import React, { useState, useEffect } from "react";
import MedicoConfig from "./MedicoConfig";
import PacienteConfig from "./PacienteConfig";
import EmpleadoConfig from "./EmpleadoConfig";
import "./Configuracion.css";

function Configuracion() {
    const [role, setRole] = useState("");

    useEffect(() => {
        // Obtener el rol desde localStorage
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    // Renderizar contenido basado en el rol
    const renderContent = () => {
        if (role === "medico") {
            return <MedicoConfig />;
        } else if (role === "paciente") {
            return <PacienteConfig />;
        } else if (role === "empleado") {
            return <EmpleadoConfig />;
        } else {
            return <p>No tienes acceso a la configuración.</p>;
        }
    };

    return renderContent();
}

export default Configuracion;
