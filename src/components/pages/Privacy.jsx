import React, { useEffect } from "react";
import { 
  Shield, 
  Database, 
  Eye, 
  Share2, 
  Lock, 
  HelpCircle, 
  ChevronRight,
  Clock
} from "lucide-react";
import "../css/Privacy.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "scope", label: "Scope", icon: <Eye size={18} /> },
    { id: "collection", label: "Data Collection", icon: <Database size={18} /> },
    { id: "usage", label: "How We Use It", icon: <Shield size={18} /> },
    { id: "sharing", label: "Data Sharing", icon: <Share2 size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
    { id: "contact", label: "Support", icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className="policy-page">
      {/* Header Banner - Matches Terms */}
      <div className="policy-header">
        <div className="header-overlay">
          <h1>Privacy Policy</h1>
          <p>
            <Clock size={14} style={{ display: 'inline', marginRight: '5px' }} />
            Last updated January 2025 • Your privacy is our priority
          </p>
        </div>
      </div>

      <div className="policy-layout">
        {/* Sticky Sidebar Navigation */}
        <aside className="policy-sidebar">
          <nav>
            {sections.map((sec) => (
              <a key={sec.id} href={`#${sec.id}`} className="nav-item">
                {sec.icon}
                <span>{sec.label}</span>
                <ChevronRight className="chevron" size={14} />
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="policy-main">
          <section className="intro-card">
            <p className="policy-text">
              We, <span className="brand-badge">Zapit Commerce Private Limited</span>, are committed to protecting the privacy and security of your personal information. This policy explains how we collect, use, and process your data.
            </p>
          </section>

          <section id="scope" className="content-block">
            <div className="section-head">
              <Eye className="section-icon" />
              <h2>Applicability and Scope</h2>
            </div>
            <p>This policy applies to information Zapit collects through its website, application, and electronic communications. It does not apply to third-party services you may use in connection with Zapit.</p>
            <div className="info-callout">
              <strong>Permissible Age:</strong> Services are intended for users aged 18+. We do not knowingly collect data from minors.
            </div>
          </section>

          <section id="collection" className="content-block">
            <div className="section-head">
              <Database className="section-icon" />
              <h2>Information We Collect</h2>
            </div>
            <h3 className="sub-head">Directly Provided</h3>
            <ul className="modern-list">
              <li><strong>Personal details:</strong> Name, address, email, phone number, and anniversary dates.</li>
              <li><strong>Content:</strong> Order history and contact information provided for features.</li>
              <li><strong>Activity:</strong> Search terms and results selected.</li>
            </ul>
            
            <h3 className="sub-head">Automatically Collected</h3>
            <ul className="modern-list">
              <li>Real-time device location (with permission).</li>
              <li>IP addresses, browser types, and usage patterns.</li>
              <li>Cookies and pixel tags for improved experience.</li>
            </ul>
          </section>

          <section id="usage" className="content-block">
            <div className="section-head">
              <Shield className="section-icon" />
              <h2>How We Use Information</h2>
            </div>
            <p>Your data allows us to provide a seamless delivery experience. We use it to:</p>
            <ul className="modern-list">
              <li>Process orders and manage delivery via partners.</li>
              <li>Send transactional updates via SMS and WhatsApp.</li>
              <li>Detect and prevent fraudulent activities.</li>
              <li>Improve platform features based on user behavior.</li>
            </ul>
          </section>

          <section id="sharing" className="content-block">
            <div className="section-head">
              <Share2 className="section-icon" />
              <h2>Sharing and Disclosure</h2>
            </div>
            <p>We may share information with:</p>
            <div className="grid-cards">
              <div className="mini-pill">Contractors & Vendors</div>
              <div className="mini-pill">Subsidiaries</div>
              <div className="mini-pill">Legal Authorities</div>
              <div className="mini-pill">Potential Business Buyers</div>
            </div>
          </section>

          <section id="security" className="content-block">
            <div className="section-head">
              <Lock className="section-icon" />
              <h2>Security Standards</h2>
            </div>
            <p>We implement physical, electronic, and managerial procedures to safeguard your data. We follow generally accepted industry standards to protect personal information submitted to us.</p>
          </section>

          <section id="contact" className="content-block">
            <div className="section-head">
              <HelpCircle className="section-icon" />
              <h2>Contact Our DPO</h2>
            </div>
            <div className="contact-box">
              <p>For queries regarding data processing or this policy, contact our <strong>Data Protection Officer</strong>:</p>
              <a href="mailto:privacy@zapit.com" className="policy-link-btn">privacy@zapit.com</a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;