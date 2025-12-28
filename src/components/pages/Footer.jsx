import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import "../css/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Left: Brand & Copyright */}
        <div className="footer-brand-section">
          <div className="footer-logo">
            <span className="logo-dot"></span>
            <span className="logo-text">Zapit</span>
          </div>
          <p className="footer-copyright">
            © {currentYear} Zapit Commerce Pvt Ltd. All rights reserved.
          </p>
        </div>

        {/* Center: Legal Links */}
        <div className="footer-nav">
          <Link to="/privacy" className="footer-nav-link">Privacy Policy</Link>
          <span className="nav-divider">•</span>
          <Link to="/terms" className="footer-nav-link">Terms of Service</Link>
        </div>

        {/* Right: Social Media Icons */}
        <div className="footer-social">
          <a href="https://www.facebook.com/share/1DFtcYTU95/" target="_blank" rel="noreferrer" className="social-btn">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/anuragrai045" target="_blank" rel="noreferrer" className="social-btn">
            <FaInstagram />
          </a>
           <a href="https://x.com/AnuragRai119891" target="_blank" rel="noreferrer" className="social-btn">
            <FaXTwitter />
          </a>
          <a href="https://www.linkedin.com/in/anurag-rai-0148a9292" target="_blank" rel="noreferrer" className="social-btn">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;