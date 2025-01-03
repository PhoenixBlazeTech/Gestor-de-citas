import React, { useState, useEffect } from "react";
import "./Main.css"; // Importa el CSS actualizado

function EmpleadoConfig() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellidoPat: "",
        apellidoMat: "",
        puesto: "",
    });
    const [puestos, setPuestos] = useState([]);

    useEffect(() => {
        // Obtener puestos desde el backend
        fetch("http://localhost:5000/api/puestos")
            .then((res) => res.json())
            .then((data) => setPuestos(data))
            .catch((err) => console.error("Error fetching puestos:", err));

        // Prellenar los datos del formulario con el nombre completo y otros campos
        const storedNombre = localStorage.getItem("nombreCompleto");
        if (storedNombre) {
            const [nombre, apellidoPat, apellidoMat] = storedNombre.split(" ");
            setFormData((prev) => ({
                ...prev,
                nombre,
                apellidoPat,
                apellidoMat,
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Agregar el userId del empleado desde localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Error: No se encontró el ID del usuario.");
            return;
        }

        fetch("http://localhost:5000/api/empleado/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, id: userId }), // Incluir el userId
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    alert(data.message);
                    const nuevoNombreCompleto = `${formData.nombre} ${formData.apellidoPat} ${formData.apellidoMat}`;
                    localStorage.setItem("nombreCompleto", nuevoNombreCompleto);
                } else {
                    alert("Error al actualizar perfil");
                }
            })
            .catch((err) => console.error("Error updating empleado:", err));
    };

    return (
        <div>
            <form className="form-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    maxLength={20}
                    className="form-input"
                    placeholder="Nombre"
                />
                <input
                    type="text"
                    name="apellidoPat"
                    value={formData.apellidoPat}
                    onChange={handleInputChange}
                    maxLength={20}
                    className="form-input"
                    placeholder="Apellido Paterno"
                />
                <input
                    type="text"
                    name="apellidoMat"
                    value={formData.apellidoMat}
                    onChange={handleInputChange}
                    maxLength={20}
                    className="form-input"
                    placeholder="Apellido Materno"
                />
                <select
                    name="puesto"
                    value={formData.puesto}
                    onChange={handleInputChange}
                    className="form-select"
                >
                    <option value="">Seleccionar Puesto</option>
                    {puestos.map((puesto) => (
                        <option key={puesto.PUESTO_ID} value={puesto.PUESTO_ID}>
                            {puesto.PUESTO}
                        </option>
                    ))}
                </select>
                <button type="submit" className="form-button">Actualizar</button>
            </form>
        </div>
    );
}

export default EmpleadoConfig;
