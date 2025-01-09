import './Main.css';
import React, { useState, useEffect } from "react";

function PacienteContent() {
    const [citas, setCitas] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const pacienteId = localStorage.getItem("userId");

                if (!pacienteId) {
                    throw new Error("No se encontró el ID del paciente conectado");
                }

                const response = await fetch(`http://localhost:5000/api/paciecon/${pacienteId}`);
                if (!response.ok) {
                    throw new Error("Error al obtener citas");
                }

                const data = await response.json();
                setCitas(data.filter(cita => cita.estado !== "C")); // Filtrar las citas canceladas
            } catch (error) {
                console.error("Error:", error);
                setError("No se pudieron cargar las citas.");
            }
        };

        const fetchHistorial = async () => {
            try {
                const pacienteId = localStorage.getItem("userId");

                if (!pacienteId) {
                    throw new Error("No se encontró el ID del paciente conectado");
                }

                const response = await fetch(`http://localhost:5000/api/historial/${pacienteId}`);
                if (!response.ok) {
                    throw new Error("Error al obtener el historial médico");
                }

                const data = await response.json();
                setHistorial(data);
            } catch (error) {
                console.error("Error:", error);
                setError("No se pudo cargar el historial médico.");
            }
        };

        fetchCitas();
        fetchHistorial();
    }, []);

    const handleButtonClick = async (id) => {
        try {
            const response = await fetch("http://localhost:5000/api/citas/cancelar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cita_id: id }),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setCitas((prevCitas) =>
                    prevCitas.filter((cita) => cita.id !== id) // Eliminar la cita cancelada de la lista
                );
                // Refrescar la página después de cancelar la cita
                window.location.reload();
            } else {
                alert(data.error || "Error al cancelar la cita");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al conectar con el servidor");
        }
    };
    

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="content">
                <h2>Hola, Paciente</h2>
                <p>Este es el contenido exclusivo para pacientes.</p>
                <div className="table-container">
                    <div className="citas-container">
                        <h3 className="title-table">Lista de Citas</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Estado</th>
                                    <th>Médico</th>
                                    <th id="button-th"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {citas.map((cita) => (
                                    <tr key={cita.id}>
                                        <td>{cita.fechaHora || 'No asignada'}</td>
                                        <td>{cita.estado}</td>
                                        <td>{cita.medico}</td>
                                        <td className="button-cell">
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleButtonClick(cita.id)}
                                                >
                                                    Cancelar
                                                </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="historial-container">
                        <h3 className="title-table">Historial Médico</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Estado</th>
                                    <th>Consultorio</th>
                                    <th>Diagnóstico</th>
                                    <th>Receta</th>
                                    <th>Medicamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.fechaHora}</td>
                                        <td>{entry.estado}</td>
                                        <td>{entry.consultorio}</td>
                                        <td>{entry.diagnostico}</td>
                                        <td>{entry.receta}</td>
                                        <td>{entry.medicamento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PacienteContent;