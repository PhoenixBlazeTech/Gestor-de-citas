# Guía de Implementación de Seguridad de Contraseñas

## Archivos Modificados/Creados

### 1. `hash_passwords_script.py` - Script de hasheo de contraseñas existentes
- **Ubicación**: `server/hash_passwords_script.py`
- **Función**: Convierte todas las contraseñas en texto plano a hash seguro usando pbkdf2:sha256
- **Usa**: Los stored procedures existentes (`medico_update`, `paciente_update`, `empleado_update`)

### 2. `app.py` - Función de login actualizada
- **Cambios realizados**:
  - Agregado import: `from werkzeug.security import generate_password_hash, check_password_hash`
  - Modificada función `login()` para usar `check_password_hash()`
  - Las consultas ahora obtienen la contraseña hasheada para verificación

## Pasos para Implementar

### Paso 1: Instalar dependencias (si es necesario)
```bash
cd server
pip install -r requirements.txt
```

### Paso 2: Ejecutar el script de hasheo de contraseñas
```bash
cd server
python hash_passwords_script.py
```

**¿Qué hace el script?**
- Conecta a la base de datos
- Lee todas las contraseñas actuales (texto plano)
- Verifica si ya están hasheadas (evita doble hasheo)
- Genera hash seguro usando pbkdf2:sha256
- Actualiza cada registro usando los stored procedures
- Muestra progreso en tiempo real

### Paso 3: Verificar que el servidor funciona con hashing
```bash
cd server
python app.py
```

### Paso 4: Probar el login desde el frontend
```bash
cd client
npm start
```

## Cómo Funciona el Sistema de Seguridad

### Antes (Inseguro)
```sql
-- La consulta comparaba texto plano
WHERE USUARIO = :usuario AND CONTRASENIA = :contrasenia
```

### Después (Seguro)
```python
# 1. Busca el usuario
SELECT MEDICO_ID, NOMBRE_COMPLETO, CONTRASENIA FROM MEDICO WHERE USUARIO = :usuario

# 2. Verifica la contraseña con hash
if medico and check_password_hash(medico[2], contrasenia):
    # Login exitoso
```

## Características de Seguridad

### Hash pbkdf2:sha256
- **Algoritmo**: PBKDF2 con SHA-256
- **Sal automática**: Werkzeug genera sal única por contraseña
- **Iteraciones**: 260,000 por defecto (muy seguro)
- **Formato**: `pbkdf2:sha256:260000$sal$hash`

### Protección contra ataques
- ✅ **Rainbow Tables**: La sal única previene ataques precomputados
- ✅ **Fuerza Bruta**: Las 260,000 iteraciones hacen muy lento el cracking
- ✅ **Timing Attacks**: check_password_hash() usa comparación de tiempo constante
- ✅ **Doble Hasheo**: El script verifica si ya está hasheado antes de procesar

## Stored Procedures Utilizados

### medico_update
```sql
PROCEDURE medico_update(
    p_medico_id IN MEDICO.MEDICO_ID%TYPE,
    p_nombre IN MEDICO.NOMBRE%TYPE DEFAULT NULL,
    p_apellido_pat IN MEDICO.APELLIDO_PAT%TYPE DEFAULT NULL,
    p_apellido_mat IN MEDICO.APELLIDO_MAT%TYPE DEFAULT NULL,
    p_horario IN VARCHAR2 DEFAULT NULL,
    p_espec_id IN MEDICO.ESPEC_ID%TYPE DEFAULT NULL,
    p_contrasenia IN MEDICO.CONTRASENIA%TYPE DEFAULT NULL,
    p_usuario IN MEDICO.USUARIO%TYPE DEFAULT NULL
)
```

### paciente_update y empleado_update
- Siguen el mismo patrón con parámetros DEFAULT NULL
- Permiten actualizar solo la contraseña sin modificar otros campos

## Verificación del Sistema

### 1. Verificar que las contraseñas fueron hasheadas
```sql
SELECT USUARIO, SUBSTR(CONTRASENIA, 1, 20) || '...' AS HASH_PREVIEW 
FROM MEDICO 
LIMIT 3;
```

### 2. Probar login con credenciales existentes
- Los usuarios pueden seguir usando sus contraseñas originales
- El sistema automáticamente las compara contra el hash

### 3. Monitorear logs del servidor
```
Datos recibidos en el servidor: {'usuario': 'admin', 'contrasenia': 'password123'}
```

## Troubleshooting

### Error: "Oracle Client not configured"
```bash
# Asegurar que Oracle Instant Client esté instalado
oracledb.init_oracle_client()
```

### Error: "check_password_hash not found"
```bash
pip install --upgrade werkzeug
```

### Error: "Stored procedure not found"
- Verificar que los procedures estén creados en la base de datos
- Ejecutar scripts de `DB/plsql/procedures.sql`

## Seguridad Adicional Recomendada

### 1. Variables de Entorno
```python
# En lugar de hardcodear credenciales
import os
username = os.getenv('DB_USERNAME', 'usr_citas')
password = os.getenv('DB_PASSWORD', 'citapass')
```

### 2. Rate Limiting
- Agregar límite de intentos de login por IP
- Implementar bloqueo temporal tras múltiples fallos

### 3. Logging de Seguridad
- Registrar intentos de login fallidos
- Monitorear patrones de acceso sospechosos

## ✅ Lista de Verificación Final

- [ ] Script `hash_passwords_script.py` ejecutado exitosamente
- [ ] Función `login()` actualizada en `app.py`  
- [ ] Servidor Flask funcionando correctamente
- [ ] Login desde frontend funcional con credenciales existentes
- [ ] Contraseñas en BD están hasheadas (verificar con consulta SQL)
- [ ] No hay errores en logs del servidor