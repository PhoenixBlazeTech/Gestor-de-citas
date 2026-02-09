-- medico Update Procedure
create or replace PROCEDURE medico_update(
  p_id  IN medico.medico_id%TYPE,
  -- DEFAULT NULL
  p_nombre  IN medico.nombre%TYPE DEFAULT NULL,
  p_apellido_pat IN medico.apellido_pat%TYPE DEFAULT NULL,
  p_apellido_mat IN medico.apellido_mat%TYPE DEFAULT NULL,
  p_horario IN medico.horario%TYPE DEFAULT NULL,
  p_espec_id IN medico.espec_id%TYPE DEFAULT NULL,
  p_contrasenia IN medico.contrasenia%TYPE DEFAULT NULL
)
IS
BEGIN
   UPDATE medico
   SET 
      nombre       = NVL(p_nombre, nombre),
      apellido_pat = NVL(p_apellido_pat, apellido_pat),
      apellido_mat = NVL(p_apellido_mat, apellido_mat),
      horario      = NVL(p_horario, horario),
      espec_id     = NVL(p_espec_id, espec_id),
      contrasenia = NVL(p_contrasenia,contrasenia)
   WHERE medico_id = p_id;
   IF SQL%ROWCOUNT = 0 THEN
     RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: cliente no existe');
   END IF;
EXCEPTION
   WHEN OTHERS THEN
   IF SQLCODE = -2291 THEN
     RAISE_APPLICATION_ERROR(-20013, 'Error: La especialidad indicada no existe.');
     ELSE 
       RAISE;
    END IF;
END;
/

-- Paciente Update Procedure

CREATE OR REPLACE PROCEDURE paciente_update(
   p_id IN paciente.paciente_id%TYPE,
-- DATA TO UPDATE
  p_nombre IN paciente.nombre%TYPE DEFAULT NULL,
  p_apat IN paciente.apellido_pat%TYPE DEFAULT NULL,
  p_amat IN paciente.apellido_mat%TYPE DEFAULT NULL,
  p_sexo IN paciente.sexo%TYPE DEFAULT NULL,
  p_lada IN paciente.lada%TYPE DEFAULT NULL,
  p_telefono IN paciente.telefono%TYPE DEFAULT NULL,
  p_extension IN paciente.extension%TYPE DEFAULT NULL,
  p_birthdate IN paciente.fecha_nacimiento%TYPE DEFAULT NULL,
  p_usuario IN paciente.usuario%TYPE DEFAULT NULL,
  p_alcal_mun IN paciente.alcal_mun%TYPE DEFAULT NULL,
  p_colonia IN paciente.colonia%TYPE DEFAULT NULL,
  p_cp IN paciente.cp%TYPE DEFAULT NULL,
  p_calle IN paciente.calle%TYPE DEFAULT NULL,
  p_ext IN paciente.ext%TYPE DEFAULT NULL,
  p_inter IN paciente.inter%TYPE DEFAULT NULL,
  p_contrasenia IN paciente.contrasenia%TYPE DEFAULT NULL,
  p_estado_id IN paciente.estado_id%TYPE DEFAULT NULL 
)
IS
BEGIN
 UPDATE paciente
 SET 
    nombre = NVL(p_nombre,nombre),
    apellido_pat =  NVL(p_apat,apellido_pat),
    apellido_mat = NVL(p_amat,apellido_mat),
    sexo = NVL(p_sexo,sexo),
    lada = NVL(p_lada,lada),
    telefono = NVL(p_telefono,telefono),
    extension = NVL(p_extension,extension),
    fecha_nacimiento = NVL(p_birthdate,fecha_nacimiento),
    usuario = NVL(p_usuario,usuario),
    alcal_mun = NVL(p_alcal_mun,alcal_mun),
    colonia = NVL(p_colonia,colonia),
    cp = NVL(p_cp,cp),
    calle = NVL(p_calle,calle),
    ext = NVL(p_ext,ext),
    inter = NVL(p_inter,inter),
    contrasenia = NVL(p_contrasenia,contrasenia),
    estado_id = NVL(p_estado_id,estado_id)
  WHERE paciente_id = p_id;
  
  IF SQL%ROWCOUNT = 0 THEN 
    RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: cliente no existe');
  END IF;
EXCEPTION
   WHEN OTHERS THEN
   IF SQLCODE = -2291 THEN
     RAISE_APPLICATION_ERROR(-20013, 'Error: La especialidad indicada no existe.');
   ELSE
     RAISE;
   END IF;
END;
/

--Empleado Update Procedure
CREATE OR REPLACE PROCEDURE empleado_update(
  p_id IN empleado.empleado_id%TYPE,
  --DATA TO UPDATE
  p_nombre IN empleado.nombre%TYPE DEFAULT NULL,
  p_apat IN empleado.apellido_pat%TYPE DEFAULT NULL,
  p_amat IN empleado.apellido_mat%TYPE DEFAULT NULL,
  p_usuario IN empleado.usuario%TYPE DEFAULT NULL,
  p_contrasenia IN empleado.contrasenia%TYPE DEFAULT NULL,
  p_rol IN empleado.rol%TYPE DEFAULT NULL
)
IS
BEGIN
 UPDATE empleado
 SET
   nombre = NVL(p_nombre,nombre),
   apellido_pat = NVL(p_apat,apellido_pat),
   apellido_mat = NVL(p_amat,apellido_mat),
   usuario = NVL(p_usuario,usuario),
   contrasenia = NVL(p_contrasenia,contrasenia),
   rol = NVL(p_rol,rol)
   WHERE empleado_id = p_id;
   IF SQL%ROWCOUNT = 0 THEN 
      RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: cliente no existe');
   END IF;
EXCEPTION
  WHEN OTHERS THEN
  IF SQLCODE = -2291 THEN
    RAISE_APPLICATION_ERROR(-20013, 'Error: La especialidad indicada no existe.');
  ELSE
    RAISE;
  END IF;
END;
/

-- Estado Update Procedure
CREATE OR REPLACE PROCEDURE estado_update(
  p_id IN estados.estado_id%TYPE,
  p_nombre IN estados.nombre%TYPE DEFAULT NULL
)
IS
BEGIN
  UPDATE estados
  SET nombre = NVL(p_nombre, nombre)
  WHERE estado_id = p_id;

  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: estado no existe');
  END IF;
END;
/

-- Especialidad Update Procedure
CREATE OR REPLACE PROCEDURE especialidad_update(
  p_id IN especialidad.espec_id%TYPE,
  p_nombre IN especialidad.nombre%TYPE DEFAULT NULL
)
IS
BEGIN
  UPDATE especialidad
  SET nombre = NVL(p_nombre, nombre)
  WHERE espec_id = p_id;

  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: especialidad no existe');
  END IF;
END;
/

-- Cita Update Procedure
CREATE OR REPLACE PROCEDURE cita_update(
  p_id IN citas.cita_id%TYPE,
  p_fecha_hora IN citas.fecha_hora_cita%TYPE DEFAULT NULL,
  p_estado IN citas.estado_cita%TYPE DEFAULT NULL,
  p_consultorio IN citas.numero_consultorio%TYPE DEFAULT NULL,
  p_paciente_id IN citas.paciente_id%TYPE DEFAULT NULL,
  p_medico_id IN citas.medico_id%TYPE DEFAULT NULL
)
IS
BEGIN
  UPDATE citas
  SET fecha_hora_cita = NVL(p_fecha_hora, fecha_hora_cita),
      estado_cita = NVL(p_estado, estado_cita),
      numero_consultorio = NVL(p_consultorio, numero_consultorio),
      paciente_id = NVL(p_paciente_id, paciente_id),
      medico_id = NVL(p_medico_id, medico_id)
  WHERE cita_id = p_id;

  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: cita no existe');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -2291 THEN
      RAISE_APPLICATION_ERROR(-20013, 'Error: el paciente o médico indicado no existe.');
    ELSE
      RAISE;
    END IF;
END;
/

-- Padecimiento Update Procedure
CREATE OR REPLACE PROCEDURE padecimiento_update(
  p_id IN padecimiento.padecimiento_id%TYPE,
  p_nombre IN padecimiento.padecimiento%TYPE DEFAULT NULL
)
IS
BEGIN
  UPDATE padecimiento
  SET padecimiento = NVL(p_nombre, padecimiento)
  WHERE padecimiento_id = p_id;

  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: padecimiento no existe');
  END IF;
END;
/

-- Paciente Padecimiento Update Procedure
CREATE OR REPLACE PROCEDURE paciente_padecimiento_update(
  p_padecimiento_id IN paciente_padecimiento.padecimiento_id%TYPE,
  p_paciente_id IN paciente_padecimiento.paciente_id%TYPE,
  p_new_padecimiento_id IN paciente_padecimiento.padecimiento_id%TYPE DEFAULT NULL,
  p_new_paciente_id IN paciente_padecimiento.paciente_id%TYPE DEFAULT NULL,
  p_observacion IN paciente_padecimiento.observacion%TYPE DEFAULT NULL
)
IS
BEGIN
  UPDATE paciente_padecimiento
  SET padecimiento_id = NVL(p_new_padecimiento_id, padecimiento_id),
      paciente_id = NVL(p_new_paciente_id, paciente_id),
      observacion = COALESCE(p_observacion, observacion)
  WHERE padecimiento_id = p_padecimiento_id
    AND paciente_id = p_paciente_id;

  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: relación paciente/padecimiento no existe');
  END IF;
EXCEPTION
  WHEN DUP_VAL_ON_INDEX THEN
    RAISE_APPLICATION_ERROR(-20014, 'Error: combinación paciente/padecimiento duplicada.');
  WHEN OTHERS THEN
    IF SQLCODE = -2291 THEN
      RAISE_APPLICATION_ERROR(-20013, 'Error: el paciente o padecimiento indicado no existe.');
    ELSE
      RAISE;
    END IF;
END;
/

-- Diagnostico Update Procedure
CREATE OR REPLACE PROCEDURE diagnostico_update(
  p_id IN diagnostico.diagnostico_id%TYPE,
  p_diagnostico IN diagnostico.diagnostico%TYPE DEFAULT NULL,
  p_cita_id IN diagnostico.cita_id%TYPE DEFAULT NULL
)
IS
BEGIN
  UPDATE diagnostico
  SET diagnostico = COALESCE(p_diagnostico, diagnostico),
      cita_id = NVL(p_cita_id, cita_id)
  WHERE diagnostico_id = p_id;

  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: diagnóstico no existe');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -2291 THEN
      RAISE_APPLICATION_ERROR(-20013, 'Error: la cita indicada no existe.');
    ELSE
      RAISE;
    END IF;
END;
/

-- Receta Update Procedure
CREATE OR REPLACE PROCEDURE receta_update(
  p_id IN receta.receta_id%TYPE,
  p_medico_id IN receta.medico_id%TYPE DEFAULT NULL,
  p_paciente_id IN receta.paciente_id%TYPE DEFAULT NULL,
  p_fecha_emision IN receta.fecha_emision%TYPE DEFAULT NULL,
  p_medicamentos IN receta.medicamentos%TYPE DEFAULT NULL
)
IS
BEGIN
  UPDATE receta
  SET medico_id = NVL(p_medico_id, medico_id),
      paciente_id = NVL(p_paciente_id, paciente_id),
      fecha_emision = NVL(p_fecha_emision, fecha_emision),
      medicamentos = NVL(p_medicamentos, medicamentos)
  WHERE receta_id = p_id;

  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20012, 'No se actualizó: receta no existe');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -2291 THEN
      RAISE_APPLICATION_ERROR(-20013, 'Error: el médico o paciente indicado no existe.');
    ELSE
      RAISE;
    END IF;
END;
/

--DELETE medico PROCEDURE
CREATE OR REPLACE PROCEDURE medico_delete(
  p_id IN medico.medico_id%TYPE
)
IS
BEGIN
  DELETE FROM medico
  WHERE medico_id = p_id;
  
  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20013, 'No se eliminó: médico con ID ' || p_id || ' no existe');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
  IF SQLCODE = -2292 THEN
     RAISE_APPLICATION_ERROR(-20014, 'No se puede eliminar: el médico tiene citas o registros asociados.');
  ELSE
    RAISE;
  END IF;
END;
/

--Paciente DELETE PROCEDURE
create or replace PROCEDURE paciente_delete(
  p_id IN paciente.paciente_id%TYPE
)
IS
BEGIN 
   DELETE FROM paciente
   WHERE paciente_id = p_id;
   IF SQL%ROWCOUNT = 0 THEN
     RAISE_APPLICATION_ERROR(-20013, 'No se eliminó: paciente con ID ' || p_id || ' no existe');
   END IF;
EXCEPTION
  WHEN OTHERS THEN
  IF SQLCODE = -2292 THEN
     RAISE_APPLICATION_ERROR(-20014, 'No se puede eliminar: el paciente tiene citas o registros asociados.');
  ELSE
    RAISE;
  END IF;
END;


--READ Medico PROCEDURE contraseña y id
CREATE OR REPLACE PROCEDURE medico_pass(
   p_user IN medico.usuario%TYPE,
   p_id OUT medico.medico_id%TYPE,
   p_pass OUT medico.contrasenia%TYPE
)
IS
BEGIN
   SELECT medico_id,contrasenia
   INTO p_id,p_pass
   FROM medico
   WHERE usuario = p_user;
EXCEPTION
   WHEN NO_DATA_FOUND THEN
     RAISE_APPLICATION_ERROR(-20011, 'Medico no encontrado');
END;
/

--READ Paciente PROCEDURE contraseña y id
CREATE OR REPLACE PROCEDURE paciente_pass(
  p_user IN paciente.usuario%TYPE,
  p_id OUT paciente.paciente_id%TYPE,
  p_pass OUT paciente.contrasenia%TYPE
)
IS
BEGIN 
  SELECT paciente_id,contrasenia
  INTO p_id,p_pass
  FROM paciente
  WHERE usuario = p_user;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20011, 'Paciente no encontrado');
END;
/

--READ Empleado PROCEDURE contraseña y id
CREATE OR REPLACE PROCEDURE empleado_pass(
  p_user IN empleado.usuario%TYPE,
  p_id OUT empleado.empleado_id%TYPE,
  p_pass OUT empleado.contrasenia%TYPE
)
IS
BEGIN 
  SELECT empleado_id,contrasenia
  INTO p_id,p_pass
  FROM empleado
  WHERE usuario = p_user;
EXCEPTION
     WHEN NO_DATA_FOUND THEN
     RAISE_APPLICATION_ERROR(-20011, 'empleado no encontrado');
END;
/

--medico create procedure
CREATE OR REPLACE PROCEDURE insert_medico(
  p_id OUT medico.medico_id%TYPE,
  p_nombre IN medico.nombre%TYPE,
  a_pat  IN medico.apellido_pat%TYPE,
  a_mat  IN medico.apellido_mat%TYPE,
  p_user IN medico.usuario%TYPE,
  p_pass IN medico.contrasenia%TYPE
)
IS
BEGIN
    INSERT INTO medico(nombre,apellido_pat,apellido_mat,usuario,contrasenia) 
    VALUES(p_nombre,a_pat,a_mat,p_user,p_pass)
   RETURNING medico_id INTO p_id;
EXCEPTION 
   WHEN DUP_VAL_ON_INDEX THEN
    RAISE_APPLICATION_ERROR(-20010, 'User ya existe');
END;
/
--Paciente create procedure
CREATE OR REPLACE PROCEDURE insert_paciente(
  p_id           OUT paciente.paciente_id%TYPE,
  p_nombre       IN  paciente.nombre%TYPE,
  p_apellido_pat IN  paciente.apellido_pat%TYPE,
  p_apellido_mat IN  paciente.apellido_mat%TYPE,
  p_usuario      IN  paciente.usuario%TYPE,
  p_alcal_mun    IN  paciente.alcal_mun%TYPE,
  p_colonia      IN  paciente.colonia%TYPE,
  p_cp           IN  paciente.cp%TYPE,
  p_calle        IN  paciente.calle%TYPE,
  p_contrasenia  IN  paciente.contrasenia%TYPE
)
IS
BEGIN
  INSERT INTO paciente (
    nombre,
    apellido_pat,
    apellido_mat,
    usuario,
    alcal_mun,
    colonia,
    cp,
    calle,
    contrasenia
  )
  VALUES (
    p_nombre,
    p_apellido_pat,
    p_apellido_mat,
    p_usuario,
    p_alcal_mun,
    p_colonia,
    p_cp,
    p_calle,
    p_contrasenia
  )
  RETURNING paciente_id INTO p_id;

EXCEPTION
  WHEN DUP_VAL_ON_INDEX THEN
    RAISE_APPLICATION_ERROR(-20010, 'El usuario ya existe');
  WHEN OTHERS THEN
    RAISE_APPLICATION_ERROR(-20099, SQLERRM);
END insert_paciente;
/