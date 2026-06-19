import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Shield, Users, Compass, BookOpen, Target, Landmark, GraduationCap, CheckCircle2, Sparkles, Cpu, Heart, Globe, Calendar, ArrowRight } from 'lucide-react';


// ─── Shared PageHeader ────────────────────────────────────────────────────────
const PageHeader = ({ title, subtitle, bgImageGrad = 'var(--gradient-primary)' }) => (
  <div style={{
    background: bgImageGrad,
    color: '#ffffff',
    padding: '70px 0',
    textAlign: 'center',
    marginBottom: '48px',
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
      position: 'absolute', top: '-10%', right: '-8%',
      width: '320px', height: '320px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <h1 className="font-serif" style={{ fontSize: '38px', color: '#ffffff', marginBottom: '12px', fontWeight: '800' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '600px', marginInline: 'auto' }}>
          {subtitle}
        </p>
      )}
    </div>
    {/* Decorative Wave Bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)', zIndex: 2 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,101.4,227.14,83.56,258.14,76.22,290.41,68.22,321.39,56.44Z" fill="var(--bg-light)"></path>
      </svg>
    </div>
  </div>
);

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <span style={{
    padding: '6px 14px',
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    color: 'var(--secondary)',
    border: '1px solid rgba(79, 70, 229, 0.15)',
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
      backgroundColor: 'rgba(79, 70, 229, 0.08)', display: 'flex',
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

// ─── 1. IEEE Global ───────────────────────────────────────────────────────────
export const IEEEGlobal = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="About IEEE" subtitle="Institute of Electrical and Electronics Engineers — The World's Largest Technical Professional Organization" />
    <div className="container">

      {/* About block */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start', marginBottom: '48px' }}>
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
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(79,70,229,0.08) !important; }`}</style>
  </div>
);

// ─── 2. KVITT Trust ───────────────────────────────────────────────────────────
export const KVITTTrust = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="Kongu Vellalar Institute of Technology Trust" subtitle="KVITT — Driving Educational Empowerment in the Kongu Region since 1983" />
    <div className="container">

      {/* History */}
      <div className="card" style={{ padding: '36px', marginBottom: '36px', borderTop: '4px solid var(--secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={22} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <SectionLabel text="Founding Story" />
            <h2 style={{ fontSize: '22px', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>History of the Trust</h2>
          </div>
        </div>
        <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          Established in 1983 by 37 traditional patrons of the Kongu region, the <strong>Kongu Vellalar Institute of Technology Trust (KVITT)</strong> has been a pioneer in delivering quality technical and higher education to the rural and semi-urban student community in Tamil Nadu.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          The guiding principle of the trust has always been philanthropic educational service: to uplift society by creating institutions that provide top-tier scientific, engineering, and arts knowledge. From humble beginnings, the trust now manages multiple leading institutions, catering to the education of thousands of students.
        </p>
      </div>

      {/* Institution Cards */}
      <div>
        <SectionLabel text="Institutions Under KVITT" />
        <h2 style={{ fontSize: '22px', color: 'var(--primary)', fontWeight: '800', margin: '10px 0 24px' }}>Our Family of Institutions</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[
          { Icon: GraduationCap, title: 'Kongu Engineering College', desc: 'Our premier autonomous engineering campus offering UG, PG, and PhD programs in core and interdisciplinary streams.', accent: 'var(--secondary)' },
          { Icon: BookOpen, title: 'Kongu Arts & Science College', desc: 'Offering programs in Computer Science, Humanities, and Commerce with a strong industry-ready curriculum.', accent: 'var(--accent-cyan)' },
          { Icon: Shield, title: 'Kongu Polytechnic College', desc: 'Imparting quality practical diploma programs in core engineering disciplines, preparing skilled technicians.', accent: 'var(--accent)' },
        ].map(({ Icon, title, desc, accent }) => (
          <div key={title} className="card about-feature-card" style={{ padding: '28px', textAlign: 'center', borderTop: `3px solid ${accent}` }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon size={26} style={{ color: accent }} />
            </div>
            <h3 style={{ fontSize: '17px', marginBottom: '10px', fontWeight: '750', color: 'var(--primary)' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(79,70,229,0.08) !important; }`}</style>
  </div>
);

// ─── 3. KEC College ───────────────────────────────────────────────────────────
export const KonguEngineering = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="Kongu Engineering College" subtitle="Autonomous Institution | Affiliated to Anna University | NAAC A++ Accredited" />
    <div className="container">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '36px' }}>

        {/* Overview Card */}
        <div className="card" style={{ padding: '36px', borderTop: '4px solid var(--secondary)' }}>
          <SectionLabel text="Academic Overview" />
          <h2 style={{ fontSize: '20px', marginBottom: '14px', color: 'var(--primary)', fontWeight: '800' }}>About the College</h2>
          <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
            Kongu Engineering College (KEC) was established in 1984 under the KVITT trust. Located in a sprawling 167-acre eco-friendly green campus in Perundurai, Erode, KEC has earned a reputation as one of the best private engineering colleges in Tamil Nadu and India.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
            KEC is accredited by NAAC with 'A++' Grade and has consistently ranked high in NIRF. The college offers 14 UG programs, 19 PG programs, and doctoral research programs across all engineering disciplines.
          </p>
        </div>

        {/* Infrastructure Card */}
        <div className="card" style={{ padding: '36px', borderTop: '4px solid var(--accent-cyan)' }}>
          <SectionLabel text="Infrastructure" />
          <h2 style={{ fontSize: '20px', marginBottom: '18px', color: 'var(--primary)', fontWeight: '800' }}>Key Facilities</h2>
          <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
            {[
              "Highly equipped Research Laboratories in all departments",
              "Central library with 100,000+ volumes and digital databases",
              "Technology Business Incubator (TBI) supported by DST, Govt of India",
              "Advanced High Performance Computing (HPC) facilities",
              "Active student placement cell with industry partnerships"
            ].map((infra, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '13.5px', color: 'var(--text-muted)', alignItems: 'flex-start' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                {infra}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// ─── 4. KEC SRC ───────────────────────────────────────────────────────────────
export const KECSRC = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="KEC Students Research Cell" subtitle="Supporting Student Innovation, Prototype Development & IP Creation" />
    <div className="container">

      {/* Hero Content */}
      <div className="card" style={{ padding: '36px', marginBottom: '32px', borderTop: '4px solid var(--secondary)' }}>
        <SectionLabel text="Innovation Wing" />
        <h2 style={{ fontSize: '22px', marginBottom: '14px', color: 'var(--primary)', fontWeight: '800' }}>Empowering Innovation</h2>
        <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          The <strong>KEC Students Research Cell (SRC)</strong> is a specialized research wing that supports undergraduate and postgraduate students in translating theoretical engineering knowledge into functional physical and software prototypes.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          Working hand-in-hand with professional bodies like the IEEE Student Branch, KEC SRC hosts project contests, provides funding grants for promising ideas, and pairs students with expert faculty mentors.
        </p>
      </div>

      <SectionLabel text="Support Programs" />
      <h2 style={{ fontSize: '22px', color: 'var(--primary)', fontWeight: '800', margin: '10px 0 24px' }}>How SRC Supports Students</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[
          { Icon: Award, title: 'Seed Funding', desc: 'Grants financial assistance for component procurement and assembly of engineering projects with promising innovation potential.', accent: 'var(--secondary)' },
          { Icon: Shield, title: 'Patent Assistance', desc: 'Offers IP support and legal guidance for students filing patents on original prototypes developed under research programs.', accent: 'var(--accent-cyan)' },
          { Icon: BookOpen, title: 'Conference Sponsorship', desc: 'Reimburses registration and travel fees for peer-reviewed conference paper presentations at national and international forums.', accent: 'var(--accent)' },
        ].map(({ Icon, title, desc, accent }) => (
          <div key={title} className="card about-feature-card" style={{ padding: '28px', borderTop: `3px solid ${accent}` }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={20} style={{ color: accent }} />
            </div>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '750', color: 'var(--primary)' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(79,70,229,0.08) !important; }`}</style>
  </div>
);

// ─── 5. IEEE KEC SB ───────────────────────────────────────────────────────────
// ─── 5. IEEE KEC SB ───────────────────────────────────────────────────────────
export const defaultAboutKecSbData = {
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
  ],
  cta: {
    title: "Ready to Shape the Future of Technology?",
    text: "Join the IEEE KEC Student Branch family today. Unlock global networking, resources, and career-defining opportunities.",
    "btn1Text": "Become a Member",
    "btn1Link": "https://www.ieee.org/membership/join/index.html",
    "btn2Text": "Explore Societies",
    "btn2Link": "/execomm"
  }
};

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

const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value, 10) || 0;
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

export const IEEEKECSB = () => {
  const [data, setData] = useState(defaultAboutKecSbData);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_about_kec_sb_v1');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing about kec sb data:", e);
      }
    }
  }, []);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px' }}>
      <PageHeader 
        title="IEEE KEC Student Branch" 
        subtitle="Empowering Student Engineering Leadership and Global Professional Collaboration" 
      />
      
      <div className="container">
        {/* A. Who We Are Section */}
        <div className="scroll-reveal fade-up" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start', marginBottom: '56px' }}>
          <div className="card" style={{ padding: '36px', height: '100%', borderTop: '4px solid var(--secondary)' }}>
            <SectionLabel text="Who We Are" />
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary)', fontWeight: '800' }}>
              {data.whoWeAre.title}
            </h2>
            <p style={{ marginBottom: '18px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.75' }}>
              {data.whoWeAre.intro}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.75', margin: 0 }}>
              {data.whoWeAre.introSecondary}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div className="card" style={{ padding: '24px', borderTop: '3px solid var(--secondary)' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(79, 70, 229, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={20} style={{ color: 'var(--secondary)' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Our Mission</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
                {data.whoWeAre.mission}
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
                {data.whoWeAre.vision}
              </p>
            </div>
          </div>
        </div>

        {/* B. Glance Statistics Section */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <SectionLabel text="Branch Numbers" />
            <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
              IEEE at a Glance
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {data.stats.map((stat, idx) => (
              <div key={idx} className="card scroll-reveal zoom-in" style={{
                padding: '24px 16px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(79, 70, 229, 0.08)',
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

        {/* C. Journey Timeline Section */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <SectionLabel text="Our Legacy" />
            <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
              Journey Timeline
            </h2>
          </div>

          <div className="timeline-container" style={{ position: 'relative', margin: '40px auto 0', padding: '10px 0' }}>
            {data.timeline.map((item, idx) => {
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

        {/* D. Branch Impact Section */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <SectionLabel text="Empowering Students" />
            <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
              Branch Impact Areas
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {data.impact.map((imp, idx) => (
              <div key={idx} className="card about-feature-card scroll-reveal fade-up" style={{ padding: '28px', transition: 'all 0.3s ease', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

        {/* E. Why Join IEEE? Section */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <SectionLabel text="Benefits" />
            <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginTop: '6px' }}>
              Why Join IEEE?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {data.whyJoin.map((benefit, idx) => (
              <div key={idx} className="card scroll-reveal fade-up" style={{ padding: '28px', borderLeft: '4px solid var(--secondary)', transition: 'all 0.3s ease', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px' }}>
                  {benefit.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* F. Call-to-Action Banner */}
        {data.cta && (
          <div className="card scroll-reveal fade-up" style={{
            marginTop: '56px',
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
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
              <h2 className="font-serif" style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px', fontWeight: '800' }}>
                {data.cta.title}
              </h2>
              <p style={{ color: '#d0e4f2', fontSize: '14.5px', lineHeight: '1.65', marginBottom: '28px' }}>
                {data.cta.text}
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={data.cta.btn1Link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '700', borderRadius: '30px', textDecoration: 'none' }}>
                  {data.cta.btn1Text}
                </a>
                <Link to={data.cta.btn2Link} className="btn" style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '700', borderRadius: '30px', backgroundColor: 'transparent', color: '#ffffff', border: '2px solid #ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {data.cta.btn2Text} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .timeline-container::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: rgba(79, 70, 229, 0.12);
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
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
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
          box-shadow: 0 12px 24px rgba(79, 70, 229, 0.08) !important;
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
  );
};

// ─── 6. KEC SPS Chapter ───────────────────────────────────────────────────────
export const KECSPS = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader
      title="IEEE KEC Signal Processing Society"
      subtitle="IEEE KEC SPS Student Branch Chapter"
      bgImageGrad="var(--gradient-cyber)"
    />
    <div className="container">

      <div className="card" style={{ padding: '36px', marginBottom: '32px', borderTop: '4px solid var(--accent-cyan)' }}>
        <SectionLabel text="Chapter Overview" />
        <h2 style={{ fontSize: '22px', marginBottom: '14px', color: 'var(--primary)', fontWeight: '800' }}>Signal Processing Society Chapter</h2>
        <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          The <strong>IEEE KEC Signal Processing Society (SPS) Student Chapter</strong> is dedicated to the study, research, and application of signal processing techniques including image processing, computer vision, speech and audio processing, machine learning models, and communications.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          We organize hands-on training programs in Python, MATLAB, and microcontroller deployments to build student skills in processing real-world sensor streams and signals.
        </p>
      </div>

      <SectionLabel text="Focus Areas" />
      <h2 style={{ fontSize: '22px', color: 'var(--primary)', fontWeight: '800', margin: '10px 0 24px' }}>Technical Focus Areas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[
          { Icon: Award, title: 'Image & Vision', desc: 'Computer vision algorithms, edge detection, and deep learning for object recognition and visual data analysis.', accent: 'var(--secondary)' },
          { Icon: Users, title: 'Speech & Bio-Signals', desc: 'Processing techniques for audio, EMG, and ECG signals for medical and assistive technology applications.', accent: 'var(--accent-cyan)' },
          { Icon: Shield, title: 'Embedded DSP', desc: 'Hardware-level signal analysis on microcontrollers, IoT boards, and FPGA systems for real-time deployment.', accent: 'var(--accent)' },
        ].map(({ Icon, title, desc, accent }) => (
          <div key={title} className="card about-feature-card" style={{ padding: '28px', borderTop: `3px solid ${accent}` }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={20} style={{ color: accent }} />
            </div>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '750', color: 'var(--primary)' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(79,70,229,0.08) !important; }`}</style>
  </div>
);

// ─── 7. KEC WIE Group ─────────────────────────────────────────────────────────
export const KECWIE = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader
      title="IEEE KEC Women in Engineering"
      subtitle="IEEE KEC WIE Affinity Group — Inspiring the Next Generation of Female Engineers"
      bgImageGrad="var(--gradient-colorful)"
    />
    <div className="container">

      <div className="card" style={{ padding: '36px', marginBottom: '32px', borderTop: '4px solid var(--secondary)' }}>
        <SectionLabel text="Affinity Group" />
        <h2 style={{ fontSize: '22px', marginBottom: '14px', color: 'var(--primary)', fontWeight: '800' }}>Women in Engineering Affinity Group</h2>
        <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          The <strong>IEEE Women in Engineering (WIE) Affinity Group at Kongu Engineering College</strong> is part of the largest international professional network dedicated to promoting women engineers and scientists, and inspiring young girls to follow their interest in scientific careers.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          WIE KEC organizes coding camps, mentorship sessions, leadership forums, and community development workshops. We strive to provide resources, peer encouragement, and visibility to female engineering students at KEC.
        </p>
      </div>

      <SectionLabel text="Core Programs" />
      <h2 style={{ fontSize: '22px', color: 'var(--primary)', fontWeight: '800', margin: '10px 0 24px' }}>Our Flagship Initiatives</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[
          { Icon: Users, title: 'Mentorship Forums', desc: 'Interactive sessions connecting current female students with successful alumni in tech leadership roles across the industry.', accent: 'var(--secondary)' },
          { Icon: BookOpen, title: 'Coding Bootcamps', desc: 'Dedicated tech bootcamps in web development, database systems, and mobile application development for women engineers.', accent: 'var(--accent-cyan)' },
          { Icon: Sparkles, title: 'Outreach & Welfare', desc: 'Community outreach workshops to promote digital literacy and STEM awareness among rural school girls in the Kongu region.', accent: 'var(--accent)' },
        ].map(({ Icon, title, desc, accent }) => (
          <div key={title} className="card about-feature-card" style={{ padding: '28px', borderTop: `3px solid ${accent}` }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={20} style={{ color: accent }} />
            </div>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '750', color: 'var(--primary)' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(79,70,229,0.08) !important; }`}</style>
  </div>
);

