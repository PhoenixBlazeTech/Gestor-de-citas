import oracledb
import os
from dotenv import load_dotenv
from contextlib import contextmanager

# Cargar variables de entorno desde d:\Gestion_de_citas\.env
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(project_root, '.env')
if not load_dotenv(env_path, override=True):
    raise RuntimeError(f'No se pudo cargar el archivo .env en: {env_path}')

# Credenciales de conexión
username = os.getenv('username')
password = os.getenv('password')
dsn = os.getenv('dsn')
if not all([username, password, dsn]):
    raise RuntimeError('Faltan variables de entorno: username, password o dsn')

print(f"[DB] Configuración cargada: username={username}, dsn={dsn}")


# Configuración para python-oracledb
try:
    oracledb.init_oracle_client()
except Exception as e:
    print(f"Modo thin activado: {e}")
    pass

@contextmanager
def get_db_connection():
    """
    Context manager para manejar conexiones a la base de datos.
    
    Uso:
        with get_db_connection() as (connection, cursor):
            cursor.execute("SELECT * FROM tabla")
            results = cursor.fetchall()
    
    Auto-commit al finalizar
    Auto-rollback en caso de error
    Auto-close de cursor y conexión
    """
    connection = None
    cursor = None
    try:
        print(f"[DB] Intentando conectar a Oracle como {username}@{dsn}...")
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()
        print(f"[DB] ✓ CONEXIÓN EXITOSA a Oracle")
        yield connection, cursor
        connection.commit()
    except oracledb.DatabaseError as error:
        print(f"[DB] ✗ ERROR DE CONEXIÓN: {error}")
        if connection:
            connection.rollback()
        raise error
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()