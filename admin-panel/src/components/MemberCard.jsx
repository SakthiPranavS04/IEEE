import React from 'react';

const MemberCard = ({ person, showSocials = false, onClick, animationDelay = "0s" }) => {
  if (!person) return null;

  return (
    <div 
      className="member-premium-card scroll-reveal fade-up"
      style={{ transitionDelay: animationDelay }}
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
        {person.position && <span className="member-card-badge">{person.position}</span>}
        <img 
          src={person.photo} 
          alt={person.name} 
          className="member-card-image"
          loading="lazy"
        />
      </div>
      <div className="member-card-details">
        <div>
          <h4 className="member-card-name">{person.name}</h4>
          <div className="member-card-dept">{person.department} &bull; {person.year}</div>
        </div>
        
        {showSocials && person.socials && (
          <div className="member-card-socials" onClick={(e) => e.stopPropagation()}>
            <a href={person.socials.linkedin || "#"} className="member-social-icon" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href={person.socials.instagram || "#"} className="member-social-icon" target="_blank" rel="noreferrer" aria-label="Instagram Profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href={person.socials.facebook || "#"} className="member-social-icon" target="_blank" rel="noreferrer" aria-label="Facebook Profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
