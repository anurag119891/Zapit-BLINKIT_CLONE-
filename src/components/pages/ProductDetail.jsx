import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import ProductCard from "./ProductCard";
import { 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Store, 
  Info, 
  Plus, 
  Minus, 
  ShoppingBag,
  ArrowLeft
} from "lucide-react";
import { slugify } from "../../utils/urlCreater";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prodRes = await fetch(`https://zapit-hl9x.onrender.com/api/products/${id}`);
        const prodResult = await prodRes.json();

        if (prodResult.success) {
          const currentProduct = prodResult.data;
          setProduct(currentProduct);

          if (currentProduct.category) {
            const catId = typeof currentProduct.category === "object" 
              ? currentProduct.category._id 
              : currentProduct.category;

            const suggRes = await fetch(`https://zapit-hl9x.onrender.com/api/products?categoryId=${catId}`);
            const suggResult = await suggRes.json();

            if (suggResult.success) {
              const filtered = suggResult.data.filter((p) => p._id !== id);
              setSuggestions(filtered.slice(0, 6));
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (id) fetchProductData();
  }, [id]);

  if (loading) return (
    <div className="pd-loading-container">
      <div className="pd-spinner"></div>
      <p>Fetching product details...</p>
    </div>
  );
  
  if (!product) return <div className="pd-error-state">Product not found</div>;

  const quantity = getItemQuantity(product._id);
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="pd-page-wrapper">
      {/* Breadcrumb Navigation */}
      <nav className="pd-breadcrumb-nav">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        {product.category && (
          <>
            <Link to={`/cn/${slugify(product.category.name)}/cid/${product.category._id}`}>
              {product.category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span>{product.name}</span>
      </nav>

      <div className="pd-grid">
        {/* Left: Media Gallery */}
        <div className="pd-gallery">
          <div className="pd-main-image-card">
            <img src={product.image} alt={product.name} />
            {discount > 0 && <div className="pd-promo-label">{discount}% OFF</div>}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="pd-content">
          <div className="pd-header">
            <span className="pd-brand-tag">{product.brand || "Zapit Fresh"}</span>
            <h1 className="pd-main-title">{product.name}</h1>
            <div className="pd-quick-meta">
              <div className="pd-meta-pill">
                <Clock size={14} />
                <span>{product.time || "10 MINS"}</span>
              </div>
              <div className="pd-meta-pill">
                <ShoppingBag size={14} />
                <span>{product.weight}</span>
              </div>
            </div>
          </div>

          <div className="pd-price-card">
            <div className="pd-price-row">
              <span className="pd-current-price">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="pd-mrp-price">MRP ₹{product.mrp}</span>
              )}
            </div>
            <p className="pd-tax-info">Inclusive of all taxes</p>
          </div>

          <div className="pd-actions-row">
            {quantity === 0 ? (
              <button className="pd-primary-add" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            ) : (
              <div className="pd-stepper">
                <button onClick={() => removeFromCart(product._id)}><Minus size={18} /></button>
                <span className="pd-qty-val">{quantity}</span>
                <button onClick={() => addToCart(product)}><Plus size={18} /></button>
              </div>
            )}
          </div>

          <div className="pd-trust-banners">
            <div className="trust-item">
              <ShieldCheck size={20} className="text-teal" />
              <div>
                <h6>Quality Assurance</h6>
                <p>Hand-picked and fresh items</p>
              </div>
            </div>
            <div className="trust-item">
              <Store size={20} className="text-teal" />
              <div>
                <h6>Direct from Store</h6>
                <p>Packed safely at our dark stores</p>
              </div>
            </div>
          </div>

          <div className="pd-details-section">
            <div className="pd-section-title">
              <Info size={16} />
              <h4>Product Description</h4>
            </div>
            <p className="pd-description-text">
              {product.description || "No specific description provided for this product. Freshly sourced and delivered to your doorstep in minutes."}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Products */}
      {suggestions.length > 0 && (
        <section className="pd-related">
          <div className="pd-section-header">
            <h3>Customers also bought</h3>
            <Link to="/">View all <ChevronRight size={16}/></Link>
          </div>
          <div className="pd-related-grid">
            {suggestions.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;