import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = ({ contact }) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formSent, setFormSent] = useState(false);

  if (!contact) return null;

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;
    setFormSent(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormMsg('');
      setFormSent(false);
      alert('Your enquiry has been successfully submitted! The society coordinators will contact you soon.');
    }, 1000);
  };

  return (
    <section className="society-section alt-bg">
      <div className="container">
        <div className="contact-section-grid">
          
          <div className="contact-details-box scroll-reveal slide-right">
            <div>
              <h2>Contact & Support</h2>
              <div className="contact-info-list">
                <div className="contact-info-row">
                  <div className="contact-icon-wrapper">
                    <Mail size={18} />
                  </div>
                  <div className="contact-info-text">
                    <h3>Email Address</h3>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                </div>

                <div className="contact-info-row">
                  <div className="contact-icon-wrapper">
                    <Phone size={18} />
                  </div>
                  <div className="contact-info-text">
                    <h3>Telephone</h3>
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </div>
                </div>

                <div className="contact-info-row">
                  <div className="contact-icon-wrapper">
                    <MapPin size={18} />
                  </div>
                  <div className="contact-info-text">
                    <h3>Office Location</h3>
                    <p>{contact.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-social-channels">
              <h3>Connect With Us</h3>
              <div className="contact-social-row">
                <a href={contact.socials.linkedin || "#"} className="contact-social-link" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
                </a>
                <a href={contact.socials.instagram || "#"} className="contact-social-link" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
                </a>
                <a href={contact.socials.website || "#"} className="contact-social-link" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Official Site
                </a>
              </div>
            </div>
          </div>

          <div className="quick-enquiry-box scroll-reveal slide-left">
            <h2>Quick Enquiry</h2>
            <form onSubmit={handleEnquirySubmit} className="enquiry-form">
              <input 
                type="text" 
                placeholder="Your Full Name"
                required 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              <input 
                type="email" 
                placeholder="Your Email Address"
                required 
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
              <textarea 
                placeholder="How can we help you? Write your question here..." 
                rows="5"
                required
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ gap: '8px', alignSelf: 'flex-start' }}>
                <Send size={15} /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
