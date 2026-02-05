CREATE OR REPLACE FUNCTION calcular_edad(
  p_birthdate IN paciente.fecha_nacimiento%TYPE,
  p_id IN paciente.paciente_id%TYPE
)
RETURN NUMBER
IS
 v_age NUMBER;
 v_today DATE:=SYSDATE;
BEGIN
  v_age := TRUNC(MONTHS_BETWEEN(v_today, p_birthdate) / 12);
  RETURN v_age;
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error en calcular_edad: ' || SQLERRM);
    RETURN -1;
END;
/
