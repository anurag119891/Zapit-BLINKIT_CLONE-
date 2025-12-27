import React, { useState } from "react";
import {
  Upload,
  Type,
  LayoutList,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  ChevronLeft
} from "lucide-react";
import "../css/AdminAddModal.css";
import { useNavigate } from "react-router-dom";

const AdminCategory = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const initialCategoryState = {
    name: "",
    image: "",
    priority: 0,
    isActive: true,
  };
  const [catFormData, setCatFormData] = useState(initialCategoryState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

    if (name === "priority") {
      if (val !== "") {
        const numVal = parseInt(val, 10);
        val = Math.max(0, Math.min(5, numVal)); 
      }
    }
    setCatFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("https://zapit-hl9x.onrender.com/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catFormData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: "Category added successfully!" });
        setCatFormData(initialCategoryState);
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
      {/* Header matching AdminProduct */}
      <header className="admin-header">
        <div>
          <h2 className="admin-title">Add New Category</h2>
          <p className="admin-subtitle">Create a new collection to organize your products.</p>
        </div>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back
        </button>
      </header>

      {/* Status Notifications */}
      {status.message && (
        <div className={`status-banner ${status.type === "success" ? "bg-green" : "bg-red"}`}>
          {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-grid-form">
        {/* LEFT COLUMN: Details */}
        <div className="form-main-content">
          <section className="form-card">
            <h3 className="card-section-title">General Details</h3>
            
            <div className="form-group">
              <label>Category Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <Type className="icon" size={18} />
                <input
                  type="text"
                  name="name"
                  required
                  value={catFormData.name}
                  onChange={handleChange}
                  placeholder="e.g., Dairy, Bread & Eggs"
                />
              </div>
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label>Display Priority (0-5)</label>
                <div className="input-with-icon">
                  <LayoutList className="icon" size={18} />
                  <input
                    type="number"
                    name="priority"
                    min="0"
                    max="5"
                    value={catFormData.priority}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group toggle-wrapper">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={catFormData.isActive}
                    onChange={handleChange}
                    className="toggle-checkbox"
                  />
                  <div className="toggle-track">
                    <div className="toggle-thumb"></div>
                  </div>
                  <span className="toggle-text">Visible on Store</span>
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Image & Action */}
        <div className="form-side-content">
          <section className="form-card image-upload-card">
            <h3 className="card-section-title">Category Image</h3>
            <div className="image-preview-container">
              {catFormData.image ? (
                <img src={catFormData.image} alt="Preview" className="img-preview" />
              ) : (
                <div className="img-placeholder">
                  <ImageIcon size={40} />
                  <span>URL Preview</span>
                </div>
              )}
            </div>
            
            <div className="form-group mt-4">
              <label>Image URL <span className="req">*</span></label>
              <div className="input-with-icon">
                <Upload className="icon" size={18} />
                <input
                  type="url"
                  name="image"
                  required
                  value={catFormData.image}
                  onChange={handleChange}
                  placeholder="Paste URL here..."
                />
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="main-submit-btn">
            {loading ? "Processing..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCategory;