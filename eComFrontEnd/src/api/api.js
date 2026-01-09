import axios from "axios";
import keycloak from "../support/auth/keycloak";

const API = axios.create({
  baseURL: "http://localhost:5000", 
});

API.interceptors.request.use(async (req) => {
    console.log("req", req);
    console.log("auth", keycloak.authenticated );
    console.log("tok",  keycloak.token);
    if (keycloak.authenticated && keycloak.token) {
      await keycloak.updateToken(30);
  
      req.headers.set(
        "Authorization",
        `Bearer ${keycloak.token}`
      );
  
      console.log("Authorization header attached");
    } else {
      console.warn("Keycloak not authenticated yet");
    }
  
    return req;
  });

export const getTenants = () => API.get("/tenants");

export const getTenantById = (tenant_uuid) =>
  API.get(`/tenants/${tenant_uuid}`);

export const createTenant = (data) =>
  API.post("/admin/tenants", data);

export const disableTenant = (tenant_uuid) =>
  API.delete(`/tenants/${tenant_uuid}`);

export const getTenantProducts = (tenant) =>
    API.get(`/${tenant}/products`);
  
  export const addTenantProduct = (tenant, data) =>
    API.post(`/${tenant}/products`, data);
  
  export const updateTenantProduct = (tenant, id, data) =>
    API.put(`/${tenant}/products/${id}`, data);
  
  export const deleteTenantProduct = (tenant, id) =>
    API.delete(`/${tenant}/products/${id}`);

export const getAllProducts = ({
  page = 1,
  limit = 8,
  search = "",
}) =>
  API.get("/products", {
    params: { page, limit, search },
  });

export const addToCart = (data) =>
  API.post("/products/cart/add", data);

export const getCart = () =>
  API.get("/products/cart");

export const buyProduct = () =>
  API.post("/products/buy");

export const deleteItemFromCart = (productId)=>
  API.delete(`/products/cart/remove/${productId}`);

