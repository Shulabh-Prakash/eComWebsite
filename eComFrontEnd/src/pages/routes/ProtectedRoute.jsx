import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../support/auth/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authenticated, initialized, keycloak } = useContext(AuthContext);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

const hasAccess = allowedRoles.length === 0 || allowedRoles.some((role) => roles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

