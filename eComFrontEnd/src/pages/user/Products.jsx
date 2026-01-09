import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../support/auth/AuthProvider";
import Layout from "../../components/Layout/Layout";

const Products = () => {
  const { tenant } = useParams();
  const { keycloak } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!keycloak?.token) return;

    axios
      .get(`http://localhost:4000/${tenant}/products`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [tenant, keycloak]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      !category || p.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) return <div>Loading products...</div>;

  return (
    <Layout>
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {tenant.toUpperCase()} Products
      </h1>
  
      <div className="flex gap-4 mb-6">
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Search product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
  
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="shoes">Shoes</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p>Category: {p.category}</p>
            <p>Price: ${p.price}</p>
            <p>Available: {p.quantity}</p>
  
            <button className="mt-3 bg-blue-600 text-white px-4 py-1 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
  
};

export default Products;