import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",   // Keycloak server
  realm: "ecommerce",             // your realm name
  clientId: "frontend-client",    // client created in Keycloak
});

export default keycloak;
