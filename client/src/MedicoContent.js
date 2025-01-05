import './Main.css'
import React, { useState, useEffect } from "react";



function MedicoContent() {
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
