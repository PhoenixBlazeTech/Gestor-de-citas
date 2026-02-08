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

@paciente_bp.route('/paciecon/<paciente_id>', methods=['GET'])
def get_citas_por_paciente(paciente_id):
    try:
        with get_db_connection() as (connection, cursor):
            query = """
                SELECT 
                    c.CITAS_ID,
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
                    "id": row[0],
                    "fechaHora": row[1],
                    "estado": row[2],
                    "medico": row[3]
                }
                for row in cursor.fetchall()
            ]
            return jsonify(citas)

    except Exception as error:
        print(f"Error al obtener citas: {error}")
        return jsonify({"error": "Error al obtener citas"}), 500

@paciente_bp.route('/historial/<paciente_id>', methods=['GET'])
def get_historial_medico(paciente_id):
    try:
        with get_db_connection() as (connection, cursor):
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

    except Exception as error:
        print(f"Error al obtener historial médico: {error}")
        return jsonify({"error": "Error al obtener historial médico"}), 500

@paciente_bp.route('/padecimientos/add', methods=['POST'])
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

        with get_db_connection() as (connection, cursor):
            # Insertar en PADECIMIENTO
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

            return jsonify({"message": "Padecimiento creado y asociado con éxito"}), 201

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

