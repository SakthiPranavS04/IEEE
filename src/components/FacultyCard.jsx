import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Linkedin = ({ size = 16, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const getContactInfo = (name, phoneProp, emailProp, linkedinProp) => {
  const cleanName = name ? name.replace(/Dr\.\s*/g, '').trim() : '';
  const emailName = cleanName.toLowerCase().split(' ').filter(Boolean).join('.');
  const linkedinName = cleanName.toLowerCase().split(' ').filter(Boolean).join('-');
  
  return {
    phone: phoneProp || "+91 99999 99999",
    email: emailProp || `${emailName}@kongu.edu`,
    linkedin: linkedinProp || `https://linkedin.com/in/${linkedinName}`
  };
};

const FacultyCard = ({ faculty, onClick }) => {
  if (!faculty) return null;

  const contact = getContactInfo(faculty.name, faculty.phone, faculty.email, faculty.linkedin);

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
        <div className="member-card-details" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div>
            <h3 className="member-card-name">{faculty.name}</h3>
            <div className="member-card-role">{faculty.position}</div>
            <div className="member-card-dept">{faculty.department}</div>
          </div>
          
          <div style={{
            display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center',
            borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <a
              href={`tel:${contact.phone}`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(79, 70, 229, 0.08)',
                color: 'var(--society-primary, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(79, 70, 229, 0.15)'
              }}
              title={`Call ${faculty.name}`}
              className="roster-contact-icon-btn"
            >
              <Phone size={14} />
            </a>
            <a
              href={`mailto:${contact.email}`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                color: 'var(--society-primary, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(6, 182, 212, 0.15)'
              }}
              title={`Email ${faculty.name}`}
              className="roster-contact-icon-btn"
            >
              <Mail size={14} />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(14, 118, 168, 0.08)',
                color: '#0e76a8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(14, 118, 168, 0.15)'
              }}
              title={`Connect with ${faculty.name} on LinkedIn`}
              className="roster-contact-icon-btn"
            >
              <Linkedin size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
