import React, { useState, useEffect } from "react";
import "./Paciente_tabla.css";

function Paciente_tabla() {
    const [pacientes, setPacientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [lastId, setLastId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [notification, setNotification] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ show: false, pacienteId: null, nombre: "" });

    // Cargar pacientes iniciales
    useEffect(() => {
        loadInitialPatients();
    }, []);

    const loadInitialPatients = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/paciente/list?limit=10");
            const data = await response.json();
            
            if (response.ok) {
                setPacientes(data.pacientes || []);
                if (data.pacientes && data.pacientes.length > 0) {
                    setLastId(data.pacientes[data.pacientes.length - 1].paciente_id);
                }
                setHasMore(data.pacientes && data.pacientes.length === 10);
            }
        } catch (error) {
            showNotification("Error al cargar pacientes", "error");
        } finally {
            setLoading(false);
        }
    };

    const loadMorePatients = async () => {
        if (!hasMore || loading) return;
        
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5000/api/paciente/list?limit=10&last_id=${lastId}`
            );
            const data = await response.json();
            
            if (response.ok) {
                const newPatients = data.pacientes || [];
                setPacientes(prev => [...prev, ...newPatients]);
                
                if (newPatients.length > 0) {
                    setLastId(newPatients[newPatients.length - 1].paciente_id);
                }
                setHasMore(newPatients.length === 10);
            }
        } catch (error) {
            showNotification("Error al cargar más pacientes", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (pacienteId, nombreCompleto) => {
        setConfirmModal({ show: true, pacienteId, nombre: nombreCompleto });
    };

    const handleConfirmDelete = async () => {
        const { pacienteId, nombre } = confirmModal;
        setConfirmModal({ show: false, pacienteId: null, nombre: "" });

        try {
            const response = await fetch(
                `http://localhost:5000/api/paciente/${pacienteId}`,
                { method: "DELETE" }
            );
            
            const data = await response.json();

            if (response.ok) {
                setPacientes(prev => prev.filter(p => p.paciente_id !== pacienteId));
                showNotification("Paciente eliminado exitosamente", "success");
            } else if (response.status === 409) {
                showNotification(
                    "No se puede eliminar: el paciente tiene citas o registros asociados",
                    "error"
                );
            } else if (response.status === 404) {
                showNotification("El paciente no existe", "error");
            } else {
                showNotification(data.error || "Error al eliminar paciente", "error");
            }
        } catch (error) {
            showNotification("Error de conexión al eliminar paciente", "error");
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const filteredPacientes = pacientes.filter(p => 
        p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="paciente-tabla">
            <div className="paciente-tabla__hero">
                <span className="paciente-tabla__eyebrow">Gestión de pacientes</span>
                <h1>Administrar pacientes</h1>
                <p>Consulta y gestiona el registro completo de pacientes en el sistema.</p>
            </div>

            {notification && (
                <div className={`paciente-tabla__notification paciente-tabla__notification--${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <div className="paciente-tabla__card">
                <div className="paciente-tabla__search">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="paciente-tabla__search-input"
                    />
                </div>

                <div className="paciente-tabla__container">
                    <table className="paciente-tabla__table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th className="paciente-tabla__nombre-header">Nombre Completo</th>
                                <th className="paciente-tabla__acciones-header">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPacientes.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="paciente-tabla__empty">
                                        No hay pacientes para mostrar
                                    </td>
                                </tr>
                            ) : (
                                filteredPacientes.map(paciente => (
                                    <tr key={paciente.paciente_id}>
                                        <td>{paciente.paciente_id}</td>
                                        <td>{paciente.nombre_completo}</td>
                                        <td>
                                            <button
                                                className="paciente-tabla__delete-btn"
                                                onClick={() => handleDeleteClick(
                                                    paciente.paciente_id,
                                                    paciente.nombre_completo
                                                )}
                                                title="Eliminar paciente"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {hasMore && !searchTerm && (
                    <div className="paciente-tabla__more">
                        <button
                            onClick={loadMorePatients}
                            disabled={loading}
                            className="paciente-tabla__more-btn"
                        >
                            {loading ? "Cargando..." : "Cargar más"}
                        </button>
                    </div>
                )}
            </div>

            {confirmModal.show && (
                <div className="paciente-tabla__modal-overlay" onClick={() => setConfirmModal({ show: false, pacienteId: null, nombre: "" })}>
                    <div className="paciente-tabla__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="paciente-tabla__modal-icon">⚠️</div>
                        <h2>Confirmar eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar a <strong>{confirmModal.nombre}</strong>?</p>
                        <p className="paciente-tabla__modal-warning">Esta acción no se puede deshacer.</p>
                        <div className="paciente-tabla__modal-actions">
                            <button
                                className="paciente-tabla__modal-btn paciente-tabla__modal-btn--cancel"
                                onClick={() => setConfirmModal({ show: false, pacienteId: null, nombre: "" })}
                            >
                                Cancelar
                            </button>
                            <button
                                className="paciente-tabla__modal-btn paciente-tabla__modal-btn--confirm"
                                onClick={handleConfirmDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Paciente_tabla;