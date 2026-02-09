from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash
from utils.db import get_db_connection

medico_bp = Blueprint('medico', __name__, url_prefix='/api')

@medico_bp.route('/especialidades', methods=['GET'])
def get_especialidades():
    try:
        with get_db_connection() as (connection, cursor):
            query = "SELECT ESPEC_ID, NOMBRE FROM ESPECIALIDAD"
            cursor.execute(query)
            especialidades = [{"ESPEC_ID": row[0], "NOMBRE": row[1]} for row in cursor]
            return jsonify(especialidades)

    except Exception as error:
        print(f"Error al obtener especialidades: {error}")
        return jsonify({"error": "Error al obtener especialidades"}), 500

@medico_bp.route('/medico/update', methods=['POST'])
def update_medico():
    data = request.json
    try:
        with get_db_connection() as (connection, cursor):
            query = """
                UPDATE MEDICO
                SET NOMBRE = :nombre,
                    APELLIDO_PAT = :apellido_pat,
                    APELLIDO_MAT = :apellido_mat,
                    HORARIO = TO_DATE(:horario, 'YYYY-MM-DD"T"HH24:MI:SS'),
                    ESPEC_ID = :especialidad
                WHERE MEDICO_ID = :medico_id
            """
            cursor.execute(query, {
                "nombre": data["nombre"],
                "apellido_pat": data["apellidoPat"],
                "apellido_mat": data["apellidoMat"],
                "horario": data["horario"],
                "especialidad": data["especialidad"],
                "medico_id": data["id"]
            })

            return jsonify({"message": "Perfil de médico actualizado con éxito"})

    except Exception as error:
        return jsonify({"error": f"Error al actualizar médico: {error}"}), 500

@medico_bp.route('/Medcon/<medico_id>', methods=['GET'])
def get_pacientes_por_medico(medico_id):
    try:
        with get_db_connection() as (connection, cursor):
            query = """
                SELECT 
                    p.PACIENTE_ID,
                    p.NOMBRE || ' ' || p.APELLIDO_PAT || ' ' || p.APELLIDO_MAT AS NOMBRE_COMPLETO,
                    NVL(c.ESTADO_CITA, 'Sin cita') AS ESTADO_CITA,
                    TO_CHAR(c.FECHA_HORA_CITA, 'YYYY-MM-DD HH24:MI:SS') AS FECHA_HORA_CITA,
                    CITAS_ID
                FROM PACIENTE p
                JOIN CITAS c ON p.PACIENTE_ID = c.PACIENTE_ID
                WHERE c.MEDICO_ID = :medico_id
            """
            cursor.execute(query, {"medico_id": medico_id})

            pacientes = [
                {
                    "id": row[0],
                    "nombre": row[1],
                    "estado": row[2],
                    "fechaHoraCita": row[3],
                    "cita_id": row[4]
                }
                for row in cursor.fetchall()
            ]

            return jsonify(pacientes)

    except Exception as error:
        print(f"Error al obtener pacientes: {error}")
        return jsonify({"error": "Error al obtener pacientes"}), 500

@medico_bp.route('/medico', methods=['POST'])
def insert_medico():
    data = request.json or {}
    required_fields = ["nombre", "apellidoPat", "apellidoMat", "usuario", "contrasenia"]
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing)}"}), 400

    try:
        with get_db_connection() as (connection, cursor):
            out_id = cursor.var(int)
            contrasenia_hash = generate_password_hash(data["contrasenia"], method='pbkdf2:sha256')
            cursor.callproc('insert_medico', [
                out_id,
                data["nombre"],
                data["apellidoPat"],
                data["apellidoMat"],
                data["usuario"],
                contrasenia_hash,
            ])
            connection.commit()

            return jsonify({
                "message": "Médico creado exitosamente",
                "medico_id": out_id.getvalue()
            }), 201

    except Exception as error:
        return jsonify({"error": f"Error al crear médico: {error}"}), 500

@medico_bp.route('/medico/<int:medico_id>', methods=['DELETE'])
def delete_medico(medico_id):
    try:
        with get_db_connection() as (connection, cursor):
            cursor.callproc('medico_delete', [medico_id])
            connection.commit()
            return jsonify({"message": "Médico eliminado exitosamente"})

    except Exception as error:
        error_text = str(error)
        if 'ORA-20013' in error_text or '20013' in error_text:
            return jsonify({"error": f"No se eliminó: médico con ID {medico_id} no existe"}), 404
        if 'ORA-20014' in error_text or '20014' in error_text:
            return jsonify({"error": "No se puede eliminar: el médico tiene registros asociados"}), 409
        return jsonify({"error": f"Error al eliminar médico: {error}"}), 500

@medico_bp.route('/medico', methods=['GET'])
def list_medicos():
    try:
        limit = request.args.get('limit', default=10, type=int) or 10
        limit = max(1, min(limit, 50))
        after_id = request.args.get('after', type=int)
        raw_search = request.args.get('search', type=str)
        normalized_search = raw_search.strip() if raw_search else None

        limit_plus_one = limit + 1

        with get_db_connection() as (connection, cursor):
            query = f"""
                SELECT MEDICO_ID,
                       NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT AS NOMBRE_COMPLETO
                FROM MEDICO
                WHERE (:after_id IS NULL OR MEDICO_ID > :after_id)
                  AND (
                        :search_term IS NULL OR
                        UPPER(NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT) LIKE '%' || UPPER(:search_term) || '%'
                      )
                ORDER BY MEDICO_ID
                FETCH NEXT {limit_plus_one} ROWS ONLY
            """

            cursor.execute(query, {
                "after_id": after_id,
                "search_term": normalized_search,
            })

            rows = cursor.fetchall()
            has_more = len(rows) > limit
            trimmed_rows = rows[:limit]

            payload = {
                "data": [
                    {
                        "medico_id": row[0],
                        "nombre_completo": row[1],
                    }
                    for row in trimmed_rows
                ],
                "pageSize": limit,
                "hasMore": has_more,
                "nextCursor": trimmed_rows[-1][0] if has_more and trimmed_rows else None,
            }

            return jsonify(payload)

    except Exception as error:
        return jsonify({"error": f"Error al listar médicos: {error}"}), 500

