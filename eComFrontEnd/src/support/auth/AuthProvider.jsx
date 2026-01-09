import { createContext, useEffect, useState, useRef } from "react";
import keycloak from "./keycloak";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const initializedOnce = useRef(false);

  useEffect(() => {
    if (initializedOnce.current) return; 
    initializedOnce.current = true;

    keycloak
      .init({
        onLoad: "check-sso", 
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        setInitialized(true);
        console.log("keycloak token: ", keycloak.token)
      })
      .catch(() => {
        setAuthenticated(false);
        setInitialized(true);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        initialized,
        keycloak, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

