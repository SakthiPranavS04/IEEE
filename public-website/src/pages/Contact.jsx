import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import API from '../services/api';
const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'var(--gradient-primary)',
    color: '#ffffff',
    padding: '70px 0',
    textAlign: 'center',
    marginBottom: '40px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Decorative top colored line */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'var(--gradient-colorful)',
      zIndex: 2
    }} />
    <div style={{
      position: 'absolute', top: '-10%', right: '-8%',
      width: '320px', height: '320px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.12) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <h1 className="font-serif" style={{ fontSize: '38px', color: '#ffffff', marginBottom: '8px', fontWeight: '800' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>}
    </div>
    {/* Decorative Wave Bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)', zIndex: 2 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,101.4,227.14,83.56,258.14,76.22,290.41,68.22,321.39,56.44Z" fill="var(--bg-light)"></path>
      </svg>
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitting(true);
      try {
        // Map frontend fields to match backend schema requirements without changing UI
        const payload = {
          fullName: formData.name,
          email: formData.email,
          phone: "Not provided",
          college: "Not provided",
          department: formData.subject || "Not provided",
          message: formData.message
        };

        const response = await fetch(`${API}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setIsSubmitted(true);
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          alert("Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
        alert("Error connecting to the backend server. Make sure it is running.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
      <PageHeader
        title="Contact Us"
        subtitle="Reach out to the KEC IEEE Student Branch team for queries or partnerships"
      />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Contact Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '24px' }}>Inquiries</h2>
              <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <MapPin size={22} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '4px' }}>Office Address</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                      IEEE Student Branch Office,<br />
                      Department of Electrical & Electronics Engineering,<br />
                      Kongu Engineering College Campus,<br />
                      Perundurai, Erode - 638060, Tamil Nadu, India.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Phone size={22} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '4px' }}>Call Us</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                      +91 4294 226555 / 226666
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Mail size={22} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '4px' }}>Email Inquiries</h4>
                    <a href="mailto:ieee@kongu.edu" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                      ieee@kongu.edu
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Campus Location Map */}
            <div className="card" style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--primary)', marginBottom: '12px', textAlign: 'center', fontWeight: '700' }}>Campus Location</h3>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <iframe
                  src="https://maps.google.com/maps?q=Kongu%20Engineering%20College,%20Perundurai,%20Erode,%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kongu Engineering College Map"
                />
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="card" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '24px' }}>Send us a message</h2>
            {isSubmitted ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <CheckCircle size={56} style={{ color: 'var(--secondary)' }} />
                <h3 style={{ color: 'var(--primary)', fontSize: '20px' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button className="btn btn-secondary" onClick={() => setIsSubmitted(false)} style={{ marginTop: '16px', padding: '8px 20px', fontSize: '14px' }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="name" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                    className="input-focus"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="email" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                    className="input-focus"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="subject" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                    className="input-focus"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="message" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'var(--transition-fast)'
                    }}
                    className="input-focus"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '14px', display: 'flex', gap: '8px', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} {!isSubmitting && <Send size={14} />}
                </button>

              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .input-focus:focus {
          border-color: var(--secondary) !important;
          box-shadow: 0 0 0 3px rgba(var(--secondary-rgb), 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Contact;
