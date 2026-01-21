-- Tabla: ESTADOS
CREATE TABLE estados(
    estado_id NUMBER 
    GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR2(20),
    CONSTRAINT estados_pk PRIMARY KEY(estado_id)
);
-- Tabla: PACIENTE
CREATE TABLE paciente(
    paciente_id NUMBER
        GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR2(20) NOT NULL,
    apellido_pat VARCHAR2(20) NOT NULL,
    apellido_mat VARCHAR2(20) NOT NULL,
    sexo CHAR(1) 
        CONSTRAINT sexo_chk CHECK(sexo IN ('H','M')),
    lada CHAR(5),
    telefono VARCHAR2(20),
    extension VARCHAR2(5),
    fecha_nacimiento DATE,
    usuario VARCHAR2(20) NOT NULL,
    alcal_mun VARCHAR2(50) NOT NULL,
    colonia VARCHAR2(50) NOT NULL,
    cp VARCHAR2(5) NOT NULL,
    calle VARCHAR2(50)NOT NULL,
    ext CHAR(3),
    inter CHAR(3),
    contrasenia VARCHAR2(255) NOT NULL,
    estado_id NUMBER,
        CONSTRAINT estados_fk FOREIGN KEY(estado_id) REFERENCES estados(estado_id) ON DELETE SET NULL,
        CONSTRAINT paciente_pk PRIMARY KEY(paciente_id)
);

-- Tabla: ESPECIALIDAD
CREATE TABLE especialidad(
    espec_id NUMBER
        GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR2(20) NOT NULL,
    CONSTRAINT especialidad_pk PRIMARY KEY(espec_id)
);

-- Tabla: MEDICO
CREATE TABLE medico(
    medico_id NUMBER 
        GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR2(20) NOT NULL,
    apellido_pat VARCHAR2(20) NOT NULL,
    apellido_mat VARCHAR2(20) NOT NULL,
    horario DATE,
    usuario VARCHAR2(7),
    constrasenia VARCHAR2(255) NOT NULL,
    espec_id NUMBER,
    CONSTRAINT espec_fk FOREIGN KEY(espec_id) REFERENCES especialidad(espec_id) ON DELETE SET NULL,
    CONSTRAINT medico_pk PRIMARY KEY(medico_id)
);


-- Tabla: CITAS
CREATE TABLE citas(
    cita_id NUMBER 
        GENERATED ALWAYS AS IDENTITY,
    fecha_hora_cita DATE NOT NULL,
    estado_cita CHAR(1)
        CONSTRAINT estado_cita_chk CHECK(estado_cita IN('p','f','c')),
    numero_consultorio NUMBER,
    paciente_id NUMBER,
    medico_id NUMBER,
    CONSTRAINT paciente_fk FOREIGN KEY(paciente_id) REFERENCES paciente(paciente_id) ON DELETE CASCADE,
    CONSTRAINT medico_fk FOREIGN KEY(medico_id) REFERENCES medico(medico_id) ON DELETE SET NULL,
    CONSTRAINT cita_pk PRIMARY KEY(cita_id)
);


-- Tabla: PADECIMIENTO
CREATE TABLE padecimiento(
    padecimiento_id  NUMBER 
        GENERATED ALWAYS AS IDENTITY,
    padecimiento VARCHAR2(30),
    CONSTRAINT padecimiento_pk PRIMARY KEY(padecimiento_id)
);

-- Tabla: PACIENTE_PADECIMIENTO
CREATE TABLE paciente_padecimiento(
    padecimiento_id NUMBER,
    paciente_id NUMBER,
    observacion CLOB,
    CONSTRAINT padecimiento_fk FOREIGN KEY(padecimiento_id) REFERENCES padecimiento(padecimiento_id) ON DELETE SET NULL,
    CONSTRAINT pacientes_fk FOREIGN KEY(paciente_id) REFERENCES paciente(paciente_id) ON DELETE CASCADE,
    CONSTRAINT paciente_padecimiento_pk PRIMARY KEY(padecimiento_id,paciente_id)
);

-- Tabla: DIAGNOSTICO
CREATE TABLE diagnostico(
    diagnostico_id NUMBER 
        GENERATED ALWAYS AS IDENTITY,
    diagnostico CLOB,
    cita_id NUMBER,
    CONSTRAINT diagnostico_pk PRIMARY KEY(diagnostico_id),
    CONSTRAINT cita_fk FOREIGN KEY(cita_id) REFERENCES citas(cita_id)
);

--Tabla: RECETA
CREATE TABLE receta (
    receta_id NUMBER
        GENERATED ALWAYS AS IDENTITY,
    medico_id NUMBER NOT NULL,
    paciente_id NUMBER NOT NULL,
    fecha_emision DATE,
    medicamentos VARCHAR2(20),
    CONSTRAINT medic_fk FOREIGN KEY(medico_id) REFERENCES medico(medico_id),
    CONSTRAINT pacients_fk FOREIGN KEY(paciente_id) REFERENCES paciente(paciente_id)
);
