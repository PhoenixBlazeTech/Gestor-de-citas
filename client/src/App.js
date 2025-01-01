import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Medico from "./Medico";
import Paciente from "./paciente";
import Empleado from "./Empleado";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Ruta del Login */}
          <Route path="/" element={<Login />} />

          {/* Ruta para Medico */}
          <Route path="/medico" element={<Medico />} />

          {/* Ruta para Paciente */}
          <Route path="/paciente" element={<Paciente />} />

          {/* Ruta para Empleado */}
          <Route path="/empleado" element={<Empleado />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

