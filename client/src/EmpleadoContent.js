import React, { useState, useEffect } from "react";
import "./Main.css";

function EmpleadoContent() {
    const [data, setData] = useState([]); // Estado para almacenar los datos de la tabla
    const [newCompuesto, setNewCompuesto] = useState({ medicamento: "", compuesto: "" }); // Estado para el formulario de compuestos
    const [newMedicamento, setNewMedicamento] = useState(""); // Estado para el formulario de medicamentos
    const [medicamentos, setMedicamentos] = useState([]); // Estado para almacenar medicamentos


    
    return (
        <>
            <div className="container-forms-empleado">
                {/* Formulario para agregar compuestos */}
                
            </div>
        </>
    );
}

export default EmpleadoContent;
