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
                TO_CHAR(c.FECHA_HORA_CITA, 'YYYY-MM-DD HH24:MI:SS') AS FECHA_HORA_CITA,
                CITAS_ID
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
                "fechaHoraCita": row[3], # Incluyendo la fecha y hora
                "cita_id": row[4]
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

        # Consulta SQL actualizada
        query = """
            SELECT c.comp_id AS compuesto_id, c.nombre AS nombre_compuesto, m.nombre AS nombre_medicamento
            FROM compuesto c
            JOIN medicamento m USING(medicamento_id)
        """
        cursor.execute(query)

        # Transformar los resultados en una lista de diccionarios
        data = [
            {
                "compuesto_id": row[0],
                "nombre_compuesto": row[1],
                "nombre_medicamento": row[2]
            }
            for row in cursor
        ]

        return jsonify(data)

    except oracledb.DatabaseError as error:
        return jsonify({"error": f"Error al obtener datos: {error}"}), 500

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

@app.route('/api/medicamento/add', methods=['POST'])
def add_medicamento():
    try:
        # Obtener los datos del cuerpo de la solicitud
        data = request.json
        nombre = data.get("nombre")

        if not nombre:
            return jsonify({"error": "El campo 'nombre' es obligatorio."}), 400

        # Conexión a la base de datos
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Insertar el nuevo medicamento (el ID lo genera el trigger automáticamente)
        query = "INSERT INTO MEDICAMENTO (NOMBRE) VALUES (:nombre)"
        cursor.execute(query, [nombre])
        connection.commit()

        return jsonify({"message": "Medicamento agregado con éxito."})

    except oracledb.Error as e:
        print(f"Error al insertar medicamento: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            
@app.route('/api/compuesto/add', methods=['POST'])
def add_compuesto():
    try:
        # Obtener los datos del cuerpo de la solicitud
        data = request.json
        medicamento_id = data.get("medicamento")
        nombre_compuesto = data.get("compuesto")

        if not medicamento_id or not nombre_compuesto:
            return jsonify({"error": "Los campos 'medicamento' y 'compuesto' son obligatorios."}), 400

        # Conexión a la base de datos
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Insertar el nuevo compuesto (el ID lo genera el trigger automáticamente)
        query = """
            INSERT INTO COMPUESTO (MEDICAMENTO_ID, NOMBRE)
            VALUES (:medicamento_id, :nombre_compuesto)
        """
        cursor.execute(query, [medicamento_id, nombre_compuesto])
        connection.commit()

        return jsonify({"message": "Compuesto agregado con éxito."})

    except oracledb.Error as e:
        print(f"Error al insertar compuesto: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/medicamento/delete', methods=['DELETE'])
def delete_medicamento():
    try:
        data = request.get_json()
        medicamento_id = data.get("medicamento_id")
        
        if not medicamento_id:
            return jsonify({"error": "El ID del medicamento es obligatorio"}), 400
        
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()
        query = "DELETE FROM MEDICAMENTO WHERE MEDICAMENTO_ID = :id"
        cursor.execute(query, {"id": medicamento_id})
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Medicamento no encontrado"}), 404
        
        return jsonify({"message": "Medicamento eliminado con éxito"}), 200
    except oracledb.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/compuesto/delete', methods=['DELETE'])
def delete_compuesto():
    try:
        # Obtener los datos del cuerpo de la solicitud
        data = request.get_json()
        print("Datos recibidos:", data)  # Log para verificar datos
        compuesto_id = data.get('compuesto_id')

        if not compuesto_id:
            print("Error: No se proporcionó el compuesto_id")
            return jsonify({"error": "El ID del compuesto es requerido"}), 400

        # Conectar a la base de datos
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

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
        connection.commit()
        print("Compuesto eliminado con éxito")

        return jsonify({"message": "Compuesto eliminado con éxito."})

    except oracledb.DatabaseError as error:
        print("Error en la base de datos:", error)
        return jsonify({"error": f"Error al eliminar el compuesto: {error}"}), 500

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection:
            connection.close()

@app.route('/api/citas/add', methods=['POST'])
def add_cita():
    try:
        data = request.json
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Insertar los datos
        query = """
            INSERT INTO CITAS (FECHA_HORA_CITA, ESTADO_CITA, NUM_CONSULTORIO, PACIENTE_ID, MEDICO_ID)
            VALUES (TO_TIMESTAMP(:fecha_hora, 'YYYY-MM-DD"T"HH24:MI:SS'), :estado_cita, :num_consultorio, :paciente_id, :medico_id)
        """
        cursor.execute(query, {
            'fecha_hora': data['fecha_hora'],
            'estado_cita': data['estado_cita'],  # Valor predeterminado, por ejemplo 'A'
            'num_consultorio': data['num_consultorio'],
            'paciente_id': data['paciente_id'],
            'medico_id': data['medico_id']
        })
        connection.commit()

        return jsonify({"message": "Cita creada exitosamente."}), 201

    except oracledb.DatabaseError as error:
        return jsonify({"error": f"Error en la base de datos: {error}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/paciecon/<paciente_id>', methods=['GET'])
def get_citas_por_paciente(paciente_id):
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        query = """
            SELECT 
                c.CITAS_ID,  -- Incluir el ID de la cita
                TO_CHAR(c.FECHA_HORA_CITA, 'YYYY-MM-DD HH24:MI:SS') AS FECHA_HORA_CITA,
                c.ESTADO_CITA,
                m.NOMBRE || ' ' || m.APELLIDO_PAT || ' ' || m.APELLIDO_MAT AS MEDICO_NOMBRE
            FROM CITAS c
            JOIN MEDICO m ON c.MEDICO_ID = m.MEDICO_ID
            WHERE c.PACIENTE_ID = :paciente_id
        """
        cursor.execute(query, {"paciente_id": paciente_id})
        citas = [
            {
                "id": row[0],  # Asegúrate de usar "id" aquí
                "fechaHora": row[1],
                "estado": row[2],
                "medico": row[3]
            }
            for row in cursor.fetchall()
        ]
        return jsonify(citas)

    except oracledb.DatabaseError as error:
        print(f"Error al obtener citas: {error}")
        return jsonify({"error": "Error al obtener citas"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



@app.route('/api/citas/cancelar', methods=['POST'])
def cancelar_cita():
    data = request.json  # Recibir el cuerpo de la solicitud
    print(f"Datos recibidos en el servidor: {data}")  # Agregar este print
    
    cita_id = data.get("cita_id")  # Obtener el ID de la cita

    if not cita_id:
        return jsonify({"error": "ID de la cita no proporcionado"}), 400

    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Actualizar el estado de la cita
        query = "UPDATE CITAS SET ESTADO_CITA = 'C' WHERE CITAS_ID = :cita_id"
        cursor.execute(query, {"cita_id": cita_id})
        connection.commit()

        # Verificar si se actualizó alguna fila
        if cursor.rowcount > 0:
            return jsonify({"message": "Cita cancelada con éxito"})
        else:
            return jsonify({"error": "No se encontró la cita con el ID proporcionado"}), 404

    except oracledb.DatabaseError as error:
        print(f"Error al cancelar cita: {error}")
        return jsonify({"error": "Error al cancelar cita"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/historial/<paciente_id>', methods=['GET'])
def get_historial_medico(paciente_id):
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        query = """
            SELECT 
                TO_CHAR(C.FECHA_HORA_CITA, 'YYYY-MM-DD HH24:MI:SS') AS FECHA_HORA_CITA,
                C.ESTADO_CITA,
                C.NUM_CONSULTORIO,
                D.DIAGNOSTICO,
                R.PERIODICIDAD AS RECETA,
                M.NOMBRE AS MEDICAMENTO
            FROM PACIENTE P
            JOIN CITAS C ON P.PACIENTE_ID = C.PACIENTE_ID   
            JOIN DIAGNOSTICO D ON C.CITAS_ID = D.CITAS_ID    
            JOIN RECETA R ON D.DIAGNOSTICO_ID = R.DIAGNOSTICO_ID 
            JOIN MEDICAMENTO M ON R.MEDICAMENTO_ID = M.MEDICAMENTO_ID 
            WHERE P.PACIENTE_ID = :paciente_id
            ORDER BY C.FECHA_HORA_CITA DESC
        """
        cursor.execute(query, {"paciente_id": paciente_id})
        historial = [
            {
                "fechaHora": row[0],
                "estado": row[1],
                "consultorio": row[2],
                "diagnostico": row[3],
                "receta": row[4],
                "medicamento": row[5],
            }
            for row in cursor.fetchall()
        ]
        return jsonify(historial)

    except oracledb.DatabaseError as error:
        print(f"Error al obtener historial médico: {error}")
        return jsonify({"error": "Error al obtener historial médico"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/pacientes/<id>', methods=['GET'])
def get_paciente(id):
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Consulta SQL para obtener el nombre completo del paciente
        query = """
            SELECT NOMBRE, APELLIDO_PAT, APELLIDO_MAT
            FROM PACIENTE
            WHERE PACIENTE_ID = :id
        """
        cursor.execute(query, [id])
        row = cursor.fetchone()

        if row:
            # Concatenar el nombre completo
            nombre_completo = f"{row[0]} {row[1]} {row[2]}"
            return jsonify({"nombre_completo": nombre_completo})
        else:
            return jsonify({"error": "Paciente no encontrado"}), 404

    except oracledb.DatabaseError as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/padecimientos/add', methods=['POST'])
def add_padecimiento_and_associate():
    try:
        data = request.get_json()
        padecimiento = data.get("padecimiento")
        paciente_id = data.get("paciente_id")
        observacion = data.get("observacion", "Sin observación")

        # Validaciones
        if not padecimiento or len(padecimiento) > 20:
            return jsonify({"error": "Padecimiento inválido o demasiado largo"}), 400
        if not paciente_id:
            return jsonify({"error": "Paciente ID no proporcionado"}), 400
        if len(observacion) > 33:
            return jsonify({"error": "Observación demasiado larga"}), 400

        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Insertar en PADECIMIENTO (el trigger genera automáticamente el ID)
        cursor.execute(
            "INSERT INTO PADECIMIENTO (PADECIMIENTO) VALUES (:padecimiento)",
            {"padecimiento": padecimiento},
        )

        # Obtener el ID generado automáticamente por el trigger
        cursor.execute("SELECT 'PA' || LPAD(SEQ_PADECIMIENTO_ID.CURRVAL, 2, '0') FROM DUAL")
        nuevo_padecimiento_id = cursor.fetchone()[0]

        # Asociar con PACIENTE_PADECIMIENTO
        cursor.execute(
            "INSERT INTO PACIENTE_PADECIMIENTO (PACIENTE_ID, PADECIMIENTO_ID, OBSERVACION) "
            "VALUES (:paciente_id, :padecimiento_id, :observacion)",
            {
                "paciente_id": paciente_id,
                "padecimiento_id": nuevo_padecimiento_id,
                "observacion": observacion,
            },
        )

        connection.commit()

        return jsonify({"message": "Padecimiento creado y asociado con éxito"}), 201

    except oracledb.DatabaseError as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/diagnostico/add', methods=['POST'])
def add_diagnostico():
    try:
        # Obtener los datos del request
        data = request.get_json()
        citas_id = data.get('citas_id')
        diagnostico = data.get('diagnostico')

        # Validar los datos
        if not citas_id or not diagnostico:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        if len(diagnostico) > 600:
            return jsonify({"error": "El diagnóstico no puede exceder los 600 caracteres"}), 400

        # Conexión a la base de datos
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Insertar en la tabla DIAGNOSTICO (el trigger generará el DIAGNOSTICO_ID automáticamente)
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

        # Confirmar los cambios
        connection.commit()

        # Devolver respuesta exitosa con el ID generado
        return jsonify({
            "message": "Diagnóstico agregado con éxito",
            "diagnostico_id": nuevo_diagnostico_id
        }), 201

    except oracledb.Error as e:
        # Manejo de errores en la base de datos
        print(f"Error al agregar diagnóstico: {str(e)}")
        return jsonify({"error": "Error al agregar diagnóstico"}), 500

    finally:
        # Cerrar conexiones
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/receta/add', methods=['POST'])
def add_receta():
    try:
        # Obtener los datos del request
        data = request.get_json()
        diagnostico_id = data.get('diagnostico_id')
        medicamento_id = data.get('medicamento_id')
        periodicidad = data.get('periodicidad')

        # Validar los datos
        if not diagnostico_id or not medicamento_id or not periodicidad:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        if len(periodicidad) > 25:
            return jsonify({"error": "La periodicidad no puede exceder los 25 caracteres"}), 400

        # Conexión a la base de datos
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        # Insertar en la tabla RECETA
        cursor.execute("""
            INSERT INTO RECETA (DIAGNOSTICO_ID, MEDICAMENTO_ID, PERIODICIDAD) 
            VALUES (:diagnostico_id, :medicamento_id, :periodicidad)
        """, {
            "diagnostico_id": diagnostico_id,
            "medicamento_id": medicamento_id,
            "periodicidad": periodicidad
        })

        # Confirmar los cambios
        connection.commit()

        # Devolver respuesta exitosa
        return jsonify({"message": "Receta agregada con éxito"}), 201

    except oracledb.Error as e:
        # Manejo de errores en la base de datos
        print(f"Error al agregar receta: {str(e)}")
        return jsonify({"error": "Error al agregar receta"}), 500

    finally:
        # Cerrar conexiones
        if cursor:
            cursor.close()
        if connection:
            connection.close()


if __name__ == '__main__':
    app.run(debug=True)
