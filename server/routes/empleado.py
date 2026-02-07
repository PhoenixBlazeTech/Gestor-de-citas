from flask import Blueprint, jsonify, request
from utils.db import get_db_connection

empleado_bp = Blueprint('empleado', __name__, url_prefix='/api')

@empleado_bp.route('/empleado/update', methods=['POST'])
def update_empleado():
    data = request.json
    try:
        with get_db_connection() as (connection, cursor):
            cursor.callproc('empleado_update', [
                data.get("id"),
                data.get("nombre"),
                data.get("apellidoPat"),
                data.get("apellidoMat"),
                data.get("usuario"),
                data.get("contrasenia"),
                data.get("rol")
            ])
            connection.commit()
            return jsonify({"message": "Perfil de empleado actualizado con éxito"})

    except Exception as error:
        return jsonify({"error": f"Error al actualizar empleado: {error}"}), 500

