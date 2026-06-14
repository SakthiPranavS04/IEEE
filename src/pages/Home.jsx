import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Award, BookOpen, Calendar, Users, ArrowRight, ShieldCheck, Flame, Zap, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Dynamic state hooks for admin-editable components
  const [heroImages, setHeroImages] = useState(() => {
    const stored = localStorage.getItem('ieee_hero_images');
    return stored ? JSON.parse(stored) : [
      '/assets/kec_gate.jpg',
      '/assets/kec_itpark.jpg',
      '/assets/kec_admin.jpg'
    ];
  });

  const [aboutImage, setAboutImage] = useState(() => {
    return localStorage.getItem('ieee_about_image') || '/assets/kec_itpark.jpg';
  });

  const [keystonesVideoUrl, setKeystonesVideoUrl] = useState(() => {
    return localStorage.getItem('ieee_keystones_video_url') || 'https://www.youtube.com/embed/S_T1VwN7Gic';
  });

  const [impactStats, setImpactStats] = useState(() => {
    const stored = localStorage.getItem('ieee_impact_stats');
    return stored ? JSON.parse(stored) : [
      { id: 1, value: "45+", label: "Active Members" },
      { id: 2, value: "75+", label: "Technical Events Organized" },
      { id: 3, value: "18+", label: "National Awards" },
      { id: 4, value: "3+", label: "Research Publications" },
      { id: 5, value: "20+", label: "Workshops Conducted" },
      { id: 6, value: "10+", label: "Industry Collaborations" }
    ];
  });

  const [testimonials, setTestimonials] = useState(() => {
    const stored = localStorage.getItem('ieee_testimonials');
    return stored ? JSON.parse(stored) : [
      { id: 1, text: "IEEE helped me improve my leadership skills and technical confidence through hands-on event organization.", author: "Student Member", role: "KEC IEEE SB" },
      { id: 2, text: "The networking opportunities and workshops provided valuable industry exposure and practical knowledge.", author: "IEEE Alumni", role: "KEC IEEE SB" },
      { id: 3, text: "Being part of IEEE motivated me to explore research, innovation, and professional development beyond academics.", author: "IEEE Graduate", role: "KEC IEEE SB" }
    ];
  });

  const [partnerLogos, setPartnerLogos] = useState(() => {
    const stored = localStorage.getItem('ieee_partner_logos');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: "IEEE", logo: "/assets/ieee_logo.png" },
      { id: 2, name: "IEEE Computer Society", logo: "/assets/ieee_kec_logo.png" },
      { id: 3, name: "IEEE Women in Engineering (WIE)", logo: "/assets/ieee_kec_logo.png" },
      { id: 4, name: "Kongu Engineering College", logo: "/assets/kec_logo.png" },
      { id: 5, name: "Industry Partners", logo: "/assets/ieee_logo.png" }
    ];
  });

  const [memberCount, setMemberCount] = useState(() => {
    return localStorage.getItem('ieee_member_count') || '45';
  });
  const [eventsCount, setEventsCount] = useState(() => {
    return localStorage.getItem('ieee_events_count') || '75+';
  });
  const [awardsCount, setAwardsCount] = useState(() => {
    return localStorage.getItem('ieee_awards_count') || '18+';
  });
  const [papersCount, setPapersCount] = useState(() => {
    return localStorage.getItem('ieee_papers_count') || '15';
  });

  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);

  // Google Sheet URL for Member Count (retained for backward compatibility or future fallback, not currently mapped to UI stats)
  const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-R4zV8G4N1iA8oD5H1fB8G3C2n2o1K7p_example/pub?output=csv';

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error('Sheet load failed');
        const csv = await response.text();
        const rows = csv.split('\n').map(r => r.split(','));
        if (rows.length > 0 && rows[0].length > 0) {
          const firstVal = rows[0][0].replace(/"/g, '').trim();
          if (firstVal && !isNaN(firstVal.replace(/[+,\s]/g, ''))) {
            // Keep stats array sync if needed, otherwise skip
          }
        }
      } catch (e) {
        console.warn("Could not load member count from Google Sheet", e);
      }
    };
    if (GOOGLE_SHEET_CSV_URL && !GOOGLE_SHEET_CSV_URL.includes('_example') && !localStorage.getItem('ieee_member_count')) {
      fetchMemberCount();
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const [mission, setMission] = useState(() => localStorage.getItem('ieee_mission') || "To cultivate a culture of innovation, foster teamwork, and enhance student capability in research and design through seminars, hands-on workshops, student-led projects, and professional networking.");
  const [vision, setVision] = useState(() => localStorage.getItem('ieee_vision') || "To build a world-class center of technical learning and professional excellence that empowers young minds to create engineering solutions for a sustainable and technologically advanced society.");
  const [tickerNotices, setTickerNotices] = useState(() => {
    const stored = localStorage.getItem('ieee_ticker_notices');
    return stored ? JSON.parse(stored) : [
      "🌿 IEEE KEC Student Branch membership drive 2026 is now live! Sign up today.",
      "🏆 KEC Student Branch recognized as one of the most active branches in the Madras Section.",
      "🚀 Register for 'CodeSprint 2026' - National level Hackathon organized by KEC IEEE Computer Society.",
      "📢 Guest Lecture on 'AI & Edge Computing' scheduled for June 15, 2026."
    ];
  });

  const stats = [
    { icon: <Users size={32} style={{ color: 'var(--secondary)' }} />, value: memberCount, label: 'Active Members' },
    { icon: <Calendar size={32} style={{ color: 'var(--accent-cyan)' }} />, value: eventsCount, label: 'Events Yearly' },
    { icon: <Award size={32} style={{ color: '#f59e0b' }} />, value: awardsCount, label: 'National Awards' },
    { icon: <BookOpen size={32} style={{ color: 'var(--accent)' }} />, value: papersCount, label: 'Research Papers' },
  ];

  const tabContent = {
    mission: {
      title: "Our Mission",
      content: (
        <>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            {mission}
          </p>
        </>
      )
    },
    vision: {
      title: "Our Vision",
      content: (
        <>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            {vision}
          </p>
        </>
      )
    }
  };

  const isEventCompleted = (dateStr) => {
    try {
      const today = new Date("2026-06-04");
      let normalized = dateStr;
      if (normalized.includes('-')) {
        const parts = normalized.split('-');
        const yearMatch = normalized.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : "2026";
        const dayMatch = parts[1].match(/\d+/);
        const monthMatch = normalized.match(/[a-zA-Z]+/);
        if (dayMatch && monthMatch) {
          normalized = `${monthMatch[0]} ${dayMatch[0]}, ${year}`;
        }
      } else {
        const words = normalized.trim().split(/\s+/);
        if (words.length === 2) {
          normalized = `${words[0]} 28, ${words[1]}`;
        }
      }
      const parsedDate = new Date(normalized);
      return parsedDate < today;
    } catch (e) {
      return false;
    }
  };

  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const defaultPast = [
      {
        title: "Workshop on Digital Signal Processing & IoT",
        desc: "A 3-day practical bootcamp focusing on capturing and processing real-time sensor waveforms using ESP32 and DSP filtering algorithms.",
        date: "May 18, 2026",
        venue: "DSP Lab, ECE Dept, KEC",
        tag: "SPS Chapter",
        highlights: "50+ participants built smart ECG filter prototypes."
      },
      {
        title: "WIE CodeQuest: Coding Bootcamp for Girls",
        desc: "A bootcamp dedicated to teaching web building, database structure, and frontend hosting to young female engineers.",
        date: "April 24, 2026",
        venue: "Internet Lab, KEC",
        tag: "WIE Group",
        highlights: "Participated by 80 girls, 5 projects were selected for incubation support."
      },
      {
        title: "National Conference on Computing & Communication (NCCC 2026)",
        desc: "Flagship paper presentation event featuring research papers from student groups across the region, judged by Anna University faculty.",
        date: "March 15, 2026",
        venue: "Maharaja Auditorium, KEC",
        tag: "Conference",
        highlights: "30+ research papers published in local IEEE digital archives."
      }
    ];

    const storedPast = localStorage.getItem('ieee_events_past');
    let pastList = [];
    if (storedPast) {
      pastList = JSON.parse(storedPast);
    } else {
      pastList = defaultPast;
    }

    const formatted = pastList.slice(0, 3).map(evt => ({
      title: evt.title,
      desc: evt.desc,
      tag: evt.tag,
      date: evt.date,
      link: "/events/past"
    }));
    setHighlights(formatted);
  }, []);

  const getStatIconAndColor = (label, index) => {
    const text = (label || '').toLowerCase();
    
    // Choose icon based on keyword or index
    const styles = [
      {
        icon: <Users size={28} />,
        color: '#4f46e5', // Indigo
        bgColor: 'rgba(79, 70, 229, 0.08)'
      },
      {
        icon: <Calendar size={28} />,
        color: '#06b6d4', // Cyan
        bgColor: 'rgba(6, 182, 212, 0.08)'
      },
      {
        icon: <Award size={28} />,
        color: '#f59e0b', // Amber
        bgColor: 'rgba(245, 158, 11, 0.08)'
      },
      {
        icon: <BookOpen size={28} />,
        color: '#10b981', // Emerald
        bgColor: 'rgba(16, 185, 129, 0.08)'
      },
      {
        icon: <Flame size={28} />,
        color: '#f43f5e', // Rose
        bgColor: 'rgba(244, 63, 94, 0.08)'
      },
      {
        icon: <Zap size={28} />,
        color: '#8b5cf6', // Violet
        bgColor: 'rgba(139, 92, 246, 0.08)'
      }
    ];

    if (text.includes('member') || text.includes('volunteer') || text.includes('people') || text.includes('student')) {
      return styles[0];
    } else if (text.includes('event') || text.includes('conducted') || text.includes('seminar')) {
      return styles[1];
    } else if (text.includes('award') || text.includes('won') || text.includes('national')) {
      return styles[2];
    } else if (text.includes('paper') || text.includes('publication') || text.includes('research') || text.includes('book')) {
      return styles[3];
    } else if (text.includes('workshop') || text.includes('hackathon') || text.includes('session')) {
      return styles[4];
    } else if (text.includes('collaboration') || text.includes('partner') || text.includes('industry')) {
      return styles[5];
    }

    return styles[index % styles.length];
  };

  return (
    <div className="animate-fade-in">
      {/* Custom notice marquee */}
      <div className="ticker-wrap">
        <div className="ticker">
          {tickerNotices.map((notice, idx) => (
            <span key={idx} className="ticker-item">{notice}</span>
          ))}
          {/* Double map for continuous marquee loop */}
          {tickerNotices.map((notice, idx) => (
            <span key={`dup-${idx}`} className="ticker-item">{notice}</span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '100px 0 120px',
        color: '#ffffff',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Carousel Background Images with smooth transition */}
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("${img}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: idx === currentBgIndex ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: 0
            }}
          />
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Centered Row with IEEE Logo */}
          <div className="hero-emblems-row" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '36px'
          }}>
            <img 
              src="/assets/ieee_logo_white.png" 
              alt="IEEE Logo" 
              style={{ 
                height: '110px', 
                display: 'block',
                filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.75))'
              }} 
            />
          </div>

          {/* Centered Large Bold Title */}
          <h1 style={{
            fontSize: 'calc(20px + 1.5vw)',
            lineHeight: '1.3',
            color: '#ffffff',
            marginBottom: '36px',
            fontWeight: '800',
            maxWidth: '1200px',
            marginInline: 'auto',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 4px 30px rgba(0, 0, 0, 0.95)',
            fontFamily: 'var(--font-sans)'
          }}>
            IEEE Student Branch
            <br />
            Kongu Engineering College
          </h1>

          {/* Two centered pill-styled buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
            <RouterLink
              to="/contact"
              style={{
                backgroundColor: 'rgba(79, 70, 229, 0.25)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontWeight: '700',
                padding: '14px 36px',
                borderRadius: '30px',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
              className="hero-btn-hover"
            >
              Join IEEE - KEC SB
            </RouterLink>
            <a
              href="https://www.ieee.org/membership/join/index.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'rgba(79, 70, 229, 0.25)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontWeight: '700',
                padding: '14px 36px',
                borderRadius: '30px',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
              className="hero-btn-hover"
            >
              How to Join IEEE?
            </a>
          </div>

          {/* Slide indicator dots */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '40px' }}>
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBgIndex(idx)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: idx === currentBgIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
                className="hero-dot"
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <style>{`
          .hero-btn-hover:hover {
            background-color: rgba(79, 70, 229, 0.45) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35) !important;
          }
          .hero-dot:hover {
            background-color: #ffffff !important;
            transform: scale(1.2);
          }
          @media (max-width: 768px) {
            .hero-emblems-row {
              gap: 16px !important;
            }
          }
        `}</style>
      </section>

      {/* About IEEE KEC Student Branch Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Left Column: Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '32px', color: 'var(--primary)', fontWeight: '800', borderLeft: '4px solid var(--secondary)', paddingLeft: '12px' }}>
                About IEEE KEC Student Branch
              </h2>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                IEEE Student Branch at Kongu Engineering College is a vibrant community of innovators, researchers, developers, and technology enthusiasts committed to advancing technical knowledge and professional growth. Through workshops, seminars, hackathons, competitions, industry interactions, and research initiatives, the branch empowers students to develop technical expertise, leadership skills, and global perspectives.
              </p>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                The student branch serves as a platform for collaboration, innovation, and continuous learning while connecting students with the vast global IEEE network.
              </p>
            </div>
            {/* Right Column: Illustration/Image */}
            <div style={{ textAlign: 'center' }}>
              <img 
                src={aboutImage} 
                alt="About IEEE KEC Student Branch" 
                style={{ 
                  width: '100%', 
                  maxHeight: '360px', 
                  objectFit: 'cover', 
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1.5px solid var(--border-subtle)',
                  transition: 'all 0.3s ease'
                }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Join IEEE Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: '800', color: 'var(--primary)' }}>Why Join IEEE?</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary)', margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginInline: 'auto' }}>
              Being part of the world's largest technical professional organization offers unparalleled benefits.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {[
              { title: "Global Networking", text: "Connect with students, professionals, and researchers worldwide.", icon: <Users size={24} /> },
              { title: "Technical Learning", text: "Access workshops, technical resources, competitions, and certifications.", icon: <BookOpen size={24} /> },
              { title: "Leadership Development", text: "Build communication, management, and teamwork skills.", icon: <Award size={24} /> },
              { title: "Research Opportunities", text: "Participate in innovation projects, conferences, and publications.", icon: <ShieldCheck size={24} /> },
              { title: "Career Growth", text: "Gain industry exposure, mentorship, and internship opportunities.", icon: <Flame size={24} /> },
              { title: "Exclusive Resources", text: "Access IEEE standards, publications, and professional communities.", icon: <Zap size={24} /> }
            ].map((card, idx) => (
              <div key={idx} className="card stat-card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(79, 70, 229, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--secondary)',
                  boxShadow: 'inset 0 0 10px rgba(79, 70, 229, 0.02)'
                }}>
                  {card.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '750', marginBottom: '8px', color: 'var(--primary)' }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Impact In Numbers Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: '800', color: 'var(--primary)' }}>Our Impact in Numbers</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary)', margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginInline: 'auto' }}>
              Discover our accomplishments and active role in driving technical education.
            </p>
          </div>
          <div className="home-stats-grid">
            {impactStats.map((stat, idx) => {
              const { icon, color, bgColor } = getStatIconAndColor(stat.label, idx);
              return (
                <div key={stat.id || idx} className="stat-card-hover home-stat-item">
                  <div className="home-stat-icon-wrapper" style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    backgroundColor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    boxShadow: `inset 0 0 10px rgba(${color === '#4f46e5' ? '79, 70, 229' : '0, 0, 0'}, 0.02)`
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div className="home-stat-value" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.2' }}>{stat.value}</div>
                    <div className="home-stat-label" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Tabs Section (Adaptive Content) */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Operational Keystones</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginInline: 'auto' }}>
              Learn more about the foundation, trust, and engineering bodies that drive IEEE activities at Kongu Engineering College.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Left Column: YouTube Video */}
            <div style={{ width: '100%' }}>
              <div className="video-frame-container" style={{
                position: 'relative',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                height: 0,
                borderRadius: '16px',
                border: '6px solid #ffffff',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
                overflow: 'hidden',
                backgroundColor: '#0f172a'
              }}>
                <iframe
                  src={keystonesVideoUrl}
                  title="IEEE KEC SB Promotional Video"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Right Column: Mission / Vision Tabs & Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Tab Navigation */}
              <div style={{
                display: 'flex',
                gap: '12px',
                borderBottom: '2px solid var(--border-subtle)',
                paddingBottom: '16px'
              }}>
                {[
                  { id: 'mission', label: 'Mission' },
                  { id: 'vision', label: 'Vision' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      borderRadius: '30px',
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTab === tab.id ? 'var(--gradient-cyber)' : '#ffffff',
                      color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                      boxShadow: activeTab === tab.id ? '0 4px 12px rgba(6, 182, 212, 0.35)' : 'var(--shadow-sm)',
                      transition: 'var(--transition-fast)'
                    }}
                    className="tab-hover"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content Card */}
              <div className="card animate-fade-in" style={{ 
                key: activeTab, 
                padding: '36px', 
                minHeight: '220px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                margin: 0,
                border: '1px solid var(--border-subtle)'
              }}>
                <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--primary)', borderLeft: '4px solid var(--secondary)', paddingLeft: '12px', fontWeight: '800' }}>
                  {tabContent[activeTab].title}
                </h3>
                <div style={{ color: 'var(--text-dark)' }}>
                  {tabContent[activeTab].content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Testimonials Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: '800', color: 'var(--primary)' }}>What Our Members Say</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary)', margin: '0 auto' }}></div>
          </div>

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 40px' }}>
            {testimonials.length > 0 && (
              <div className="card" style={{
                position: 'relative',
                padding: '40px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '220px',
                justifyContent: 'center'
              }}>
                <Quote size={40} style={{ color: 'rgba(79, 70, 229, 0.15)', marginBottom: '16px' }} />
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: 'var(--text-dark)',
                  fontStyle: 'italic',
                  marginBottom: '20px',
                  fontWeight: '500'
                }}>
                  "{testimonials[currentTestimonialIdx].text}"
                </p>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>
                    {testimonials[currentTestimonialIdx].author}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {testimonials[currentTestimonialIdx].role}
                  </span>
                </div>
              </div>
            )}

            {/* Carousel Navigation Buttons */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  style={{
                    position: 'absolute',
                    left: '-10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    zIndex: 2,
                    transition: 'all 0.2s ease'
                  }}
                  className="carousel-btn"
                  title="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentTestimonialIdx((prev) => (prev + 1) % testimonials.length)}
                  style={{
                    position: 'absolute',
                    right: '-10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    zIndex: 2,
                    transition: 'all 0.2s ease'
                  }}
                  className="carousel-btn"
                  title="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dots indicator */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonialIdx(idx)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: idx === currentTestimonialIdx ? 'var(--secondary)' : 'rgba(79, 70, 229, 0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease'
                  }}
                  title={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Events Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '40px 0 80px' }} className="scroll-reveal">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Event Highlights</h2>
              <p style={{ color: 'var(--text-muted)' }}>Catch up with our flagship initiatives and activities.</p>
            </div>
            <RouterLink to="/events/past" className="btn btn-outline" style={{ display: 'flex', gap: '8px', padding: '10px 20px', fontSize: '14px' }}>
              View All Events <ArrowRight size={16} />
            </RouterLink>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {highlights.map((hl, idx) => {
              const isPast = isEventCompleted(hl.date);
              return (
                <div 
                  key={idx} 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    height: '100%',
                    filter: isPast ? 'grayscale(45%) opacity(0.85)' : 'none',
                    backgroundColor: isPast ? '#f8fafc' : '#ffffff',
                    border: isPast ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: isPast ? '#e2e8f0' : 'rgba(79, 70, 229, 0.1)',
                        color: isPast ? '#64748b' : 'var(--secondary)',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}>
                        {hl.tag}
                      </span>
                      {isPast && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '750',
                          color: '#64748b',
                          backgroundColor: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          border: '1px solid #cbd5e1',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '700', color: isPast ? '#475569' : 'inherit' }}>{hl.title}</h3>
                    <p style={{ color: isPast ? '#64748b' : 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>{hl.desc}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>{hl.date}</span>
                    <RouterLink to={hl.link} style={{ color: isPast ? '#64748b' : 'var(--secondary)', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Details →
                    </RouterLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visit Us Map Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-light)', borderTop: '1px solid var(--border-subtle)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>Visit Us</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary)', margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginInline: 'auto' }}>
              Find us on Google Maps or drop by the Kongu Engineering College campus.
            </p>
          </div>
          
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            padding: '12px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            <iframe
              src="https://maps.google.com/maps?q=Kongu%20Engineering%20College,%20Perundurai,%20Erode,%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="350"
              style={{ border: 0, display: 'block', borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kongu Engineering College Map"
            />
          </div>
        </div>
      </section>

      {/* Partners & Collaborations Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: '800', color: 'var(--primary)' }}>Partners & Collaborations</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary)', margin: '0 auto' }}></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            justifyItems: 'center',
            alignItems: 'center',
            marginTop: '32px'
          }}>
            {partnerLogos.map((partner, idx) => (
              <div key={partner.id || idx} className="card stat-card-hover" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px',
                width: '100%',
                maxWidth: '220px',
                height: '140px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <img
                  src={partner.logo}
                  alt={partner.name}
                  style={{
                    maxHeight: '60px',
                    maxWidth: '130px',
                    objectFit: 'contain',
                    filter: 'grayscale(10%) contrast(90%)',
                    transition: 'all 0.3s ease',
                    marginBottom: '10px'
                  }}
                  className="partner-logo-img"
                />
                <span style={{ fontSize: '12px', fontWeight: '750', color: 'var(--primary)', textAlign: 'center' }}>
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .video-frame-container {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .video-frame-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.18), 0 0 25px rgba(79, 70, 229, 0.15) !important;
        }
        .tab-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2) !important;
        }
        .stat-card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(79, 70, 229, 0.3) !important;
          box-shadow: var(--shadow-md) !important;
        }
        .home-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }
        .home-stat-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px 20px;
          border-radius: 16px;
          background-color: #ffffff;
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        @media (max-width: 1024px) {
          .home-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media (max-width: 480px) {
          .home-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .home-stat-item {
            padding: 12px 10px;
            gap: 8px;
            border-radius: 12px;
          }
          .home-stat-icon-wrapper {
            width: 40px !important;
            height: 40px !important;
            border-radius: 8px !important;
          }
          .home-stat-icon-wrapper svg {
            width: 20px !important;
            height: 20px !important;
          }
          .home-stat-value {
            font-size: 20px !important;
          }
          .home-stat-label {
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
