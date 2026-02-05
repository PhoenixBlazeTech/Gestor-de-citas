import { Navigate, Outlet } from "react-router-dom";

// Middleware de rutas: verifica que el usuario esté autenticado
// y opcionalmente que tenga un rol permitido.
function ProtectedRoute({ allowedRoles }) {
  const role = localStorage.getItem("role");

  // Si no hay rol en localStorage, redirigimos al login
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // Si se pasan roles permitidos, validamos contra ellos
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderizamos la ruta hija
  return <Outlet />;
}

export default ProtectedRoute;
