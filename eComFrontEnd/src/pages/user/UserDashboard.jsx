import React from "react";
import Layout from "../../components/Layout/Layout";
import UserProducts from "./UserProducts";

export default function UserDashboard() {
  return (
    <UserProducts>
    <div style={{ padding: "20px" }}>
      <h1>User Dashboard</h1>
      <p>Here, User can browse products.</p>
    </div>
    </UserProducts>
  );
}
