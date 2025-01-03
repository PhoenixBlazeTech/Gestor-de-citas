import React, { useState, useEffect } from "react";
import "./Main.css"; // Importa el CSS actualizado

function PacienteConfig() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellidoPat: "",
        apellidoMat: "",
        telefono: "",
        calle: "",
        alcalMun: "",
        colonia: "",
        cp: "",
        estado: "",
    });
    const [estados, setEstados] = useState([]);

    useEffect(() => {
        // Obtener estados desde el backend
        fetch("http://localhost:5000/api/estados")
            .then((res) => res.json())
            .then((data) => setEstados(data))
            .catch((err) => console.error("Error fetching estados:", err));

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

        // Agregar el userId del paciente desde localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Error: No se encontró el ID del usuario.");
            return;
        }

        fetch("http://localhost:5000/api/paciente/update", {
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
            .catch((err) => console.error("Error updating paciente:", err));
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
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    maxLength={15}
                    className="form-input"
                    placeholder="Teléfono"
                />
                <input
                    type="text"
                    name="calle"
                    value={formData.calle}
                    onChange={handleInputChange}
                    maxLength={50}
                    className="form-input"
                    placeholder="Calle"
                />
                <input
                    type="text"
                    name="alcalMun"
                    value={formData.alcalMun}
                    onChange={handleInputChange}
                    maxLength={50}
                    className="form-input"
                    placeholder="Alcaldía o Municipio"
                />
                <input
                    type="text"
                    name="colonia"
                    value={formData.colonia}
                    onChange={handleInputChange}
                    maxLength={50}
                    className="form-input"
                    placeholder="Colonia"
                />
                <input
                    type="text"
                    name="cp"
                    value={formData.cp}
                    onChange={handleInputChange}
                    maxLength={5}
                    className="form-input"
                    placeholder="Código Postal"
                />
                <input
                    type="text"
                    name="estado"
                    list="estado-options"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Estado"
                />
                <datalist id="estado-options">
                    {estados.map((estado) => (
                        <option key={estado.ESTADO_ID} value={estado.NOMBRE}>
                            {estado.NOMBRE}
                        </option>
                    ))}
                </datalist>
                <button type="submit" className="form-button">Actualizar</button>
            </form>
        </div>
    );
}

export default PacienteConfig;
