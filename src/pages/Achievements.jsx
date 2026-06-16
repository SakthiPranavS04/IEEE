import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, Sparkles, ArrowRight, Calendar } from 'lucide-react';

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
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%)',
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
  </div>
);

const renderIcon = (type, size = 28, color = '#ffffff') => {
  switch (type) {
    case 'trophy': return <Trophy size={size} style={{ color }} />;
    case 'award': return <Award size={size} style={{ color }} />;
    case 'star': return <Star size={size} style={{ color }} />;
    default: return <Sparkles size={size} style={{ color }} />;
  }
};

const getGradient = (index) => {
  const gradients = [
    { start: '#4f46e5', end: '#8b5cf6' }, // Indigo to Violet
    { start: '#8b5cf6', end: '#ec4899' }, // Violet to Pink
    { start: '#06b6d4', end: '#3b82f6' }, // Cyan to Blue
    { start: '#10b981', end: '#06b6d4' }, // Emerald to Cyan
    { start: '#f59e0b', end: '#ec4899' }  // Amber to Pink
  ];
  return gradients[index % gradients.length];
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const defaultAchievements = [
      {
        id: 1,
        iconType: 'trophy',
        title: "Best Student Branch Award 2025",
        category: "Section-level Recognition",
        desc: "Recognized as the 'Most Active Student Branch' under the IEEE Madras Section for executing 70+ technical events, community drives, and registering 400+ members in 2025."
      },
      {
        id: 2,
        iconType: 'award',
        title: "First Prize - Anna University Project Expo",
        category: "Student Accomplishment",
        desc: "A team of IEEE KEC final year students won the 1st prize of ₹50,000 for their prototype 'Smart Assistive Glove for Quadriplegic Patients' sponsored by IEEE SPS & KEC SRC."
      },
      {
        id: 3,
        iconType: 'star',
        title: "IEEE SPS Travel Grant Recipient",
        category: "Global Travel Grant",
        desc: "SPS Student Chair Karthik Raja was awarded a full travel and accommodation grant to present his research on edge voice filtering at IEEE ICASSP 2025 in Seoul, South Korea."
      },
      {
        id: 4,
        iconType: 'sparkles',
        title: "Outstanding Student Volunteer Award",
        category: "Individual Recognition",
        desc: "Student Branch Chair Abhishek M. received the Outstanding Volunteer Award from the IEEE Madras Section for his leadership in hosting E-Waste awareness campaigns across Erode."
      }
    ];

    const storedAchievements = localStorage.getItem('ieee_achievements');
    let loadedData = [];
    if (storedAchievements) {
      loadedData = JSON.parse(storedAchievements);
    } else {
      localStorage.setItem('ieee_achievements', JSON.stringify(defaultAchievements));
      loadedData = defaultAchievements;
    }
    setAchievements(loadedData);
    if (loadedData.length > 0) {
      setSelectedId(loadedData[0].id);
    }
  }, []);

  const defaultAchievementsStats = [
    { label: "Total Section Awards", count: "15+" },
    { label: "Global Travel Grants", count: "3" },
    { label: "Project Expo Prizes", count: "12+" },
    { label: "Indexed Research Papers", count: "25+" }
  ];

  const defaultSuccessStories = [
    {
      title: "From Perundurai to Seoul: A Research Journey",
      category: "Research Highlight",
      story: "Karthik Raja V., a final-year EEE student, developed an embedded edge AI voice filter for local speech waveforms under KEC SRC mentorship. His paper was accepted at the prestigious ICASSP 2025 conference in South Korea, earning him an IEEE travel grant. 'Volunteering at the student branch gave me exposure to global standards,' he shares.",
      media: "Featured in Erode Local Press, March 2025"
    },
    {
      title: "Smart Assistive Glove Wins First Place at Zonal Expo",
      category: "Innovation Success",
      story: "A team of 4 ECE student members designed a glove prototype with flex sensors and text-to-speech firmware to assist quadriplegic users. Backed by seed funding of ₹10,000 from KEC Student Research Cell, the prototype took 1st place among 80 competing colleges. The team is now filing an Indian utility patent.",
      media: "Featured in Daily Express, April 2025"
    }
  ];

  const [achStats, setAchStats] = useState(defaultAchievementsStats);
  const [successStories, setSuccessStories] = useState(defaultSuccessStories);

  useEffect(() => {
    const storedStats = localStorage.getItem('ieee_achievements_stats_v1');
    if (storedStats) {
      setAchStats(JSON.parse(storedStats));
    } else {
      localStorage.setItem('ieee_achievements_stats_v1', JSON.stringify(defaultAchievementsStats));
    }

    const storedStories = localStorage.getItem('ieee_success_stories_v1');
    if (storedStories) {
      setSuccessStories(JSON.parse(storedStories));
    } else {
      localStorage.setItem('ieee_success_stories_v1', JSON.stringify(defaultSuccessStories));
    }
  }, []);

  const selectedAch = achievements.find(a => a.id === selectedId) || achievements[0];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '80vh' }}>
      <PageHeader
        title="Student & Branch Achievements"
        subtitle="Celebrating technical excellence, research grants, and section-level laurels"
      />

      <div className="container">
        
        {/* SECTION 1: STAIRCASE CHART SHOWCASE */}
        {achievements.length > 0 && (
          <div className="card" style={{
            padding: '40px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '50px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{
                padding: '4px 12px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--primary)',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Interactive Timeline Chart
              </span>
              <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', marginTop: '10px' }}>Highlights of Accomplishments</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Click any tier to spotlight the achievement details below</p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '48px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              
              {/* Left Side: Elegant Trophy SVG Illustration */}
              <div style={{
                flex: '1 1 260px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '20px'
              }}>
                <div className="trophy-container" style={{ position: 'relative' }}>
                  {/* Floating sparkles behind */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    width: '100%',
                    height: '100%',
                    animation: 'spin 15s linear infinite',
                    pointerEvents: 'none',
                    opacity: 0.5
                  }}>
                    <div style={{ position: 'absolute', top: '10%', left: '10%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
                  </div>

                  <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                    filter: 'drop-shadow(0 12px 24px rgba(245, 158, 11, 0.25))',
                    animation: 'float 4s ease-in-out infinite'
                  }}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff3c4" />
                        <stop offset="35%" stopColor="#fbbf24" />
                        <stop offset="70%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#02619a" />
                        <stop offset="100%" stopColor="#0a385b" />
                      </linearGradient>
                    </defs>
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 3h12v6c0 3.314-2.686 6-6 6s-6-2.686-6-6V3Z" fill="url(#goldGradient)" />
                    <path d="M12 15v5M8 21h8" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round"/>
                    {/* Star detail inside trophy */}
                    <path d="M12 6.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3.9-1.8z" fill="#ffffff" />
                  </svg>
                </div>
                <div style={{
                  marginTop: '16px',
                  textAlign: 'center',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  fontSize: '15px'
                }}>
                  Hall of Laurels
                </div>
              </div>

              {/* Right Side: Staircase tiers */}
              <div style={{
                flex: '2 2 450px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%'
              }}>
                {achievements.map((ach, idx) => {
                  const widthPercent = achievements.length <= 1
                    ? 100
                    : 65 + (idx / (achievements.length - 1)) * 35;
                  const grad = getGradient(idx);
                  const isSelected = selectedId === ach.id;

                  return (
                    <div
                      key={ach.id}
                      onClick={() => setSelectedId(ach.id)}
                      style={{
                        width: `${widthPercent}%`,
                        background: `linear-gradient(135deg, ${grad.start} 0%, ${grad.end} 100%)`,
                        borderRadius: '30px 12px 12px 30px',
                        padding: '12px 20px',
                        color: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isSelected 
                          ? '0 8px 20px rgba(79, 70, 229, 0.35)' 
                          : '0 2px 6px rgba(0, 0, 0, 0.05)',
                        transform: isSelected ? 'translateX(12px) scale(1.01)' : 'none',
                        border: isSelected ? '2px solid var(--secondary)' : '2px solid transparent',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      className="staircase-bar"
                    >
                      {/* Subtle reflection overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '50%',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)',
                        pointerEvents: 'none'
                      }} />

                      {/* Bar Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1, minWidth: 0, flex: 1 }}>
                        <span style={{
                          fontWeight: '800',
                          fontSize: '14px',
                          color: '#ffe066',
                          opacity: 0.9,
                          flexShrink: 0
                        }}>
                          #{idx + 1}
                        </span>
                        <span style={{
                          fontWeight: '700',
                          fontSize: '13.5px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          letterSpacing: '0.2px'
                        }} title={ach.title}>
                          {ach.title}
                        </span>
                      </div>

                      {/* Icon Circle */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        flexShrink: 0,
                        marginLeft: '12px',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}>
                        {renderIcon(ach.iconType, 16, '#ffffff')}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Spotlight Detail Card */}
            {selectedAch && (
              <div style={{
                marginTop: '40px',
                padding: '28px',
                borderRadius: '16px',
                background: 'var(--gradient-soft)',
                border: '1px solid var(--border-subtle)',
                borderLeft: '5px solid var(--secondary)',
                display: 'flex',
                gap: '24px',
                alignItems: 'start',
                animation: 'slideUp 0.3s ease-out',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 12px rgba(10,56,91,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  flexShrink: 0
                }}>
                  {renderIcon(selectedAch.iconType, 28, '#f59e0b')}
                </div>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#02619a',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    {selectedAch.category}
                  </span>
                  <h3 style={{ fontSize: '18px', color: 'var(--primary)', margin: '0 0 8px 0', fontWeight: '800' }}>
                    {selectedAch.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
                    {selectedAch.desc}
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* SECTION 2: GRID OF ALL CARDS */}
        <div style={{ marginBottom: '24px' }}>
          <h2 className="font-serif" style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px' }}>
            Historical Gallery of Achievements
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' }}>
            Full catalog of prestigious accolades received by our student branch and affinity chapters.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {achievements.map((ach) => {
            const isHighlighted = selectedId === ach.id;
            return (
              <div
                key={ach.id}
                onClick={() => setSelectedId(ach.id)}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  border: isHighlighted ? '2px solid var(--secondary)' : '1px solid var(--border-subtle)',
                  transform: isHighlighted ? 'translateY(-4px)' : 'none',
                  boxShadow: isHighlighted ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: isHighlighted ? '#eff6ff' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}>
                    {renderIcon(ach.iconType, 24, isHighlighted ? '#02619a' : '#64748b')}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: isHighlighted ? '#02619a' : '#94a3b8',
                    textTransform: 'uppercase',
                    backgroundColor: isHighlighted ? '#dbeafe' : '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease'
                  }}>
                    {ach.category}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', color: 'var(--primary)', margin: '4px 0 10px', fontWeight: '750' }}>{ach.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Student Success Stories & Media Mentions */}
        <div style={{ marginTop: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{
              padding: '4px 12px',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--primary)',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Success Narratives
            </span>
            <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', marginTop: '10px' }}>Student Breakthrough Stories</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Detailed accounts of research milestones and local press mentions</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
            {successStories.map((item, idx) => (
              <div key={idx} className="card scroll-reveal fade-up" style={{ padding: '32px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--secondary)', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '8px' }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: '18px', color: 'var(--primary)', margin: '0 0 12px 0', fontWeight: '800' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: '0 0 20px 0' }}>
                    {item.story}
                  </p>
                </div>
                {item.media && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    📰 {item.media}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Embedded Animations and Keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .staircase-bar:hover {
          transform: translateX(6px) scale(1.005) !important;
          box-shadow: 0 6px 15px rgba(2,97,154,0.25) !important;
        }
      `}</style>
    </div>
  );
};

export default Achievements;
