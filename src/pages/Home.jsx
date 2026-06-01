import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Award, BookOpen, Calendar, Users, ArrowRight, ShieldCheck, Flame, Zap } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [memberCount, setMemberCount] = useState('480+');

  // Google Sheet URL for Member Count
  // File > Share > Publish to web > Select Link, choose CSV from the dropdown list.
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
            setMemberCount(firstVal.includes('+') ? firstVal : firstVal + '+');
          } else if (rows.length > 1 && rows[1].length > 0) {
            const secondVal = rows[1][0].replace(/"/g, '').trim();
            if (secondVal && !isNaN(secondVal.replace(/[+,\s]/g, ''))) {
              setMemberCount(secondVal.includes('+') ? secondVal : secondVal + '+');
            }
          }
        }
      } catch (e) {
        console.warn("Could not load member count from Google Sheet, using default.", e);
      }
    };
    if (GOOGLE_SHEET_CSV_URL && !GOOGLE_SHEET_CSV_URL.includes('_example')) {
      fetchMemberCount();
    }
  }, []);

  const heroImages = [
    '/assets/kec_gate.jpg',
    '/assets/kec_itpark.jpg',
    '/assets/kec_admin.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const tickerNotices = [
    "🌿 IEEE KEC Student Branch membership drive 2026 is now live! Sign up today.",
    "🏆 KEC Student Branch recognized as one of the most active branches in the Madras Section.",
    "🚀 Register for 'CodeSprint 2026' - National level Hackathon organized by KEC IEEE Computer Society.",
    "📢 Guest Lecture on 'AI & Edge Computing' scheduled for June 15, 2026."
  ];

  const stats = [
    { icon: <Users size={32} style={{ color: 'var(--secondary)' }} />, value: memberCount, label: 'Active Members' },
    { icon: <Calendar size={32} style={{ color: 'var(--secondary)' }} />, value: '75+', label: 'Events Yearly' },
    { icon: <Award size={32} style={{ color: 'var(--secondary)' }} />, value: '18+', label: 'National Awards' },
    { icon: <BookOpen size={32} style={{ color: 'var(--secondary)' }} />, value: '120+', label: 'Research Papers' },
  ];

  const tabContent = {
    about: {
      title: "Advancing Technology for Humanity",
      content: (
        <>
          <p style={{ marginBottom: '16px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            The **IEEE Student Branch of Kongu Engineering College (KEC)** is a vibrant student-run community of technology enthusiasts, engineers, and researchers. Established to provide students with opportunities for professional growth, technical skill enhancement, and leadership training.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            Through workshops, symposia, research groups, and community outreach programs, we bridge the gap between academic theory and industry applications, aligning with the global mission of the Institute of Electrical and Electronics Engineers (IEEE).
          </p>
        </>
      )
    },
    vision: {
      title: "Our Mission & Vision",
      content: (
        <>
          <h4 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '18px' }}>Vision</h4>
          <p style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            To build a world-class center of technical learning and professional excellence that empowers young minds to create engineering solutions for a sustainable and technologically advanced society.
          </p>
          <h4 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '18px' }}>Mission</h4>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            To cultivate a culture of innovation, foster teamwork, and enhance student capability in research and design through seminars, hands-on workshops, student-led projects, and professional networking.
          </p>
        </>
      )
    },
    madras: {
      title: "IEEE Madras Section",
      content: (
        <>
          <p style={{ marginBottom: '16px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            The **IEEE Madras Section** represents IEEE in the state of Tamil Nadu and Union Territory of Puducherry. It is one of the oldest and most active sections in Region 10 (Asia-Pacific). It plays a crucial role in disseminating knowledge and supporting engineering colleges through student branch congresses, funding support, and project contests.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            Under the mentorship of the Madras Section, IEEE KEC SB has grown to become a premium student branch, regularly hosting section-level workshops, faculty development programs, and leadership training sessions.
          </p>
        </>
      )
    },
    research: {
      title: "KEC Students Research Cell (KEC SRC)",
      content: (
        <>
          <p style={{ marginBottom: '16px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            The **KEC Students Research Cell (KEC SRC)** is an institutional body dedicated to encouraging, mentoring, and funding research and development initiatives amongst undergraduate and postgraduate students. 
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            The cell operates in close integration with the IEEE Student Branch to support student-driven hardware and software development projects, hackathon prototypes, and peer-reviewed conference papers. KEC SRC provides seed funding, laboratory resources, and mentor pairing to transform ideas into working models.
          </p>
        </>
      )
    }
  };

  const highlights = [
    {
      title: "TechSummit 2026",
      desc: "Annual flagship symposium featuring papers, project displays, and tech talks from industry experts.",
      tag: "Technical",
      date: "March 2026",
      link: "/events/past"
    },
    {
      title: "Women in Data Science",
      desc: "WIE organized panel discussion and training session on Big Data and Analytics for rural development.",
      tag: "WIE Affinity",
      date: "April 2026",
      link: "/events/past"
    },
    {
      title: "DSP & IoT Bootcamp",
      desc: "Hands-on workshop organized by the IEEE KEC SPS Chapter on building smart signal analysis systems.",
      tag: "Signal Processing",
      date: "May 2026",
      link: "/events/past"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Custom notice marquee */}
      <div className="ticker-wrap">
        <div className="ticker">
          {tickerNotices.map((notice, idx) => (
            <span key={idx} className="ticker-item">{notice}</span>
          ))}
          {/* Duplicate to ensure seamless looping */}
          {tickerNotices.map((notice, idx) => (
            <span key={`dup-${idx}`} className="ticker-item">{notice}</span>
          ))}
        </div>
      </div>

      {/* Hero Banner Section (Matches KSV Screenshot Layout & Font/Positioning) */}
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

        {/* Subtle Dark Overlay to ensure text readability while keeping original image colors fully visible */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Centered Row with Shield, IEEE Brand Block, and SRC seal */}
          <div className="hero-emblems-row" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '36px',
            flexWrap: 'wrap'
          }}>
            {/* Left: KEC horizontal Logo */}
            <a 
              href="https://kongu.ac.in/aboutkec" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'block' }}
            >
              <img 
                src="/assets/kec_logo.png" 
                alt="Kongu Engineering College Logo" 
                style={{ 
                  height: '70px', 
                  display: 'block',
                  cursor: 'pointer'
                }} 
              />
            </a>

            {/* Right: IEEE Student Branch Banner */}
            <div style={{ display: 'flex', alignItems: 'center', height: '70px' }}>
              <img 
                src="/assets/ieee_kec_logo.png" 
                alt="IEEE Kongu Engineering College Students Branch Logo" 
                style={{ height: '50px', display: 'block' }} 
              />
            </div>
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
            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
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
                backgroundColor: 'rgba(10, 56, 91, 0.4)',
                border: '1.5px solid #c9ebff',
                color: '#ffffff',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '30px',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
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
                backgroundColor: 'rgba(10, 56, 91, 0.4)',
                border: '1.5px solid #c9ebff',
                color: '#ffffff',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '30px',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
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
            background-color: #c9ebff !important;
            color: #0a385b !important;
            transform: translateY(-2px);
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

      {/* Metrics Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '50px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px'
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-light)',
                border: '1px dashed var(--border-subtle)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.2' }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Tabs Section (Adaptive Content) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Operational Keystones</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginInline: 'auto' }}>
              Learn more about the foundation, trust, and engineering bodies that drive IEEE activities at Kongu Engineering College.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px'
          }}>
            {/* Tab navigation */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              borderBottom: '2px solid var(--border-subtle)',
              paddingBottom: '16px'
            }}>
              {[
                { id: 'about', label: 'IEEE KEC Student Branch' },
                { id: 'vision', label: 'Mission & Vision' },
                { id: 'madras', label: 'IEEE Madras Section' },
                { id: 'research', label: 'KEC Research Cell (SRC)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    borderRadius: '30px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.id ? 'var(--primary)' : '#ffffff',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition-fast)'
                  }}
                  className="tab-hover"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panel content */}
            <div className="card animate-fade-in" style={{ key: activeTab, padding: '40px', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary)', borderLeft: '4px solid var(--secondary)', paddingLeft: '16px' }}>
                {tabContent[activeTab].title}
              </h3>
              <div style={{ color: 'var(--text-dark)' }}>
                {tabContent[activeTab].content}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Events Section */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
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
            {highlights.map((hl, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--primary)',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    {hl.tag}
                  </span>
                  <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '700' }}>{hl.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>{hl.desc}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>{hl.date}</span>
                  <RouterLink to={hl.link} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Details →
                  </RouterLink>
                </div>
              </div>
            ))}
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

      <style>{`
        .tab-hover:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
