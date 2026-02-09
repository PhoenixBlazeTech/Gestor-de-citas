import React, { useEffect, useState } from 'react';
import "./Medico_tabla.css";

function Medico_tabla() {
	const [medicos, setMedicos] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [nextCursor, setNextCursor] = useState(null);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [notification, setNotification] = useState(null);
	const [confirmModal, setConfirmModal] = useState({ show: false, medicoId: null, nombre: '' });

	useEffect(() => {
		loadInitialMedicos();
	}, []);

	const loadInitialMedicos = async () => {
		setLoading(true);
		try {
			const response = await fetch('http://localhost:5000/api/medico?limit=10');
			const data = await response.json();

			if (!response.ok) throw new Error(data.error || 'No se pudieron cargar los médicos');

			const rows = data?.data || [];
			setMedicos(rows);
			setNextCursor(data?.nextCursor || (rows.length ? rows[rows.length - 1].medico_id : null));
			setHasMore(Boolean(data?.hasMore) && rows.length === 10);
		} catch (error) {
			showNotification(error.message || 'Error al cargar médicos', 'error');
			setMedicos([]);
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	};

	const loadMoreMedicos = async () => {
		if (loading || !hasMore || !nextCursor || searchTerm) return;

		setLoading(true);
		try {
			const params = new URLSearchParams({ limit: '10', after: String(nextCursor) });
			const response = await fetch(`http://localhost:5000/api/medico?${params.toString()}`);
			const data = await response.json();

			if (!response.ok) throw new Error(data.error || 'No se pudieron cargar más médicos');

			const rows = data?.data || [];
			setMedicos((prev) => [...prev, ...rows]);
			setNextCursor(data?.nextCursor || (rows.length ? rows[rows.length - 1].medico_id : null));
			setHasMore(Boolean(data?.hasMore) && rows.length === 10);
		} catch (error) {
			showNotification(error.message || 'Error al cargar más médicos', 'error');
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClick = (medicoId, nombre) => {
		setConfirmModal({ show: true, medicoId, nombre });
	};

	const handleConfirmDelete = async () => {
		const { medicoId } = confirmModal;
		setConfirmModal({ show: false, medicoId: null, nombre: '' });

		try {
			const response = await fetch(`http://localhost:5000/api/medico/${medicoId}`, { method: 'DELETE' });
			const data = await response.json().catch(() => ({}));

			if (!response.ok) throw new Error(data.error || 'No se pudo eliminar al médico');

			setMedicos((prev) => prev.filter((medico) => medico.medico_id !== medicoId));
			showNotification('Médico eliminado exitosamente', 'success');
		} catch (error) {
			showNotification(error.message || 'Error al eliminar médico', 'error');
		}
	};

	const showNotification = (message, type) => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 4000);
	};

	const filteredMedicos = medicos.filter((medico) =>
		(medico?.nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<section className="medico-tabla">
			<div className="medico-tabla__hero">
				<span className="medico-tabla__eyebrow">Gestión de médicos</span>
				<h1>Administrar médicos</h1>
				<p>Consulta el padrón de especialistas y mantén sus accesos al día.</p>
			</div>

			{notification && (
				<div className={`medico-tabla__notification medico-tabla__notification--${notification.type}`}>
					{notification.message}
				</div>
			)}

			<div className="medico-tabla__card">
				<div className="medico-tabla__search">
					<input
						type="text"
						placeholder="Buscar por nombre..."
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						className="medico-tabla__search-input"
					/>
				</div>

				<div className="medico-tabla__container">
					<table className="medico-tabla__table">
						<thead>
							<tr>
								<th>ID</th>
								<th className="medico-tabla__nombre-header">Nombre completo</th>
								<th className="medico-tabla__acciones-header">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{filteredMedicos.length === 0 ? (
								<tr>
									<td colSpan="3" className="medico-tabla__empty">
										No hay médicos para mostrar
									</td>
								</tr>
							) : (
								filteredMedicos.map((medico) => (
									<tr key={medico.medico_id}>
										<td>{medico.medico_id}</td>
										<td>{medico.nombre_completo}</td>
										<td>
											<button
												className="medico-tabla__delete-btn"
												onClick={() => handleDeleteClick(medico.medico_id, medico.nombre_completo)}
												title="Eliminar médico"
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
					<div className="medico-tabla__more">
						<button
							onClick={loadMoreMedicos}
							disabled={loading}
							className="medico-tabla__more-btn"
						>
							{loading ? 'Cargando...' : 'Cargar más'}
						</button>
					</div>
				)}
			</div>

			{confirmModal.show && (
				<div
					className="medico-tabla__modal-overlay"
					onClick={() => setConfirmModal({ show: false, medicoId: null, nombre: '' })}
				>
					<div className="medico-tabla__modal" onClick={(event) => event.stopPropagation()}>
						<div className="medico-tabla__modal-icon">⚠️</div>
						<h2>Confirmar eliminación</h2>
						<p>
							¿Deseas eliminar a <strong>{confirmModal.nombre}</strong>?
						</p>
						<p className="medico-tabla__modal-warning">Esta acción no se puede deshacer.</p>
						<div className="medico-tabla__modal-actions">
							<button
								className="medico-tabla__modal-btn medico-tabla__modal-btn--cancel"
								onClick={() => setConfirmModal({ show: false, medicoId: null, nombre: '' })}
							>
								Cancelar
							</button>
							<button
								className="medico-tabla__modal-btn medico-tabla__modal-btn--confirm"
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

export default Medico_tabla;