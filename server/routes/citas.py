from flask import Blueprint, jsonify, request
from utils.db import get_db_connection

citas_bp = Blueprint('citas', __name__, url_prefix='/api')

@citas_bp.route('/citas/add', methods=['POST'])
def add_cita():
    try:
        data = request.json
        with get_db_connection() as (connection, cursor):
            query = """
                INSERT INTO CITAS (FECHA_HORA_CITA, ESTADO_CITA, NUM_CONSULTORIO, PACIENTE_ID, MEDICO_ID)
                VALUES (TO_TIMESTAMP(:fecha_hora, 'YYYY-MM-DD"T"HH24:MI:SS'), :estado_cita, :num_consultorio, :paciente_id, :medico_id)
            """
            cursor.execute(query, {
                'fecha_hora': data['fecha_hora'],
                'estado_cita': data['estado_cita'],
                'num_consultorio': data['num_consultorio'],
                'paciente_id': data['paciente_id'],
                'medico_id': data['medico_id']
            })

            return jsonify({"message": "Cita creada exitosamente."}), 201

    except Exception as error:
        return jsonify({"error": f"Error en la base de datos: {error}"}), 500

@citas_bp.route('/citas/cancelar', methods=['POST'])
def cancelar_cita():
    data = request.json
    print(f"Datos recibidos en el servidor: {data}")
    
    cita_id = data.get("cita_id")

    if not cita_id:
        return jsonify({"error": "ID de la cita no proporcionado"}), 400

    try:
        with get_db_connection() as (connection, cursor):
            query = "UPDATE CITAS SET ESTADO_CITA = 'C' WHERE CITAS_ID = :cita_id"
            cursor.execute(query, {"cita_id": cita_id})

            if cursor.rowcount > 0:
                return jsonify({"message": "Cita cancelada con éxito"})
            else:
                return jsonify({"error": "No se encontró la cita con el ID proporcionado"}), 404

    except Exception as error:
        print(f"Error al cancelar cita: {error}")
        return jsonify({"error": "Error al cancelar cita"}), 500
