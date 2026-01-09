import axios from "axios";
import keycloak from "../auth/keycloak";

const api = axios.create({
  baseURL: "http://localhost:8000", 
});

api.interceptors.request.use(
  async (config) => {
    if (keycloak.token) {
      
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
