from flask import Blueprint, jsonify, request
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
