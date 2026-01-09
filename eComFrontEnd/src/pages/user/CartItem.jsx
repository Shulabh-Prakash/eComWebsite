import React from "react";

const CartItem = ({ item, onRemove }) => {
  const { name, description, price, image_url, quantity } = item;
  const subtotal = price * quantity;

  return (
    <div className="card h-100 shadow-sm">
      
      {image_url && (
        <img
          src={image_url}
          alt={name}
          className="card-img-top"
          style={{
            height: "180px",
            objectFit: "cover"
          }}
        />
      )}
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>

        <p className="card-text text-muted small">
          {description}
        </p>

        <div className="mt-auto">
          <p className="mb-1">
            <strong>Price:</strong> ₹{price}
          </p>

          <p className="mb-1">
            <strong>Quantity:</strong> {quantity}
          </p>

          <p className="mb-3">
            <strong>Subtotal:</strong> ₹{subtotal}
          </p>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onRemove(item.product_id)}
            >
              Remove
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
