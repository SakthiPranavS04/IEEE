import React from 'react';
import { Mail } from 'lucide-react';

const FacultyCard = ({ faculty, onClick }) => {
  if (!faculty) return null;

  return (
    <div className="faculty-advisor-row scroll-reveal fade-up">
      <div 
        className="member-premium-card faculty-advisor-card"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className="member-card-glow" />
        <div className="member-card-image-box">
          <span className="member-card-badge">Faculty Advisor</span>
          <img 
            src={faculty.photo} 
            alt={faculty.name} 
            className="member-card-image"
            loading="lazy" 
          />
        </div>
        <div className="member-card-details">
          <div>
            <h3 className="member-card-name">{faculty.name}</h3>
            <div className="member-card-role">{faculty.position}</div>
            <div className="member-card-dept">{faculty.department}</div>
          </div>
          <div style={{ 
            fontSize: '13px', 
            color: 'var(--society-primary)', 
            fontWeight: '600', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            marginTop: '10px' 
          }}>
            <Mail size={13} /> Contact Advisor
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
