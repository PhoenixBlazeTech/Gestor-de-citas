#!/usr/bin/env python3
"""
Script para hashear las contraseñas existentes en la base de datos
usando los stored procedures medico_update, paciente_update y empleado_update.
"""

import oracledb
from werkzeug.security import generate_password_hash
import sys

# Configuración de conexión a la base de datos
USERNAME = "usr_citas"
PASSWORD = "citapass"
DSN = "localhost:1521/xepdb1"

def conectar_db():
    """Establece conexión con la base de datos Oracle"""
    try:
        # Inicializar cliente Oracle (opcional para modo thin)
        try:
            oracledb.init_oracle_client()
        except:
            pass  # En modo thin no es necesario
            
        connection = oracledb.connect(user=USERNAME, password=PASSWORD, dsn=DSN)
        return connection
    except oracledb.DatabaseError as e:
        print(f"Error al conectar con la base de datos: {e}")
        sys.exit(1)

def hashear_contraseñas_medicos(connection):
    """Hashea las contraseñas de todos los médicos"""
    cursor = connection.cursor()
    
    try:
        print("Procesando médicos...")
        
        # Obtener todos los médicos con sus contraseñas actuales
        query = """
            SELECT MEDICO_ID, NOMBRE, APELLIDO_PAT, APELLIDO_MAT,
                   HORARIO, ESPEC_ID, CONTRASENIA, USUARIO
            FROM MEDICO
        """
        cursor.execute(query)
        medicos = cursor.fetchall()
        
        for medico in medicos:
            medico_id, nombre, apellido_pat, apellido_mat, horario, espec_id, contrasenia_actual, usuario = medico
            
            # Verificar si la contraseña ya está hasheada (empieza con pbkdf2:sha256:)
            if contrasenia_actual.startswith('pbkdf2:sha256:'):
                print(f"  - Médico {nombre} {apellido_pat}: contraseña ya está hasheada")
                continue
            
            # Generar hash de la contraseña
            contrasenia_hash = generate_password_hash(contrasenia_actual, method='pbkdf2:sha256')
            
            # Llamar al stored procedure medico_update
            cursor.callproc('medico_update', [
                medico_id,        # p_id
                nombre,           # p_nombre
                apellido_pat,     # p_apellido_pat
                apellido_mat,     # p_apellido_mat
                horario,          # p_horario
                espec_id,         # p_espec_id
                contrasenia_hash  # p_contrasenia
            ])
            
            print(f"  ✓ Médico {nombre} {apellido_pat}: contraseña hasheada")
            
        connection.commit()
        print(f"Procesados {len(medicos)} médicos")
        
    except oracledb.DatabaseError as e:
        print(f"Error al procesar médicos: {e}")
        connection.rollback()
    finally:
        cursor.close()

def hashear_contraseñas_pacientes(connection):
    """Hashea las contraseñas de todos los pacientes"""
    cursor = connection.cursor()
    
    try:
        print("Procesando pacientes...")
        
        # Obtener todos los pacientes con sus contraseñas actuales
        query = """
            SELECT PACIENTE_ID, NOMBRE, APELLIDO_PAT, APELLIDO_MAT,
                   SEXO, LADA, TELEFONO, EXTENSION,
                   FECHA_NACIMIENTO, USUARIO,
                   ALCAL_MUN, COLONIA, CP, CALLE,
                   EXT, INTER, ESTADO_ID,
                   CONTRASENIA
            FROM PACIENTE
        """
        cursor.execute(query)
        pacientes = cursor.fetchall()
        
        for paciente in pacientes:
            (
                paciente_id,
                nombre,
                apellido_pat,
                apellido_mat,
                sexo,
                lada,
                telefono,
                extension,
                fecha_nacimiento,
                usuario,
                alcal_mun,
                colonia,
                cp,
                calle,
                ext,
                inter,
                estado_id,
                contrasenia_actual
            ) = paciente
            
            # Verificar si la contraseña ya está hasheada
            if contrasenia_actual.startswith('pbkdf2:sha256:'):
                print(f"  - Paciente {nombre} {apellido_pat}: contraseña ya está hasheada")
                continue
            
            # Generar hash de la contraseña
            contrasenia_hash = generate_password_hash(contrasenia_actual, method='pbkdf2:sha256')
            
            # Llamar al stored procedure paciente_update
            cursor.callproc('paciente_update', [
                paciente_id,       # p_id
                nombre,            # p_nombre
                apellido_pat,      # p_apat
                apellido_mat,      # p_amat
                sexo,              # p_sexo
                lada,              # p_lada
                telefono,          # p_telefono
                extension,         # p_extension
                fecha_nacimiento,  # p_birthdate
                usuario,           # p_usuario
                alcal_mun,         # p_alcal_mun
                colonia,           # p_colonia
                cp,                # p_cp
                calle,             # p_calle
                ext,               # p_ext
                inter,             # p_inter
                contrasenia_hash,  # p_contrasenia
                estado_id          # p_estado_id
            ])
            
            print(f"  ✓ Paciente {nombre} {apellido_pat}: contraseña hasheada")
            
        connection.commit()
        print(f"Procesados {len(pacientes)} pacientes")
        
    except oracledb.DatabaseError as e:
        print(f"Error al procesar pacientes: {e}")
        connection.rollback()
    finally:
        cursor.close()

def hashear_contraseñas_empleados(connection):
    """Hashea las contraseñas de todos los empleados"""
    cursor = connection.cursor()
    
    try:
        print("Procesando empleados...")
        
        # Obtener todos los empleados con sus contraseñas actuales
        query = """
            SELECT EMPLEADO_ID, NOMBRE, APELLIDO_PAT, APELLIDO_MAT,
                   USUARIO, CONTRASENIA, ROL
            FROM EMPLEADO
        """
        cursor.execute(query)
        empleados = cursor.fetchall()
        
        for empleado in empleados:
            empleado_id, nombre, apellido_pat, apellido_mat, usuario, contrasenia_actual, rol = empleado
            
            # Verificar si la contraseña ya está hasheada
            if contrasenia_actual.startswith('pbkdf2:sha256:'):
                print(f"  - Empleado {nombre} {apellido_pat}: contraseña ya está hasheada")
                continue
            
            # Generar hash de la contraseña
            contrasenia_hash = generate_password_hash(contrasenia_actual, method='pbkdf2:sha256')
            
            # Llamar al stored procedure empleado_update
            cursor.callproc('empleado_update', [
                empleado_id,       # p_id
                nombre,            # p_nombre
                apellido_pat,      # p_apat
                apellido_mat,      # p_amat
                usuario,           # p_usuario
                contrasenia_hash,  # p_contrasenia
                rol                # p_rol
            ])
            
            print(f"  ✓ Empleado {nombre} {apellido_pat}: contraseña hasheada")
            
        connection.commit()
        print(f"Procesados {len(empleados)} empleados")
        
    except oracledb.DatabaseError as e:
        print(f"Error al procesar empleados: {e}")
        connection.rollback()
    finally:
        cursor.close()

def main():
    """Función principal del script"""
    print("=== SCRIPT DE HASHEO DE CONTRASEÑAS ===")
    print("Este script convertirá las contraseñas en texto plano a hash seguro.")
    
    # Confirmar ejecución
    respuesta = input("\n¿Desea continuar? (s/N): ")
    if respuesta.lower() not in ['s', 'si', 'sí', 'y', 'yes']:
        print("Operación cancelada.")
        sys.exit(0)
    
    # Conectar a la base de datos
    print("\nConectando a la base de datos...")
    connection = conectar_db()
    print("Conexión establecida.")
    
    try:
        # Procesar cada tipo de usuario
        hashear_contraseñas_medicos(connection)
        print()
        hashear_contraseñas_pacientes(connection)
        print()
        hashear_contraseñas_empleados(connection)
        
        print("\n=== PROCESO COMPLETADO ===")
        print("Todas las contraseñas han sido hasheadas exitosamente.")
        
    except Exception as e:
        print(f"\nError durante la ejecución: {e}")
        sys.exit(1)
    finally:
        connection.close()
        print("Conexión cerrada.")

if __name__ == "__main__":
    main()
