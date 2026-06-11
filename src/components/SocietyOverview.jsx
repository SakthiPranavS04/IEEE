import React from 'react';
import { Target, Compass, Award } from 'lucide-react';

const SocietyOverview = ({ mission, vision, objectives, overview }) => {
  return (
    <section className="society-section">
      <div className="container">
        <div className="about-section-grid">
          
          <div className="about-info-card scroll-reveal fade-up">
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
              marginBottom: '12px'
            }}>
              Overview
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '18px' }}>About the Society</h2>
            {overview && (typeof overview === 'string' ? overview.split('\n\n') : overview).map((p, i) => (
              <p key={i} style={{ marginBottom: '16px', color: '#475569', fontSize: '15px', lineHeight: '1.75' }}>{p}</p>
            ))}
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
