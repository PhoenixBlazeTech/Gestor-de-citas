import React, { useState, useEffect } from "react";
import "./Main.css";
import { useNavigate } from "react-router-dom";

function MedicoContent() {
    const [pacientes, setPacientes] = useState([]);
    const [error, setError] = useState(null);
    const [newCita, setNewCita] = useState({
        paciente: "",
        fechaHora: "",
        consultorio: "",
    });
    const navigate = useNavigate();
    const [todosPacientes, setTodosPacientes] = useState([]); // Todos los pacientes

    // Obtener todos los pacientes
    const fetchTodosPacientes = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/pacientes"); // Nuevo endpoint
            if (!response.ok) {
                throw new Error("Error al obtener la lista de todos los pacientes.");
            }
            const data = await response.json();
            setTodosPacientes(data); // Actualizar estado con pacientes
        } catch (error) {
            console.error("Error:", error);
            setError("No se pudieron cargar todos los pacientes.");
        }
    };

    // Obtener pacientes asignados al médico
    const fetchPacientes = async () => {
        try {
            const medicoId = localStorage.getItem("userId");
            if (!medicoId) {
                throw new Error("No se encontró el ID del médico conectado");
            }

            const response = await fetch(`http://localhost:5000/api/Medcon/${medicoId}`);
            if (!response.ok) {
                throw new Error("Error al obtener pacientes");
            }
            const data = await response.json();
            setPacientes(data);
            setError(null);
        } catch (error) {
            console.error("Error:", error);
            setError("No se pudieron cargar los pacientes.");
        }
    };

    useEffect(() => {
        fetchPacientes(); // Llamada para pacientes asignados
        fetchTodosPacientes(); // Llamada para todos los pacientes
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCita({ ...newCita, [name]: value });
    };

    const handleAddDate = (e) => {
        e.preventDefault();

        const medicoId = localStorage.getItem("userId");
        if (!medicoId || !newCita.paciente || !newCita.fechaHora || !newCita.consultorio) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (isNaN(new Date(newCita.fechaHora).getTime())) {
            alert("Por favor, selecciona una fecha y hora válida.");
            return;
        }

        fetch("http://localhost:5000/api/citas/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                medico_id: medicoId,
                paciente_id: newCita.paciente,
                fecha_hora: newCita.fechaHora,
                num_consultorio: newCita.consultorio,
                estado_cita: "A",
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message || "Cita agendada con éxito.");
                setNewCita({ paciente: "", fechaHora: "", consultorio: "" });
                fetchPacientes(); // Refresca la lista de pacientes
            })
            .catch((err) => console.error("Error adding cita:", err));
    };

    const handleDiagnosticoClick = (citaId, pacienteId) => {
        navigate(`/diagnostico/${citaId}/${pacienteId}`); // Pasar citaId y pacienteId en la URL
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="content">
            <form onSubmit={handleAddDate} className="form-container">
                <select
                    name="paciente"
                    value={newCita.paciente}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                >
                    <option value="">Seleccionar Paciente</option>
                    {todosPacientes.map((paciente, index) => (
                        <option key={`${paciente.id}-${index}`} value={paciente.id}>
                            {paciente.nombre}
                        </option>
                    ))}
                </select>

                <input
                    type="datetime-local"
                    name="fechaHora"
                    value={newCita.fechaHora}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    name="consultorio"
                    placeholder="Número de Consultorio"
                    value={newCita.consultorio}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                />
                <button type="submit" className="form-button">Agendar</button>
            </form>

            <h3 className="title-table">Lista de Pacientes Asignados</h3>
            <div className="container-table">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre del Paciente</th>
                            <th>Estado de la Cita</th>
                            <th>Fecha y Hora</th>
                            <th id="button-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.map((paciente, index) => (
                            <tr key={`${paciente.id}-${index}`}>
                                <td>{paciente.nombre}</td>
                                <td>{paciente.estado}</td>
                                <td>{paciente.fechaHoraCita || "No asignada"}</td>
                                <td className="button-cell">
                                    <button
                                        onClick={() => handleDiagnosticoClick(paciente.cita_id, paciente.id)} 
                                        className="delete-button"
                                    >
                                        Diagnóstico
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MedicoContent;
