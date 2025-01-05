import React, { useState, useEffect } from "react";
import "./Main.css";

function EmpleadoContent() {
    const [data, setData] = useState([]); // Estado para almacenar los datos de la tabla
    const [newCompuesto, setNewCompuesto] = useState({ medicamento: "", compuesto: "" }); // Estado para el formulario de compuestos
    const [newMedicamento, setNewMedicamento] = useState(""); // Estado para el formulario de medicamentos
    const [medicamentos, setMedicamentos] = useState([]); // Estado para almacenar medicamentos

    // Función para cargar los datos de la tabla
    const fetchTableData = () => {
        fetch("http://localhost:5000/api/compuesto")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.error("Error fetching table data:", err));
    };


    // Función para cargar los medicamentos
    const fetchMedicamentos = () => {
        fetch("http://localhost:5000/api/medicamentos")
            .then((res) => res.json())
            .then((data) => setMedicamentos(data))
            .catch((err) => console.error("Error fetching medicamentos:", err));
    };

    useEffect(() => {
        fetchTableData(); // Cargar datos de la tabla
        fetchMedicamentos(); // Cargar medicamentos
    }, []);

    // Manejar cambios en el formulario de compuestos
    const handleCompuestoChange = (e) => {
        const { name, value } = e.target;
        setNewCompuesto({ ...newCompuesto, [name]: value });
    };

    // Manejar cambios en el formulario de medicamentos
    const handleMedicamentoChange = (e) => {
        setNewMedicamento(e.target.value);
    };

    // Agregar un nuevo compuesto
    const handleAddCompuesto = (e) => {
        e.preventDefault();
        if (!newCompuesto.medicamento || !newCompuesto.compuesto) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        fetch("http://localhost:5000/api/compuesto/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCompuesto),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message || "Compuesto agregado con éxito.");
                fetchTableData();
                setNewCompuesto({ medicamento: "", compuesto: "" });
            })
            .catch((err) => console.error("Error adding compuesto:", err));
    };

    // Agregar un nuevo medicamento
    const handleAddMedicamento = (e) => {
        e.preventDefault();
        if (!newMedicamento) {
            alert("El campo de medicamento no puede estar vacío.");
            return;
        }

        fetch("http://localhost:5000/api/medicamento/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: newMedicamento }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message || "Medicamento agregado con éxito.");
                fetchMedicamentos();
                setNewMedicamento("");
            })
            .catch((err) => console.error("Error adding medicamento:", err));
    };

    // Eliminar un compuesto
    const handleDeleteCompuesto = (compuestoId) => {
        fetch("http://localhost:5000/api/compuesto/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ compuesto_id: compuestoId }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message || "Compuesto eliminado con éxito.");
                fetchTableData();
            })
            .catch((err) => console.error("Error deleting compuesto:", err));
    };

    return (
        <>
            <div className="container-forms-empleado">
                {/* Formulario para agregar compuestos */}
                <div className="form-container">
                    <h2>Agregar Nuevo Compuesto</h2>
                    <form onSubmit={handleAddCompuesto}>
                        <select
                            name="medicamento"
                            value={newCompuesto.medicamento}
                            onChange={handleCompuestoChange}
                            className="form-select"
                            required
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
                            name="compuesto"
                            placeholder="Nombre del Compuesto"
                            value={newCompuesto.compuesto}
                            onChange={handleCompuestoChange}
                            className="form-input"
                            required
                        />
                        <button type="submit" className="form-button">Agregar</button>
                    </form>
                </div>

                {/* Formulario para agregar medicamentos */}
                <div className="form-container">
                    <h2>Agregar Nuevo Medicamento</h2>
                    <form onSubmit={handleAddMedicamento}>
                        <input
                            type="text"
                            name="medicamento"
                            placeholder="Nombre del Medicamento"
                            value={newMedicamento}
                            onChange={handleMedicamentoChange}
                            className="form-input"
                            required
                        />
                        <button type="submit" className="form-button">Agregar</button>
                    </form>
                </div>
            </div>

            {/* Tabla */}
            <div className="container-table">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Medicamento</th>
                            <th>Compuesto</th>
                            <th id="button-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.nombre_medicamento}</td>
                                <td>{row.nombre_compuesto}</td>
                                <td className="button-cell">
                                    <button
                                        onClick={() => handleDeleteCompuesto(row.compuesto_id)}
                                        className="delete-button"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default EmpleadoContent;
