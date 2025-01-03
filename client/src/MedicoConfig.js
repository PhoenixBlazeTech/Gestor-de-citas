import React, { useState, useEffect } from "react";
import "./Main.css"; // Importa el CSS actualizado
import Swal from "sweetalert2";

function MedicoConfig() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellidoPat: "",
        apellidoMat: "",
        horario: "",
        especialidad: "",
    });
    const [especialidades, setEspecialidades] = useState([]);

    useEffect(() => {
        // Obtener especialidades desde el backend
        fetch("http://localhost:5000/api/especialidades")
            .then((res) => res.json())
            .then((data) => setEspecialidades(data))
            .catch((err) => console.error("Error fetching especialidades:", err));

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

        // Agregar el userId del médico desde localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
            Swal.fire({
                title: "Error",
                text: "No se encontró el ID del usuario.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        fetch("http://localhost:5000/api/medico/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, id: userId }), // Incluir el userId
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    Swal.fire({
                        title: "¡Éxito!",
                        text: data.message,
                        icon: "success",
                        confirmButtonText: "Aceptar",
                    });
                    const nuevoNombreCompleto = `${formData.nombre} ${formData.apellidoPat} ${formData.apellidoMat}`;
                    localStorage.setItem("nombreCompleto", nuevoNombreCompleto);
                } else {
                    alert("Error al actualizar perfil");
                }
            })
            .catch((err) => console.error("Error updating medico:", err));
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
                <input
                    type="datetime-local"
                    name="horario"
                    value={formData.horario}
                    onChange={handleInputChange}
                    className="form-input"
                />
                <select
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    className="form-select"
                >
                    <option value="">Seleccionar Especialidad</option>
                    {especialidades.map((esp) => (
                        <option key={esp.ESPEC_ID} value={esp.ESPEC_ID}>
                            {esp.NOMBRE}
                        </option>
                    ))}
                </select>
                <button type="submit" className="form-button">Actualizar</button>
            </form>
        </div>
    );
}

export default MedicoConfig;


