import { useEffect, useState } from "react";
import MedicoContent from "./MedicoContent";
import PacienteContent from "./PacienteContent";
import EmpleadoContent from "./EmpleadoContent";


function Main(){
    const [role, setRole] = useState("");

    useEffect(() => {
        // Recuperar el rol desde localStorage
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    // Renderizar contenido basado en el rol
    const renderContent = () => {
        if (role === "medico") {
            return <MedicoContent />;
        } else if (role === "paciente") {
            return <PacienteContent />;
        } else if (role === "empleado") {
            return <EmpleadoContent />;
        } else {
            return <p>No tienes acceso a esta sección</p>;
        }
    };

    return <div className="content">{renderContent()}</div>;
}

export default Main;