import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Users, Phone, User, Award, Shield, BookOpen, Layers, X, Mail } from 'lucide-react';

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

// ─── Page Header ──────────────────────────────────────────────────────────────
const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'var(--gradient-primary)',
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
        <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '580px', margin: '0 auto' }}>
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

// ─── Section Label pill ───────────────────────────────────────────────────────
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

// Helper for sorting levels
const getHierarchyLevel = (position) => {
  const pos = (position || '').toLowerCase().trim();
  if (pos === 'chairman' || pos === 'vice chairman' || pos === 'student branch chair' || pos === 'student branch vice chair') return 1;
  if (pos === 'society chairman' || pos === 'society vice chairman' || pos.includes('society chair') || pos.includes('society vice chair')) return 2;
  if (pos === 'additional secretary' || pos.includes('additional secretary')) return 3;
  if (pos === 'joint secretary' || pos.includes('joint secretary')) return 4;
  
  if (pos.includes('web team chairman') || pos.includes('web team vice chairman') || pos.includes('web team chair') || pos.includes('web team vice chair') ||
      pos.includes('event team chairman') || pos.includes('event team vice chairman') || pos.includes('event team chair') || pos.includes('event team vice chair') ||
      pos.includes('media team chairman') || pos.includes('media team vice chairman') || pos.includes('media team chair') || pos.includes('media team vice chair') ||
      pos.includes('committee head') || pos.includes('event head') || pos.includes('web head') || pos.includes('media head')) return 5;
      
  if (pos === 'office bearer' || pos === 'office bearers' || pos === 'executive member' || pos === 'executive members' || pos.includes('bearer') || pos.includes('executive')) return 6;
  
  return 7; // members / default
};

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

// ─── Faculty Card ───────────────────────────────────────────────────────────
const FacultyCard = ({ name, position, phone, email, linkedin, image, societyName, onClick }) => {
  const initials = name
    ? name.split(' ').filter(w => !w.includes('.')).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const contact = getContactInfo(name, phone, email, linkedin);

  return (
    <div 
      className="card faculty-card execomm-clickable-card" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Rectangular Image Banner */}
      {image ? (
        <img 
          src={image} 
          alt={name} 
          style={{
            width: '100%', 
            height: '280px', 
            objectFit: 'cover',
            objectPosition: 'top',
            backgroundColor: '#f1f5f9'
          }} 
        />
      ) : (
        <div 
          style={{
            width: '100%', 
            height: '280px', 
            background: 'var(--gradient-cyber)',
            color: '#ffffff',
            fontSize: '40px', 
            fontWeight: '800',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          {initials}
        </div>
      )}

      {/* Details Container */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          backgroundColor: '#eff6ff', color: '#1e40af',
          padding: '3px 10px', borderRadius: '20px',
          fontSize: '10px', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '0.5px',
          marginBottom: '6px',
          alignSelf: 'flex-start'
        }}>
          Faculty Coordinator
        </div>

        <h3 style={{ fontSize: '17px', color: 'var(--primary)', margin: '0 0 2px 0', fontWeight: '800', lineHeight: '1.4' }}>
          {name}
        </h3>
        <div style={{
          color: 'var(--secondary)',
          fontSize: '12px', 
          fontWeight: '700',
          textTransform: 'uppercase', 
          letterSpacing: '0.8px',
          lineHeight: '1.4',
          marginBottom: '12px'
        }}>
          {position}
        </div>

        <div style={{
          display: 'flex', gap: '16px', width: '100%', justifyContent: 'center', alignItems: 'center',
          borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
        >
          <a
            href={`tel:${contact.phone}`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(var(--secondary-rgb), 0.15)'
            }}
            title={`Call ${name}`}
            className="roster-contact-icon-btn"
          >
            <Phone size={16} />
          </a>
          <a
            href={`mailto:${contact.email}`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(6, 182, 212, 0.15)'
            }}
            title={`Email ${name}`}
            className="roster-contact-icon-btn"
          >
            <Mail size={16} />
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(14, 118, 168, 0.08)',
              color: '#0e76a8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(14, 118, 168, 0.15)'
            }}
            title={`Connect with ${name} on LinkedIn`}
            className="roster-contact-icon-btn"
          >
            <Linkedin size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Student Card ───────────────────────────────────────────────────────────
const StudentCard = ({ student, onClick }) => {
  const initials = student.name
    ? student.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const contact = getContactInfo(student.name, student.phone, student.email, student.linkedin);

  return (
    <div 
      className="card student-card execomm-clickable-card" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {student.image ? (
        <img 
          src={student.image} 
          alt={student.name} 
          style={{
            width: '100%', 
            height: '260px', 
            objectFit: 'cover',
            objectPosition: 'top',
            backgroundColor: '#f1f5f9'
          }} 
        />
      ) : (
        <div 
          style={{
            width: '100%', 
            height: '260px', 
            background: 'var(--gradient-colorful)',
            color: '#ffffff',
            fontSize: '40px', 
            fontWeight: '800',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          {initials}
        </div>
      )}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
        <h3 style={{ fontSize: '16px', color: 'var(--primary)', margin: '0', fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {student.name}
        </h3>
        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          color: 'var(--secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>
          {student.position}
        </span>

        {/* Contact Icons for StudentCard */}
        <div style={{
          display: 'flex', gap: '16px', width: '100%', justifyContent: 'center', alignItems: 'center',
          borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
        >
          <a
            href={`tel:${contact.phone}`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(var(--secondary-rgb), 0.15)'
            }}
            title={`Call ${student.name}`}
            className="roster-contact-icon-btn"
          >
            <Phone size={16} />
          </a>
          <a
            href={`mailto:${contact.email}`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(6, 182, 212, 0.15)'
            }}
            title={`Email ${student.name}`}
            className="roster-contact-icon-btn"
          >
            <Mail size={16} />
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(14, 118, 168, 0.08)',
              color: '#0e76a8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(14, 118, 168, 0.15)'
            }}
            title={`Connect with ${student.name} on LinkedIn`}
            className="roster-contact-icon-btn"
          >
            <Linkedin size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Component ────────────────────────────────────────────────────────
const MemberModal = ({ member, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const modalRef = React.useRef(null);
  useEffect(() => {
    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }
  }, []);

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;
    if (!modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll(
      'button, [href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  };

  const initials = member.name
    ? member.name.split(' ').filter(w => !w.includes('.')).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div 
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleTabKey}
        style={{
          width: '650px',
          maxWidth: '90%',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-premium)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: 'none',
            color: 'var(--primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          className="modal-close-btn"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* Modal Side-by-Side Flex Layout */}
        <div className="execomm-modal-layout" style={{ display: 'flex', flexDirection: 'row', width: '100%', minHeight: '360px' }}>
          {/* Left Column: Profile Image Container */}
          <div className="modal-left-image-container" style={{ width: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'var(--gradient-colorful)',
                color: '#ffffff',
                fontSize: '110px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {initials}
              </div>
            )}
          </div>

          {/* Right Column: Details Section */}
          <div className="modal-right-details-container" style={{ flexGrow: 1, padding: '36px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: '700', margin: '0 0 4px 0' }}>
              {member.name}
            </h2>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '700', 
              color: 'var(--primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px'
            }}>
              {member.position}
            </div>

            <div style={{ borderBottom: '1px solid #e2e8f0', margin: '16px 0 24px 0' }} />

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontSize: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <span style={{ fontWeight: '700', color: 'var(--primary)', width: '130px', flexShrink: 0 }}>Branch:</span>
                <span style={{ fontWeight: '500', color: '#334155' }}>{member.branch}</span>
              </div>
              {member.department && (
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <span style={{ fontWeight: '700', color: 'var(--primary)', width: '130px', flexShrink: 0 }}>Department:</span>
                  <span style={{ fontWeight: '500', color: '#334155' }}>{member.department}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <span style={{ fontWeight: '700', color: 'var(--primary)', width: '130px', flexShrink: 0 }}>IEEE Number:</span>
                <span style={{ fontWeight: '500', color: '#334155' }}>{member.ieeeNumber || 'N/A'}</span>
              </div>
              {member.year && (
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <span style={{ fontWeight: '700', color: 'var(--primary)', width: '130px', flexShrink: 0 }}>Year:</span>
                  <span style={{ fontWeight: '500', color: '#334155' }}>{member.year} Year</span>
                </div>
              )}
              {member.phone && (
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <span style={{ fontWeight: '700', color: 'var(--primary)', width: '130px', flexShrink: 0 }}>Phone:</span>
                  <span style={{ fontWeight: '500', color: '#334155' }}>
                    <a href={`tel:${member.phone}`} style={{ color: '#334155', textDecoration: 'none', fontWeight: '500' }}>
                      {member.phone}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Execomm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (path) => {
    if (path.includes('/students')) {
      return 'students';
    }
    return 'faculties';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'students') {
      navigate('/execomm/students');
    } else {
      navigate('/execomm/faculties');
    }
  };

  const [societies, setSocieties] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API}/team`);
        if (res.ok) {
          const data = await res.json();
          
          // Process Students
          const studentsData = data.filter(m => m.type === 'Student').map(m => ({
            id: m._id,
            name: m.name,
            position: m.role || 'Member',
            society: m.category || 'IEEE KEC SB',
            image: m.image,
            linkedin: m.linkedin,
            department: m.department || '',
            yearOfStudy: m.year || '',
            ieeeNumber: m.ieeeNumber || '',
            phone: m.phone || '',
            email: m.email || ''
          }));
          setStudents(studentsData);

          // Process Faculties into Societies
          const facultiesData = data.filter(m => m.type === 'Faculty');
          const societiesMap = {};
          
          facultiesData.forEach(fac => {
            if (!societiesMap[fac.category]) {
              societiesMap[fac.category] = {
                id: fac.category,
                name: fac.category,
                faculties: []
              };
            }
            societiesMap[fac.category].faculties.push({
              name: fac.name,
              position: fac.role,
              phone: fac.phone,
              email: fac.email,
              linkedin: fac.linkedin,
              image: fac.image,
              order: fac.order || 0
            });
          });
          
          const loadedSocieties = Object.values(societiesMap).map((soc, idx) => {
            soc.faculties.sort((a, b) => a.order - b.order);
            return {
              id: idx + 1,
              name: soc.name,
              faculty1: soc.faculties[0] || null,
              faculty2: soc.faculties[1] || null
            };
          });
          
          setSocieties(loadedSocieties);
        }
      } catch(err) {
        console.error("Failed to fetch team data", err);
      }
    };
    
    fetchTeam();
  }, []);

  // Sort societies according to requested order
  const societyOrderMap = {
    "computer society (cs society)": 1,
    "robotics and automation society (ras)": 2,
    "women in engineering (wie)": 3,
    "power & energy society (pes)": 4,
    "communications society (comsoc)": 5,
    "antennas and propagation society (ap-s)": 6,
    "ap-s (antennas and propagation society)": 6
  };

  const getSocietySortOrder = (name) => {
    const norm = (name || '').toLowerCase().trim();
    return societyOrderMap[norm] || 99; // append unknown to the end
  };

  const sortedSocieties = [...societies].sort((a, b) => {
    return getSocietySortOrder(a.name) - getSocietySortOrder(b.name);
  });

  // Sort students according to KEC SB hierarchy
  const sortedStudents = [...students].sort((a, b) => {
    const diff = getHierarchyLevel(a.position) - getHierarchyLevel(b.position);
    if (diff !== 0) return diff;
    // Alphabetical secondary sort
    return (a.name || '').localeCompare(b.name || '');
  });

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px' }}>
      <PageHeader
        title="Executive Committee"
        subtitle="Meet the professional advisors and student leaders steering the IEEE KEC Student Branch"
      />

      {/* ExeComm Tabs Navigation */}
      <div className="container" style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(var(--secondary-rgb), 0.05)',
            border: '1px solid rgba(var(--secondary-rgb), 0.15)',
            borderRadius: '30px',
            padding: '6px',
            boxShadow: 'var(--shadow-sm)',
            backdropFilter: 'blur(10px)',
          }}>
            <button
              onClick={() => handleTabChange('faculties')}
              className={`execomm-tab-button ${activeTab === 'faculties' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '24px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
              }}
            >
              <Award size={16} /> Faculty Coordinators
            </button>
            <button
              onClick={() => handleTabChange('students')}
              className={`execomm-tab-button ${activeTab === 'students' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '24px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
              }}
            >
              <Shield size={16} /> Student Office Bearers
            </button>
          </div>
        </div>
      </div>

      {/* ExeComm Content Container */}
      <div className="container">
        <div key={activeTab} className="animate-fade-in">
          {activeTab === 'faculties' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <SectionLabel text="Advisory Board" />
                <h2 className="font-serif" style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: '800', marginTop: '8px' }}>
                  Faculty Coordinators
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
                  Experienced advisors providing leadership, technical guidance, and administrative support across core IEEE societies.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {sortedSocieties.map((soc) => {
                  const fac1Level = getHierarchyLevel(soc.faculty1?.position);
                  const fac2Level = getHierarchyLevel(soc.faculty2?.position);
                  
                  const showFac1First = fac1Level <= fac2Level;
                  const coordList = showFac1First
                    ? [soc.faculty1, soc.faculty2]
                    : [soc.faculty2, soc.faculty1];

                  return (
                    <div key={soc.id} style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '32px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}>
                      <h3 style={{
                        fontSize: '20px',
                        color: 'var(--primary)',
                        fontWeight: '800',
                        marginBottom: '24px',
                        textAlign: 'left',
                        borderBottom: '2px solid var(--border-subtle)',
                        paddingBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{ fontSize: '24px' }}>🏫</span> {soc.name}
                      </h3>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px'
                      }}>
                        {coordList.map((fac, fIdx) => {
                          if (!fac || !fac.name) return null;
                          const contact = getContactInfo(fac.name, fac.phone, fac.email, fac.linkedin);
                          return (
                            <FacultyCard
                              key={fIdx}
                              name={fac.name}
                              position={fac.position}
                              phone={fac.phone}
                              email={contact.email}
                              linkedin={contact.linkedin}
                              image={fac.image}
                              societyName={soc.name}
                              onClick={() => setSelectedMember({
                                name: fac.name,
                                position: fac.position,
                                phone: contact.phone,
                                email: contact.email,
                                linkedin: contact.linkedin,
                                image: fac.image,
                                branch: soc.name,
                                type: 'Faculty'
                              })}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'students' && (() => {
            const HIERARCHY_LEVEL_LABELS = {
              1: "Student Branch Chairpersons",
              2: "Society Chairpersons",
              3: "Additional Secretaries",
              4: "Joint Secretaries",
              5: "Committee Heads",
              6: "Executive Members",
              7: "Student Members"
            };
            const levels = [1, 2, 3, 4, 5, 6, 7];
            
            return (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <SectionLabel text="Student Leadership" />
                  <h2 className="font-serif" style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: '800', marginTop: '8px' }}>
                    Student Office Bearers
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
                    Active student coordinators managing chapter operations, workshops, project expos, and community outreach.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                  {levels.map(level => {
                    const levelStudents = sortedStudents.filter(stud => getHierarchyLevel(stud.position) === level);
                    if (levelStudents.length === 0) return null;

                    return (
                      <div key={level} style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '32px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                      }}>
                        <h3 style={{
                          fontSize: '20px',
                          color: 'var(--primary)',
                          fontWeight: '800',
                          marginBottom: '24px',
                          textAlign: 'left',
                          borderBottom: '2px solid var(--border-subtle)',
                          paddingBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <span style={{ fontSize: '24px' }}>🛡️</span> {HIERARCHY_LEVEL_LABELS[level]}
                        </h3>
                        
                        <div className="execomm-students-grid" style={{
                          display: 'grid',
                          gap: '24px'
                        }}>
                           {levelStudents.map((stud) => {
                            const contact = getContactInfo(stud.name, stud.phone, stud.email, stud.linkedin);
                            return (
                              <StudentCard 
                                key={stud.id} 
                                student={stud} 
                                onClick={() => setSelectedMember({
                                  name: stud.name,
                                  position: stud.position,
                                  branch: stud.society || 'IEEE KEC SB',
                                  department: stud.department,
                                  ieeeNumber: stud.ieeeNumber,
                                  year: stud.yearOfStudy,
                                  image: stud.image,
                                  phone: contact.phone,
                                  email: contact.email,
                                  linkedin: contact.linkedin,
                                  type: 'Student'
                                })}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Modal Portal/Conditional rendering */}
        {selectedMember && (
          <MemberModal 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)} 
          />
        )}
      </div>

      <style>{`
        .execomm-tab-button {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .execomm-tab-button:hover {
          color: var(--secondary) !important;
          background-color: rgba(255, 255, 255, 0.5) !important;
        }
        .execomm-tab-button.active {
          background-color: #ffffff !important;
          color: var(--secondary) !important;
          box-shadow: 0 4px 12px rgba(var(--secondary-rgb), 0.12) !important;
        }
        .execomm-students-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 1024px) {
          .execomm-students-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .execomm-students-grid {
            grid-template-columns: 1fr;
          }
        }
        .execomm-clickable-card {
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }
        .execomm-clickable-card:hover,
        .execomm-clickable-card:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(var(--secondary-rgb), 0.15) !important;
          border-color: var(--border-focus) !important;
        }
        .modal-close-btn {
          transition: all 0.2s ease;
        }
        .modal-close-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 600px) {
          .execomm-modal-layout {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .modal-left-image-container {
            width: 100% !important;
            height: 240px !important;
          }
          .modal-right-details-container {
            padding: 24px !important;
          }
        }
        .roster-contact-icon-btn:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          filter: brightness(0.95);
        }
      `}</style>
    </div>
  );
};

export default Execomm;
