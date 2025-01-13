import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Medico from "./Medico";
import Paciente from "./paciente";
import Empleado from "./Empleado";
import Configuracion from "./Configuracion"; // Importa el componente de configuración
import Main from "./Main";
import DiagnosticoPage from './DiagnosticoPage';


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
          <Route path="/" element={<Main />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/diagnostico/:citaId/:pacienteId" element={<DiagnosticoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

