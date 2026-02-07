from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash
from utils.db import get_db_connection
import oracledb

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de autenticación usando procedimientos almacenados"""
    data = request.json
    usuario = data.get("usuario")
    contrasenia = data.get("contrasenia")

    print(f"Intento de login: {usuario}")

    try:
        with get_db_connection() as (connection, cursor):
            # Intentar login como MEDICO usando el procedimiento medico_pass
            try:
                p_id = cursor.var(int)
                p_pass = cursor.var(str)
                cursor.callproc('medico_pass', [usuario, p_id, p_pass])
                
                medico_id = p_id.getvalue()
                medico_pass = p_pass.getvalue()
                
                if medico_id and check_password_hash(medico_pass, contrasenia):
                    # Obtener nombre completo
                    cursor.execute("""
                        SELECT NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT 
                        FROM MEDICO WHERE MEDICO_ID = :id
                    """, {"id": medico_id})
                    nombre = cursor.fetchone()[0]
                    return jsonify({"ok": True, "rol": "medico", "id": medico_id, "nombre": nombre})
            except oracledb.DatabaseError:
                pass  # Usuario no es médico, intentar siguiente

            # Intentar login como PACIENTE usando el procedimiento paciente_pass
            try:
                p_id = cursor.var(int)
                p_pass = cursor.var(str)
                cursor.callproc('paciente_pass', [usuario, p_id, p_pass])
                
                paciente_id = p_id.getvalue()
                paciente_pass = p_pass.getvalue()
                
                if paciente_id and check_password_hash(paciente_pass, contrasenia):
                    # Obtener nombre completo
                    cursor.execute("""
                        SELECT NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT 
                        FROM PACIENTE WHERE PACIENTE_ID = :id
                    """, {"id": paciente_id})
                    nombre = cursor.fetchone()[0]
                    return jsonify({"ok": True, "rol": "paciente", "id": paciente_id, "nombre": nombre})
            except oracledb.DatabaseError:
                pass  # Usuario no es paciente, intentar siguiente

            # Intentar login como EMPLEADO usando el procedimiento empleado_pass
            try:
                p_id = cursor.var(int)
                p_pass = cursor.var(str)
                cursor.callproc('empleado_pass', [usuario, p_id, p_pass])
                
                empleado_id = p_id.getvalue()
                empleado_pass = p_pass.getvalue()
                
                if empleado_id and check_password_hash(empleado_pass, contrasenia):
                    # Obtener nombre completo
                    cursor.execute("""
                        SELECT NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT 
                        FROM EMPLEADO WHERE EMPLEADO_ID = :id
                    """, {"id": empleado_id})
                    nombre = cursor.fetchone()[0]
                    return jsonify({"ok": True, "rol": "empleado", "id": empleado_id, "nombre": nombre})
            except oracledb.DatabaseError:
                pass  # Usuario no es empleado

            # Credenciales incorrectas o usuario no encontrado
            return jsonify({"ok": False, "message": "Credenciales incorrectas"}), 401

    except oracledb.DatabaseError as error:
        print(f"Error en login: {error}")
        return jsonify({"error": "Error al conectar con la base de datos"}), 500
