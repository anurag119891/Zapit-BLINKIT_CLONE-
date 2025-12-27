import React, { useState, useEffect } from "react";
import { X, Package, Calendar, ChevronRight, ShoppingBag, Clock } from "lucide-react";
import "../css/OrderPanel.css";

const API_BASE_URL = "http://localhost:5000/api/orders";

export default function OrderPanel({ open, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchOrders();
  }, [open]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  if (!open) return null;

  return (
    <>
      <div className={`order-overlay-new ${open ? "visible" : ""}`} onClick={onClose} />

      <aside className={`order-drawer-new ${open ? "active" : ""}`}>
        {/* Header Section */}
        <div className="drawer-header">
          <div className="header-left">
            <Package size={22} className="text-teal" />
            <h3>My Orders</h3>
            <span className="order-pill">{orders.length} Past</span>
          </div>
          <button onClick={onClose} className="drawer-close">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="drawer-content">
          {loading ? (
            <div className="empty-drawer">
              <Clock className="spinner" size={40} />
              <p>Fetching your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-drawer">
              <div className="empty-icon-circle">
                <ShoppingBag size={48} />
              </div>
              <h4>No orders yet</h4>
              <p>Looks like you haven't placed any orders with Zapit yet.</p>
              <button className="back-to-shop" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="order-stack">
              {orders.map((order) => (
                <div key={order._id} className="order-card-new">
                  <div className="order-card-head">
                    <div className="order-meta">
                      <span className="order-date">
                        <Calendar size={12} /> {formatDate(order.createdAt)}
                      </span>
                      <span className={`status-tag ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="order-id">ID: #{order._id.slice(-6).toUpperCase()}</span>
                  </div>

                  <div className="order-items-preview">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="item-token">
                        {item.productName} {item.quantity > 1 && `(x${item.quantity})`}
                      </span>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="total-stack">
                      <span className="total-label">Amount Paid</span>
                      <span className="total-val">₹{order.totalAmount}</span>
                    </div>
                    <button className="reorder-btn">
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}