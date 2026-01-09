import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../support/auth/AuthProvider";
import Layout from "../../components/Layout/Layout";
import { getTenantProducts, addTenantProduct, updateTenantProduct, deleteTenantProduct } from "../../api/api.js";


const TenantManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { keycloak } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image_url: "",
  });

  const [editForm, setEditForm] = useState({});


  const username = keycloak?.tokenParsed?.preferred_username;

  if (!username) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getTenantProducts(username);
      setProducts(res.data.filter((p) => p.is_active !== false));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.quantity) return;

    await addTenantProduct(username,{
      ...form
    });

    setForm({
      name: "",
      description: "",
      price: "",
      quantity: "",
      image_url: "",
    });

    loadProducts();
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    await updateTenantProduct(username,id, {
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      quantity: Number(editForm.quantity),
      image_url: editForm.image_url,
    });

    setEditingId(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    await deleteTenantProduct(username, id);
    loadProducts();
  };

  return (
    <Layout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1>Manage Products</h1>

        <div className="card">
          <h3>Add Product</h3>

          <div className="grid">
            <input placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Image URL" value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <input type="number" placeholder="Price" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" placeholder="Quantity" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>

          <textarea placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <button className="primary" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>

        <h3>Your Products</h3>

        {products.map((p) => (
          <div key={p.id} className="product-card">
            {editingId === p.id ? (
              <>
                <img src={editForm.image_url} alt="" />
                <div className="flex-1">
                  <input value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />

                  <textarea value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />

                  <div className="badges">
                    <input type="number" value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                    <input type="number" value={editForm.quantity}
                      onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} />
                  </div>
                </div>

                <div className="actions">
                  <button className="success" onClick={() => saveEdit(p.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <img src={p.image_url} alt={p.name} />

                <div className="flex-1">
                  <h4>{p.name}</h4>
                  <p className="muted">{p.description}</p>

                  <div className="badges">
                    <span>₹{p.price}</span>
                    <span>Qty: {p.quantity}</span>
                  </div>
                </div>

                <div className="actions">
                  <button onClick={() => startEdit(p)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .card {
          background:#fff;
          padding:20px;
          border-radius:12px;
          margin-bottom:24px;
          box-shadow:0 2px 10px rgba(0,0,0,.06);
        }
        .grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
        }
        textarea { width:100%; margin-top:10px; }
        .primary { background:#2563eb; color:white; }
        .product-card {
          display:flex;
          gap:16px;
          background:#fff;
          padding:16px;
          border-radius:12px;
          margin-bottom:16px;
          border:1px solid #e5e7eb;
        }
        img {
          width:80px;
          height:80px;
          object-fit:cover;
          border-radius:10px;
        }
        .flex-1 { flex:1; }
        .muted { color:#6b7280; font-size:14px; }
        .badges span {
          background:#f3f4f6;
          padding:4px 10px;
          border-radius:999px;
          margin-right:8px;
        }
        .actions button { margin-left:6px; }
        .danger { background:#ef4444; color:white; }
        .success { background:#22c55e; color:white; }
      `}</style>
    </Layout>
  );
};

export default TenantManageProducts;