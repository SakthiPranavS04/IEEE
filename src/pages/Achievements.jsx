import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, Sparkles, ArrowRight, Calendar, X } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAch, setModalAch] = useState(null);

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

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '80vh' }}>
      <PageHeader
        title="Student & Branch Achievements"
        subtitle="Celebrating technical excellence, research grants, and section-level laurels"
      />

      <div className="container">
        
        {/* Historical Gallery of Achievements */}
        <div style={{ marginBottom: '24px' }}>
          <h2 className="font-serif" style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px' }}>
            Historical Gallery of Achievements
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' }}>
            Full catalog of prestigious accolades received by our student branch and affinity chapters.
          </p>
        </div>

        <div className="timeline-container" style={{ position: 'relative', margin: '40px auto 0', padding: '20px 0' }}>
          {/* Vertical line spine */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'linear-gradient(to bottom, var(--secondary) 0%, rgba(var(--secondary-rgb), 0.2) 100%)',
            borderRadius: '2px',
            zIndex: 1
          }} className="timeline-spine" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative', zIndex: 2 }}>
            {achievements.map((ach, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={ach.id}
                  onClick={() => {
                    setModalAch(ach);
                    setIsModalOpen(true);
                  }}
                  className={`timeline-item ${isLeft ? 'left' : 'right'}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: '100%',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {/* Timeline Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: '24px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      border: '4px solid var(--secondary)',
                      boxShadow: '0 0 0 4px rgba(6, 182, 212, 0.15)',
                      zIndex: 3,
                      transition: 'all 0.3s ease'
                    }}
                    className="timeline-dot"
                  />

                  {/* Timeline Content Card */}
                  <div
                    className="timeline-card-wrapper"
                    style={{
                      width: '45%',
                      marginLeft: isLeft ? '0' : 'auto',
                      marginRight: isLeft ? 'auto' : '0',
                      paddingLeft: isLeft ? '0' : '20px',
                      paddingRight: isLeft ? '20px' : '0'
                    }}
                  >
                    <div
                      className="card timeline-card"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'start'
                      }}
                    >
                      {/* Card Arrow */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '24px',
                          [isLeft ? 'right' : 'left']: '-8px',
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#ffffff',
                          borderLeft: isLeft ? 'none' : '1px solid var(--border-subtle)',
                          borderBottom: isLeft ? 'none' : '1px solid var(--border-subtle)',
                          borderRight: isLeft ? '1px solid var(--border-subtle)' : 'none',
                          borderTop: isLeft ? '1px solid var(--border-subtle)' : 'none',
                          transform: 'rotate(45deg)',
                          zIndex: 2
                        }}
                        className="timeline-arrow"
                      />

                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--secondary)',
                        flexShrink: 0
                      }}>
                        {renderIcon(ach.iconType, 20, 'var(--secondary)')}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: 'var(--secondary)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          display: 'block',
                          marginBottom: '6px'
                        }}>
                          {ach.category}
                        </span>
                        <h3 style={{
                          fontSize: '16px',
                          color: 'var(--primary)',
                          fontWeight: '800',
                          margin: '0 0 8px 0',
                          lineHeight: '1.4'
                        }}>
                          {ach.title}
                        </h3>
                        <p style={{
                          color: 'var(--text-muted)',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {ach.desc}
                        </p>
                        <div style={{
                          marginTop: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          color: 'var(--primary)',
                          fontWeight: '700'
                        }}>
                          Read Details <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* Achievement Details Modal */}
      {isModalOpen && modalAch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={() => setIsModalOpen(false)}
        >
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            position: 'relative',
            animation: 'modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header pattern */}
            <div style={{
              background: 'var(--gradient-primary)',
              padding: '24px 32px',
              color: '#ffffff',
              position: 'relative'
            }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                color: '#d0e4f2',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                display: 'block',
                marginBottom: '6px'
              }}>
                {modalAch.category}
              </span>
              <h3 style={{ fontSize: '20px', color: '#ffffff', margin: 0, fontWeight: '800', paddingRight: '36px' }}>
                {modalAch.title}
              </h3>
            </div>
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#02619a'
                }}>
                  {renderIcon(modalAch.iconType, 22, '#02619a')}
                </div>
                <div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block' }}>Recognition Category</span>
                  <strong style={{ fontSize: '14px', color: 'var(--primary)' }}>{modalAch.category}</strong>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7', margin: 0 }}>
                {modalAch.desc}
              </p>
            </div>
          </div>
        </div>
      )}

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
        .timeline-card:hover {
          transform: translateY(-4px) scale(1.01) !important;
          box-shadow: var(--shadow-md) !important;
          border-color: var(--secondary) !important;
        }
        .timeline-item:hover .timeline-dot {
          background-color: var(--secondary) !important;
          box-shadow: 0 0 0 6px rgba(6, 182, 212, 0.3) !important;
        }
        @media (max-width: 768px) {
          .timeline-spine {
            left: 20px !important;
            transform: none !important;
          }
          .timeline-dot {
            left: 20px !important;
            transform: translateX(-50%) !important;
          }
          .timeline-card-wrapper {
            width: calc(100% - 40px) !important;
            margin-left: 40px !important;
            margin-right: 0 !important;
            padding-left: 12px !important;
            padding-right: 0 !important;
          }
          .timeline-arrow {
            left: -8px !important;
            right: auto !important;
            border-left: 1px solid var(--border-subtle) !important;
            border-bottom: 1px solid var(--border-subtle) !important;
            border-right: none !important;
            border-top: none !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-close-btn:hover {
          background-color: rgba(255, 255, 255, 0.25) !important;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Achievements;
