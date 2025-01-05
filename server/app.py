from flask import Flask, jsonify, request
from flask_cors import CORS  # Importar Flask-CORS
import oracledb  # Cambiado de cx_Oracle a oracledb

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Datos de conexión
username = "usr_citas"
password = "citapass"
dsn = "localhost:1521/xepdb1"

# Configuración para oracledb
oracledb.init_oracle_client()  # Asegúrate de que Oracle Instant Client esté configurado

@app.route('/')
def home():
    return "Funcionando"

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json  # Recibimos un JSON con 'usuario' y 'contrasenia'
    usuario = data.get("usuario")
    contrasenia = data.get("contrasenia")

    print(f"Datos recibidos en el servidor: {data}")  # Log para verificar los datos

    try:
        # Conexión a Oracle
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Verificar en la tabla MEDICO
        query_medico = """
            SELECT MEDICO_ID, NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT AS NOMBRE_COMPLETO
            FROM MEDICO
            WHERE USUARIO = :usuario AND CONTRASENIA = :contrasenia
        """
        cursor.execute(query_medico, usuario=usuario, contrasenia=contrasenia)
        medico = cursor.fetchone()
        if medico:
            return jsonify({"ok": True, "rol": "medico", "id": medico[0], "nombre": medico[1]})

        # Verificar en la tabla PACIENTE
        query_paciente = """
            SELECT PACIENTE_ID, NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT AS NOMBRE_COMPLETO
            FROM PACIENTE
            WHERE USUARIO = :usuario AND CONTRASENIA = :contrasenia
        """
        cursor.execute(query_paciente, usuario=usuario, contrasenia=contrasenia)
        paciente = cursor.fetchone()
        if paciente:
            return jsonify({"ok": True, "rol": "paciente", "id": paciente[0], "nombre": paciente[1]})

        # Verificar en la tabla EMPLEADO
        query_empleado = """
            SELECT EMPLEADO_ID, NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT AS NOMBRE_COMPLETO
            FROM EMPLEADO
            WHERE USUARIO = :usuario AND CONTRASENIA = :contrasenia
        """
        cursor.execute(query_empleado, usuario=usuario, contrasenia=contrasenia)
        empleado = cursor.fetchone()
        if empleado:
            return jsonify({"ok": True, "rol": "empleado", "id": empleado[0], "nombre": empleado[1]})

        # Si no se encuentra en ninguna tabla
        return jsonify({"ok": False, "message": "Credenciales incorrectas"}), 401

    except oracledb.DatabaseError as error:
        print(f"Error al conectar con la base de datos: {error}")  # Log del error
        return jsonify({"error": "Error al conectar con la base de datos"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/especialidades', methods=['GET'])
def get_especialidades():
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        query = "SELECT ESPEC_ID, NOMBRE FROM ESPECIALIDAD"
        cursor.execute(query)
        especialidades = [{"ESPEC_ID": row[0], "NOMBRE": row[1]} for row in cursor]

        return jsonify(especialidades)

    except oracledb.DatabaseError as error:
        print(f"Error al obtener especialidades: {error}")
        return jsonify({"error": "Error al obtener especialidades"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/medico/update', methods=['POST'])
def update_medico():
    data = request.json
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

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
        connection.commit()

        return jsonify({"message": "Perfil de médico actualizado con éxito"})

    except oracledb.DatabaseError as error:
        return jsonify({"error": f"Error al actualizar médico: {error}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/paciente/update', methods=['POST'])
def update_paciente():
    data = request.json
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

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
        connection.commit()

        return jsonify({"message": "Perfil de paciente actualizado con éxito"})

    except oracledb.DatabaseError as error:
        return jsonify({"error": f"Error al actualizar paciente: {error}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/empleado/update', methods=['POST'])
def update_empleado():
    data = request.json
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        query = """
            UPDATE EMPLEADO
            SET NOMBRE = :nombre,
                APELLIDO_PAT = :apellido_pat,
                APELLIDO_MAT = :apellido_mat,
                PUESTO_ID = :puesto
            WHERE EMPLEADO_ID = :empleado_id
        """
        cursor.execute(query, {
            "nombre": data["nombre"],
            "apellido_pat": data["apellidoPat"],
            "apellido_mat": data["apellidoMat"],
            "puesto": data["puesto"],
            "empleado_id": data["id"]
        })
        connection.commit()

        return jsonify({"message": "Perfil de empleado actualizado con éxito"})

    except oracledb.DatabaseError as error:
        return jsonify({"error": f"Error al actualizar empleado: {error}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/puestos', methods=['GET'])
def get_puestos():
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Consulta para obtener los puestos
        query = "SELECT PUESTO_ID, PUESTO FROM PUESTO"
        cursor.execute(query)

        # Construir la respuesta en formato JSON
        puestos = [{"PUESTO_ID": row[0], "PUESTO": row[1]} for row in cursor]

        return jsonify(puestos)

    except oracledb.DatabaseError as error:
        print(f"Error al obtener puestos: {error}")
        return jsonify({"error": f"Error al obtener puestos: {error}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/Medcon/<medico_id>', methods=['GET'])
def get_pacientes_por_medico(medico_id):
    try:
        # Conexión a la base de datos
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Consulta SQL para filtrar pacientes por médico e incluir FECHA_HORA_CITA
        query = """
            SELECT 
                p.PACIENTE_ID,
                p.NOMBRE || ' ' || p.APELLIDO_PAT || ' ' || p.APELLIDO_MAT AS NOMBRE_COMPLETO,
                NVL(c.ESTADO_CITA, 'Sin cita') AS ESTADO_CITA,
                TO_CHAR(c.FECHA_HORA_CITA, 'YYYY-MM-DD HH24:MI:SS') AS FECHA_HORA_CITA
            FROM PACIENTE p
            JOIN CITAS c ON p.PACIENTE_ID = c.PACIENTE_ID
            WHERE c.MEDICO_ID = :medico_id
        """
        cursor.execute(query, {"medico_id": medico_id})

        # Procesar resultados
        pacientes = [
            {
                "id": row[0],
                "nombre": row[1],
                "estado": row[2],
                "fechaHoraCita": row[3]  # Incluyendo la fecha y hora
            }
            for row in cursor.fetchall()
        ]

        # Devolver respuesta en formato JSON
        return jsonify(pacientes)

    except oracledb.DatabaseError as error:
        print(f"Error al obtener pacientes: {error}")
        return jsonify({"error": "Error al obtener pacientes"}), 500

    finally:
        # Cerrar conexión
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/pacientes', methods=['GET'])
def get_pacientes():
    try:
        # Conexión a Oracle
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Query para obtener los pacientes
        query = """
            SELECT PACIENTE_ID, NOMBRE || ' ' || APELLIDO_PAT || ' ' || APELLIDO_MAT AS NOMBRE_COMPLETO
            FROM PACIENTE
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        # Convertir a formato JSON
        pacientes = [{"id": row[0], "nombre": row[1]} for row in rows]

        return jsonify(pacientes)

    except oracledb.DatabaseError as error:
        print(f"Error al obtener pacientes: {error}")
        return jsonify({"error": "Error al obtener pacientes"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()




@app.route('/api/compuesto', methods=['GET'])
def get_compuesto():
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Consulta SQL
        query = """
            SELECT m.nombre AS nombre_medicamento, c.nombre AS nombre_compuesto
            FROM compuesto c
            JOIN medicamento m USING(medicamento_id)
        """
        cursor.execute(query)

        # Transformar los resultados en una lista de diccionarios
        data = [{"nombre_medicamento": row[0], "nombre_compuesto": row[1]} for row in cursor]

        return jsonify(data)

    except oracledb.DatabaseError as error:
        return jsonify({"error": f"Error al obtener datos: {error}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/compuesto/delete', methods=['DELETE'])
def delete_compuesto():
    try:
        data = request.json
        compuesto_id = data.get("compuesto_id")  # Recibir el ID del compuesto a eliminar

        if not compuesto_id:
            return jsonify({"error": "ID del compuesto no proporcionado"}), 400

        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Eliminar el registro
        query = "DELETE FROM compuesto WHERE compuesto_id = :compuesto_id"
        cursor.execute(query, {"compuesto_id": compuesto_id})
        connection.commit()

        return jsonify({"message": "Compuesto eliminado con éxito"})

    except oracledb.DatabaseError as error:
        return jsonify({"error": f"Error al eliminar compuesto: {error}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/medicamentos', methods=['GET'])
def get_medicamentos():
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()
        query = "SELECT MEDICAMENTO_ID, NOMBRE FROM MEDICAMENTO"
        cursor.execute(query)
        medicamentos = [{"MEDICAMENTO_ID": row[0], "NOMBRE": row[1]} for row in cursor]
        return jsonify(medicamentos)
    except oracledb.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)
