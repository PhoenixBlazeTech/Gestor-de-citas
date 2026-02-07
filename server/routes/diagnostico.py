from flask import Blueprint, jsonify, request
from utils.db import get_db_connection

diagnostico_bp = Blueprint('diagnostico', __name__, url_prefix='/api')

@diagnostico_bp.route('/diagnostico/add', methods=['POST'])
def add_diagnostico():
    try:
        data = request.get_json()
        citas_id = data.get('citas_id')
        diagnostico = data.get('diagnostico')

        # Validar los datos
        if not citas_id or not diagnostico:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        if len(diagnostico) > 600:
            return jsonify({"error": "El diagnóstico no puede exceder los 600 caracteres"}), 400

        with get_db_connection() as (connection, cursor):
            # Insertar en la tabla DIAGNOSTICO
            cursor.execute("""
                INSERT INTO DIAGNOSTICO (DIAGNOSTICO, CITAS_ID) 
                VALUES (:diagnostico, :citas_id)
            """, {
                "diagnostico": diagnostico,
                "citas_id": citas_id
            })

            # Obtener el ID generado por el trigger
            cursor.execute("SELECT 'DI' || LPAD(SEQ_DIAGNOSTICO_ID.CURRVAL, 2, '0') FROM DUAL")
            nuevo_diagnostico_id = cursor.fetchone()[0]

            return jsonify({
                "message": "Diagnóstico agregado con éxito",
                "diagnostico_id": nuevo_diagnostico_id
            }), 201

    except Exception as e:
        print(f"Error al agregar diagnóstico: {str(e)}")
        return jsonify({"error": "Error al agregar diagnóstico"}), 500

@diagnostico_bp.route('/receta/add', methods=['POST'])
def add_receta():
    try:
        data = request.get_json()
        diagnostico_id = data.get('diagnostico_id')
        medicamento_id = data.get('medicamento_id')
        periodicidad = data.get('periodicidad')

        # Validar los datos
        if not diagnostico_id or not medicamento_id or not periodicidad:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        if len(periodicidad) > 25:
            return jsonify({"error": "La periodicidad no puede exceder los 25 caracteres"}), 400

        with get_db_connection() as (connection, cursor):
            # Insertar en la tabla RECETA
            cursor.execute("""
                INSERT INTO RECETA (DIAGNOSTICO_ID, MEDICAMENTO_ID, PERIODICIDAD) 
                VALUES (:diagnostico_id, :medicamento_id, :periodicidad)
            """, {
                "diagnostico_id": diagnostico_id,
                "medicamento_id": medicamento_id,
                "periodicidad": periodicidad
            })

            return jsonify({"message": "Receta agregada con éxito"}), 201

    except Exception as e:
        print(f"Error al agregar receta: {str(e)}")
        return jsonify({"error": "Error al agregar receta"}), 500
