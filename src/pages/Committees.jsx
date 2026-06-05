import React, { useState, useEffect } from 'react';
import { Target, PenTool, Cpu, Share2, Compass } from 'lucide-react';

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

const renderIcon = (name) => {
  switch (name) {
    case 'Technical Committee': return <Cpu size={28} style={{ color: 'var(--secondary)' }} />;
    case 'Editorial & Content Committee': return <PenTool size={28} style={{ color: 'var(--secondary)' }} />;
    case 'Creative & Design Committee': return <Target size={28} style={{ color: 'var(--secondary)' }} />;
    case 'Public Relations & Publicity Committee': return <Share2 size={28} style={{ color: 'var(--secondary)' }} />;
    default: return <Compass size={28} style={{ color: 'var(--secondary)' }} />;
  }
};

const Committees = () => {
  const [opCommittees, setOpCommittees] = useState([]);

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
  }, []);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
      <PageHeader
        title="Operational Committees"
        subtitle="The dedicated volunteer groups running daily operations at KEC IEEE SB"
      />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '30px'
        }}>
          {opCommittees.map((comm) => (
            <div key={comm.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {renderIcon(comm.name)}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{comm.name}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
                  {comm.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                  <strong>Committee Lead:</strong> <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>{comm.lead}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                  <strong>Co-Lead:</strong> <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>{comm.coLead}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Active Members: <strong>{comm.teamCount} Volunteers</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Committees;
