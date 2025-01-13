import React, { useState } from "react";
import "./Main.css";

function PadecimientoForm({ pacienteId }) {
    const [padecimiento, setPadecimiento] = useState("");
    const [observacion, setObservacion] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar tamaños
        if (padecimiento.length > 20) {
            alert("El nombre del padecimiento no puede exceder los 20 caracteres.");
            return;
        }
        if (observacion.length > 33) {
            alert("La observación no puede exceder los 33 caracteres.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/padecimientos/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ padecimiento, paciente_id: pacienteId, observacion }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Padecimiento creado y asociado con éxito.");
                setPadecimiento("");
                setObservacion("");
            } else {
                throw new Error(data.error || "Error al crear el padecimiento.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "Error en el proceso.");
        }
    };

    return (
        <div className="form-container">
            <h2>Agregar Padecimiento</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={padecimiento}
                    onChange={(e) => setPadecimiento(e.target.value)}
                    placeholder="Nombre del Padecimiento"
                    maxLength="20"
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    placeholder="Observación"
                    maxLength="33"
                    required
                    className="form-input"
                />
                <button type="submit" className="form-button">
                    Guardar
                </button>
            </form>
        </div>
    );
}

export default PadecimientoForm;

