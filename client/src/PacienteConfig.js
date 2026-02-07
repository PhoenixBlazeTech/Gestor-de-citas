import React, { useState, useEffect } from "react";
import "./PacienteConfig.css";

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
    const [loadingEstados, setLoadingEstados] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        setLoadingEstados(true);
        fetch("http://localhost:5000/api/estados")
            .then((res) => res.json())
            .then((data) => setEstados(data))
            .catch((err) => {
                console.error("Error fetching estados:", err);
                setStatus({ type: "error", message: "No pudimos cargar la lista de estados." });
            })
            .finally(() => setLoadingEstados(false));

        const storedNombre = localStorage.getItem("nombreCompleto");
        if (storedNombre) {
            const parts = storedNombre.split(" ").filter(Boolean);
            setFormData((prev) => ({
                ...prev,
                nombre: parts[0] || "",
                apellidoPat: parts[1] || "",
                apellidoMat: parts.slice(2).join(" ") || "",
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
            setStatus({ type: "error", message: "No encontramos tu sesión. Inicia sesión nuevamente." });
            setIsSubmitting(false);
            return;
        }

        fetch("http://localhost:5000/api/paciente/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, id: userId }),
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
                console.error("Error updating paciente:", err);
                setStatus({ type: "error", message: "Error al conectar con el servidor." });
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <section className="paciente-config">
            <div className="paciente-config__hero">
                <span className="paciente-config__eyebrow">Perfil del paciente</span>
                <h1>Configura tu información personal</h1>
                <p>
                    Mantén tus datos al día para agilizar tus citas y recibir recordatorios en el momento
                    correcto.
                </p>
            </div>

            <div className="paciente-config__card">
                <header className="paciente-config__header">
                    <div>
                        <h2>Resumen del perfil</h2>
                        <p>Comparte solamente lo necesario. Todo permanece cifrado en nuestros sistemas.</p>
                    </div>
                    <div className="paciente-config__badge">ID #{localStorage.getItem("userId") || "---"}</div>
                </header>

                {status && (
                    <div className={`paciente-config__alert paciente-config__alert--${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form className="paciente-config__form" onSubmit={handleSubmit}>
                    <section className="paciente-config__section">
                        <div className="paciente-config__section-header">
                            <div>
                                <p className="paciente-config__section-eyebrow">Identidad</p>
                                <h3>Datos generales</h3>
                            </div>
                            <span>Usamos estos datos para personalizar tu experiencia.</span>
                        </div>
                        <div className="paciente-config__grid">
                            <label className="paciente-config__field">
                                <span>Nombre</span>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    maxLength={20}
                                    className="paciente-config__input"
                                    placeholder="Carmen"
                                    required
                                />
                            </label>
                            <label className="paciente-config__field">
                                <span>Apellido paterno</span>
                                <input
                                    type="text"
                                    name="apellidoPat"
                                    value={formData.apellidoPat}
                                    onChange={handleInputChange}
                                    maxLength={20}
                                    className="paciente-config__input"
                                    placeholder="Ramírez"
                                />
                            </label>
                            <label className="paciente-config__field">
                                <span>Apellido materno</span>
                                <input
                                    type="text"
                                    name="apellidoMat"
                                    value={formData.apellidoMat}
                                    onChange={handleInputChange}
                                    maxLength={20}
                                    className="paciente-config__input"
                                    placeholder="Pérez"
                                />
                            </label>
                        </div>
                    </section>

                    <section className="paciente-config__section">
                        <div className="paciente-config__section-header">
                            <div>
                                <p className="paciente-config__section-eyebrow">Contacto y ubicación</p>
                                <h3>¿Dónde podemos encontrarte?</h3>
                            </div>
                            <span>Solo tu equipo médico puede ver esta información.</span>
                        </div>
                        <div className="paciente-config__grid">
                            <label className="paciente-config__field">
                                <span>Teléfono</span>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    maxLength={15}
                                    className="paciente-config__input"
                                    placeholder="55 1234 5678"
                                />
                            </label>
                            <label className="paciente-config__field">
                                <span>Calle</span>
                                <input
                                    type="text"
                                    name="calle"
                                    value={formData.calle}
                                    onChange={handleInputChange}
                                    maxLength={50}
                                    className="paciente-config__input"
                                    placeholder="Av. Reforma 123"
                                />
                            </label>
                            <label className="paciente-config__field">
                                <span>Colonia</span>
                                <input
                                    type="text"
                                    name="colonia"
                                    value={formData.colonia}
                                    onChange={handleInputChange}
                                    maxLength={50}
                                    className="paciente-config__input"
                                    placeholder="Juárez"
                                />
                            </label>
                            <label className="paciente-config__field">
                                <span>Alcaldía o municipio</span>
                                <input
                                    type="text"
                                    name="alcalMun"
                                    value={formData.alcalMun}
                                    onChange={handleInputChange}
                                    maxLength={50}
                                    className="paciente-config__input"
                                    placeholder="Cuauhtémoc"
                                />
                            </label>
                            <label className="paciente-config__field">
                                <span>Código postal</span>
                                <input
                                    type="text"
                                    name="cp"
                                    value={formData.cp}
                                    onChange={handleInputChange}
                                    maxLength={5}
                                    className="paciente-config__input"
                                    placeholder="06600"
                                />
                            </label>
                            <label className="paciente-config__field">
                                <span>Estado</span>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    className="paciente-config__input paciente-config__select"
                                >
                                    <option value="" disabled>
                                        {loadingEstados ? "Cargando estados..." : "Selecciona un estado"}
                                    </option>
                                    {estados.map((estado) => (
                                        <option key={estado.ESTADO_ID} value={estado.NOMBRE}>
                                            {estado.NOMBRE}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </section>

                    <div className="paciente-config__actions">
                        <button
                            type="submit"
                            className="paciente-config__button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar cambios"}
                        </button>
                        <button
                            type="button"
                            className="paciente-config__button paciente-config__button--ghost"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            Volver arriba
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default PacienteConfig;
