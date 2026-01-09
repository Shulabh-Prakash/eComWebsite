import React from "react";
import Layout from "../components/Layout/Layout";

const OrderPage = () => {
  return (
    <Layout>
      <div className="container mt-5 text-center">
        <h2 className="text-success mb-3">🎉 Order Placed Successfully!</h2>

        <p className="lead">
          Thank you for your purchase. Your order has been placed.
        </p>

        <a href="/user" className="btn btn-primary mt-3">
          Continue Shopping
        </a>
      </div>
    </Layout>
  );
};

export default OrderPage;
