import { Navigate, useLocation } from "react-router-dom";
import { clearToken, getToken } from "../services/api";
import { getStoredUser } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.is_active === false) {
    clearToken();

    return (
      <Navigate
        to="/login"
        state={{
          message:
            "Akun kamu belum diverifikasi oleh admin. Silakan tunggu sampai akun kamu aktif.",
        }}
        replace
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const token = getToken();
  const user = getStoredUser();

  if (token && user) {
    if (user.is_active === false) {
      clearToken();

      return (
        <Navigate
          to="/login"
          state={{
            message:
              "Akun kamu belum diverifikasi oleh admin. Silakan tunggu sampai akun kamu aktif.",
          }}
          replace
        />
      );
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export { GuestRoute };
export default ProtectedRoute;