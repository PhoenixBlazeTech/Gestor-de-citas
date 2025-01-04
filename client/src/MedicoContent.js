import React, { useState, useEffect } from 'react';

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
    );
}

export default MedicoContent;
