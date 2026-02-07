import React, { useState, useEffect } from "react";
import "./EmpleadoConfig.css";

function EmpleadoConfig() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellidoPat: "",
        apellidoMat: "",
        puesto: "",
    });
    const [puestos, setPuestos] = useState([]);
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Obtener puestos desde el backend
        fetch("http://localhost:5000/api/puestos")
            .then((res) => res.json())
            .then((data) => setPuestos(data))
            .catch((err) => {
                console.error("Error fetching puestos:", err);
                setStatus({ type: "error", message: "No pudimos cargar la lista de puestos." });
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
        setStatus(null);
        setIsSubmitting(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setStatus({ type: "error", message: "No encontramos tu sesión, inicia nuevamente." });
            setIsSubmitting(false);
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
                    const nuevoNombreCompleto = `${formData.nombre} ${formData.apellidoPat} ${formData.apellidoMat}`;
                    localStorage.setItem("nombreCompleto", nuevoNombreCompleto);
                    setStatus({ type: "success", message: "Perfil actualizado correctamente." });
                } else {
                    setStatus({ type: "error", message: "No pudimos actualizar tu perfil." });
                }
            })
            .catch((err) => {
                console.error("Error updating empleado:", err);
                setStatus({ type: "error", message: "Error al conectar con el servidor." });
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <section className="empleado-config">
            <div className="empleado-config__hero">
                <span className="empleado-config__eyebrow">Panel interno</span>
                <h1>Cuida tu perfil operativo</h1>
                <p>Sincronizamos tus datos con los flujos administrativos para evitar errores de acceso.</p>
            </div>

            <div className="empleado-config__card">
                <header className="empleado-config__header">
                    <div>
                        <h2>Identidad corporativa</h2>
                        <p>Solo tu equipo de RR.HH. tiene acceso a estos datos.</p>
                    </div>
                    <span className="empleado-config__badge">ID #{localStorage.getItem("userId") || "---"}</span>
                </header>

                {status && (
                    <div className={`empleado-config__alert empleado-config__alert--${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form className="empleado-config__form" onSubmit={handleSubmit}>
                    <div className="empleado-config__grid">
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
                                placeholder="López"
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
                                placeholder="García"
                            />
                        </label>
                        <label>
                            <span>Puesto</span>
                            <select name="puesto" value={formData.puesto} onChange={handleInputChange}>
                                <option value="" disabled>
                                    {puestos.length === 0 ? "Cargando puestos..." : "Selecciona un puesto"}
                                </option>
                                {puestos.map((puesto) => (
                                    <option key={puesto.PUESTO_ID} value={puesto.PUESTO_ID}>
                                        {puesto.PUESTO}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="empleado-config__actions">
                        <button
                            type="button"
                            className="empleado-config__button empleado-config__button--ghost"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            Volver arriba
                        </button>
                        <button type="submit" disabled={isSubmitting} className="empleado-config__button">
                            {isSubmitting ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default EmpleadoConfig;
