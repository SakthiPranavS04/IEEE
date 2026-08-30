import React from 'react';
import { Link } from 'react-router-dom';
import { societiesData } from '../data/societiesData';
import { Users, Calendar, Award, Cpu, ArrowRight } from 'lucide-react';

const PageHeader = ({ title, subtitle, bgImageGrad = 'var(--gradient-primary)' }) => (
  <div style={{
    background: bgImageGrad,
    color: '#ffffff',
    padding: '70px 0',
    textAlign: 'center',
    marginBottom: '48px',
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
      background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.15) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <h1 className="font-serif" style={{ fontSize: '38px', color: '#ffffff', marginBottom: '12px', fontWeight: '800' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '600px', marginInline: 'auto' }}>
          {subtitle}
        </p>
      )}
    </div>
    {/* Decorative Wave Bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)', zIndex: 2 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,101.4,227.14,83.56,258.14,76.22,290.41,68.22,321.39,56.44Z" fill="var(--bg-light)"></path>
      </svg>
    </div>
  </div>
);

const SectionLabel = ({ text }) => (
  <span style={{
    padding: '6px 14px',
    backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
    color: 'var(--secondary)',
    border: '1px solid rgba(var(--secondary-rgb), 0.15)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '750',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'inline-block',
    marginBottom: '12px'
  }}>
    {text}
  </span>
);

const SocietiesPage = () => {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px' }}>
      <PageHeader 
        title="IEEE Technical Societies & Affinity Groups" 
        subtitle="Specialized engineering chapters and affinity groups providing direct paths to global technology innovation, professional links, and technical design excellence." 
      />

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <SectionLabel text="Our Chapters" />
          <h2 className="font-serif" style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
            Explore Specialized Technical Domains
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '650px', margin: '12px auto 0', lineHeight: '1.6' }}>
            KEC IEEE features 6 specialized organizational units, each focusing on a distinct technical or volunteer track. Explore our chapters below to find your fit.
          </p>
        </div>

        {/* Societies Grid */}
        <div className="societies-grid">
          {Object.keys(societiesData).map((key) => {
            const society = societiesData[key];
            const primaryColor = society.theme?.primary || 'var(--secondary)';
            return (
              <div key={key} className="card society-list-card scroll-reveal fade-up" style={{ 
                borderTop: `4px solid ${primaryColor}`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {/* Hero Image Container */}
                <div style={{ 
                  height: '160px', 
                  overflow: 'hidden', 
                  position: 'relative',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px'
                }}>
                  <img 
                    src={society.heroImage} 
                    alt={society.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }} 
                    className="society-card-img"
                  />
                  {/* Overlay Logo/Text badge */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    left: '12px', 
                    backgroundColor: primaryColor, 
                    color: '#ffffff', 
                    padding: '4px 10px', 
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '750',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    letterSpacing: '0.5px'
                  }}>
                    {society.logoText}
                  </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.4', margin: 0 }}>
                    {society.name}
                  </h3>
                  <p style={{ fontSize: '13px', fontStyle: 'italic', color: primaryColor, fontWeight: '600', margin: 0 }}>
                    {society.tagline}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.6', margin: '4px 0 0', flexGrow: 1 }}>
                    {society.about.overview.length > 160 
                      ? `${society.about.overview.substring(0, 160)}...` 
                      : society.about.overview}
                  </p>

                  {/* Society stats */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    borderTop: '1px solid var(--border-subtle)', 
                    borderBottom: '1px solid var(--border-subtle)', 
                    padding: '12px 0',
                    margin: '12px 0 6px 0'
                  }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700' }}>
                        <Users size={12} style={{ color: primaryColor }} /> MEMBERS
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '850', color: 'var(--primary)', marginTop: '2px' }}>
                        {society.stats.members}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700' }}>
                        <Calendar size={12} style={{ color: primaryColor }} /> EVENTS
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '850', color: 'var(--primary)', marginTop: '2px' }}>
                        {society.stats.events}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700' }}>
                        <Cpu size={12} style={{ color: primaryColor }} /> PROJECTS
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '850', color: 'var(--primary)', marginTop: '2px' }}>
                        {society.stats.projects}
                      </div>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <Link 
                    to={`/execomm/${key}`}
                    className="btn-explore-chapter"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: 'transparent',
                      color: primaryColor,
                      border: `1.5px solid ${primaryColor}`,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      marginTop: '8px'
                    }}
                  >
                    Explore Chapter <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .societies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 30px;
        }
        .society-list-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
        }
        .society-list-card:hover .society-card-img {
          transform: scale(1.06);
        }
        .btn-explore-chapter:hover {
          background-color: var(--primary) !important;
          color: #ffffff !important;
          border-color: var(--primary) !important;
        }
        @media (max-width: 480px) {
          .societies-grid {
            grid-template-columns: 1fr !important;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default SocietiesPage;
