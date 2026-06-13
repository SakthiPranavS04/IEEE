import React from 'react';
import { Target, Compass, Award } from 'lucide-react';

const SocietyOverview = ({ mission, vision, objectives, overview, tagline }) => {
  return (
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
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '18px' }}>About the Society</h2>
            {overview && (typeof overview === 'string' ? overview.split('\n\n') : overview).map((p, i) => (
              <p key={i} style={{ marginBottom: '24px', color: '#475569', fontSize: '15px', lineHeight: '1.75' }}>{p}</p>
            ))}

            {/* Bottom Tagline Block */}
            {tagline && (
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
                  {tagline}
                </p>
              </div>
            )}
          </div>

          <div className="about-cards-stack">
            <div className="about-small-card scroll-reveal slide-left" style={{ animationDelay: '0.1s' }}>
              <div className="about-small-card-icon">
                <Target size={20} />
              </div>
              <div className="about-small-card-content">
                <h3>Our Mission</h3>
                <p>{mission}</p>
              </div>
            </div>

            <div className="about-small-card scroll-reveal slide-left" style={{ animationDelay: '0.2s' }}>
              <div className="about-small-card-icon">
                <Compass size={20} />
              </div>
              <div className="about-small-card-content">
                <h3>Our Vision</h3>
                <p>{vision}</p>
              </div>
            </div>

            <div className="about-small-card scroll-reveal slide-left" style={{ animationDelay: '0.3s' }}>
              <div className="about-small-card-icon">
                <Award size={20} />
              </div>
              <div className="about-small-card-content">
                <h3>Key Objectives</h3>
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                  {objectives && objectives.map((obj, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SocietyOverview;
