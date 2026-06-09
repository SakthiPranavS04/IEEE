import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Phone, User, Award, Shield, BookOpen, Layers } from 'lucide-react';

// ─── Page Header ──────────────────────────────────────────────────────────────
const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
    color: '#ffffff',
    padding: '60px 0',
    textAlign: 'center',
    marginBottom: '48px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', top: '-10%', right: '-8%',
      width: '320px', height: '320px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.03)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.02)', pointerEvents: 'none'
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
  </div>
);

// ─── Section Label pill ───────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <span style={{
    padding: '4px 14px',
    backgroundColor: 'var(--accent-light)',
    color: 'var(--primary)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'inline-block',
    marginBottom: '10px'
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

// ─── Faculty Card ───────────────────────────────────────────────────────────
const FacultyCard = ({ name, position, phone, image, societyName, onClick }) => {
  const initials = name
    ? name.split(' ').filter(w => !w.includes('.')).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

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
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        borderTop: '4px solid #0a385b',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '120px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '12px 16px',
        textAlign: 'left',
        gap: '16px',
        boxSizing: 'border-box'
      }}
    >
      {/* Horizontal Landscape Profile Image (~25-30% of card width: 100px) with circular edge */}
      {image ? (
        <img 
          src={image} 
          alt={name} 
          style={{
            width: '100px', 
            height: '75px', 
            borderRadius: '16px',
            objectFit: 'contain',
            backgroundColor: '#f1f5f9',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            flexShrink: 0
          }} 
        />
      ) : (
        <div 
          style={{
            width: '100px', 
            height: '75px', 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
            color: '#ffffff',
            fontSize: '20px', 
            fontWeight: '800',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {initials || <User size={24} />}
        </div>
      )}

      {/* Text Details */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: '15px', color: '#0a385b', margin: '0 0 2px 0', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </h3>
        <div style={{
          color: '#02619a',
          fontSize: '12px', 
          fontWeight: '700',
          textTransform: 'uppercase', 
          letterSpacing: '0.5px',
          margin: '0 0 2px 0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {position}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
          IEEE: N/A
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
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        borderTop: '4px solid #02619a',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '120px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '12px 16px',
        textAlign: 'left',
        gap: '16px',
        boxSizing: 'border-box'
      }}
    >
      {/* Horizontal Landscape Profile Image (~25-30% of card width: 100px) with circular edge */}
      {student.image ? (
        <img 
          src={student.image} 
          alt={student.name} 
          style={{
            width: '100px', 
            height: '75px', 
            borderRadius: '16px',
            objectFit: 'contain',
            backgroundColor: '#f1f5f9',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            flexShrink: 0
          }} 
        />
      ) : (
        <div 
          style={{
            width: '100px', 
            height: '75px', 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
            color: '#ffffff',
            fontSize: '20px', 
            fontWeight: '800',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {initials}
        </div>
      )}

      {/* Text Details */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: '15px', color: '#0a385b', margin: '0 0 2px 0', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {student.name}
        </h3>
        <div style={{
          color: '#02619a',
          fontSize: '12px', 
          fontWeight: '700',
          textTransform: 'uppercase', 
          letterSpacing: '0.4px',
          margin: '0 0 2px 0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {student.position}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
          IEEE: {student.ieeeNumber}
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
          width: '680px',
          maxWidth: '90%',
          maxHeight: '90vh',
          backgroundColor: '#EAF6FF',
          border: '1px solid #90CAF9',
          borderRadius: '16px',
          boxShadow: '0 20px 48px rgba(25, 118, 210, 0.15)',
          overflowY: 'auto',
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
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #90CAF9',
            color: '#1976D2',
            fontSize: '20px',
            fontWeight: 'bold',
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
          &times;
        </button>

        {/* Modal Side-by-Side Flex Layout */}
        <div className="execomm-modal-layout" style={{ display: 'flex', flexDirection: 'row', width: '100%', minHeight: '360px' }}>
          {/* Left Column: Profile Image Container (Fully visible original photo, no cropping) */}
          <div className="modal-left-image-container" style={{ width: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d0e4f2', flexShrink: 0, overflow: 'hidden' }}>
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
                background: 'linear-gradient(135deg, #1976D2 0%, #90CAF9 100%)',
                color: '#ffffff',
                fontSize: '48px',
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
          <div className="modal-right-details-container" style={{ flexGrow: 1, padding: '28px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '24px', color: '#1976D2', fontWeight: '800', margin: '0 0 4px 0' }}>
              {member.name}
            </h2>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '700', 
              color: '#1976D2', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              marginBottom: '20px'
            }}>
              {member.position}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderTop: '1px solid #90CAF9',
              paddingTop: '20px',
              fontSize: '15px',
              color: '#334155'
            }}>
              <div>
                <span style={{ fontWeight: '750', color: '#1976D2', display: 'inline-block', width: '130px' }}>Branch:</span>
                <span style={{ fontWeight: '500' }}>{member.branch}</span>
              </div>
              {member.department && (
                <div>
                  <span style={{ fontWeight: '750', color: '#1976D2', display: 'inline-block', width: '130px' }}>Department:</span>
                  <span style={{ fontWeight: '500' }}>{member.department}</span>
                </div>
              )}
              <div>
                <span style={{ fontWeight: '750', color: '#1976D2', display: 'inline-block', width: '130px' }}>IEEE Number:</span>
                <span style={{ fontWeight: '600' }}>{member.ieeeNumber || 'N/A'}</span>
              </div>
              {member.year && (
                <div>
                  <span style={{ fontWeight: '750', color: '#1976D2', display: 'inline-block', width: '130px' }}>Year:</span>
                  <span style={{ fontWeight: '500' }}>{member.year} Year</span>
                </div>
              )}
              {member.phone && (
                <div>
                  <span style={{ fontWeight: '750', color: '#1976D2', display: 'inline-block', width: '130px' }}>Phone:</span>
                  <span style={{ fontWeight: '500' }}>
                    <a href={`tel:${member.phone}`} style={{ color: '#1976D2', textDecoration: 'none', fontWeight: '600' }}>
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
  const activeTab = location.pathname.includes('/students') ? 'students' : 'faculties';

  const [societies, setSocieties] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    // 1. Fallback / Default Societies
    const defaultSocieties = [
      {
        id: 1,
        name: "Computer Society (CS Society)",
        faculty1: { name: "Dr. S. Varadhaganapathy", position: "Society Chairman", phone: "+91 98427 21111" },
        faculty2: { name: "Dr. P. Natesan", position: "Society Vice Chairman", phone: "+91 98427 22222" }
      },
      {
        id: 2,
        name: "Robotics and Automation Society (RAS)",
        faculty1: { name: "Dr. R. Murugesan", position: "Society Chairman", phone: "+91 98427 23333" },
        faculty2: { name: "Mr. S. Albert Alexander", position: "Society Vice Chairman", phone: "+91 98427 24444" }
      },
      {
        id: 3,
        name: "Women in Engineering (WIE)",
        faculty1: { name: "Dr. J. Premalatha", position: "Society Chairman", phone: "+91 98427 25555" },
        faculty2: { name: "Dr. S. Kalaiselvi", position: "Society Vice Chairman", phone: "+91 98427 26666" }
      },
      {
        id: 4,
        name: "Power & Energy Society (PES)",
        faculty1: { name: "Dr. N. Nithyadevi", position: "Society Chairman", phone: "+91 98427 27777" },
        faculty2: { name: "Dr. A. Sheela", position: "Society Vice Chairman", phone: "+91 98427 28888" }
      },
      {
        id: 5,
        name: "Communications Society (ComSoc)",
        faculty1: { name: "Dr. K. Senthil Kumar", position: "Society Chairman", phone: "+91 98427 29999" },
        faculty2: { name: "Dr. G. Murugesan", position: "Society Vice Chairman", phone: "+91 98427 20000" }
      },
      {
        id: 6,
        name: "AP-S (Antennas and Propagation Society)",
        faculty1: { name: "Dr. T. Meeradevi", position: "Society Chairman", phone: "+91 98427 21122" },
        faculty2: { name: "Dr. K. Albert", position: "Society Vice Chairman", phone: "+91 98427 33344" }
      }
    ];

    // 2. Fallback / Default Students
    const defaultStudents = [
      {
        id: 1,
        name: "Abhishek M.",
        department: "Computer Science and Engineering",
        yearOfStudy: "IV",
        ieeeNumber: "92837482",
        position: "Chairman",
        society: "IEEE KEC SB"
      },
      {
        id: 2,
        name: "Sneha R.",
        department: "Electronics and Communication Engineering",
        yearOfStudy: "IV",
        ieeeNumber: "92837483",
        position: "Vice Chairman",
        society: "IEEE KEC SB"
      },
      {
        id: 3,
        name: "Karthik Raja V.",
        department: "Electrical and Electronics Engineering",
        yearOfStudy: "IV",
        ieeeNumber: "92837484",
        position: "Society Chairman",
        society: "Computer Society (CS Society)"
      },
      {
        id: 4,
        name: "Priyanka S.",
        department: "Information Technology",
        yearOfStudy: "IV",
        ieeeNumber: "92837485",
        position: "Society Vice Chairman",
        society: "Women in Engineering (WIE)"
      },
      {
        id: 5,
        name: "Harish K.",
        department: "Electronics and Instrumentation Engineering",
        yearOfStudy: "III",
        ieeeNumber: "92837486",
        position: "Additional Secretary",
        society: "IEEE KEC SB"
      },
      {
        id: 6,
        name: "Naveen S.",
        department: "Mechanical Engineering",
        yearOfStudy: "III",
        ieeeNumber: "92837487",
        position: "Joint Secretary",
        society: "IEEE KEC SB"
      },
      {
        id: 7,
        name: "Dharini P.",
        department: "Computer Science and Engineering",
        yearOfStudy: "III",
        ieeeNumber: "92837488",
        position: "Web Team Chairman",
        society: "IEEE KEC SB"
      },
      {
        id: 8,
        name: "Arun Kumar S.",
        department: "Chemical Engineering",
        yearOfStudy: "III",
        ieeeNumber: "92837489",
        position: "Event Team Chairman",
        society: "IEEE KEC SB"
      },
      {
        id: 9,
        name: "Divya K.",
        department: "Food Technology",
        yearOfStudy: "II",
        ieeeNumber: "92837490",
        position: "Office Bearer",
        society: "Women in Engineering (WIE)"
      },
      {
        id: 10,
        name: "Kavya R.",
        department: "Electronics and Communication Engineering",
        yearOfStudy: "II",
        ieeeNumber: "92837491",
        position: "Member",
        society: "Robotics and Automation Society (RAS)"
      }
    ];

    // Load from localStorage
    const storedSocieties = localStorage.getItem('ieee_execomm_societies');
    if (storedSocieties) {
      setSocieties(JSON.parse(storedSocieties));
    } else {
      localStorage.setItem('ieee_execomm_societies', JSON.stringify(defaultSocieties));
      setSocieties(defaultSocieties);
    }

    const storedStudents = localStorage.getItem('ieee_execomm_students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      localStorage.setItem('ieee_execomm_students', JSON.stringify(defaultStudents));
      setStudents(defaultStudents);
    }
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

  const handleTabClick = (tabId) => {
    navigate(`/execomm/${tabId}`);
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px' }}>
      <PageHeader
        title="Executive Committee"
        subtitle="Meet the professional advisors and student leaders steering the IEEE KEC Student Branch"
      />

      {/* Tab Switcher */}
      <div className="container">
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '12px',
          marginBottom: '50px', flexWrap: 'wrap'
        }}>
          <button
            onClick={() => handleTabClick('faculties')}
            style={{
              padding: '12px 30px',
              fontSize: '14px', fontWeight: '700',
              borderRadius: '30px', border: 'none', cursor: 'pointer',
              letterSpacing: '0.5px',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              backgroundColor: activeTab === 'faculties' ? '#0a385b' : '#ffffff',
              color: activeTab === 'faculties' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'faculties'
                ? '0 6px 20px rgba(10,56,91,0.22)'
                : '0 2px 8px rgba(0,0,0,0.06)',
              transform: activeTab === 'faculties' ? 'translateY(-1px)' : 'none'
            }}
          >
            Faculties
          </button>
          <button
            onClick={() => handleTabClick('students')}
            style={{
              padding: '12px 30px',
              fontSize: '14px', fontWeight: '700',
              borderRadius: '30px', border: 'none', cursor: 'pointer',
              letterSpacing: '0.5px',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              backgroundColor: activeTab === 'students' ? '#0a385b' : '#ffffff',
              color: activeTab === 'students' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'students'
                ? '0 6px 20px rgba(10,56,91,0.22)'
                : '0 2px 8px rgba(0,0,0,0.06)',
              transform: activeTab === 'students' ? 'translateY(-1px)' : 'none'
            }}
          >
            Students
          </button>
        </div>

        {/* ── FACULTIES TAB CONTENT ────────────────────────────────────── */}
        {activeTab === 'faculties' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <SectionLabel text="Advisory Board" />
              <h2 className="font-serif" style={{ fontSize: '28px', color: '#0a385b', fontWeight: '800', marginTop: '8px' }}>
                Faculty Coordinators
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
                Experienced advisors providing leadership, technical guidance, and administrative support across core IEEE societies.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {sortedSocieties.map((soc) => {
                // Determine order of faculty in-charges within the society by hierarchy
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
                      color: '#0a385b',
                      fontWeight: '800',
                      marginBottom: '24px',
                      textAlign: 'left',
                      borderBottom: '2px solid #eff6ff',
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
                      {coordList.map((fac, fIdx) => (
                        fac && fac.name ? (
                          <FacultyCard
                            key={fIdx}
                            name={fac.name}
                            position={fac.position}
                            phone={fac.phone}
                            image={fac.image}
                            societyName={soc.name}
                            onClick={() => setSelectedMember({
                              name: fac.name,
                              position: fac.position,
                              phone: fac.phone,
                              image: fac.image,
                              branch: soc.name,
                              type: 'Faculty'
                            })}
                          />
                        ) : null
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STUDENTS TAB CONTENT ─────────────────────────────────────── */}
        {activeTab === 'students' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <SectionLabel text="Student Leadership" />
              <h2 className="font-serif" style={{ fontSize: '28px', color: '#0a385b', fontWeight: '800', marginTop: '8px' }}>
                Student Office Bearers
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
                Active student coordinators managing chapter operations, workshops, project expos, and community outreach.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {sortedStudents.map((stud) => (
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
                    type: 'Student'
                  })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Portal/Conditional rendering */}
        {selectedMember && (
          <MemberModal 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)} 
          />
        )}
      </div>

      <style>{`
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
          box-shadow: 0 8px 20px rgba(10, 56, 91, 0.1) !important;
          border-color: #90CAF9 !important;
        }
        .modal-close-btn:hover {
          background-color: #ffffff !important;
          color: #1976D2 !important;
          transform: scale(1.1);
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
      `}</style>
    </div>
  );
};

export default Execomm;
