import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import CartItem from "./CartItem";
import { getCart, buyProduct, deleteItemFromCart } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      // console.log("cart res: ", res);
      setCart(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await deleteItemFromCart(productId);
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (err) {
      console.error("Failed to remove item", err);
    }
    fetchCart();
  };

  const handleBuyNow = async (item) => {
    try {
      await buyProduct();
      navigate("/order");
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
    };

    const totalItems = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    
    const totalCost = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    

  return (
    <Layout>
      <div className="container mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Your Cart</h2>

        <button
          className="btn btn-danger"
          disabled={cart.length === 0}
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
        </div>

        {loading ? (
          <p>Loading cart...</p>
        ) : cart.length === 0 ? (
          <div className="alert alert-info">
            Your cart is empty
          </div>
        ) : (
          <>
          <div className="row g-4">

            {cart.map((item) => (
              <div key={item.product_id} className="col-md-6 col-lg-4">
                <CartItem
                  item={item}
                  onRemove={handleRemove}
                />
              </div>
            ))}
          </div>

<div className="card shadow-sm border-top mt-4">
<div className="card-body d-flex justify-content-between align-items-center flex-wrap">
  <div>
    <strong>Total Items:</strong> {totalItems}
  </div>

  <div>
    <strong>Total Cost:</strong> ₹{totalCost}
  </div>

</div>
</div>
</>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
