from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash
from utils.db import get_db_connection

paciente_bp = Blueprint('paciente', __name__, url_prefix='/api')

@paciente_bp.route('/paciente/update', methods=['POST'])
def update_paciente():
    data = request.json
    try:
        with get_db_connection() as (connection, cursor):
            query = """
                UPDATE PACIENTE
                SET NOMBRE = :nombre,
                    APELLIDO_PAT = :apellido_pat,
                    APELLIDO_MAT = :apellido_mat,
                    TELEFONO = :telefono,
                    CALLE = :calle,
                    ALCAL_MUN = :alcalMun,
                    COLONIA = :colonia,
                    CP = :cp,
                    ESTADO_ID = (SELECT ESTADO_ID FROM ESTADO WHERE NOMBRE = :estado)
                WHERE PACIENTE_ID = :paciente_id
            """
            cursor.execute(query, {
                "nombre": data["nombre"],
                "apellido_pat": data["apellidoPat"],
                "apellido_mat": data["apellidoMat"],
                "telefono": data["telefono"],
                "calle": data["calle"],
                "alcalMun": data["alcalMun"],
                "colonia": data["colonia"],
                "cp": data["cp"],
                "estado": data["estado"],
                "paciente_id": data["id"]
            })

            return jsonify({"message": "Perfil de paciente actualizado con éxito"})

    except Exception as error:
        return jsonify({"error": f"Error al actualizar paciente: {error}"}), 500

@paciente_bp.route('/pacientes', methods=['GET'])
def get_pacientes():
    try:
        with get_db_connection() as (connection, cursor):
            query = """
                SELECT PACIENTE_ID, NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT AS NOMBRE_COMPLETO
                FROM PACIENTE
            """
            cursor.execute(query)
            rows = cursor.fetchall()

            pacientes = [{"id": row[0], "nombre": row[1]} for row in rows]

            return jsonify(pacientes)

    except Exception as error:
        print(f"Error al obtener pacientes: {error}")
        return jsonify({"error": "Error al obtener pacientes"}), 500

@paciente_bp.route('/pacientes/<id>', methods=['GET'])
def get_paciente(id):
    try:
        with get_db_connection() as (connection, cursor):
            query = """
                SELECT NOMBRE, APELLIDO_PAT, APELLIDO_MAT
                FROM PACIENTE
                WHERE PACIENTE_ID = :id
            """
            cursor.execute(query, [id])
            row = cursor.fetchone()

            if row:
                nombre_completo = f"{row[0]} {row[1]} {row[2]}"
                return jsonify({"nombre_completo": nombre_completo})
            else:
                return jsonify({"error": "Paciente no encontrado"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500


@paciente_bp.route('/paciente', methods=['POST'])
def insert_paciente():
    data = request.get_json() or {}
    required_fields = [
        "nombre",
        "apellidoPat",
        "apellidoMat",
        "usuario",
        "alcalMun",
        "colonia",
        "cp",
        "calle",
        "contrasenia",
    ]

    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({
            "error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"
        }), 400

    try:
        with get_db_connection() as (connection, cursor):
            paciente_id_out = cursor.var(str)
            contrasenia_hash = generate_password_hash(data["contrasenia"], method='pbkdf2:sha256')
            cursor.callproc('insert_paciente', [
                paciente_id_out,
                data["nombre"],
                data["apellidoPat"],
                data["apellidoMat"],
                data["usuario"],
                data["alcalMun"],
                data["colonia"],
                data["cp"],
                data["calle"],
                contrasenia_hash,
            ])

            return jsonify({
                "message": "Paciente creado exitosamente",
                "paciente_id": paciente_id_out.getvalue(),
            }), 201

    except Exception as error:
        return jsonify({"error": f"Error al crear paciente: {error}"}), 500

@paciente_bp.route('/paciente/<int:paciente_id>', methods=['DELETE'])
def delete_paciente(paciente_id):
    try:
        with get_db_connection() as (connection, cursor):
            cursor.callproc('paciente_delete', [paciente_id])
            
            return jsonify({"message": f"Paciente con ID {paciente_id} eliminado exitosamente"}), 200

    except Exception as error:
        error_str = str(error)
        
        # Capturar el error ORA-20014 (paciente tiene registros asociados)
        if 'ORA-20014' in error_str:
            return jsonify({
                "error": "No se puede eliminar: el paciente tiene citas o registros asociados."
            }), 409
        
        # Capturar el error ORA-20013 (paciente no existe)
        elif 'ORA-20013' in error_str:
            return jsonify({
                "error": f"No se eliminó: paciente con ID {paciente_id} no existe"
            }), 404
        
        # Cualquier otro error
        else:
            return jsonify({"error": f"Error al eliminar paciente: {error}"}), 500
        
@paciente_bp.route('/paciente/list', methods=['GET'])
def get_pacientes_paginados():
    try:
        limit = request.args.get('limit', 10, type=int)
        last_id = request.args.get('last_id', 0, type=int)
        
        with get_db_connection() as (connection, cursor):
            if last_id == 0:
                # Primera carga de datos
                query = """
                    SELECT paciente_id, 
                           (nombre || ' ' || apellido_pat || ' ' || apellido_mat) as nombre_completo
                    FROM paciente
                    ORDER BY paciente_id
                    FETCH NEXT :limit ROWS ONLY
                """
                cursor.execute(query, {"limit": limit})
            else:
                # Cargar más datos (keyset pagination)
                query = """
                    SELECT paciente_id, 
                           (nombre || ' ' || apellido_pat || ' ' || apellido_mat) as nombre_completo
                    FROM paciente
                    WHERE paciente_id > :last_id
                    ORDER BY paciente_id
                    FETCH NEXT :limit ROWS ONLY
                """
                cursor.execute(query, {"last_id": last_id, "limit": limit})
            
            rows = cursor.fetchall()
            pacientes = [
                {
                    "paciente_id": row[0],
                    "nombre_completo": row[1]
                }
                for row in rows
            ]
            
            return jsonify({"pacientes": pacientes}), 200
    
    except Exception as error:
        print(f"Error al obtener lista de pacientes: {error}")
        return jsonify({"error": f"Error al obtener lista de pacientes: {error}"}), 500

