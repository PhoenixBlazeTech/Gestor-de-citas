import React, { useState, useEffect } from 'react';

import './Main.css'
import React, { useState, useEffect } from "react";



function MedicoContent() {
    const [pacientes, setPacientes] = useState([]);
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                // Obtén el ID del médico desde el almacenamiento local o desde el estado de la sesión
                const medicoId = localStorage.getItem("userId");

                if (!medicoId) {
                    throw new Error("No se encontró el ID del médico conectado");
                }

                // Realiza la solicitud al backend con el ID del médico
                const response = await fetch(`http://localhost:5000/api/Medcon/${medicoId}`);
                if (!response.ok) {
                    throw new Error("Error al obtener pacientes");
                }
                const data = await response.json();
                setPacientes(data); // Actualizar el estado con los datos de la API
                setError(null); // Limpiar errores
            } catch (error) {
                console.error("Error:", error);
                setError("No se pudieron cargar los pacientes.");
            }
        };

        fetchPacientes();
    }, []);

    const handleDiagnosticoClick = (id) => {
        alert(`Accediendo al diagnóstico del paciente con ID: ${id}`);
        // Aquí puedes redirigir o realizar una acción específica para el diagnóstico
    };

    if (error) {
        return <div>Error: {error}</div>; // Mostrar un mensaje de error si ocurre un problema
    }

    /* Codigo form*/
    const [pacientes, setPacientes] = useState([]); // Lista de pacientes
    const [newCita, setNewCita] = useState({
        paciente: "",
        fechaHora: "",
        consultorio: "",
    });

    // Obtener pacientes desde la base de datos
    useEffect(() => {
        fetch("http://localhost:5000/api/pacientes")
            .then((res) => res.json())
            .then((data) => setPacientes(data))
            .catch((err) => console.error("Error fetching pacientes:", err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCita({ ...newCita, [name]: value });
    };

    const handleAddDate = (e) => {
        e.preventDefault();

        const medicoId = localStorage.getItem("userId"); // Obtener el ID del médico
        if (!medicoId || !newCita.paciente || !newCita.fechaHora || !newCita.consultorio) {
            alert("Todos los campos son obligatorios.");
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
                estado_cita: "A", // Estado predeterminado como "A" (activa)
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message || "Cita agendada con éxito.");
                setNewCita({ paciente: "", fechaHora: "", consultorio: "" }); // Limpiar formulario
            })
            .catch((err) => console.error("Error adding cita:", err));
    };
    /*Codigo form*/
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Texto fijo arriba */}
            <div style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#007BFF',
                color: '#fff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                <h2>Hola, Médico</h2>
                <p>Este es el contenido exclusivo para médicos.</p>
                <h3>Lista de Pacientes Asignados</h3>
            </div>

            {/* Contenedor para centrar la tabla */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexGrow: 1,
                backgroundColor: '#f4f4f4',
                padding: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    width: '60%',
                    justifyContent: 'flex-start',
                    marginBottom: '10px'
                }}>
                    <button
                        onClick={() => window.location.reload()} // Refrescar la tabla
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        Refrescar
                    </button>
                </div>
                <table style={{
                    width: '60%',
                    textAlign: 'left',
                    borderCollapse: 'collapse',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px'
                }}>
                    <thead style={{
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        textAlign: 'center'
                    }}>
                        <tr>
                            <th>Nombre del Paciente</th>
                            <th>Estado de la Cita</th>
                            <th>Fecha y Hora de la Cita</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.map((paciente) => (
                            <tr key={paciente.id} style={{ textAlign: 'center' }}>
                                <td>{paciente.nombre}</td>
                                <td>{paciente.estado}</td>
                                <td>{paciente.fechaHoraCita || 'No asignada'}</td>
                                <td className='button-dia'>
                                    <button
                                        onClick={() => handleDiagnosticoClick(paciente.id)}
                                        className='button-diag'
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
        /*Form*/
        <div className="form-container">
        <h2>Agendar Cita</h2>
        <form onSubmit={handleAddDate}>
            <select
                name="paciente"
                value={newCita.paciente}
                onChange={handleInputChange}
                className="form-select"
                required
            >
                <option value="">Seleccionar Paciente</option>
                {pacientes.map((paciente) => (
                    <option key={paciente.PACIENTE_ID} value={paciente.PACIENTE_ID}>
                        {paciente.NOMBRE} {paciente.APELLIDO_PAT} {paciente.APELLIDO_MAT}
                    </option>
                ))}
            </select>
            <input
                type="datetime-local"
                name="fechaHora"
                value={newCita.fechaHora}
                onChange={handleInputChange}
                className="form-input date-input"
                required
            />
            <input
                type="text"
                name="consultorio"
                placeholder="Número de Consultorio"
                value={newCita.consultorio}
                onChange={handleInputChange}
                className="form-input"
                required
            />
            <button type="submit" className="form-button">Agendar</button>
        </form>
    </div>
    /*Form*/
    );
}

export default MedicoContent;
