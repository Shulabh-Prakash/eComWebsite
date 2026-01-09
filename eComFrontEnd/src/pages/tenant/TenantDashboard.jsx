import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { AuthContext } from "../../support/auth/AuthProvider";

export default function TenantDashboard() {
  const { keycloak } = useContext(AuthContext);

  const username = keycloak?.tokenParsed?.preferred_username;

  if (!username) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2>Tenant Dashboard</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "12px" }}>
            <Link to={`/${username}/manage/products`}>
              Manage Products
            </Link>
          </li>

          <li>
            <Link to={`/${username}/products`}>
              View Store
            </Link>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
