import React, { useState, useEffect } from 'react';
import { Mail, Users, Sparkles, ChevronRight } from 'lucide-react';

// Custom LinkedinIcon component since brand icons are not exported by lucide-react in version 1+
const LinkedinIcon = ({ size = 24, ...props }) => (
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

// ─── Counselor Card ───────────────────────────────────────────────────────────
const CounselorCard = ({ member }) => (
  <div className="card" style={{
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid #c3d9ea',
    borderTop: '4px solid #0a385b',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* subtle background pattern */}
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: '160px', height: '160px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(2,97,154,0.05) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />

    {/* Avatar */}
    <div style={{
      width: '110px', height: '110px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
      color: '#ffffff',
      fontSize: '38px', fontWeight: '800',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '20px',
      boxShadow: '0 8px 24px rgba(10,56,91,0.22)',
      border: '4px solid #ffffff',
      flexShrink: 0
    }}>
      {member.name ? member.name.charAt(0) : '?'}
    </div>

    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      backgroundColor: '#eff6ff', color: '#1e40af',
      padding: '4px 14px', borderRadius: '20px',
      fontSize: '11px', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: '1px',
      marginBottom: '12px'
    }}>
      <Sparkles size={10} /> Faculty Counselor
    </div>

    <h2 style={{ fontSize: '24px', color: '#0a385b', marginBottom: '4px', fontWeight: '800' }}>
      {member.name}
    </h2>
    <p style={{ fontSize: '13px', fontWeight: '700', color: '#02619a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
      {member.role}
    </p>
    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
      {member.college}
    </p>
    <p style={{
      color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.65',
      maxWidth: '520px', marginBottom: '24px'
    }}>
      {member.desc}
    </p>

    <div style={{
      display: 'flex', gap: '12px', justifyContent: 'center',
      borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', width: '100%'
    }}>
      <a
        href={`mailto:${member.email}`}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 18px', borderRadius: '8px',
          backgroundColor: '#f1f5f9', color: '#475569',
          fontSize: '13px', fontWeight: '600', textDecoration: 'none',
          border: '1px solid #e2e8f0', transition: 'all 0.2s ease'
        }}
        className="execomm-contact-btn"
      >
        <Mail size={14} /> Email
      </a>
      <a
        href={member.linkedin}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 18px', borderRadius: '8px',
          backgroundColor: '#eff6ff', color: '#1d4ed8',
          fontSize: '13px', fontWeight: '600', textDecoration: 'none',
          border: '1px solid #bfdbfe', transition: 'all 0.2s ease'
        }}
        className="execomm-contact-btn"
      >
        <LinkedinIcon size={14} />
        LinkedIn
      </a>
    </div>
  </div>
);

// ─── Member Card ──────────────────────────────────────────────────────────────
const MemberCard = ({ member }) => {
  const initials = member.name
    ? member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="card execomm-member-card" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      padding: '28px 24px',
      height: '100%',
      justifyContent: 'space-between',
      borderTop: '3px solid transparent',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
          color: '#ffffff',
          fontSize: '24px', fontWeight: '800',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: '0 4px 14px rgba(10,56,91,0.18)',
          border: '3px solid #ffffff',
          flexShrink: 0
        }}>
          {initials}
        </div>

        <h3 style={{ fontSize: '17px', color: '#0a385b', marginBottom: '4px', fontWeight: '750' }}>
          {member.name}
        </h3>
        <div style={{
          fontSize: '11px', fontWeight: '700',
          color: '#02619a',
          textTransform: 'uppercase', letterSpacing: '0.8px',
          marginBottom: '12px', lineHeight: '1.4'
        }}>
          {member.role}
        </div>
        <p style={{
          fontSize: '13px', color: 'var(--text-muted)',
          lineHeight: '1.6', marginBottom: '20px',
          maxWidth: '260px'
        }}>
          {member.desc}
        </p>
      </div>

      <div style={{
        display: 'flex', gap: '10px', width: '100%', justifyContent: 'center',
        borderTop: '1px solid var(--border-subtle)', paddingTop: '14px'
      }}>
        <a
          href={`mailto:${member.email}`}
          title={`Email ${member.name}`}
          style={{
            width: '34px', height: '34px', borderRadius: '8px',
            backgroundColor: '#f1f5f9', color: '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #e2e8f0', textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          className="execomm-icon-btn"
        >
          <Mail size={15} />
        </a>
        <a
          href={member.linkedin}
          target="_blank" rel="noopener noreferrer"
          title="LinkedIn Profile"
          style={{
            width: '34px', height: '34px', borderRadius: '8px',
            backgroundColor: '#eff6ff', color: '#1d4ed8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #bfdbfe', textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          className="execomm-icon-btn"
        >
          <LinkedinIcon size={15} />
        </a>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Execomm = () => {
  const [activeSub, setActiveSub] = useState('main');
  const [counselor, setCounselor] = useState({
    name: "Dr. A. Sheela",
    role: "IEEE KEC Student Branch Counselor",
    college: "Kongu Engineering College",
    desc: "Professor & Head, Department of Electrical & Electronics Engineering. Dr. Sheela guides the overall strategic direction of the IEEE Student Branch and operational societies.",
    email: "sheela.eee@kongu.ac.in",
    linkedin: "https://linkedin.com"
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const defaultCounselor = {
      name: "Dr. A. Sheela",
      role: "IEEE KEC Student Branch Counselor",
      college: "Kongu Engineering College",
      desc: "Professor & Head, Department of Electrical & Electronics Engineering. Dr. Sheela guides the overall strategic direction of the IEEE Student Branch and operational societies.",
      email: "sheela.eee@kongu.ac.in",
      linkedin: "https://linkedin.com"
    };

    const defaultMembers = [
      { id: 1,  name: "Abhishek M.",    role: "Student Branch Chair",       category: "main", desc: "Steers KEC Student Branch activities, ensuring technical exposure and volunteer training for all members.", email: "abhishek.ieee@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 2,  name: "Sneha R.",       role: "Student Branch Vice Chair",   category: "main", desc: "Coordinates inter-departmental collaborations and manages event execution operations.", email: "sneha.ieee@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 3,  name: "Harish K.",      role: "Student Secretary",           category: "main", desc: "Manages correspondence, documents meetings, and oversees the branch documentation archive.", email: "harish.ieee@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 4,  name: "Naveen S.",      role: "Student Treasurer",           category: "main", desc: "Handles financial planning, seed funding requests, and audits event budgets.", email: "naveen.ieee@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 5,  name: "Dharini P.",     role: "Student Webmaster",           category: "main", desc: "Maintains digital branch platforms, handles portals, and manages online publications.", email: "dharini.ieee@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 6,  name: "Karthik Raja V.", role: "SPS Student Chapter Chair",  category: "sps",  desc: "Organizes training programs and lectures on digital signal, speech, and image processing.", email: "karthik.sps@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 7,  name: "Priyanka S.",    role: "SPS Vice Chair",              category: "sps",  desc: "Coordinates labs and design reviews for signal processing projects under KEC SRC.", email: "priyanka.sps@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 8,  name: "Anand M.",       role: "SPS Secretary",               category: "sps",  desc: "Handles documentation and communication for all Signal Processing Society events.", email: "anand.sps@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 9,  name: "Shruthi G.",     role: "WIE Affinity Group Chair",    category: "wie",  desc: "Leads mentorship and development programs for female students, promoting STEM pathways.", email: "shruthi.wie@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 10, name: "Divya K.",       role: "WIE Vice Chair",              category: "wie",  desc: "Coordinates programming workshops, leadership meetups, and community coding sessions.", email: "divya.wie@kec.ac.in", linkedin: "https://linkedin.com" },
      { id: 11, name: "Kavya R.",       role: "WIE Secretary",               category: "wie",  desc: "Maintains student branch WIE records and manages publicity for gender empowerment events.", email: "kavya.wie@kec.ac.in", linkedin: "https://linkedin.com" }
    ];

    const storedCounselor = localStorage.getItem('ieee_execomm_counselor');
    setCounselor(storedCounselor ? JSON.parse(storedCounselor) : defaultCounselor);
    if (!storedCounselor) localStorage.setItem('ieee_execomm_counselor', JSON.stringify(defaultCounselor));

    const storedMembers = localStorage.getItem('ieee_execomm_members');
    setMembers(storedMembers ? JSON.parse(storedMembers) : defaultMembers);
    if (!storedMembers) localStorage.setItem('ieee_execomm_members', JSON.stringify(defaultMembers));
  }, []);

  const tabs = [
    { id: 'main', label: 'IEEE KEC SB Officers',         subtitle: 'Core Office Bearers' },
    { id: 'sps',  label: 'Signal Processing Society',    subtitle: 'SPS Chapter' },
    { id: 'wie',  label: 'Women in Engineering',         subtitle: 'WIE Group' },
  ];

  const activeMembers = members.filter(m => m.category === activeSub);
  const activeTab = tabs.find(t => t.id === activeSub);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px' }}>
      <PageHeader
        title="Executive Committee"
        subtitle="Meet the student leaders and faculty counselors steering the KEC IEEE Student Branch"
      />

      {/* ── Faculty Counselor ─────────────────────────────────────────────── */}
      <div className="container" style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <SectionLabel text="Faculty Leadership" />
          <h2 className="font-serif" style={{ fontSize: '26px', color: '#0a385b', fontWeight: '800', marginTop: '8px' }}>
            Branch Counselor
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Faculty advisor and strategic guide for the IEEE KEC Student Branch.
          </p>
        </div>
        <div style={{ maxWidth: '640px', marginInline: 'auto' }}>
          <CounselorCard member={counselor} />
        </div>
      </div>

      {/* ── Tab Switcher ──────────────────────────────────────────────────── */}
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <SectionLabel text="Student Leadership" />
          <h2 className="font-serif" style={{ fontSize: '26px', color: '#0a385b', fontWeight: '800', marginTop: '8px' }}>
            Office Bearers
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Select a society to view its respective office bearers.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '10px',
          marginBottom: '40px', flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSub(tab.id)}
              style={{
                padding: '10px 24px',
                fontSize: '13.5px', fontWeight: '700',
                borderRadius: '30px', border: 'none', cursor: 'pointer',
                letterSpacing: '0.2px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: activeSub === tab.id ? '#0a385b' : '#ffffff',
                color: activeSub === tab.id ? '#ffffff' : '#64748b',
                boxShadow: activeSub === tab.id
                  ? '0 4px 14px rgba(10,56,91,0.25)'
                  : '0 2px 6px rgba(0,0,0,0.06)',
                transform: activeSub === tab.id ? 'translateY(-1px)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '28px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <Users size={18} style={{ color: '#02619a' }} />
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#0a385b' }}>
            {activeTab?.label}
          </span>
          <ChevronRight size={16} style={{ color: '#94a3b8' }} />
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            {activeMembers.length} member{activeMembers.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Member Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {activeMembers.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      <style>{`
        .execomm-member-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 12px 28px rgba(10,56,91,0.10) !important;
          border-top-color: #02619a !important;
        }
        .execomm-icon-btn:hover {
          background-color: #0a385b !important;
          color: #ffffff !important;
          border-color: #0a385b !important;
        }
        .execomm-contact-btn:hover {
          box-shadow: 0 4px 12px rgba(10,56,91,0.15);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default Execomm;
