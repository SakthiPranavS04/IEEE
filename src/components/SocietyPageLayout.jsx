import React, { useState, useEffect } from 'react';
import { Mail, X } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import '../pages/SocietyPage.css';
import HeroSection from './HeroSection';
import SocietyOverview from './SocietyOverview';
import StatisticsSection from './StatisticsSection';
import FacultyCard from './FacultyCard';
import LeadershipCard from './LeadershipCard';
import MemberCard from './MemberCard';
import GallerySection from './GallerySection';
import ContactSection from './ContactSection';
import LoadingSkeleton from './LoadingSkeleton';

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

const SocietyPageLayout = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    if (data) {
      document.title = `IEEE KEC – ${data.name}`;
    }
  }, [data]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        const selectors = 'section, .card, .scroll-reveal, .member-premium-card, .about-info-card, .about-small-card, .stat-item, .contact-details-box, .quick-enquiry-box';
        const elementsToReveal = document.querySelectorAll(selectors);

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '0px 0px -20px 0px'
          }
        );

        elementsToReveal.forEach((el) => {
          if (!el.classList.contains('scroll-reveal')) {
            el.classList.add('scroll-reveal');
          }
          observer.observe(el);
        });
      }, 80);

      return () => clearTimeout(timer);
    }
  }, [isLoading, data]);

  if (!data) return null;

  const themeStyles = {
    '--society-primary': data.theme.primary,
    '--society-secondary': data.theme.secondary,
    '--society-primary-rgb': hexToRgb(data.theme.primary),
  };

  const repeatedMilestones = data.milestones ? (() => {
    let repeated = [...data.milestones];
    while (repeated.length < 10) {
      repeated = [...repeated, ...data.milestones];
    }
    return [...repeated, ...repeated];
  })() : [];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="society-page-container" style={themeStyles}>
      
      {/* Breadcrumb path */}
      <Breadcrumb societyName={data.name} />

      {/* Hero Banner */}
      <HeroSection 
        name={data.name}
        motto={data.motto}
        description={data.description}
        heroImage={data.heroImage}
        heroVideo={data.heroVideo}
        logoText={data.logoText || data.name.split(" ").map(w => w[0]).join("")}
      />

      {/* Milestones & Achievements Section */}
      {data.milestones && data.milestones.length > 0 && (
        <section className="society-section" style={{ paddingBottom: '30px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <h2 className="committee-section-title font-serif scroll-reveal fade-up" style={{ textAlign: 'center', marginBottom: '8px' }}>Milestones & Achievements</h2>
            <p className="committee-section-subtitle scroll-reveal fade-up" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '36px' }}>Key breakthroughs and recognition earned by our society</p>
            
            <div className="milestones-marquee-container scroll-reveal fade-up">
              <div className="milestones-marquee-track">
                {repeatedMilestones.map((ms, idx) => (
                  <div key={idx} className="milestone-marquee-card">
                    <img 
                      src={ms.image || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800'} 
                      alt={ms.title} 
                      className="milestone-card-img"
                    />
                    <div className="milestone-card-overlay">
                      {ms.date && (
                        <span className="milestone-card-badge">{ms.date}</span>
                      )}
                      <h3 className="milestone-card-title">{ms.title}</h3>
                      {ms.description && (
                        <p className="milestone-card-desc">{ms.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Overview mission/vision */}
      <SocietyOverview 
        overview={data.about.overview || data.description}
        mission={data.about.mission}
        vision={data.about.vision}
        objectives={data.about.objectives}
        tagline={data.tagline}
      />

      {/* Statistics Section */}
      <StatisticsSection statistics={data.statistics} />

      {/* Flagship Initiatives & Focus Areas */}
      {data.initiatives && data.initiatives.length > 0 && (
        <section className="society-section">
          <div className="container">
            <h2 className="committee-section-title font-serif scroll-reveal fade-up">Flagship Initiatives</h2>
            <p className="committee-section-subtitle scroll-reveal fade-up">Pioneering technical objectives and development pathways driving our members</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginTop: '32px'
            }}>
              {data.initiatives.map((item, idx) => (
                <div
                  key={idx}
                  className="scroll-reveal fade-up"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '36px 30px',
                    border: '1px solid rgba(var(--society-primary-rgb), 0.12)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    position: 'relative',
                    overflow: 'hidden',
                    transitionDelay: `${idx * 0.08}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(var(--society-primary-rgb), 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(var(--society-primary-rgb), 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(var(--society-primary-rgb), 0.12)';
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(var(--society-primary-rgb), 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--society-primary)'
                  }}>
                    {item.icon === 'Cpu' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>}
                    {item.icon === 'Network' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/></svg>}
                    {item.icon === 'Zap' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
                    {item.icon === 'Heart' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>}
                    {item.icon === 'Code' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}
                    {item.icon === 'Globe' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                    {item.icon === 'Award' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>}
                    {item.icon === 'Users' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                    {!['Cpu', 'Network', 'Zap', 'Heart', 'Code', 'Globe', 'Award', 'Users'].includes(item.icon) && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '850', color: '#0f172a', marginBottom: '8px' }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>{item.description}</p>
                  </div>
                  {item.tag && (
                    <span style={{
                      position: 'absolute',
                      top: '36px',
                      right: '30px',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(var(--society-primary-rgb), 0.08)',
                      color: 'var(--society-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}>
                      {item.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Executive Committee Section */}
      <section className="society-section alt-bg">
        <div className="container">
          <h2 className="committee-section-title font-serif scroll-reveal fade-up">Executive Committee</h2>
          <p className="committee-section-subtitle scroll-reveal fade-up">Steering expertise and leader coordination across {data.name}</p>

          <div className="committee-hierarchy-container">
            
            {/* Section 1: Faculty In-Charge */}
            <FacultyCard 
              faculty={data.facultyIncharge} 
              onClick={() => setSelectedMember({ ...data.facultyIncharge, branch: "Faculty Advisor" })}
            />

            {/* Section 2: Chairman & Vice Chairman */}
            <LeadershipCard 
              chairman={data.chairman} 
              viceChairman={data.viceChairman}
              onChairmanClick={() => setSelectedMember({ ...data.chairman, branch: data.name })}
              onViceChairmanClick={() => setSelectedMember({ ...data.viceChairman, branch: data.name })}
            />

            {/* Section 3: Office Bearers (Grid: 4 col desktop, 2 col tablet, 1 col mobile) */}
            <div>
              <h3 className="font-serif" style={{ fontSize: '22px', textAlign: 'center', marginBottom: '24px', fontWeight: '800' }}>Office Bearers</h3>
              <div className="office-bearers-grid">
                {data.officeBearers && data.officeBearers.map((ob, idx) => (
                  <MemberCard 
                    key={idx}
                    person={ob}
                    showSocials={false}
                    animationDelay={`${(idx % 4) * 0.06}s`}
                    onClick={() => setSelectedMember({ ...ob, branch: data.name })}
                  />
                ))}
              </div>
            </div>

            {/* Section 4: Members (Grid: 4 col, zoom hover, socials reveal) */}
            <div>
              <h3 className="font-serif" style={{ fontSize: '22px', textAlign: 'center', marginBottom: '24px', fontWeight: '800' }}>Committee Members</h3>
              <div className="members-grid">
                {data.members && data.members.map((mem, idx) => (
                  <MemberCard 
                    key={idx}
                    person={{ ...mem, position: "Executive Member" }}
                    showSocials={true}
                    animationDelay={`${(idx % 4) * 0.06}s`}
                    onClick={() => setSelectedMember({ ...mem, position: "Executive Member", branch: data.name })}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection gallery={data.gallery} />

      {/* Contact Section */}
      <ContactSection contact={data.contact} />

      {/* Member Details Modal Popup */}
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

            {/* Profile image (Left) */}
            <div style={{ width: '250px', minWidth: '220px', flexGrow: 1, backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img 
                src={selectedMember.photo} 
                alt={selectedMember.name} 
                style={{ width: '100%', height: '100%', minHeight: '250px', objectFit: 'contain' }} 
              />
            </div>

            {/* Profile details (Right) */}
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
                {selectedMember.ieeeMembershipNo && (
                  <div>
                    <strong style={{ color: '#64748b', display: 'inline-block', width: '100px' }}>IEEE No:</strong>
                    <span style={{ color: '#0f172a', fontWeight: '600' }}>{selectedMember.ieeeMembershipNo}</span>
                  </div>
                )}
                {selectedMember.customFields && Object.entries(selectedMember.customFields).map(([key, val]) => {
                  if (!val) return null;
                  return (
                    <div key={key}>
                      <strong style={{ color: '#64748b', display: 'inline-block', width: '100px' }}>{key}:</strong>
                      <span style={{ color: '#0f172a', fontWeight: '500' }}>{val}</span>
                    </div>
                  );
                })}
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

export default SocietyPageLayout;
