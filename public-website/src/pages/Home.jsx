import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import API from '../services/api';
import { Award, BookOpen, Calendar, Users, ArrowRight, ShieldCheck, Flame, Zap, ChevronLeft, ChevronRight, Quote, MessageSquare, Globe, Compass, Target, Cpu, Heart, Sparkles, Shield } from 'lucide-react';
import { societiesData } from '../data/societiesData';

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <span style={{
    padding: '6px 14px',
    backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
    color: 'var(--secondary)',
    border: '1px solid rgba(var(--secondary-rgb), 0.15)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '750',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'inline-block',
    marginBottom: '12px'
  }}>
    {text}
  </span>
);

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, accent = false }) => (
  <div className="card about-feature-card" style={{
    padding: '28px',
    display: 'flex',
    gap: '18px',
    alignItems: 'flex-start',
    borderTop: accent ? '3px solid var(--secondary)' : '3px solid transparent',
    transition: 'all 0.3s ease'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      backgroundColor: 'rgba(var(--secondary-rgb), 0.08)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={22} style={{ color: 'var(--secondary)' }} />
    </div>
    <div>
      <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '750', color: 'var(--primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
    </div>
  </div>
);

const getAboutSbIcon = (name, style = {}) => {
  switch (name) {
    case 'Cpu': return <Cpu size={22} style={style} />;
    case 'Target': return <Target size={22} style={style} />;
    case 'Heart': return <Heart size={22} style={style} />;
    case 'Users': return <Users size={22} style={style} />;
    case 'BookOpen': return <BookOpen size={22} style={style} />;
    case 'Globe': return <Globe size={22} style={style} />;
    case 'Award': return <Award size={22} style={style} />;
    default: return <Sparkles size={22} style={style} />;
  }
};

const defaultAboutKecSbData = {
  whoWeAre: {
    title: "Who We Are",
    intro: "The IEEE Kongu Engineering College Student Branch (IEEE KEC SB) was established to inspire technical innovation among students and provide them with a platform for professional growth. We regularly organize workshops, hackathons, and guest lectures on cutting-edge technologies.",
    introSecondary: "As part of the IEEE Madras Section, our branch acts as a gateway for students to interact with global researchers, participate in international contests, and access IEEE's vast digital libraries and resources.",
    mission: "To build a world-class center of technical learning and professional excellence that empowers young minds to create engineering solutions for a sustainable and technologically advanced society.",
    vision: "To cultivate a culture of innovation, foster teamwork, and enhance student capability in research and design through seminars, hands-on workshops, student-led projects, and professional networking."
  },
  stats: [
    { label: "Student Members", count: "120+" },
    { label: "Professional Chapters", count: "6" },
    { label: "Events Conducted", count: "80+" },
    { label: "Awards Received", count: "15+" },
    { label: "Years of Impact", count: "10" }
  ],
  impact: [
    {
      title: "Technical Growth",
      desc: "Hands-on experience with emerging technologies like AI, IoT, VLSI, and cloud computing through workshops.",
      icon: "Cpu"
    },
    {
      title: "Leadership Development",
      desc: "Steering roles inside operational committees, planning conferences, and heading volunteer chapters.",
      icon: "Target"
    },
    {
      title: "Community Service",
      desc: "Promoting digital literacy, energy auditing, and assistive technologies in nearby rural schools.",
      icon: "Heart"
    },
    {
      title: "Professional Networking",
      desc: "Direct channels to connect with international researchers, industry stalwarts, and Anna University peers.",
      icon: "Users"
    },
    {
      title: "Research Exposure",
      desc: "Direct funding and mentorship for publishing in indexed journals and presenting at IEEE conferences.",
      icon: "BookOpen"
    },
    {
      title: "Industry Collaboration",
      desc: "Industrial visits, guest lectures by tech giants, and internships backed by IEEE member associations.",
      icon: "Globe"
    }
  ],
  whyJoin: [
    {
      title: "Global Networking",
      desc: "Access a massive community of professionals, engineers, and scientists across 160+ countries."
    },
    {
      title: "IEEE Resources",
      desc: "Free/discounted access to IEEE Spectrum, Xplore Digital Library, and academic publications."
    },
    {
      title: "Leadership Opportunities",
      desc: "Build team management, event execution, and administrative leadership skills early in your career."
    },
    {
      title: "International Exposure",
      desc: "Submit papers and participate in international competitions like IEEE Extreme, Congresses, etc."
    },
    {
      title: "Technical Workshops",
      desc: "Free or highly subsidized tickets to advanced hands-on training sessions and hackathons."
    },
    {
      title: "Career Development",
      desc: "Gain edge in placements, graduate school applications, and research fellowship selections."
    }
  ],
  timeline: [
    {
      year: "2015",
      title: "Student Branch Inauguration",
      desc: "IEEE KEC Student Branch officially established under Madras Section with 35 charter student members."
    },
    {
      year: "2018",
      title: "Society Additions",
      desc: "Established Computer Society and Women in Engineering affinity groups to cater to specialized domains."
    },
    {
      year: "2021",
      title: "Regional Recognitions",
      desc: "Awarded the Outstanding Student Branch Award from the IEEE Madras Section for high volunteer activity."
    },
    {
      year: "2024",
      title: "Decade of Impact & Expansion",
      desc: "Expanded to 6 active technical societies, cross-border hackathons, and over 120 registered active members."
    }
  ]
};

const hexToRgb = (hex) => {
  if (!hex) return "15, 76, 92";
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `${r}, ${g}, ${b}`;
};

const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const isPlus = typeof value === 'string' && value.includes('+');

  useEffect(() => {
    let start = 0;
    if (target === 0) {
      setCount(value);
      return;
    }
    const increment = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value, target, duration]);

  return <span>{count}{isPlus ? '+' : ''}</span>;
};

const Home = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Dynamic state hooks for admin-editable components
  const [heroImages, setHeroImages] = useState(['/assets/kec_gate.jpg', '/assets/kec_itpark.jpg', '/assets/kec_admin.jpg']);
  const [aboutImage, setAboutImage] = useState('/assets/kec_gate.jpg');
  const [keystonesVideoUrl, setKeystonesVideoUrl] = useState('https://youtu.be/_90Hd1qMDGM');
  const [impactStats, setImpactStats] = useState([
    { id: 1, value: "45+", label: "Active Members" },
    { id: 2, value: "75+", label: "Technical Events Organized" },
    { id: 3, value: "18+", label: "National Awards" },
    { id: 4, value: "3+", label: "Research Publications" },
    { id: 5, value: "20+", label: "Workshops Conducted" },
    { id: 6, value: "10+", label: "Industry Collaborations" }
  ]);
  const [testimonials, setTestimonials] = useState([
    { id: 1, text: "IEEE helped me improve my leadership skills and technical confidence through hands-on event organization.", author: "Student Member", role: "KEC IEEE SB" },
    { id: 2, text: "The networking opportunities and workshops provided valuable industry exposure and practical knowledge.", author: "IEEE Alumni", role: "KEC IEEE SB" },
    { id: 3, text: "Being part of IEEE motivated me to explore research, innovation, and professional development beyond academics.", author: "IEEE Graduate", role: "KEC IEEE SB" }
  ]);
  const [memberCount, setMemberCount] = useState('45');
  const [eventsCount, setEventsCount] = useState('75+');
  const [awardsCount, setAwardsCount] = useState('18+');
  const [papersCount, setPapersCount] = useState('15');

  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);

  const [societiesList, setSocietiesList] = useState([]);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await fetch(`${API}/societies`);
        if (response.ok) {
          const data = await response.json();
          // Filter out societies that are not meant for the grid if needed, or just use them all.
          // Fallback to default societiesData if none exist
          if (data && data.length > 0) {
            setSocietiesList(data);
          } else {
            setSocietiesList(Object.values(societiesData));
          }
        }
      } catch (e) {
        console.error("Error fetching societies:", e);
        setSocietiesList(Object.values(societiesData));
      }
    };
    fetchSocieties();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API}/settings`);
        if (response.ok) {
          const settings = await response.json();
          const getVal = (key) => {
            const s = settings.find(s => s.key === key);
            return s ? s.value : null;
          };
          
          const mCount = getVal('ieee_member_count');
          if (mCount) setMemberCount(mCount);
          
          const eCount = getVal('ieee_events_count');
          if (eCount) setEventsCount(eCount);
          
          const aCount = getVal('ieee_awards_count');
          if (aCount) setAwardsCount(aCount);
          
          const pCount = getVal('ieee_papers_count');
          if (pCount) setPapersCount(pCount);
          
          const m = getVal('ieee_mission');
          if (m) setMission(m);
          
          const v = getVal('ieee_vision');
          if (v) setVision(v);
          
          const hImgs = getVal('ieee_hero_images');
          if (hImgs) {
            try { setHeroImages(typeof hImgs === 'string' ? JSON.parse(hImgs) : hImgs); } catch(e){}
          }
          
          const aImg = getVal('ieee_about_image');
          if (aImg) setAboutImage(aImg);
          
          const kVid = getVal('ieee_keystones_video_url_v2');
          if (kVid) setKeystonesVideoUrl(kVid);
          
          const iStats = getVal('ieee_impact_stats');
          if (iStats) {
            try { setImpactStats(typeof iStats === 'string' ? JSON.parse(iStats) : iStats); } catch(e){}
          }
          
          const tmonials = getVal('ieee_testimonials');
          if (tmonials) {
            try { setTestimonials(typeof tmonials === 'string' ? JSON.parse(tmonials) : tmonials); } catch(e){}
          }

          const notices = getVal('ieee_ticker_notices');
          if (notices) {
            try { setTickerNotices(typeof notices === 'string' ? JSON.parse(notices) : notices); } catch(e){}
          }
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const [mission, setMission] = useState("To cultivate a culture of innovation, foster teamwork, and enhance student capability in research and design through seminars, hands-on workshops, student-led projects, and professional networking.");
  const [vision, setVision] = useState("To build a world-class center of technical learning and professional excellence that empowers young minds to create engineering solutions for a sustainable and technologically advanced society.");
  const [tickerNotices, setTickerNotices] = useState([
    "🌿 IEEE KEC Student Branch membership drive 2026 is now live! Sign up today.",
    "🏆 KEC Student Branch recognized as one of the most active branches in the Madras Section.",
    "🚀 Register for 'CodeSprint 2026' - National level Hackathon organized by KEC IEEE Computer Society.",
    "📢 Guest Lecture on 'AI & Edge Computing' scheduled for June 15, 2026."
  ]);

  const stats = [
    { icon: <Users size={32} style={{ color: 'var(--secondary)' }} />, value: memberCount, label: 'Active Members' },
    { icon: <Calendar size={32} style={{ color: 'var(--accent-cyan)' }} />, value: eventsCount, label: 'Events Yearly' },
    { icon: <Award size={32} style={{ color: '#f59e0b' }} />, value: awardsCount, label: 'National Awards' },
    { icon: <BookOpen size={32} style={{ color: 'var(--accent)' }} />, value: papersCount, label: 'Research Papers & Projects' },
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
  const [carouselIndex, setCarouselIndex] = useState(0);

  const THEME_GRADIENTS = {
    'IEEE Blue': 'linear-gradient(135deg, #00629B 0%, #0a385b 100%)',
    'Purple': 'linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)',
    'Cyan': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'Green': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'Teal': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
  };

  const getEventIcon = (tag) => {
    const t = (tag || '').toLowerCase();
    if (t.includes('sps') || t.includes('signal') || t.includes('iot')) return <Zap size={44} color="#ffffff" style={{ opacity: 0.9, zIndex: 1 }} />;
    if (t.includes('wie') || t.includes('women') || t.includes('group')) return <Users size={44} color="#ffffff" style={{ opacity: 0.9, zIndex: 1 }} />;
    if (t.includes('conference') || t.includes('symposium') || t.includes('award')) return <Award size={44} color="#ffffff" style={{ opacity: 0.9, zIndex: 1 }} />;
    if (t.includes('workshop') || t.includes('bootcamp') || t.includes('hands')) return <BookOpen size={44} color="#ffffff" style={{ opacity: 0.9, zIndex: 1 }} />;
    if (t.includes('hackathon') || t.includes('code')) return <Flame size={44} color="#ffffff" style={{ opacity: 0.9, zIndex: 1 }} />;
    if (t.includes('lecture') || t.includes('seminar') || t.includes('talk')) return <MessageSquare size={44} color="#ffffff" style={{ opacity: 0.9, zIndex: 1 }} />;
    return <Calendar size={44} color="#ffffff" style={{ opacity: 0.9, zIndex: 1 }} />;
  };

  const autoplayRef = useRef(null);

  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    if (highlights.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % highlights.length);
      }, 5000);
    }
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [highlights.length]);

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev === 0 ? highlights.length - 1 : prev - 1));
    resetAutoplay();
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % highlights.length);
    resetAutoplay();
  };

  const handleDotClick = (idx) => {
    setCarouselIndex(idx);
    resetAutoplay();
  };

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await fetch(`${API}/events`);
        if (response.ok) {
          const data = await response.json();
          const eventsList = Array.isArray(data) ? data : (data.events || []);
          
          let filtered = eventsList.filter(evt => evt.isHighlighted);
          
          if (filtered.length === 0) {
            filtered = eventsList.slice(0, 3).map((evt, idx) => ({
              ...evt,
              isHighlighted: true,
              highlightOrder: idx + 1,
              highlightDescription: evt.highlightDescription || evt.desc || '',
              highlightTheme: idx === 0 ? 'Purple' : idx === 1 ? 'Cyan' : 'IEEE Blue'
            }));
          }
          
          filtered.sort((a, b) => (a.highlightOrder || 0) - (b.highlightOrder || 0));
          setHighlights(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch highlighted events:", err);
      }
    };
    
    fetchHighlights();
  }, []);

  const getStatIconAndColor = (label, index) => {
    const text = (label || '').toLowerCase();
    
    // Choose icon based on keyword or index
    const styles = [
      {
        icon: <Users size={28} />,
        color: '#0F4C5C', // Teal
        bgColor: 'rgba(15, 76, 92, 0.08)'
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

  const formatEmbedUrl = (url) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.includes('youtube.com/embed/')) {
      return cleanUrl;
    }
    let videoId = '';
    if (cleanUrl.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(cleanUrl);
        videoId = urlObj.searchParams.get('v');
      } catch (e) {
        const match = cleanUrl.match(/[?&]v=([^&#]+)/);
        if (match) videoId = match[1];
      }
    } else if (cleanUrl.includes('youtu.be/')) {
      const parts = cleanUrl.split('youtu.be/');
      if (parts.length > 1) {
        videoId = parts[1].split(/[?#]/)[0];
      }
    } else if (cleanUrl.includes('youtube.com/shorts/')) {
      const parts = cleanUrl.split('youtube.com/shorts/');
      if (parts.length > 1) {
        videoId = parts[1].split(/[?#]/)[0];
      }
    } else if (cleanUrl.includes('youtube.com/v/')) {
      const parts = cleanUrl.split('youtube.com/v/');
      if (parts.length > 1) {
        videoId = parts[1].split(/[?#]/)[0];
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return cleanUrl;
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
            KEC IEEE Student Branch
            <br />
            Kongu Engineering College
          </h1>

          {/* Join button */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
            <RouterLink
              to="/contact"
              style={{
                backgroundColor: 'rgba(var(--secondary-rgb), 0.25)',
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
            background-color: rgba(var(--secondary-rgb), 0.45) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(var(--secondary-rgb), 0.35) !important;
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

      {/* A. Detailed About IEEE KEC Student Branch Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          {/* Who We Are */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start', marginBottom: '56px' }}>
            <div className="card" style={{ padding: '36px', height: '100%', borderTop: '4px solid var(--secondary)' }}>
              <SectionLabel text="Who We Are" />
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary)', fontWeight: '800' }}>
                {defaultAboutKecSbData.whoWeAre.title}
              </h2>
              <p style={{ marginBottom: '18px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.75' }}>
                {defaultAboutKecSbData.whoWeAre.intro}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.75', margin: 0 }}>
                {defaultAboutKecSbData.whoWeAre.introSecondary}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
              <div className="card" style={{ padding: '24px', borderTop: '3px solid var(--secondary)' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(var(--secondary-rgb), 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Compass size={20} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Our Mission</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
                  {defaultAboutKecSbData.whoWeAre.mission}
                </p>
              </div>

              <div className="card" style={{ padding: '24px', borderTop: '3px solid var(--accent-cyan)' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={20} style={{ color: 'var(--accent-cyan)' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Our Vision</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
                  {defaultAboutKecSbData.whoWeAre.vision}
                </p>
              </div>
            </div>
          </div>

          {/* Glance Statistics */}
          <div style={{ marginBottom: '56px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <SectionLabel text="Branch Numbers" />
              <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
                IEEE at a Glance
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {defaultAboutKecSbData.stats.map((stat, idx) => (
                <div key={idx} className="card scroll-reveal zoom-in" style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(var(--secondary-rgb), 0.08)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s ease'
                }}>
                  <h3 style={{ fontSize: '36px', fontWeight: '850', color: 'var(--secondary)', marginBottom: '6px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    <AnimatedCounter value={stat.count} />
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: '56px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <SectionLabel text="Our Legacy" />
              <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
                Journey Timeline
              </h2>
            </div>
            <div className="timeline-container" style={{ position: 'relative', margin: '40px auto 0', padding: '10px 0' }}>
              {defaultAboutKecSbData.timeline.map((item, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div key={idx} className={`timeline-item ${isLeft ? 'left' : 'right'} scroll-reveal fade-up`}>
                    <div className="timeline-dot" />
                    <div className="card" style={{
                      padding: '28px',
                      width: '100%',
                      borderTop: '3px solid var(--secondary)',
                      transition: 'all 0.3s ease',
                      boxShadow: 'var(--shadow-sm)',
                      backgroundColor: '#ffffff'
                    }}>
                      <span style={{ fontSize: '18px', fontWeight: '850', color: 'var(--secondary)', display: 'block', marginBottom: '6px' }}>
                        {item.year}
                      </span>
                      <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px', lineHeight: '1.4' }}>
                        {item.title}
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Impact Areas */}
          <div style={{ marginBottom: '56px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <SectionLabel text="Empowering Students" />
              <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
                Branch Impact Areas
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {defaultAboutKecSbData.impact.map((imp, idx) => (
                <div key={idx} className="card about-feature-card scroll-reveal fade-up" style={{ padding: '28px', transition: 'all 0.3s ease', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(var(--secondary-rgb), 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {getAboutSbIcon(imp.icon, { color: 'var(--secondary)' })}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px', margin: 0 }}>
                      {imp.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', margin: '6px 0 0' }}>
                      {imp.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* B. Detailed About IEEE Student Branch (Global) Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
            <div className="card" style={{ padding: '36px', borderTop: '4px solid var(--secondary)' }}>
              <SectionLabel text="Overview" />
              <h2 style={{ fontSize: '22px', marginBottom: '16px', color: 'var(--primary)', fontWeight: '800' }}>What is IEEE?</h2>
              <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
                IEEE is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity.
              </p>
              <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
                Through its highly cited publications, conferences, technology standards, and professional and educational activities, IEEE is the trusted voice across aerospace systems, computers, telecommunications, biomedical engineering, electric power, and consumer electronics.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
                IEEE has over 420,000 members in more than 160 countries and sponsors more than 1,800 annual conferences and meetings worldwide.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FeatureCard
                icon={Target}
                title="Core Vision"
                desc="IEEE will be essential to the global technical community and be universally recognized for the contributions of technology and of technical professionals in improving global conditions."
                accent
              />
              <FeatureCard
                icon={Compass}
                title="IEEE Mission"
                desc="IEEE's core purpose is to foster technological innovation and excellence for the benefit of humanity."
              />
              <FeatureCard
                icon={Award}
                title="Global Reach"
                desc="With 160+ country presence and 1,800+ conferences annually, IEEE is the definitive home for technical professionals worldwide."
              />
            </div>
          </div>
        </div>
      </section>

      {/* C. Detailed Why Join IEEE Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <SectionLabel text="Benefits" />
            <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
              Why Join IEEE?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {defaultAboutKecSbData.whyJoin.map((benefit, idx) => (
              <div key={idx} className="card scroll-reveal fade-up" style={{ padding: '28px', borderLeft: '4px solid var(--secondary)', transition: 'all 0.3s ease', backgroundColor: '#ffffff', borderTop: '1px solid rgba(var(--secondary-rgb), 0.08)', borderRight: '1px solid rgba(var(--secondary-rgb), 0.08)', borderBottom: '1px solid rgba(var(--secondary-rgb), 0.08)' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px' }}>
                  {benefit.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>

          <style>{`
            .timeline-container::before {
              content: '';
              position: absolute;
              left: 50%;
              top: 0;
              bottom: 0;
              width: 4px;
              background-color: rgba(var(--secondary-rgb), 0.12);
              transform: translateX(-50%);
            }
            .timeline-item {
              display: flex;
              width: 50%;
              position: relative;
              margin-bottom: 36px;
              box-sizing: border-box;
            }
            .timeline-item.left {
              justify-content: flex-end;
              padding-right: 32px;
              margin-left: 0;
            }
            .timeline-item.right {
              justify-content: flex-start;
              padding-left: 32px;
              margin-left: 50%;
            }
            .timeline-dot {
              position: absolute;
              top: 24px;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--secondary);
              border: 4px solid #ffffff;
              box-shadow: 0 0 0 3px rgba(var(--secondary-rgb), 0.15);
              z-index: 2;
            }
            .timeline-item.left .timeline-dot {
              right: -8px;
            }
            .timeline-item.right .timeline-dot {
              left: -8px;
            }
            .about-feature-card {
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              background-color: #ffffff;
            }
            .about-feature-card:hover {
              transform: translateY(-4px) !important;
              box-shadow: 0 12px 24px rgba(var(--secondary-rgb), 0.08) !important;
            }

            @media (max-width: 768px) {
              .timeline-container::before {
                left: 16px !important;
                transform: none;
              }
              .timeline-item {
                width: 100% !important;
                margin-left: 0 !important;
                padding-left: 36px !important;
                padding-right: 0 !important;
                justify-content: flex-start !important;
              }
              .timeline-dot {
                left: 8px !important;
                right: auto !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* Society Quick Access Section */}
      <section className="section-padding scroll-reveal" style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: '800', color: 'var(--primary)' }}>Society Quick Access</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary)', margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginInline: 'auto' }}>
              Quick access to our specialized technical societies and affinity chapters.
            </p>
          </div>
          <div className="society-grid">
            {societiesList.map((soc) => {
              let key = '';
              const nameLower = soc.name.toLowerCase();
              if (nameLower.includes('antennas') || nameLower.includes('propagation') || nameLower.includes('aps')) key = 'ap-s';
              else if (nameLower.includes('computer')) key = 'computer-society';
              else if (nameLower.includes('women') || nameLower.includes('wie')) key = 'wie';
              else if (nameLower.includes('robotics') || nameLower.includes('ras')) key = 'ras';
              else if (nameLower.includes('power') || nameLower.includes('pes')) key = 'pes';
              else if (nameLower.includes('communications') || nameLower.includes('comsoc')) key = 'comsoc';

              const themeColor = soc.theme?.primary || 'var(--secondary)';
              
              // Choose appropriate icon
              let socIcon = <BookOpen size={24} />;
              if (key === 'ap-s') socIcon = <MessageSquare size={24} />;
              else if (key === 'computer-society') socIcon = <Award size={24} />;
              else if (key === 'wie') socIcon = <Users size={24} />;
              else if (key === 'ras') socIcon = <Award size={24} />;
              else if (key === 'pes') socIcon = <Zap size={24} />;
              else if (key === 'comsoc') socIcon = <Globe size={24} />;

              return (
                <div key={key} className="card society-card-hover" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  borderTop: `4px solid ${themeColor}`,
                  borderLeft: `1px solid rgba(${hexToRgb(themeColor)}, 0.15)`,
                  borderRight: `1px solid rgba(${hexToRgb(themeColor)}, 0.15)`,
                  borderBottom: `1px solid rgba(${hexToRgb(themeColor)}, 0.15)`,
                  borderRadius: '16px',
                  padding: '28px',
                  transition: 'all 0.3s ease',
                  height: '100%'
                }}>
                  <div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: `rgba(${hexToRgb(themeColor)}, 0.08)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: themeColor,
                      marginBottom: '20px'
                    }}>
                      {socIcon}
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px', color: 'var(--primary)' }}>
                      {soc.name}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px', margin: '0' }}>
                      {soc.tagline || soc.description}
                    </p>
                  </div>
                  <RouterLink to={`/execomm/${key}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: themeColor,
                    fontWeight: '700',
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    marginTop: 'auto'
                  }}>
                    View Roster & Milestones <ArrowRight size={14} />
                  </RouterLink>
                </div>
              );
            })}
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
                    boxShadow: `inset 0 0 10px rgba(${color === '#0F4C5C' ? '15, 76, 92' : '0, 0, 0'}, 0.02)`
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div className="home-stat-value" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.2' }}>
                      <AnimatedCounter value={stat.value} />
                    </div>
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
                  src={formatEmbedUrl(keystonesVideoUrl)}
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
                <Quote size={40} style={{ color: 'rgba(var(--secondary-rgb), 0.15)', marginBottom: '16px' }} />
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
                    backgroundColor: idx === currentTestimonialIdx ? 'var(--secondary)' : 'rgba(var(--secondary-rgb), 0.2)',
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
      <section style={{ backgroundColor: '#ffffff', padding: '40px 0 80px', overflow: 'hidden' }} className="scroll-reveal">
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

          {highlights.length > 0 ? (
            <div style={{ position: 'relative', width: '100%', margin: '0 auto', paddingBottom: '20px' }}>
              {/* Navigation Arrows */}
              {highlights.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="event-slider-arrow left"
                    title="Previous Slide"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="event-slider-arrow right"
                    title="Next Slide"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Carousel Track */}
              <div className="event-slider-track">
                {[...Array(Math.min(3, highlights.length))].map((_, offset) => {
                  if (highlights.length === 0) return null;
                  
                  let itemIndex;
                  if (highlights.length === 1) {
                    itemIndex = 0;
                  } else {
                    itemIndex = (carouselIndex + offset - 1 + highlights.length) % highlights.length;
                  }
                  
                  const evt = highlights[itemIndex];
                  const isCenter = offset === 1 || highlights.length === 1;
                  
                  if (!evt) return null;
                  
                  return (
                    <div
                      key={`${evt.id}-${offset}`}
                      className={`event-slide-card ${isCenter ? 'center' : 'side'}`}
                      onClick={() => {
                        if (!isCenter && highlights.length > 1) {
                          setCarouselIndex(itemIndex);
                          resetAutoplay();
                        }
                      }}
                      style={{
                        backgroundColor: '#ffffff',
                        border: isCenter ? '2px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                        boxShadow: isCenter ? '0 20px 45px rgba(var(--secondary-rgb), 0.22)' : 'var(--shadow-sm)'
                      }}
                    >
                      {/* Cover Image or pre-defined Gradient Theme */}
                      <div className="event-slide-cover">
                        {evt.highlightImage ? (
                          <img src={evt.highlightImage} alt={evt.title} className="event-slide-cover-img" />
                        ) : (
                          <div className="event-slide-cover-gradient" style={{
                            background: THEME_GRADIENTS[evt.highlightTheme] || THEME_GRADIENTS['Purple']
                          }}>
                            <div className="event-slide-cover-circle" />
                            {getEventIcon(evt.tag)}
                          </div>
                        )}

                        {/* Event Category Tag */}
                        <span className="event-card-badge">
                          {evt.tag}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="event-slide-content">
                        <div>
                          {/* Date & Completed status */}
                          <div className="event-slide-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '500' }}>{evt.date}</span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '750',
                              color: '#166534',
                              backgroundColor: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Completed
                            </span>
                          </div>
                          
                          <h3 className="event-slide-title">
                            {evt.title}
                          </h3>
                          
                          {isCenter && (
                            <p className="event-slide-snippet" style={{ marginTop: '8px' }}>
                              {evt.highlightDescription || evt.desc}
                            </p>
                          )}
                        </div>

                        {isCenter && (
                          <RouterLink to="/events/past" className="event-slide-link">
                            Learn more →
                          </RouterLink>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Indicators (Dots) */}
              {highlights.length > 1 && (
                <div className="event-slider-dots">
                  {highlights.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      className={`event-slider-dot ${carouselIndex === idx ? 'active' : ''}`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>No highlighted events found.</p>
            </div>
          )}
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
        .video-frame-container {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .video-frame-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.18), 0 0 25px rgba(var(--secondary-rgb), 0.15) !important;
        }
        .tab-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(var(--secondary-rgb), 0.2) !important;
        }
        .stat-card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(var(--secondary-rgb), 0.3) !important;
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
