import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { keycloakConfig } from "../config/keycloak.js";

const client = jwksClient({
  jwksUri: "http://localhost:8080/realms/ecommerce/protocol/openid-connect/certs",
  cache: false,
  rateLimit: false,
});

const getKey = (header, callback) => {
  console.log("JWT kid:", header);
 console.log("client: ",client);
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("JWKS error:", err);
      return callback(err);
    }

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
    
  });
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, { issuer: "http://localhost:8080/realms/ecommerce", algorithms: ["RS256"], }, (err, decoded) => {
    if (err) {
      console.log("jwt verify err: ",err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user=decoded;
    next();
  });
};
