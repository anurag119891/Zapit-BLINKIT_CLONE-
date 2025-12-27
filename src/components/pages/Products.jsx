import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import SeoFooter from "./SeoFooter";
import { slugify } from "../../utils/urlCreater";
import { Search, ChevronRight, LayoutGrid, Loader2 } from "lucide-react";
import "../css/Products.css";

function Products() {
  const { categoryId, searchTerm } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://zapit-hl9x.onrender.com/api/category");
        const result = await response.json();
        if (result.success) setCategories(result.categories);
      } catch (error) { console.error(error); }
    };
    fetchCategories();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setActiveCategory(null);
      fetchProducts(`https://zapit-hl9x.onrender.com/api/products?search=${searchTerm}`);
    } else if (categories.length > 0) {
      if (categoryId) {
        const match = categories.find((c) => c._id === categoryId);
        if (match) {
          setActiveCategory(match);
          fetchProducts(`https://zapit-hl9x.onrender.com/api/products?categoryId=${categoryId}`);
        }
      } else {
        const first = categories[0];
        navigate(`/cn/${slugify(first.name)}/cid/${first._id}`, { replace: true });
      }
    }
  }, [categoryId, searchTerm, categories, navigate]);

  const fetchProducts = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setProducts(result.success ? result.data : []);
    } catch (error) { setProducts([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="products-page-wrapper">
      <div className="products-layout">
        
        {/* Left Sidebar: Category Navigation */}
        <aside className="category-sidebar">
          <div className="sidebar-header">
            <LayoutGrid size={18} />
            <span>Categories</span>
          </div>
          <nav className="category-nav">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/cn/${slugify(cat.name)}/cid/${cat._id}`}
                className={`category-item ${activeCategory?._id === cat._id ? "active" : ""}`}
              >
                <img src={cat.image} alt="" className="cat-icon" />
                <span className="cat-name">{cat.name}</span>
                <ChevronRight size={14} className="arrow" />
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="products-main">
          <header className="content-header">
            <div className="breadcrumb">
              <span>Home</span> <ChevronRight size={12} />
              <span className="current">
                {searchTerm ? "Search" : activeCategory?.name}
              </span>
            </div>
            <h1 className="main-title">
              {searchTerm ? (
                <>Results for <span>"{searchTerm}"</span></>
              ) : (
                activeCategory?.name || "Store"
              )}
            </h1>
            <p className="item-count">{products.length} Items found</p>
          </header>

          <div className="products-view">
            {loading ? (
              <div className="loading-state">
                <Loader2 className="spinner" />
                <p>Curating the best products for you...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Search size={48} />
                <h3>No products found</h3>
                <p>Try adjusting your search or category filters.</p>
              </div>
            )}
          </div>

          <SeoFooter activeCategory={activeCategory} categories={categories} />
        </main>
      </div>
    </div>
  );
}

export default Products;