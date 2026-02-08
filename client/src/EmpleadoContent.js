import React, { useState } from "react";
import "./EmpleadoContent.css";

const initialDoctorForm = {
    nombre: "",
    apellidoPat: "",
    apellidoMat: "",
    usuario: "",
    contrasenia: "",
};

const initialPatientForm = {
    nombre: "",
    apellidoPat: "",
    apellidoMat: "",
    usuario: "",
    alcalMun: "",
    colonia: "",
    cp: "",
    calle: "",
    contrasenia: "",
};

function EmpleadoContent() {
    const [doctorForm, setDoctorForm] = useState(initialDoctorForm);
    const [patientForm, setPatientForm] = useState(initialPatientForm);
    const [doctorStatus, setDoctorStatus] = useState(null);
    const [patientStatus, setPatientStatus] = useState(null);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [patientLoading, setPatientLoading] = useState(false);

    const handleDoctorChange = (event) => {
        const { name, value } = event.target;
        setDoctorForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePatientChange = (event) => {
        const { name, value } = event.target;
        setPatientForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDoctorSubmit = async (event) => {
        event.preventDefault();
        setDoctorStatus(null);
        setDoctorLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/medico", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(doctorForm),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo crear el médico");
            }

            setDoctorStatus({ type: "success", message: data.message || "Médico creado correctamente" });
            setDoctorForm(initialDoctorForm);
        } catch (error) {
            setDoctorStatus({ type: "error", message: error.message });
        } finally {
            setDoctorLoading(false);
        }
    };

    const handlePatientSubmit = async (event) => {
        event.preventDefault();
        setPatientStatus(null);
        setPatientLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/paciente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patientForm),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo crear el paciente");
            }

            setPatientStatus({ type: "success", message: data.message || "Paciente creado correctamente" });
            setPatientForm(initialPatientForm);
        } catch (error) {
            setPatientStatus({ type: "error", message: error.message });
        } finally {
            setPatientLoading(false);
        }
    };

    return (
        <section className="empleado-create-medico">
            <div className="empleado-create-medico__hero">
                <span className="empleado-create-medico__eyebrow">Panel interno</span>
                <h1>Cuida tu perfil operativo</h1>
                <p>Sincronizamos tus datos con los flujos administrativos para evitar errores de acceso.</p>
            </div>

            <div className="empleado-create-medico__cards">
                <div className="empleado-create-medico__card">
                    <header className="empleado-create-medico__header">
                        <div>
                            <h2>Identidad corporativa</h2>
                            <p>Registra nuevos médicos y dales acceso seguro a la plataforma.</p>
                        </div>
                        <span className="empleado-create-medico__badge">Alta express</span>
                    </header>

                    {doctorStatus && (
                        <div className={`empleado-create-medico__alert empleado-create-medico__alert--${doctorStatus.type}`}>
                            {doctorStatus.message}
                        </div>
                    )}

                    <form onSubmit={handleDoctorSubmit} className="empleado-create-medico__form">
                        <div className="empleado-create-medico__grid">
                            <label>
                                <span>Nombre</span>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={doctorForm.nombre}
                                    onChange={handleDoctorChange}
                                    placeholder="Alexandra"
                                    required
                                />
                            </label>
                            <label>
                                <span>Apellido paterno</span>
                                <input
                                    type="text"
                                    name="apellidoPat"
                                    value={doctorForm.apellidoPat}
                                    onChange={handleDoctorChange}
                                    placeholder="López"
                                    required
                                />
                            </label>
                            <label>
                                <span>Apellido materno</span>
                                <input
                                    type="text"
                                    name="apellidoMat"
                                    value={doctorForm.apellidoMat}
                                    onChange={handleDoctorChange}
                                    placeholder="Ramírez"
                                    required
                                />
                            </label>
                            <label>
                                <span>Usuario</span>
                                <input
                                    type="text"
                                    name="usuario"
                                    value={doctorForm.usuario}
                                    onChange={handleDoctorChange}
                                    placeholder="alramirez"
                                    required
                                />
                            </label>
                            <label>
                                <span>Contraseña temporal</span>
                                <input
                                    type="password"
                                    name="contrasenia"
                                    value={doctorForm.contrasenia}
                                    onChange={handleDoctorChange}
                                    placeholder="•••••••"
                                    required
                                />
                            </label>
                        </div>

                        <div className="empleado-create-medico__actions">
                            <button
                                type="button"
                                className="empleado-create-medico__button empleado-create-medico__button--ghost"
                                onClick={() => setDoctorForm(initialDoctorForm)}
                            >
                                Limpiar
                            </button>
                            <button type="submit" className="empleado-create-medico__button" disabled={doctorLoading}>
                                {doctorLoading ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="empleado-create-medico__card empleado-create-medico__card--secondary">
                    <header className="empleado-create-medico__header">
                        <div>
                            <h2>Ingreso de pacientes</h2>
                            <p>Genera accesos con datos básicos para tus nuevos registros.</p>
                        </div>
                        <span className="empleado-create-medico__badge empleado-create-medico__badge--soft">Registro seguro</span>
                    </header>

                    {patientStatus && (
                        <div className={`empleado-create-medico__alert empleado-create-medico__alert--${patientStatus.type}`}>
                            {patientStatus.message}
                        </div>
                    )}

                    <form onSubmit={handlePatientSubmit} className="empleado-create-medico__form">
                        <div className="empleado-create-medico__grid">
                            <label>
                                <span>Nombre</span>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={patientForm.nombre}
                                    onChange={handlePatientChange}
                                    placeholder="Daniel"
                                    required
                                />
                            </label>
                            <label>
                                <span>Apellido paterno</span>
                                <input
                                    type="text"
                                    name="apellidoPat"
                                    value={patientForm.apellidoPat}
                                    onChange={handlePatientChange}
                                    placeholder="Santos"
                                    required
                                />
                            </label>
                            <label>
                                <span>Apellido materno</span>
                                <input
                                    type="text"
                                    name="apellidoMat"
                                    value={patientForm.apellidoMat}
                                    onChange={handlePatientChange}
                                    placeholder="Luna"
                                    required
                                />
                            </label>
                            <label>
                                <span>Usuario</span>
                                <input
                                    type="text"
                                    name="usuario"
                                    value={patientForm.usuario}
                                    onChange={handlePatientChange}
                                    placeholder="dsluna"
                                    required
                                />
                            </label>
                            <label>
                                <span>Contraseña temporal</span>
                                <input
                                    type="password"
                                    name="contrasenia"
                                    value={patientForm.contrasenia}
                                    onChange={handlePatientChange}
                                    placeholder="•••••••"
                                    required
                                />
                            </label>
                            <label>
                                <span>Alcaldía o municipio</span>
                                <input
                                    type="text"
                                    name="alcalMun"
                                    value={patientForm.alcalMun}
                                    onChange={handlePatientChange}
                                    placeholder="Cuauhtémoc"
                                    required
                                />
                            </label>
                            <label>
                                <span>Colonia</span>
                                <input
                                    type="text"
                                    name="colonia"
                                    value={patientForm.colonia}
                                    onChange={handlePatientChange}
                                    placeholder="Juárez"
                                    required
                                />
                            </label>
                            <label>
                                <span>Calle</span>
                                <input
                                    type="text"
                                    name="calle"
                                    value={patientForm.calle}
                                    onChange={handlePatientChange}
                                    placeholder="Niza 32"
                                    required
                                />
                            </label>
                            <label>
                                <span>Código postal</span>
                                <input
                                    type="text"
                                    name="cp"
                                    value={patientForm.cp}
                                    onChange={handlePatientChange}
                                    placeholder="06600"
                                    required
                                />
                            </label>
                        </div>

                        <div className="empleado-create-medico__actions">
                            <button
                                type="button"
                                className="empleado-create-medico__button empleado-create-medico__button--ghost"
                                onClick={() => setPatientForm(initialPatientForm)}
                            >
                                Limpiar
                            </button>
                            <button type="submit" className="empleado-create-medico__button" disabled={patientLoading}>
                                {patientLoading ? "Guardando..." : "Crear paciente"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default EmpleadoContent;
