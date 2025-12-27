import React, { useEffect, useState } from "react";
import { 
  FileText, Shield, Info, UserCheck, 
  Truck, RefreshCcw, Mail, ChevronRight 
} from "lucide-react";
import "../css/Terms.css";

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "acceptance", label: "Acceptance", icon: <UserCheck size={18} /> },
    { id: "overview", label: "Services", icon: <Info size={18} /> },
    { id: "eligibility", label: "Eligibility", icon: <Shield size={18} /> },
    { id: "conduct", label: "Conduct", icon: <FileText size={18} /> },
    { id: "refunds", label: "Refunds", icon: <RefreshCcw size={18} /> },
    { id: "contact", label: "Contact", icon: <Mail size={18} /> },
  ];

  return (
    <div className="terms-page">
      {/* Header Banner */}
      <div className="terms-header">
        <div className="header-overlay">
          <h1>Terms of Service</h1>
          <p>Last updated June 2025 • Read carefully to understand your rights</p>
        </div>
      </div>

      <div className="terms-layout">
        {/* Sticky Sidebar Navigation */}
        <aside className="terms-sidebar">
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

        {/* Main Content Card */}
        <main className="terms-main">
          <section className="intro-card">
            <p className="terms-text">
              <span className="brand-badge">Zapit Commerce Private Limited</span> is incorporated under the Companies Act, 2013, with its registered office in Gurugram, Haryana. 
              <strong> Zapit</strong> is an independent entity and is not interconnected with “GROFFR.COM”.
            </p>
          </section>

          <section id="acceptance" className="content-block">
            <div className="section-head">
              <UserCheck className="section-icon" />
              <h2>Acceptance of Terms</h2>
            </div>
            <p>Your access to the Zapit Platform and any related mobile applications ("Services") is governed by these Terms and our Privacy Policy. By undertaking any transaction, you agree to be bound by these legal responsibilities.</p>
          </section>

          <section id="overview" className="content-block">
            <div className="section-head">
              <Info className="section-icon" />
              <h2>Services Overview</h2>
            </div>
            <p>Zapit is a platform facilitating transactions between consumers and Third-Party Sellers. Zapit acts as a facilitator and is not a party to the bipartite arrangement between you and the seller.</p>
          </section>

          <section id="eligibility" className="content-block">
            <div className="section-head">
              <Shield className="section-icon" />
              <h2>Eligibility</h2>
            </div>
            <p>Minors under 18 may only use Zapit under the supervision of a parent or legal guardian. Persons deemed "incompetent to contract" under the Indian Contract Act are not eligible.</p>
          </section>

          <section id="conduct" className="content-block">
            <div className="section-head">
              <FileText className="section-icon" />
              <h2>Limited License & Conduct</h2>
            </div>
            <p>We grant you a personal, revocable license for personal use. You agree not to engage in "Prohibited Conduct" such as:</p>
            <ul className="modern-list">
              <li>Sharing harmful, abusive, or discriminatory content.</li>
              <li>Uploading viruses or computer code designed to interrupt functionality.</li>
              <li>Infringing on patent, trademark, or copyrights.</li>
            </ul>
          </section>

          <section id="refunds" className="content-block">
            <div className="section-head">
              <RefreshCcw className="section-icon" />
              <h2>Returns & Refunds</h2>
            </div>
            <p>Products are non-refundable unless damaged, defective, or expired at delivery. Approved refunds are processed within <strong>7 working days</strong>.</p>
          </section>

          <section id="contact" className="content-block">
            <div className="section-head">
              <Mail className="section-icon" />
              <h2>Grievance Redressal</h2>
            </div>
            <div className="officer-grid">
              <div className="officer-pill">
                <h4>Grievance Officer</h4>
                <p><strong>Dhananjay Shashidharan</strong></p>
                <p>grievance.officer@zapit.com</p>
              </div>
              <div className="officer-pill">
                <h4>Nodal Officer</h4>
                <p><strong>Vikramjit Singh</strong></p>
                <p>nodal@zapit.com</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsConditions;