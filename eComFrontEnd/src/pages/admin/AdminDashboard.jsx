import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminTenants from "./AdminTenants"

export default function AdminDashboard() {
  return (
    <Layout>
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Here, admins can manage tenants and users.</p>
      <AdminTenants></AdminTenants>
    </div>
    </Layout>
  );
}
