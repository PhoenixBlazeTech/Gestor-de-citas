from flask import Blueprint, jsonify, request
from utils.db import get_db_connection

medicamentos_bp = Blueprint('medicamentos', __name__, url_prefix='/api')

@medicamentos_bp.route('/compuesto', methods=['GET'])
def get_compuesto():
    try:
        with get_db_connection() as (connection, cursor):
            query = """
                SELECT c.comp_id AS compuesto_id, c.nombre AS nombre_compuesto, m.nombre AS nombre_medicamento
                FROM compuesto c
                JOIN medicamento m USING(medicamento_id)
            """
            cursor.execute(query)

            data = [
                {
                    "compuesto_id": row[0],
                    "nombre_compuesto": row[1],
                    "nombre_medicamento": row[2]
                }
                for row in cursor
            ]

            return jsonify(data)

    except Exception as error:
        return jsonify({"error": f"Error al obtener datos: {error}"}), 500

@medicamentos_bp.route('/medicamentos', methods=['GET'])
def get_medicamentos():
    try:
        with get_db_connection() as (connection, cursor):
            query = "SELECT MEDICAMENTO_ID, NOMBRE FROM MEDICAMENTO"
            cursor.execute(query)
            medicamentos = [{"MEDICAMENTO_ID": row[0], "NOMBRE": row[1]} for row in cursor]
            return jsonify(medicamentos)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@medicamentos_bp.route('/medicamento/add', methods=['POST'])
def add_medicamento():
    try:
        data = request.json
        nombre = data.get("nombre")

        if not nombre:
            return jsonify({"error": "El campo 'nombre' es obligatorio."}), 400

        with get_db_connection() as (connection, cursor):
            query = "INSERT INTO MEDICAMENTO (NOMBRE) VALUES (:nombre)"
            cursor.execute(query, [nombre])

            return jsonify({"message": "Medicamento agregado con éxito."})

    except Exception as e:
        print(f"Error al insertar medicamento: {e}")
        return jsonify({"error": str(e)}), 500

@medicamentos_bp.route('/compuesto/add', methods=['POST'])
def add_compuesto():
    try:
        data = request.json
        medicamento_id = data.get("medicamento")
        nombre_compuesto = data.get("compuesto")

        if not medicamento_id or not nombre_compuesto:
            return jsonify({"error": "Los campos 'medicamento' y 'compuesto' son obligatorios."}), 400

        with get_db_connection() as (connection, cursor):
            query = """
                INSERT INTO COMPUESTO (MEDICAMENTO_ID, NOMBRE)
                VALUES (:medicamento_id, :nombre_compuesto)
            """
            cursor.execute(query, [medicamento_id, nombre_compuesto])

            return jsonify({"message": "Compuesto agregado con éxito."})

    except Exception as e:
        print(f"Error al insertar compuesto: {e}")
        return jsonify({"error": str(e)}), 500

@medicamentos_bp.route('/medicamento/delete', methods=['DELETE'])
def delete_medicamento():
    try:
        data = request.get_json()
        medicamento_id = data.get("medicamento_id")
        
        if not medicamento_id:
            return jsonify({"error": "El ID del medicamento es obligatorio"}), 400
        
        with get_db_connection() as (connection, cursor):
            query = "DELETE FROM MEDICAMENTO WHERE MEDICAMENTO_ID = :id"
            cursor.execute(query, {"id": medicamento_id})
            
            if cursor.rowcount == 0:
                return jsonify({"error": "Medicamento no encontrado"}), 404
            
            return jsonify({"message": "Medicamento eliminado con éxito"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@medicamentos_bp.route('/compuesto/delete', methods=['DELETE'])
def delete_compuesto():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)
        compuesto_id = data.get('compuesto_id')

        if not compuesto_id:
            print("Error: No se proporcionó el compuesto_id")
            return jsonify({"error": "El ID del compuesto es requerido"}), 400

        with get_db_connection() as (connection, cursor):
            # Verificar si el compuesto existe antes de eliminar
            verify_query = "SELECT COUNT(*) FROM COMPUESTO WHERE COMP_ID = :compuesto_id"
            cursor.execute(verify_query, [compuesto_id])
            exists = cursor.fetchone()[0]
            print("El compuesto existe:", exists)

            if not exists:
                print("Error: El compuesto no existe")
                return jsonify({"error": "El compuesto no existe"}), 404

            # Eliminar el compuesto
            delete_query = "DELETE FROM COMPUESTO WHERE COMP_ID = :compuesto_id"
            cursor.execute(delete_query, [compuesto_id])
            print("Compuesto eliminado con éxito")

            return jsonify({"message": "Compuesto eliminado con éxito."})

    except Exception as error:
        print("Error en la base de datos:", error)
        return jsonify({"error": f"Error al eliminar el compuesto: {error}"}), 500
