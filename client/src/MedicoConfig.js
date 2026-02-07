import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./MedicoConfig.css";

function MedicoConfig() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellidoPat: "",
        apellidoMat: "",
        horario: "",
        especialidad: "",
    });
    const [especialidades, setEspecialidades] = useState([]);
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/api/especialidades")
            .then((res) => res.json())
            .then((data) => setEspecialidades(data))
            .catch((err) => {
                console.error("Error fetching especialidades:", err);
                setStatus({ type: "error", message: "No pudimos cargar las especialidades." });
            });

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
        setIsSubmitting(true);
        setStatus(null);
        const userId = localStorage.getItem("userId");
        if (!userId) {
            Swal.fire({
                title: "Error",
                text: "No se encontró el ID del usuario.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            setIsSubmitting(false);
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
                    const nuevoNombreCompleto = `${formData.nombre} ${formData.apellidoPat} ${formData.apellidoMat}`;
                    localStorage.setItem("nombreCompleto", nuevoNombreCompleto);
                    setStatus({ type: "success", message: "Perfil actualizado correctamente." });
                } else {
                    setStatus({ type: "error", message: "No pudimos actualizar tu perfil." });
                }
            })
            .catch((err) => {
                console.error("Error updating medico:", err);
                setStatus({ type: "error", message: "Error al conectar con el servidor." });
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <section className="medico-config">
            <div className="medico-config__hero">
                <span className="medico-config__eyebrow">Perfil médico</span>
                <h1>Actualiza tu espacio profesional</h1>
                <p>Horarios, especialidad y datos personales conectados con tu agenda clínica.</p>
            </div>

            <div className="medico-config__card">
                <header className="medico-config__header">
                    <div>
                        <h2>Resumen personal</h2>
                        <p>Comparte solo lo necesario con tus pacientes.</p>
                    </div>
                    <span className="medico-config__badge">ID #{localStorage.getItem("userId") || "---"}</span>
                </header>

                {status && (
                    <div className={`medico-config__alert medico-config__alert--${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form className="medico-config__form" onSubmit={handleSubmit}>
                    <div className="medico-config__grid">
                        <label>
                            <span>Nombre</span>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                maxLength={20}
                                placeholder="Andrea"
                            />
                        </label>
                        <label>
                            <span>Apellido paterno</span>
                            <input
                                type="text"
                                name="apellidoPat"
                                value={formData.apellidoPat}
                                onChange={handleInputChange}
                                maxLength={20}
                                placeholder="Fernández"
                            />
                        </label>
                        <label>
                            <span>Apellido materno</span>
                            <input
                                type="text"
                                name="apellidoMat"
                                value={formData.apellidoMat}
                                onChange={handleInputChange}
                                maxLength={20}
                                placeholder="López"
                            />
                        </label>
                        <label>
                            <span>Horario disponible</span>
                            <input
                                type="datetime-local"
                                name="horario"
                                value={formData.horario}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            <span>Especialidad</span>
                            <select
                                name="especialidad"
                                value={formData.especialidad}
                                onChange={handleInputChange}
                            >
                                <option value="">
                                    {especialidades.length === 0 ? "Cargando..." : "Selecciona una"}
                                </option>
                                {especialidades.map((esp) => (
                                    <option key={esp.ESPEC_ID} value={esp.ESPEC_ID}>
                                        {esp.NOMBRE}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="medico-config__actions">
                        <button
                            type="button"
                            className="medico-config__button medico-config__button--ghost"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            Volver arriba
                        </button>
                        <button type="submit" disabled={isSubmitting} className="medico-config__button">
                            {isSubmitting ? "Guardando..." : "Guardar ajustes"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default MedicoConfig;


