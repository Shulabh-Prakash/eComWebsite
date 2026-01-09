import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function TenantProducts() {
  const { tenant } = useParams();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity_available: "",
  });

  const fetchProducts = async () => {
    const res = await api.get(`/${tenant}/products`);
    setProducts(res.data.items || res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [tenant]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createProduct = async () => {
    await api.post(`/${tenant}/products`, form);
    setForm({
      name: "",
      category: "",
      price: "",
      quantity_available: "",
    });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/${tenant}/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Products ({tenant})</h2>

      <h3>Add Product</h3>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />
      <input
        name="quantity_available"
        type="number"
        placeholder="Quantity"
        value={form.quantity_available}
        onChange={handleChange}
      />
      <button onClick={createProduct}>Add</button>

      <hr />

      <h3>Existing Products</h3>
      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: "10px" }}>
          <strong>{p.name}</strong> | ₹{p.price} | Qty: {p.quantity_available}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => deleteProduct(p.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
