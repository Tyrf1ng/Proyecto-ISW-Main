import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const usuarioGuardado = JSON.parse(sessionStorage.getItem("usuario"));
  const userRole = usuarioGuardado?.rol?.toLowerCase();

  if (!usuarioGuardado || !allowedRoles.includes(userRole)) {
    return <Navigate to="/inicio" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;