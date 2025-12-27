import React from "react";
import { IoClose } from "react-icons/io5";
import StripeWrapper from "./StripeCheckout";
import "../css/PaymentModal.css";

const PaymentModal = ({ open, onClose, amount, items, address, onSuccess }) => {
  if (!open) return null;

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        {/* Header */}
        <div className="pm-header">
          <h2>Secure Checkout</h2>
          <button onClick={onClose} className="pm-close-btn">
            <IoClose size={24} />
          </button>
        </div>

        {/* Amount Display */}
        <div className="pm-amount">
          <span className="label">Total Payable</span>
          <span className="value">₹{amount}</span>
        </div>

        {/* Stripe Component */}
        <div className="pm-body">
          <StripeWrapper
            amount={amount}
            items={items}
            address={address}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;