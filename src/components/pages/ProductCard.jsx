import React from "react";
import { Plus, Minus, Clock } from "lucide-react"; // Modern Icons
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { slugify } from "../../utils/urlCreater";
import "../css/ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const quantity = getItemQuantity(product._id);
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discount = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleCardClick = () => {
    navigate(`/prn/${slugify(product.name)}/pid/${product._id}`);
  };

  const handleAction = (e, action) => {
    e.stopPropagation(); // Essential: prevents navigation when clicking buttons
    if (action === "add") addToCart(product);
    else removeFromCart(product._id);
  };

  return (
    <div className="modern-product-card" onClick={handleCardClick}>
      {/* Image Section */}
      <div className="card-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        
        {discount > 0 && (
          <div className="promo-badge">
            <span className="percent">{discount}%</span>
            <span className="off">OFF</span>
          </div>
        )}
        
        <div className="eta-tag">
          <Clock size={10} strokeWidth={3} />
          <span>{product.time || "10 MINS"}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="card-info">
        <div className="info-top">
          <h3 className="item-title" title={product.name}>
            {product.name}
          </h3>
          <span className="item-meta">{product.weight}</span>
        </div>

        <div className="info-bottom">
          <div className="pricing">
            <span className="sale-price">₹{product.price}</span>
            {hasDiscount && <span className="original-mrp">₹{product.mrp}</span>}
          </div>

          <div className="action-area">
            {quantity === 0 ? (
              <button 
                className="add-control" 
                onClick={(e) => handleAction(e, "add")}
              >
                ADD
              </button>
            ) : (
              <div className="qty-stepper">
                <button onClick={(e) => handleAction(e, "remove")}><Minus size={14} /></button>
                <span className="count">{quantity}</span>
                <button onClick={(e) => handleAction(e, "add")}><Plus size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;