import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Award, X, ChevronRight, Compass, Target, Send
} from 'lucide-react';
import { societiesData } from '../data/societiesData';
import './SocietyPage.css';

// ─── Animated Counter Component ──────────────────────────────────────────────
const AnimatedCounter = ({ target }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const targetVal = parseInt(target, 10) || 0;
    if (targetVal === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 1200; // Total animation duration in ms
          const increment = Math.max(Math.ceil(targetVal / (duration / 20)), 1);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= targetVal) {
              setCount(targetVal);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 20);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target]);

  const suffix = typeof target === 'string' && target.includes('+') ? '+' : '';

  return (
    <span ref={elementRef} className="stat-number colored">
      {count}{suffix}
    </span>
  );
};

// Helper to convert hex to RGB values for custom transparent overlays
const hexToRgb = (hex) => {
  if (!hex) return "0, 98, 155";
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `${r}, ${g}, ${b}`;
};

const SocietyPage = () => {
  const { societyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Quick Enquiry Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formSent, setFormSent] = useState(false);

  // Retrieve society details
  const [society, setSociety] = useState(societiesData[societyId] || null);

  useEffect(() => {
    const stored = localStorage.getItem(`ieee_society_data_${societyId}`);
    if (stored) {
      try {
        setSociety(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing society data:", e);
        setSociety(societiesData[societyId]);
      }
    } else {
      setSociety(societiesData[societyId]);
    }
  }, [societyId]);

  // Auto scroll to top and handle loading transitions
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setIsLoading(true);
    
    // Simulate loading for skeleton animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);

    return () => clearTimeout(timer);
  }, [societyId]);

  // Set document title for SEO
  useEffect(() => {
    if (society) {
      document.title = `${society.name} | IEEE KEC SB`;
    }
  }, [society]);

  // Handle redirect if route invalid
  if (!society) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '30px', color: 'var(--primary)' }}>Society Page Not Found</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-muted)' }}>The requested IEEE society page does not exist.</p>
        <Link to="/" className="btn btn-primary">Go back Home</Link>
      </div>
    );
  }

  // Inject custom theme variables
  const themeStyles = {
    '--society-primary': society.theme.primary,
    '--society-secondary': society.theme.secondary,
    '--society-primary-rgb': hexToRgb(society.theme.primary),
  };

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

  // Render Skeleton Loader
  if (isLoading) {
    return (
      <div className="skeleton-loader-container container" style={{ marginTop: '40px' }}>
        <div className="skeleton-banner skeleton-shimmer" />
        <div className="skeleton-title skeleton-shimmer" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', marginTop: '30px' }}>
          <div>
            <div className="skeleton-text skeleton-shimmer" style={{ width: '90%' }} />
            <div className="skeleton-text skeleton-shimmer" style={{ width: '95%' }} />
            <div className="skeleton-text skeleton-shimmer" style={{ width: '80%' }} />
            <div className="skeleton-text skeleton-shimmer" style={{ width: '85%' }} />
          </div>
          <div>
            <div className="skeleton-text skeleton-shimmer" style={{ height: '60px', marginBottom: '15px' }} />
            <div className="skeleton-text skeleton-shimmer" style={{ height: '60px', marginBottom: '15px' }} />
            <div className="skeleton-text skeleton-shimmer" style={{ height: '60px' }} />
          </div>
        </div>
        <div className="skeleton-grid">
          <div className="skeleton-card skeleton-shimmer" />
          <div className="skeleton-card skeleton-shimmer" />
          <div className="skeleton-card skeleton-shimmer" />
          <div className="skeleton-card skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="society-page-container" style={themeStyles}>
      
      {/* Breadcrumb Navigation */}
      <section className="society-breadcrumbs" aria-label="Breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <ChevronRight size={14} style={{ opacity: 0.6 }} />
          <span>ExeComm</span>
          <ChevronRight size={14} style={{ opacity: 0.6 }} />
          <span className="active">{society.name}</span>
        </div>
      </section>

      {/* Hero Section */}
      <section 
        className="society-hero" 
        style={{ backgroundImage: `url(${society.heroImage})` }}
      >
        <div className="society-hero-overlay" />
        <div className="society-hero-content container">
          <span className="society-hero-badge">{society.logoText}</span>
          <h1 className="society-hero-title font-serif">{society.name}</h1>
          <p className="society-hero-desc">{society.tagline}</p>
        </div>
      </section>

      {/* About Section */}
      <section className="society-section">
        <div className="container">
          <div className="about-section-grid">
            
            <div className="about-info-card scroll-reveal fade-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <span style={{
                padding: '6px 14px',
                backgroundColor: 'rgba(var(--society-primary-rgb), 0.08)',
                color: 'var(--society-primary)',
                border: '1px solid rgba(var(--society-primary-rgb), 0.15)',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '750',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '12px',
                alignSelf: 'flex-start'
              }}>
                Overview
              </span>
              <h2>About the Society</h2>
              <p style={{ marginBottom: '24px' }}>{society.about.overview}</p>
              
              {/* Dynamic Bottom Tagline to fill space and align the endings */}
              {society.tagline && (
                <div style={{
                  marginTop: 'auto',
                  padding: '20px 24px',
                  backgroundColor: 'rgba(var(--society-primary-rgb), 0.04)',
                  borderLeft: '4px solid var(--society-primary)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--society-primary)' }}>
                    Focus & Tagline
                  </span>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>
                    {society.tagline}
                  </p>
                </div>
              )}
            </div>

            <div className="about-cards-stack">
              <div className="about-small-card scroll-reveal slide-left">
                <div className="about-small-card-icon">
                  <Target size={20} />
                </div>
                <div className="about-small-card-content">
                  <h3>Our Mission</h3>
                  <p>{society.about.mission}</p>
                </div>
              </div>

              <div className="about-small-card scroll-reveal slide-left" style={{ transitionDelay: '0.1s' }}>
                <div className="about-small-card-icon">
                  <Compass size={20} />
                </div>
                <div className="about-small-card-content">
                  <h3>Our Vision</h3>
                  <p>{society.about.vision}</p>
                </div>
              </div>

              <div className="about-small-card scroll-reveal slide-left" style={{ transitionDelay: '0.2s' }}>
                <div className="about-small-card-icon">
                  <Award size={20} />
                </div>
                <div className="about-small-card-content">
                  <h3>Key Objectives</h3>
                  <ul>
                    {society.about.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Counters Section */}
      <section className="container">
        <div className="stats-section scroll-reveal zoom-in">
          <div className="stats-grid">
            <div className="stat-item">
              <AnimatedCounter target={society.stats.members} />
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-item">
              <AnimatedCounter target={society.stats.events} />
              <span className="stat-label">Events Hosted</span>
            </div>
            <div className="stat-item">
              <AnimatedCounter target={society.stats.awards} />
              <span className="stat-label">Awards Won</span>
            </div>
            <div className="stat-item">
              <AnimatedCounter target={society.stats.projects} />
              <span className="stat-label">Projects Guided</span>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Committee Section */}
      <section className="society-section alt-bg">
        <div className="container">
          <h2 className="committee-section-title font-serif scroll-reveal fade-up">Executive Committee</h2>
          <p className="committee-section-subtitle scroll-reveal fade-up">Steering engineering expertise and leadership across {society.name}</p>

          <div className="committee-hierarchy-container">
            
            {/* Section 1: Faculty In-Charge (Top Center) */}
            <div className="faculty-advisor-row scroll-reveal fade-up">
              <div 
                className="member-premium-card faculty-advisor-card"
                onClick={() => setSelectedMember({ ...society.facultyIncharge, branch: "Faculty" })}
              >
                <div className="member-card-glow" />
                <div className="member-card-image-box">
                  <span className="member-card-badge">Faculty Advisor</span>
                  <img 
                    src={society.facultyIncharge.photo} 
                    alt={society.facultyIncharge.name} 
                    className="member-card-image"
                    loading="lazy" 
                  />
                </div>
                <div className="member-card-details">
                  <div>
                    <h3 className="member-card-name">{society.facultyIncharge.name}</h3>
                    <div className="member-card-role">{society.facultyIncharge.position}</div>
                    <div className="member-card-dept">{society.facultyIncharge.department}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--society-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                    <Mail size={13} /> Contact Coordinator
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Chairman and Vice Chairman Side-by-Side */}
            <div className="chairs-row">
              {/* Chairman */}
              <div 
                className="member-premium-card scroll-reveal slide-right"
                onClick={() => setSelectedMember({ ...society.chairman, position: "Chairman", branch: society.name })}
              >
                <div className="member-card-glow" />
                <div className="member-card-image-box">
                  <span className="member-card-badge">Chairman</span>
                  <img 
                    src={society.chairman.photo} 
                    alt={society.chairman.name} 
                    className="member-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="member-card-details">
                  <div>
                    <h3 className="member-card-name">{society.chairman.name}</h3>
                    <div className="member-card-role">Chairman</div>
                    <div className="member-card-dept">{society.chairman.department} &bull; {society.chairman.year}</div>
                  </div>
                </div>
              </div>

              {/* Vice Chairman */}
              <div 
                className="member-premium-card scroll-reveal slide-left"
                onClick={() => setSelectedMember({ ...society.viceChairman, position: "Vice Chairman", branch: society.name })}
              >
                <div className="member-card-glow" />
                <div className="member-card-image-box">
                  <span className="member-card-badge">Vice Chairman</span>
                  <img 
                    src={society.viceChairman.photo} 
                    alt={society.viceChairman.name} 
                    className="member-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="member-card-details">
                  <div>
                    <h3 className="member-card-name">{society.viceChairman.name}</h3>
                    <div className="member-card-role">Vice Chairman</div>
                    <div className="member-card-dept">{society.viceChairman.department} &bull; {society.viceChairman.year}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Office Bearers (Grid: Desktop 4, Tablet 2, Mobile 1) */}
            <div>
              <h3 className="font-serif" style={{ fontSize: '22px', textAlign: 'center', marginBottom: '24px', fontWeight: '800' }}>Office Bearers</h3>
              <div className="office-bearers-grid">
                {society.officeBearers.map((ob, idx) => (
                  <div 
                    key={idx}
                    className="member-premium-card scroll-reveal fade-up"
                    style={{ transitionDelay: `${(idx % 4) * 0.08}s` }}
                    onClick={() => setSelectedMember({ ...ob, branch: society.name })}
                  >
                    <div className="member-card-glow" />
                    <div className="member-card-image-box">
                      <span className="member-card-badge">{ob.position}</span>
                      <img 
                        src={ob.photo} 
                        alt={ob.name} 
                        className="member-card-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="member-card-details">
                      <div>
                        <h4 className="member-card-name">{ob.name}</h4>
                        <div className="member-card-role">{ob.position}</div>
                        <div className="member-card-dept">{ob.department} &bull; {ob.year}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Members (Grid: 4 per row, zoom/glow hover, social links) */}
            <div>
              <h3 className="font-serif" style={{ fontSize: '22px', textAlign: 'center', marginBottom: '24px', fontWeight: '800' }}>Committee Members</h3>
              <div className="members-grid">
                {society.members.map((mem, idx) => (
                  <div 
                    key={idx}
                    className="member-premium-card scroll-reveal fade-up"
                    style={{ transitionDelay: `${(idx % 4) * 0.08}s` }}
                    onClick={() => setSelectedMember({ ...mem, position: "Executive Member", branch: society.name })}
                  >
                    <div className="member-card-glow" />
                    <div className="member-card-image-box">
                      <img 
                        src={mem.photo} 
                        alt={mem.name} 
                        className="member-card-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="member-card-details">
                      <div>
                        <h4 className="member-card-name">{mem.name}</h4>
                        <div className="member-card-dept">{mem.department} &bull; {mem.year}</div>
                      </div>
                      
                      <div className="member-card-socials" onClick={(e) => e.stopPropagation()}>
                        <a href={mem.socials.linkedin} className="member-social-icon" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                        <a href={mem.socials.instagram} className="member-social-icon" target="_blank" rel="noreferrer" aria-label="Instagram Profile">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                        <a href={mem.socials.facebook} className="member-social-icon" target="_blank" rel="noreferrer" aria-label="Facebook Profile">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="society-section">
        <div className="container">
          <h2 className="committee-section-title font-serif scroll-reveal fade-up">Society Gallery</h2>
          <p className="committee-section-subtitle scroll-reveal fade-up">Highlights from recent workshops, symposiums, and collaborative project contests</p>

          <div className="masonry-gallery-grid scroll-reveal zoom-in">
            {society.gallery.map((img, idx) => {
              // Alternate sizes to create a masonry-style visual interest
              const isTall = idx === 1 || idx === 3;
              const isWide = idx === 2;
              
              return (
                <div 
                  key={idx}
                  className={`masonry-gallery-item ${isTall ? 'tall' : ''} ${isWide ? 'wide' : ''}`}
                  onClick={() => setLightboxImage(img)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLightboxImage(img);
                    }
                  }}
                >
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    className="masonry-gallery-image"
                    loading="lazy" 
                  />
                  <div className="masonry-gallery-overlay">
                    <p className="masonry-gallery-caption">{img.caption}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact & Enquiry Section */}
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
                      <a href={`mailto:${society.contact.email}`}>{society.contact.email}</a>
                    </div>
                  </div>

                  <div className="contact-info-row">
                    <div className="contact-icon-wrapper">
                      <Phone size={18} />
                    </div>
                    <div className="contact-info-text">
                      <h3>Telephone</h3>
                      <a href={`tel:${society.contact.phone}`}>{society.contact.phone}</a>
                    </div>
                  </div>

                  <div className="contact-info-row">
                    <div className="contact-icon-wrapper">
                      <MapPin size={18} />
                    </div>
                    <div className="contact-info-text">
                      <h3>Office Location</h3>
                      <p>{society.contact.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-social-channels">
                <h3>Connect With Us</h3>
                <div className="contact-social-row">
                  <a href={society.contact.socials.linkedin} className="contact-social-link" target="_blank" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
                  </a>
                  <a href={society.contact.socials.instagram} className="contact-social-link" target="_blank" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
                  </a>
                  <a href={society.contact.socials.ieee} className="contact-social-link" target="_blank" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> IEEE Page
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

      {/* Lightbox Modal (Gallery Preview) */}
      {lightboxImage && (
        <div 
          className="lightbox-backdrop"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close"
              onClick={() => setLightboxImage(null)}
              aria-label="Close Lightbox"
            >
              <X size={28} />
            </button>
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.caption} 
              className="lightbox-image" 
            />
            <p className="lightbox-caption">{lightboxImage.caption}</p>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div 
          className="modal-backdrop"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '620px',
              maxWidth: '90%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              border: '1px solid rgba(var(--society-primary-rgb), 0.12)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setSelectedMember(null)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={16} />
            </button>

            {/* Left Image Section */}
            <div style={{ width: '250px', minWidth: '220px', flexGrow: 1, backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img 
                src={selectedMember.photo} 
                alt={selectedMember.name} 
                style={{ width: '100%', height: '100%', minHeight: '250px', objectFit: 'cover' }} 
              />
            </div>

            {/* Right Details Section */}
            <div style={{ flexGrow: 2, flexBasis: '280px', padding: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '850', color: '#0f172a', margin: '0 0 6px 0' }}>
                {selectedMember.name}
              </h2>
              <div style={{ fontSize: '13px', fontWeight: '750', color: 'var(--society-primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                {selectedMember.position}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div>
                  <strong style={{ color: '#64748b', display: 'inline-block', width: '100px' }}>Branch:</strong>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>{selectedMember.branch}</span>
                </div>
                <div>
                  <strong style={{ color: '#64748b', display: 'inline-block', width: '100px' }}>Department:</strong>
                  <span style={{ color: '#0f172a', fontWeight: '500' }}>{selectedMember.department}</span>
                </div>
                {selectedMember.year && (
                  <div>
                    <strong style={{ color: '#64748b', display: 'inline-block', width: '100px' }}>Year:</strong>
                    <span style={{ color: '#0f172a', fontWeight: '500' }}>{selectedMember.year}</span>
                  </div>
                )}
                {selectedMember.phone && (
                  <div>
                    <strong style={{ color: '#64748b', display: 'inline-block', width: '100px' }}>Phone:</strong>
                    <a href={`tel:${selectedMember.phone}`} style={{ color: 'var(--society-primary)', fontWeight: '600', textDecoration: 'none' }}>
                      {selectedMember.phone}
                    </a>
                  </div>
                )}
                {selectedMember.email && (
                  <div>
                    <strong style={{ color: '#64748b', display: 'inline-block', width: '100px' }}>Email:</strong>
                    <a href={`mailto:${selectedMember.email}`} style={{ color: 'var(--society-primary)', fontWeight: '600', textDecoration: 'none' }}>
                      {selectedMember.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SocietyPage;
