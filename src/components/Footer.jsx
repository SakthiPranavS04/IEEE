import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#031726', /* Dark KSV Blue */
      color: '#c2d5e3',
      padding: '70px 0 30px',
      borderTop: '4px solid var(--secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand/About Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '800'
              }}>
                🌿
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800', lineHeight: '1.2' }}>IEEE KEC SB</h3>
                <span style={{ fontSize: '11px', color: '#8ca6b9', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Student Branch Code: 30041
                </span>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', color: '#a6bac5' }}>
              Fostering innovation, developing technical skillsets, and establishing professional leadership amongst the students of Kongu Engineering College.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '24px', borderBottom: '2px solid #10344d', paddingBottom: '10px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Home', link: '/' },
                { name: 'Upcoming Events', link: '/events/upcoming' },
                { name: 'Past Events', link: '/events/past' },
                { name: 'Achievements', link: '/achievements' },
                { name: 'IEEE operational Committee', link: '/committee' },
                { name: 'Executive Committee', link: '/execomm' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to={item.link} className="footer-link-hover" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#a6bac5',
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)'
                  }}>
                    <ArrowRight size={12} style={{ color: 'var(--secondary)' }} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '24px', borderBottom: '2px solid #10344d', paddingBottom: '10px' }}>
              Contact Details
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px' }}>
                <MapPin size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  IEEE Student Branch,<br />
                  Kongu Engineering College Campus,<br />
                  Perundurai, Erode - 638060,<br />
                  Tamil Nadu, India.
                </span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
                <Phone size={18} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                <a href="tel:+914294226555" style={{ color: '#a6bac5', textDecoration: 'none' }}>+91 4294 226555</a>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
                <Mail size={18} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                <a href="mailto:ieee@kongu.edu" style={{ color: '#a6bac5', textDecoration: 'none' }}>ieee@kongu.edu</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #10344d', margin: '40px 0 24px' }}></div>

        {/* Copyright section */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '13px',
          color: '#829ab9'
        }}>
          <div>
            © {currentYear} IEEE KEC Student Branch. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://www.ieee.org" target="_blank" rel="noopener noreferrer" style={{ color: '#829ab9', textDecoration: 'none' }} className="bottom-link-hover">IEEE.org</a>
            <a href="https://www.ieee.org/security-privacy.html" target="_blank" rel="noopener noreferrer" style={{ color: '#829ab9', textDecoration: 'none' }} className="bottom-link-hover">Privacy Policy</a>
            <a href="https://www.kongu.ac.in" target="_blank" rel="noopener noreferrer" style={{ color: '#829ab9', textDecoration: 'none' }} className="bottom-link-hover">Kongu Engineering College</a>
          </div>
        </div>
      </div>

      <style>{`
        .social-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #0e2a3e;
          color: #a6bac5;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .social-icon-btn:hover {
          background-color: var(--secondary);
          color: #fff;
          transform: translateY(-2px);
        }
        .footer-link-hover:hover {
          color: #fff !important;
          padding-left: 4px;
        }
        .bottom-link-hover:hover {
          color: #fff !important;
          text-decoration: underline !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
