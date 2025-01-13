import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PadecimientoForm from "./PadecimientoForm";
import DiagnosticoForm from "./DiagnosticoForm";

function DiagnosticoPage() {
    const { citaId, pacienteId } = useParams(); // Captura ambos parámetros
    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (pacienteId) {
            console.log("Fetching data for ID:", pacienteId); // Verificar el ID que se está pasando
            fetch(`http://localhost:5000/api/pacientes/${pacienteId}`)
                .then((res) => {
                    console.log("Response status:", res.status); // Verifica el código de estado
                    if (!res.ok) {
                        throw new Error("Error al obtener datos del paciente");
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Datos recibidos del backend:", data); // Verifica los datos recibidos
                    setPaciente(data);
                    setError(null);
                })
                .catch((err) => {
                    console.error("Error fetching paciente:", err);
                    setError("No se pudieron cargar los datos del paciente.");
                });
        }
    }, [pacienteId]);

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!paciente) {
        return <h2>Cargando datos del paciente...</h2>;
    }

    return (
        <div>
            <h1>Diagnóstico del Paciente</h1>
            <h2>{paciente.nombre_completo}</h2> {/* Nombre del paciente */}
            <div>
                {/* Formularios combinados */}
                <PadecimientoForm pacienteId={pacienteId} />
                <DiagnosticoForm citaId={citaId} />
            </div>
        </div>
    );
}

export default DiagnosticoPage;
