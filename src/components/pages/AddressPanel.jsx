import React, { useState, useEffect } from "react";
import { 
  X, MapPin, Plus, Edit3, Trash2, Home, 
  Briefcase, Map, ChevronLeft, Loader2 
} from "lucide-react";
import "../css/AddressPanel.css";

const API_BASE_URL = "http://localhost:5000/api/user";

export default function AddressPanel({ open, onClose, onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("LIST");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "Home",
    addressLine: "",
    city: "",
    pincode: "",
  });

  // Fetch addresses when panel opens
  useEffect(() => {
    if (open) fetchAddresses();
  }, [open]);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAddresses(data.user.savedAddresses || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (addr) => {
    setNewAddress({
      label: addr.label,
      addressLine: addr.addressLine,
      city: addr.city,
      pincode: addr.pincode,
    });
    setEditingId(addr._id);
    setErrors({});
    setView("FORM");
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!newAddress.addressLine.trim()) tempErrors.addressLine = "Address is required";
    if (!newAddress.city.trim()) tempErrors.city = "City is required";
    if (newAddress.pincode.length !== 6) tempErrors.pincode = "Must be 6 digits";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `${API_BASE_URL}/address/${editingId}` 
      : `${API_BASE_URL}/address`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          address: { ...newAddress, location: { type: "Point", coordinates: [0, 0] } }
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
        resetForm();
      } else {
        alert(data.message || "Save failed");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (e, addressId) => {
    e.stopPropagation(); // Prevents triggering onSelectAddress
    if (!confirm("Delete this address?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/address/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAddresses(data.addresses);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const resetForm = () => {
    setView("LIST");
    setEditingId(null);
    setErrors({});
    setNewAddress({ label: "Home", addressLine: "", city: "", pincode: "" });
  };

  if (!open) return null;

  return (
    <>
      <div className={`address-overlay-new ${open ? "visible" : ""}`} onClick={onClose} />

      <aside className={`address-drawer-new ${open ? "active" : ""}`}>
        <div className="drawer-header">
          <div className="header-left">
            {view === "FORM" ? (
              <button className="back-circle" onClick={resetForm}><ChevronLeft size={18}/></button>
            ) : (
              <MapPin size={22} className="text-teal" />
            )}
            <h3>{view === "LIST" ? "My Addresses" : editingId ? "Edit Address" : "Add Address"}</h3>
          </div>
          <button onClick={onClose} className="drawer-close"><X size={20} /></button>
        </div>

        <div className="drawer-content">
          {view === "LIST" ? (
            <div className="address-view-stack">
              <button className="add-new-trigger" onClick={() => setView("FORM")}>
                <Plus size={18} /> Add New Address
              </button>

              {loading ? (
                <div className="loading-state"><Loader2 className="spinner" /></div>
              ) : (
                <div className="address-grid">
                  {addresses.length === 0 ? (
                    <p className="ap-empty-msg">No addresses saved yet.</p>
                  ) : (
                    addresses.map((addr) => (
                      <div 
                        key={addr._id} 
                        className="address-card-new" 
                        onClick={() => onSelectAddress?.(addr)}
                      >
                        <div className="addr-card-top">
                          <div className="addr-label-group">
                            {addr.label === "Home" ? <Home size={14}/> : addr.label === "Work" ? <Briefcase size={14}/> : <Map size={14}/>}
                            <span className="addr-label-text">{addr.label}</span>
                          </div>
                          <div className="addr-actions">
                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(addr); }}><Edit3 size={16}/></button>
                            <button onClick={(e) => handleDelete(e, addr._id)} className="text-red"><Trash2 size={16}/></button>
                          </div>
                        </div>
                        <p className="addr-full-text">{addr.addressLine}, {addr.city} - {addr.pincode}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="address-form-new">
              <div className="form-section">
                <label className="form-label">Address Type</label>
                <div className="type-pills">
                  {["Home", "Work", "Other"].map((t) => (
                    <button 
                      key={t} 
                      className={`type-pill ${newAddress.label === t ? "active" : ""}`}
                      onClick={() => setNewAddress({...newAddress, label: t})}
                    >
                      {t === "Home" ? <Home size={14}/> : t === "Work" ? <Briefcase size={14}/> : <Map size={14}/>}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Full Address</label>
                <textarea 
                  className={`form-input area ${errors.addressLine ? "has-error" : ""}`}
                  placeholder="House No, Building, Street Name..."
                  value={newAddress.addressLine}
                  onChange={(e) => {
                    setNewAddress({...newAddress, addressLine: e.target.value});
                    if (errors.addressLine) setErrors({...errors, addressLine: null});
                  }}
                />
                {errors.addressLine && <span className="error-text">{errors.addressLine}</span>}
              </div>

              <div className="form-row-2">
                <div className="form-section">
                  <label className="form-label">City</label>
                  <input 
                    className={`form-input ${errors.city ? "has-error" : ""}`}
                    value={newAddress.city}
                    onChange={(e) => {
                      setNewAddress({...newAddress, city: e.target.value});
                      if (errors.city) setErrors({...errors, city: null});
                    }}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="form-section">
                  <label className="form-label">Pincode</label>
                  <input 
                    className={`form-input ${errors.pincode ? "has-error" : ""}`}
                    maxLength={6}
                    value={newAddress.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setNewAddress({...newAddress, pincode: val});
                      if (errors.pincode) setErrors({...errors, pincode: null});
                    }}
                  />
                  {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>
              </div>

              <button className="submit-addr-btn" onClick={handleSave} disabled={submitLoading}>
                {submitLoading ? <Loader2 className="spinner" size={18}/> : editingId ? "Update Address" : "Save Address"}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}