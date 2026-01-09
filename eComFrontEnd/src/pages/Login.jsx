import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../support/auth/AuthProvider";

export default function Login() {
  const { authenticated, initialized, keycloak } =
    useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;

    if (!authenticated) {
      keycloak.login();
      return;
    }

    const roles = keycloak.tokenParsed?.realm_access?.roles || [];

    if (roles.includes("admin")) {
      navigate("/admin", { replace: true });
    } else if (roles.includes("tenant")) {
      navigate("/tenant", { replace: true });
    } else {
      navigate("/user", { replace: true });
    }
  }, [authenticated, initialized, keycloak, navigate]);

  return <div>Redirecting...</div>;
};

