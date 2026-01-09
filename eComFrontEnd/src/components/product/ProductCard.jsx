import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const lowStock = product.quantity < 5;

  return (
    <div className="product-card">
      <img
        src={product.image_url || "/placeholder.png"}
        alt={product.name}
        className="product-image"
      />

      <div className="product-body">
        <h5 className="product-title">{product.name}</h5>
        <p className="product-desc">{product.description}</p>

        <div className="product-info">
          <span className="price">₹ {product.price}</span>
          <span className={`stock ${lowStock ? "low" : "ok"}`}>
            {lowStock ? `Only ${product.quantity} left` : "In Stock"}
          </span>
        </div>

        <div className="product-actions">
          <button
            className="btn btn-outline-primary"
            disabled={product.isActive}
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-primary"
            disabled={product.quantity === 0}
            onClick={() => onBuyNow(product)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
