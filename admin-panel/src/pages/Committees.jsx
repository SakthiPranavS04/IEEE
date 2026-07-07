import React, { useState, useEffect } from 'react';
import { Target, PenTool, Cpu, Share2, Compass } from 'lucide-react';
import { settingsService } from '../services/api';

const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'var(--gradient-primary)',
    color: '#ffffff',
    padding: '70px 0',
    textAlign: 'center',
    marginBottom: '40px',
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
      position: 'absolute',
      top: '-10%',
      right: '-10%',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.12) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute',
      bottom: '-20%',
      left: '-5%',
      width: '250px',
      height: '250px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <h1 className="font-serif" style={{ fontSize: '38px', color: '#ffffff', marginBottom: '12px', fontWeight: '800' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>}
    </div>
    {/* Decorative Wave Bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)', zIndex: 2 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,101.4,227.14,83.56,258.14,76.22,290.41,68.22,321.39,56.44Z" fill="var(--bg-light)"></path>
      </svg>
    </div>
  </div>
);

const renderIcon = (name) => {
  switch (name) {
    case 'Technical Committee': return <Cpu size={28} style={{ color: 'var(--secondary)' }} />;
    case 'Editorial & Content Committee': return <PenTool size={28} style={{ color: 'var(--accent)' }} />;
    case 'Creative & Design Committee': return <Target size={28} style={{ color: '#f59e0b' }} />;
    case 'Public Relations & Publicity Committee': return <Share2 size={28} style={{ color: 'var(--accent-cyan)' }} />;
    default: return <Compass size={28} style={{ color: 'var(--secondary)' }} />;
  }
};

const Committees = () => {
  const [opCommittees, setOpCommittees] = useState([]);
  
  const defaultPhilosophy = {
    title: "The Spirit of Volunteering",
    text: "Volunteering is at the core of IEEE's mission. At KEC, we believe that real engineering skills are forged by organizing, leading, and serving. Our committees offer students an experimental workspace to practice project management, professional communication, and group dynamics while working on real community initiatives."
  };

  const defaultCta = {
    title: "Become an Active Volunteer",
    text: "Want to lead technical events, design state-of-the-art posters, or publish our newsletters? Applications for operational roles are open to all active IEEE student members.",
    btnText: "Apply for Committee Role",
    btnLink: "https://forms.gle/mockvolunteer",
    btnMailText: "Inquire via Email",
    btnMailLink: "mailto:ieee@kongu.edu"
  };

  const [philosophy, setPhilosophy] = useState(defaultPhilosophy);
  const [cta, setCta] = useState(defaultCta);

  useEffect(() => {
    const defaultCommittees = [
      {
        id: 1,
        name: "Technical Committee",
        desc: "Manages hardware training, coding hackathons, project incubation labs, and website updates.",
        lead: "Manoj Kumar K. (Final ECE)",
        coLead: "Sandhiya R. (Third CSE)",
        teamCount: 15
      },
      {
        id: 2,
        name: "Editorial & Content Committee",
        desc: "In charge of publishing monthly newsletters, event documentations, and press releases.",
        lead: "Abirami S. (Final EEE)",
        coLead: "Gautham V. (Third IT)",
        teamCount: 10
      },
      {
        id: 3,
        name: "Creative & Design Committee",
        desc: "Handles branding assets, designing event posters, UI mockups, and video promos.",
        lead: "Sujith M. (Final Mech)",
        coLead: "Deepa N. (Third EIE)",
        teamCount: 12
      },
      {
        id: 4,
        name: "Public Relations & Publicity Committee",
        desc: "Drives student enrollment, social media marketing, and coordinates section-level announcements.",
        lead: "Vijay R. (Final ECE)",
        coLead: "Haritha P. (Third CSE)",
        teamCount: 14
      },
      {
        id: 5,
        name: "Event Management Committee",
        desc: "Manages logistics, registrations, hospitality for guests, and overall venue setup operations.",
        lead: "Arun Kumar S. (Final Chemical)",
        coLead: "Meena K. (Third EEE)",
        teamCount: 18
      }
    ];

    const storedCommittees = localStorage.getItem('ieee_operational_committees');
    if (storedCommittees) {
      setOpCommittees(JSON.parse(storedCommittees));
    } else {
      localStorage.setItem('ieee_operational_committees', JSON.stringify(defaultCommittees));
      setOpCommittees(defaultCommittees);
    }

    const storedPhilosophy = localStorage.getItem('ieee_committees_philosophy_v1');
    if (storedPhilosophy) {
      setPhilosophy(JSON.parse(storedPhilosophy));
    } else {
      localStorage.setItem('ieee_committees_philosophy_v1', JSON.stringify(defaultPhilosophy));
    }

    const storedCta = localStorage.getItem('ieee_committees_cta_v1');
    if (storedCta) {
      setCta(JSON.parse(storedCta));
    } else {
      localStorage.setItem('ieee_committees_cta_v1', JSON.stringify(defaultCta));
    }
  }, []);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px' }}>
      <PageHeader
        title="Operational Committees"
        subtitle="The dedicated volunteer groups running daily operations at KEC IEEE SB"
      />

      <div className="container">

        {/* Committees grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '30px',
          marginBottom: '56px'
        }}>
          {opCommittees.map((comm) => (
            <div key={comm.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 10px rgba(var(--secondary-rgb), 0.05)'
                  }}>
                    {renderIcon(comm.name)}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>{comm.name}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6', margin: 0 }}>
                  {comm.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                  <strong>Committee Lead:</strong> <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>{comm.lead}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                  <strong>Co-Lead:</strong> <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>{comm.coLead}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '500' }}>
                  <span>Active Members: <strong style={{ color: 'var(--primary)' }}>{comm.teamCount} Volunteers</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Volunteer Philosophy Block */}
        {philosophy && (
          <div className="card scroll-reveal fade-up" style={{
            padding: '40px 36px',
            background: 'rgba(var(--secondary-rgb), 0.03)',
            borderLeft: '4px solid var(--secondary)',
            borderRadius: '0 12px 12px 0',
            marginBottom: '56px',
            boxShadow: 'var(--shadow-sm)',
            border: 'none',
            borderLeftWidth: '4px',
            borderStyle: 'solid',
            borderColor: 'var(--secondary)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--secondary)' }}>Volunteering Spirit</span>
            <h3 style={{ fontSize: '22px', fontWeight: '850', color: 'var(--primary)', marginTop: '8px', marginBottom: '14px' }}>
              {philosophy.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              {philosophy.text}
            </p>
          </div>
        )}

        {/* Join the Team CTA */}
        {cta && (
          <div className="card scroll-reveal fade-up" style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #051a2e 100%)',
            color: '#ffffff',
            padding: '52px 36px',
            textAlign: 'center',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-premium)',
            border: 'none',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 90% 10%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
              <h2 className="font-serif" style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px', fontWeight: '800' }}>
                {cta.title}
              </h2>
              <p style={{ color: '#d0e4f2', fontSize: '14.5px', lineHeight: '1.65', marginBottom: '28px' }}>
                {cta.text}
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={cta.btnLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '700', borderRadius: '30px', textDecoration: 'none' }}>
                  {cta.btnText}
                </a>
                <a href={cta.btnMailLink} className="btn" style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '700', borderRadius: '30px', backgroundColor: 'transparent', color: '#ffffff', border: '2px solid #ffffff', textDecoration: 'none' }}>
                  {cta.btnMailText}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Committees;
