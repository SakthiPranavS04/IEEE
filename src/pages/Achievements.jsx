import React from 'react';
import { Award, Trophy, Star, Sparkles } from 'lucide-react';

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

const Achievements = () => {
  const achievements = [
    {
      icon: <Trophy size={32} style={{ color: '#d4af37' }} />, // Gold Trophy
      title: "Best Student Branch Award 2025",
      category: "Section-level Recognition",
      desc: "Recognized as the 'Most Active Student Branch' under the IEEE Madras Section for executing 70+ technical events, community drives, and registering 400+ members in 2025."
    },
    {
      icon: <Award size={32} style={{ color: '#c0c0c0' }} />, // Silver Medal
      title: "First Prize - Anna University Project Expo",
      category: "Student Accomplishment",
      desc: "A team of IEEE KEC final year students won the 1st prize of ₹50,000 for their prototype 'Smart Assistive Glove for Quadriplegic Patients' sponsored by IEEE SPS & KEC SRC."
    },
    {
      icon: <Star size={32} style={{ color: 'var(--secondary)' }} />,
      title: "IEEE SPS Travel Grant Recipient",
      category: "Global Travel Grant",
      desc: "SPS Student Chair Karthik Raja was awarded a full travel and accommodation grant to present his research on edge voice filtering at IEEE ICASSP 2025 in Seoul, South Korea."
    },
    {
      icon: <Sparkles size={32} style={{ color: '#b87333' }} />, // Bronze Sparkle
      title: "Outstanding Student Volunteer Award",
      category: "Individual Recognition",
      desc: "Student Branch Chair Abhishek M. received the Outstanding Volunteer Award from the IEEE Madras Section for his leadership in hosting E-Waste awareness campaigns across Erode."
    }
  ];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
      <PageHeader
        title="Student & Branch Achievements"
        subtitle="Celebrating technical excellence, research grants, and section-level laurels"
      />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {achievements.map((ach, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {ach.icon}
              </div>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {ach.category}
                </span>
                <h3 style={{ fontSize: '18px', color: 'var(--primary)', margin: '8px 0 12px' }}>{ach.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
