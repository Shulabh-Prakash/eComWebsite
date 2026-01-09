import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/product/ProductCard";
import {
  getAllProducts,
  addToCart,
  buyProduct,
} from "../../api/api";

const PAGE_SIZE = 8;

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts({
        page,
        limit: PAGE_SIZE,
        search,
      });

      setProducts(res.data.products);
      setTotalProducts(res.data.pagination.totalProducts);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleAddToCart = async (product) => {
    try {
      setActionLoading(product.id);

      await addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      });

      alert("Product added to cart 🛒");
    } catch (err) {
      console.error("Add to cart failed", err);
      alert("Failed to add product to cart");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuyNow = async (product) => {
    try {
      setActionLoading(product.id);

      await buyProduct({
        product_id: product.id,
        quantity: 1,
      });

      alert("Purchase successful ✅");
      fetchProducts(); 
    } catch (err) {
      console.error("Buy failed", err);
      alert("Purchase failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout>
      
      <div className="container mt-4 pb-5">
        <h2 className="mb-3">Welcome to our eCommerce App</h2>

        
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); 
          }}
        />

        
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <div className="alert alert-info">
            No products found
          </div>
        ) : (
          <div className="row g-4">
            {products.map((p) => (
              <div key={p.id} className="col-lg-4 col-md-6">
                <ProductCard
                  product={p}
                  onAddToCart={() => handleAddToCart(p)}
                  onBuyNow={() => handleBuyNow(p)}
                  disabled={actionLoading === p.id}
                />
              </div>
            ))}
          </div>
        )}

        
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>

            <span>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              className="btn btn-outline-secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProducts;