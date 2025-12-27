import React from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { 
  ShoppingBag, 
  PlusCircle, 
  FolderPlus 
} from "lucide-react";
import "../css/Dashboard.css";

const Dashboard = ({ user }) => {
  // 1. Security check
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === "admin") {
    return (
      <div className="dashboard-wrapper">
        {/* Simple Professional Header */}
        <header className="dashboard-top-nav">
          <div className="nav-brand">
            <span className="brand-dot"></span>
            <h1>Zapit Admin Portal</h1>
          </div>
          <div className="user-profile-summary">
            <span className="user-name">Welcome, {user.name || "Administrator"}</span>
            <div className="user-avatar">{user.name?.charAt(0) || "A"}</div>
          </div>
        </header>

        <div className="admin-layout">
          {/* Focused Sidebar */}
          <aside className="admin-sidebar">
            <nav className="sidebar-nav">
              <div className="nav-section-label">Management</div>
              
              <NavLink 
                to="/dashboard/all-products" 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <ShoppingBag size={20} />
                <span>All Products</span>
              </NavLink>

              <NavLink 
                to="/dashboard/add-products" 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <PlusCircle size={20} />
                <span>Add Product</span>
              </NavLink>

              <NavLink 
                to="/dashboard/add-category" 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <FolderPlus size={20} />
                <span>Add Category</span>
              </NavLink>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="admin-content">
            <div className="content-container">
               <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return <Navigate to="/" replace />;
};

export default Dashboard;