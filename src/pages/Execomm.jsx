import React, { useState } from 'react';
import { Mail, Users, Award, BookOpen } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
    color: '#ffffff',
    padding: '50px 0',
    textAlign: 'center',
    marginBottom: '40px'
  }}>
    <div className="container">
      <h1 className="font-serif" style={{ fontSize: '32px', color: '#ffffff', marginBottom: '8px' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '15px', color: '#d0e4f2' }}>{subtitle}</p>}
    </div>
  </div>
);

const Execomm = () => {
  const [activeSub, setActiveSub] = useState('main'); // 'main' | 'sps' | 'wie'

  const counselor = {
    name: "Dr. A. Sheela",
    role: "IEEE KEC Student Branch Counselor",
    college: "Kongu Engineering College",
    desc: "Professor & Head, Department of Electrical & Electronics Engineering. Dr. Sheela guides the overall strategic direction of the IEEE Student Branch and operational societies.",
    email: "sheela.eee@kongu.ac.in",
    linkedin: "https://linkedin.com"
  };

  const mainOfficeBearers = [
    {
      name: "Abhishek M.",
      role: "Student Branch Chair",
      desc: "Steers KEC Student Branch activities, ensuring technical exposure and volunteer training for all members.",
      email: "abhishek.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Sneha R.",
      role: "Student Branch Vice Chair",
      desc: "Coordinates inter-departmental collaborations and manages event execution operations.",
      email: "sneha.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Harish K.",
      role: "Student Secretary",
      desc: "Manages correspondence, documents meetings, and oversees the branch documentation archive.",
      email: "harish.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Naveen S.",
      role: "Student Treasurer",
      desc: "Handles financial planning, seed funding requests, and audits event budgets.",
      email: "naveen.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Dharini P.",
      role: "Student Webmaster",
      desc: "Maintains digital branch platforms, handles portals, and manages online publications.",
      email: "dharini.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    }
  ];

  const spsOfficeBearers = [
    {
      name: "Karthik Raja V.",
      role: "SPS Student Chapter Chair",
      desc: "Organizes training programs and lectures on digital signal, speech, and image processing.",
      email: "karthik.sps@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Priyanka S.",
      role: "SPS Vice Chair",
      desc: "Coordinates labs and design reviews for signal processing projects under KEC SRC.",
      email: "priyanka.sps@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Anand M.",
      role: "SPS Secretary",
      desc: "Handles documentation and communication for all Signal Processing Society events.",
      email: "anand.sps@kec.ac.in",
      linkedin: "https://linkedin.com"
    }
  ];

  const wieOfficeBearers = [
    {
      name: "Shruthi G.",
      role: "WIE Affinity Group Chair",
      desc: "Leads mentorship and development programs for female students, promoting STEM pathways.",
      email: "shruthi.wie@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Divya K.",
      role: "WIE Vice Chair",
      desc: "Coordinates programming workshops, leadership meetups, and community coding sessions.",
      email: "divya.wie@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      name: "Kavya R.",
      role: "WIE Secretary",
      desc: "Maintains student branch WIE records and manages publicity for gender empowerment events.",
      email: "kavya.wie@kec.ac.in",
      linkedin: "https://linkedin.com"
    }
  ];

  const getCommitteeList = () => {
    switch (activeSub) {
      case 'sps': return spsOfficeBearers;
      case 'wie': return wieOfficeBearers;
      default: return mainOfficeBearers;
    }
  };

  // Reusable Member Card
  const MemberCard = ({ member, isLarge = false }) => (
    <div className="card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: isLarge ? '40px' : '28px',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* CSS-drawn Avatar placeholder */}
        <div style={{
          width: isLarge ? '120px' : '90px',
          height: isLarge ? '120px' : '90px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-light)',
          color: 'var(--primary)',
          fontSize: isLarge ? '36px' : '28px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)',
          border: '3px solid #ffffff'
        }}>
          {member.name.charAt(0)}
        </div>
        <h3 style={{ fontSize: isLarge ? '22px' : '18px', color: 'var(--primary)', marginBottom: '4px' }}>{member.name}</h3>
        <div style={{
          fontSize: '13px',
          fontWeight: '700',
          color: 'var(--secondary)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px'
        }}>
          {member.role}
        </div>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          marginBottom: '24px',
          maxWidth: '300px'
        }}>
          {member.desc}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <a href={`mailto:${member.email}`} style={{ color: 'var(--text-muted)' }} className="social-link-hover">
          <Mail size={18} />
        </a>
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }} className="social-link-hover">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
      <PageHeader
        title="Executive Committee (Execomm)"
        subtitle="Meet the student leaders and faculty counselors guiding KEC IEEE SB"
      />

      {/* Faculty Advisor Section */}
      <div className="container" style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '26px' }}>Branch counselor</h2>
        </div>
        <div style={{ maxWidth: '600px', marginInline: 'auto' }}>
          <MemberCard member={counselor} isLarge={true} />
        </div>
      </div>

      {/* Switch Tabs for Societies */}
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '48px', flexWrap: 'wrap' }}>
          {[
            { id: 'main', label: 'IEEE KEC SB Officers' },
            { id: 'sps', label: 'Signal Processing Society (SPS)' },
            { id: 'wie', label: 'Women in Engineering (WIE)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSub(tab.id)}
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeSub === tab.id ? 'var(--primary)' : '#ffffff',
                color: activeSub === tab.id ? '#ffffff' : 'var(--text-muted)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Committee list grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {getCommitteeList().map((member, idx) => (
            <div key={idx}>
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .social-link-hover {
          transition: var(--transition-fast);
        }
        .social-link-hover:hover {
          color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
};

export default Execomm;
