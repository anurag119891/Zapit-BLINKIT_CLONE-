import React, { useState, useEffect } from "react";
import {
  Upload, LayoutList, CheckCircle, AlertCircle,
  IndianRupee, Package, Clock, Scale, ChevronDown, Tag, ImageIcon, Plus
} from "lucide-react";
import "../css/AdminAddModal.css";
import { capitalizeWords } from "../../utils/capitalLetter";
import { useLocation, useNavigate } from "react-router-dom";

const AdminProduct = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [existingCategories, setExistingCategories] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const productToEdit = location.state?.productToEdit;
  const isEditMode = !!productToEdit;

  const initialProductState = {
    name: "",
    brand: "Zapit",
    weight: "",
    price: "",
    mrp: "",
    image: "",
    time: "10 MINS",
    category: "",
  };
  const [prodFormData, setProdFormData] = useState(initialProductState);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/category");
        const data = await res.json();
        if (data.success || Array.isArray(data)) {
          setExistingCategories(data.categories || data);
        }
      } catch (error) { console.error("Failed to load categories", error); }
    };
    fetchCategories();

    if (isEditMode && productToEdit) {
      setProdFormData({
        ...productToEdit,
        category: typeof productToEdit.category === "object" ? productToEdit.category._id : productToEdit.category || "",
      });
    }
  }, [location, isEditMode, productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const url = isEditMode ? `http://localhost:5000/api/products/${productToEdit._id}` : "http://localhost:5000/api/products";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodFormData),
      });

      const data = await response.json();
      if (data.success) {
        setStatus({ type: "success", message: isEditMode ? "Product updated!" : "Product added!" });
        if (!isEditMode) setProdFormData(initialProductState);
        else setTimeout(() => navigate("/dashboard/all-products"), 1500);
      } else {
        throw new Error(data.message || "Operation failed");
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h2 className="admin-title">{isEditMode ? "Update Product" : "Create New Product"}</h2>
          <p className="admin-subtitle">Fill in the details to {isEditMode ? "modify" : "list"} a product in your store.</p>
        </div>
        {isEditMode && <button className="back-btn" onClick={() => navigate(-1)}>Cancel</button>}
      </header>

      {status.message && (
        <div className={`status-banner ${status.type === "success" ? "bg-green" : "bg-red"}`}>
          {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-grid-form">
        {/* LEFT COLUMN: Main Info */}
        <div className="form-main-content">
          <section className="form-card">
            <h3 className="card-section-title">General Information</h3>
            <div className="form-group">
              <label>Product Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <Package className="icon" size={18} />
                <input type="text" name="name" required value={prodFormData.name} onChange={handleChange} placeholder="e.g. Fresh Paneer" />
              </div>
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label>Category <span className="req">*</span></label>
                <div className="input-with-icon">
                  <LayoutList className="icon" size={18} />
                  <select name="category" required value={prodFormData.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {existingCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{capitalizeWords(cat.name)}</option>
                    ))}
                  </select>
                  <ChevronDown className="arrow" size={16} />
                </div>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <div className="input-with-icon">
                  <Tag className="icon" size={18} />
                  <input type="text" name="brand" value={prodFormData.brand} onChange={handleChange} placeholder="Brand Name" />
                </div>
              </div>
            </div>
          </section>

          <section className="form-card">
            <h3 className="card-section-title">Pricing & Weight</h3>
            <div className="grid-3-col">
              <div className="form-group">
                <label>Price (₹) <span className="req">*</span></label>
                <div className="input-with-icon">
                  <IndianRupee className="icon" size={16} />
                  <input type="number" name="price" required value={prodFormData.price} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>MRP (₹) <span className="req">*</span></label>
                <div className="input-with-icon">
                  <IndianRupee className="icon" size={16} />
                  <input type="number" name="mrp" required value={prodFormData.mrp} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Weight <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Scale className="icon" size={18} />
                  <input type="text" name="weight" required value={prodFormData.weight} onChange={handleChange} placeholder="500g" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Media & Delivery */}
        <div className="form-side-content">
          <section className="form-card image-upload-card">
            <h3 className="card-section-title">Product Image</h3>
            <div className="image-preview-container">
              {prodFormData.image ? (
                <img src={prodFormData.image} alt="Preview" className="img-preview" />
              ) : (
                <div className="img-placeholder">
                  <ImageIcon size={40} />
                  <span>No image URL provided</span>
                </div>
              )}
            </div>
            <div className="form-group mt-4">
              <div className="input-with-icon">
                <Upload className="icon" size={18} />
                <input type="url" name="image" required value={prodFormData.image} onChange={handleChange} placeholder="Paste Image URL" />
              </div>
            </div>
          </section>

          <section className="form-card">
            <h3 className="card-section-title">Delivery</h3>
            <div className="form-group">
              <label>Estimated Time</label>
              <div className="input-with-icon">
                <Clock className="icon" size={18} />
                <input type="text" name="time" value={prodFormData.time} onChange={handleChange} />
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="main-submit-btn">
            {loading ? "Please wait..." : isEditMode ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProduct;