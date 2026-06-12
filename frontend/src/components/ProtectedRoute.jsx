import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser, hasRole, isLoggedIn } from "../utils/auth";

function ProtectedRoute({
  children,
  allowedRoles = [],
  requireActive = false,
  redirectTo = "/login",
}) {
  const location = useLocation();
  const user = getStoredUser();

  if (!isLoggedIn()) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (requireActive && user?.is_active === false) {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;