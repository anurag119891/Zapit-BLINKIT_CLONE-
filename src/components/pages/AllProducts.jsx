import React, { useEffect, useState } from "react";
import { Trash2, Edit, PackageOpen, MoreHorizontal, ExternalLink, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/AllProducts.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://zapit-hl9x.onrender.com/api/products");
      const result = await response.json();
      if (result.success && result.data) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`https://zapit-hl9x.onrender.com/api/products/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setProducts(products.filter((p) => p._id !== id));
        }
      } catch (error) { console.error("Error deleting:", error); }
    }
  };

  if (loading) return (
    <div className="admin-loading-screen">
      <div className="loader-ring"></div>
      <span>Loading Inventory...</span>
    </div>
  );

  return (
    <div className="inventory-container">
      {/* Refined Header */}
      <header className="inventory-top-bar">
        <div className="title-area">
          <h1>Product Inventory</h1>
          <p>You currently have <b>{products.length}</b> products in your catalog.</p>
        </div>
        <button onClick={() => navigate("/dashboard/add-products")} className="add-main-btn">
          + Add New Product
        </button>
      </header>

      {products.length === 0 ? (
        <div className="empty-state-card">
          <PackageOpen size={48} />
          <h3>No products found</h3>
          <p>Start growing your store by adding your first product.</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Weight</th>
                <th>Price</th>
                <th>MRP</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="product-cell">
                    <div className="cell-img-wrapper">
                      <img src={product.image} alt="" />
                    </div>
                    <span className="product-name-bold">{product.name}</span>
                  </td>
                  <td>
                    <span className="category-pill">
                      {product.category?.name || "General"}
                    </span>
                  </td>
                  <td>{product.brand}</td>
                  <td className="text-muted">{product.weight}</td>
                  <td><span className="price-tag">₹{product.price}</span></td>
                  <td><span className="mrp-tag">₹{product.mrp}</span></td>
                  <td className="actions-cell">
                    <button 
                      className="act-btn edit" 
                      onClick={() => navigate("/dashboard/add-products", { state: { productToEdit: product } })}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="act-btn delete" 
                      onClick={() => handleDelete(product._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllProducts;