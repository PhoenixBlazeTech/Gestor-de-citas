import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Medico from "./Medico";
import Paciente from "./paciente";
import Empleado from "./Empleado";
import Configuracion from "./Configuracion";
import DiagnosticoPage from "./DiagnosticoPage";
import ProtectedRoute from "./ProtectedRoute";
import Paciente_tabla from "./paciente_tabla";
import Medico_tabla from "./medico_tabla";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Login público */}
          <Route path="/" element={<Login />} />

          {/* Rutas protegidas: requieren usuario autenticado */}
          <Route element={<ProtectedRoute />}>
            <Route path="/medico" element={<Medico />} />
            <Route path="/paciente" element={<Paciente />} />
            <Route path="/paciente-tabla" element={<Paciente_tabla />} />
            <Route path="/medico-tabla" element={<Medico_tabla />} />
            <Route path="/empleado" element={<Empleado />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/diagnostico/:citaId/:pacienteId" element={<DiagnosticoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

