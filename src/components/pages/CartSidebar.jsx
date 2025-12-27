import React from "react";
import { X, ShoppingBag, Plus, Minus, ChevronRight, Truck, Info } from "lucide-react";
import { useCart } from "../../context/CartContext";
import "../css/CartSidebar.css";

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, addToCart, removeFromCart, cartTotal } = useCart();

  return (
    <>
      <div className={`cart-overlay-new ${isOpen ? "visible" : ""}`} onClick={onClose} />

      <aside className={`cart-drawer-new ${isOpen ? "active" : ""}`}>
        {/* Header Section */}
        <div className="drawer-header">
          <div className="header-left">
            <ShoppingBag size={22} className="text-teal" />
            <h3>My Cart</h3>
            <span className="item-pill">{cartItems.length} Items</span>
          </div>
          <button onClick={onClose} className="drawer-close">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="drawer-content">
          {cartItems.length === 0 ? (
            <div className="empty-drawer">
              <div className="empty-icon-circle">
                <ShoppingBag size={48} />
              </div>
              <h4>Your cart is empty</h4>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <button className="back-to-shop" onClick={onClose}>
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Delivery ETA Promo */}
              <div className="delivery-banner">
                <Truck size={18} />
                <span>Delivery in <b>8-12 minutes</b> to your doorstep</span>
              </div>

              {/* Items List */}
              <div className="items-stack">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-card">
                    <div className="card-thumb">
                      <img src={item.image || "https://placehold.co/60"} alt={item.name} />
                    </div>
                    <div className="card-info">
                      <h4 className="item-title">{item.name}</h4>
                      <span className="item-variant">{item.weight}</span>
                      <div className="card-bottom">
                        <span className="item-price">₹{item.price}</span>
                        <div className="stepper-control">
                          <button onClick={() => removeFromCart(item._id)}><Minus size={14} /></button>
                          <span className="qty-count">{item.quantity}</span>
                          <button onClick={() => addToCart(item)}><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="summary-section">
                <div className="summary-head">
                  <Info size={16} />
                  <h4>Bill Details</h4>
                </div>
                <div className="bill-card">
                  <div className="bill-line">
                    <span>Item Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="bill-line">
                    <span>Delivery Partner Fee</span>
                    <span className="text-green">FREE</span>
                  </div>
                  <div className="bill-divider" />
                  <div className="bill-line grand">
                    <span>To Pay</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <button
              className="pay-btn"
              onClick={() => onCheckout({ items: cartItems, totalAmount: cartTotal })}
            >
              <div className="pay-btn-content">
                <div className="price-stack">
                  <span className="final-amt">₹{cartTotal}</span>
                  <span className="total-labell">TOTAL AMOUNT</span>
                </div>
                <div className="action-stack">
                  <span>Proceed to Pay</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;