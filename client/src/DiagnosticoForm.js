import React, { useState, useEffect } from "react";
import "./Main.css";

function DiagnosticoForm({ citaId }) {
    const [diagnostico, setDiagnostico] = useState("");
    const [medicamentos, setMedicamentos] = useState([]);
    const [selectedMedicamento, setSelectedMedicamento] = useState("");
    const [periodicidad, setPeriodicidad] = useState("");
    const [diagnosticoId, setDiagnosticoId] = useState(""); // Estado para almacenar el diagnóstico ID

    // Cargar lista de medicamentos
    useEffect(() => {
        fetch("http://localhost:5000/api/medicamentos")
            .then((res) => res.json())
            .then((data) => {
                setMedicamentos(data);
            })
            .catch((err) => console.error("Error fetching medicamentos:", err));
    }, []);

    const handleDiagnosticoSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:5000/api/diagnostico/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ citas_id: citaId, diagnostico }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.diagnostico_id) {
                    setDiagnosticoId(data.diagnostico_id); // Guardar el diagnóstico ID generado
                    alert(`Diagnóstico guardado con éxito. ID generado: ${data.diagnostico_id}`);
                } else {
                    alert(data.message || "Diagnóstico guardado con éxito.");
                }
                setDiagnostico(""); // Limpiar el campo de diagnóstico
            })
            .catch((err) => console.error("Error adding diagnostico:", err));
    };

    const handleRecetaSubmit = (e) => {
        e.preventDefault();

        if (!diagnosticoId) {
            alert("Primero debes guardar un diagnóstico antes de agregar una receta.");
            return;
        }

        fetch("http://localhost:5000/api/receta/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                diagnostico_id: diagnosticoId, // Usar el ID del diagnóstico generado
                medicamento_id: selectedMedicamento,
                periodicidad,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message || "Receta guardada con éxito.");
                setSelectedMedicamento("");
                setPeriodicidad("");
            })
            .catch((err) => console.error("Error adding receta:", err));
    };

    return (
        <div className="form-container">
            <h2>Agregar Diagnóstico</h2>
            <form onSubmit={handleDiagnosticoSubmit}>
                <textarea
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    placeholder="Escribe el diagnóstico"
                    required
                    className="form-input"
                ></textarea>
                <button type="submit" className="form-button">Guardar Diagnóstico</button>
            </form>

            <h2>Agregar Receta</h2>
            <form onSubmit={handleRecetaSubmit}>
                <select
                    value={selectedMedicamento}
                    onChange={(e) => setSelectedMedicamento(e.target.value)}
                    required
                    className="form-select"
                >
                    <option value="">Seleccionar Medicamento</option>
                    {medicamentos.map((med) => (
                        <option key={med.MEDICAMENTO_ID} value={med.MEDICAMENTO_ID}>
                            {med.NOMBRE}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={periodicidad}
                    onChange={(e) => setPeriodicidad(e.target.value)}
                    placeholder="Periodicidad"
                    required
                    className="form-input"
                />
                <button type="submit" className="form-button">Guardar Receta</button>
            </form>
        </div>
    );
}

export default DiagnosticoForm;
