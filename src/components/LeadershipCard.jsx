import React from 'react';

const LeadershipCard = ({ chairman, viceChairman, onChairmanClick, onViceChairmanClick }) => {
  if (!chairman || !viceChairman) return null;

  return (
    <div className="chairs-row">
      {/* Chairman */}
      <div 
        className="member-premium-card scroll-reveal slide-right"
        onClick={onChairmanClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChairmanClick();
          }
        }}
      >
        <div className="member-card-glow" />
        <div className="member-card-image-box">
          <span className="member-card-badge">Chairman</span>
          <img 
            src={chairman.photo} 
            alt={chairman.name} 
            className="member-card-image"
            loading="lazy"
          />
        </div>
        <div className="member-card-details">
          <div>
            <h3 className="member-card-name">{chairman.name}</h3>
            <div className="member-card-role">Chairman</div>
            <div className="member-card-dept">{chairman.department} &bull; {chairman.year}</div>
          </div>
        </div>
      </div>

      {/* Vice Chairman */}
      <div 
        className="member-premium-card scroll-reveal slide-left"
        onClick={onViceChairmanClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViceChairmanClick();
          }
        }}
      >
        <div className="member-card-glow" />
        <div className="member-card-image-box">
          <span className="member-card-badge">Vice Chairman</span>
          <img 
            src={viceChairman.photo} 
            alt={viceChairman.name} 
            className="member-card-image"
            loading="lazy"
          />
        </div>
        <div className="member-card-details">
          <div>
            <h3 className="member-card-name">{viceChairman.name}</h3>
            <div className="member-card-role">Vice Chairman</div>
            <div className="member-card-dept">{viceChairman.department} &bull; {viceChairman.year}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipCard;
