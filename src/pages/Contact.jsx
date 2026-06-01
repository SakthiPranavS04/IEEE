import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
    color: '#ffffff',
    padding: '50px 0',
    textAlign: 'center',
    marginBottom: '40px'
  }}>
    <div className="container">
      <h1 className="font-serif" style={{ fontSize: '32px', color: '#ffffff', marginBottom: '8px' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '15px', color: '#d0e4f2' }}>{subtitle}</p>}
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
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
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
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
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      +91 4294 226555 / 226666
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Mail size={22} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '4px' }}>Email Inquiries</h4>
                    <a href="mailto:ieee@kongu.edu" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}>
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
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '14px', display: 'flex', gap: '8px', justifyContent: 'center' }}
                >
                  Send Message <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .input-focus:focus {
          border-color: var(--secondary) !important;
          box-shadow: 0 0 0 3px rgba(2, 97, 154, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Contact;
