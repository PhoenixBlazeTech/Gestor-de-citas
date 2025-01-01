from flask import Flask, jsonify, request
from flask_cors import CORS  # Importar Flask-CORS
import cx_Oracle

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Datos de conexión
username = "usr_citas"
password = "citapass"
dsn = "localhost:1521/xepdb1"

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
        connection = cx_Oracle.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Verificar en la tabla MEDICO
        query_medico = "SELECT MEDICO_ID FROM MEDICO WHERE USUARIO = :usuario AND CONTRASENIA = :contrasenia"
        cursor.execute(query_medico, usuario=usuario, contrasenia=contrasenia)
        medico = cursor.fetchone()
        if medico:
            return jsonify({"ok": True, "rol": "medico", "id": medico[0]})

        # Verificar en la tabla PACIENTE
        query_paciente = "SELECT PACIENTE_ID FROM PACIENTE WHERE USUARIO = :usuario AND CONTRASENIA = :contrasenia"
        cursor.execute(query_paciente, usuario=usuario, contrasenia=contrasenia)
        paciente = cursor.fetchone()
        if paciente:
            return jsonify({"ok": True, "rol": "paciente", "id": paciente[0]})

        # Verificar en la tabla EMPLEADO
        query_empleado = "SELECT EMPLEADO_ID FROM EMPLEADO WHERE USUARIO = :usuario AND CONTRASENIA = :contrasenia"
        cursor.execute(query_empleado, usuario=usuario, contrasenia=contrasenia)
        empleado = cursor.fetchone()
        if empleado:
            return jsonify({"ok": True, "rol": "empleado", "id": empleado[0]})

        # Si no se encuentra en ninguna tabla
        return jsonify({"ok": False, "message": "Credenciales incorrectas"}), 401

    except cx_Oracle.Error as error:
        print(f"Error al conectar con la base de datos: {error}")  # Log del error
        return jsonify({"error": "Error al conectar con la base de datos"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)

