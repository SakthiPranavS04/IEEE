import React from 'react';
import { Award, Shield, Users, Compass, BookOpen, Target, Landmark, GraduationCap, CheckCircle2, Sparkles } from 'lucide-react';

// ─── Shared PageHeader ────────────────────────────────────────────────────────
const PageHeader = ({ title, subtitle, bgImageGrad = 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)' }) => (
  <div style={{
    background: bgImageGrad,
    color: '#ffffff',
    padding: '60px 0',
    textAlign: 'center',
    marginBottom: '48px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', top: '-10%', right: '-8%',
      width: '320px', height: '320px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.03)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.02)', pointerEvents: 'none'
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
  </div>
);

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <span style={{
    padding: '4px 14px',
    backgroundColor: 'var(--accent-light)',
    color: 'var(--primary)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'inline-block',
    marginBottom: '10px'
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
    borderTop: accent ? '3px solid #02619a' : '3px solid transparent',
    transition: 'all 0.3s ease'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      backgroundColor: 'var(--accent-light)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={22} style={{ color: '#02619a' }} />
    </div>
    <div>
      <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '750', color: '#0a385b' }}>{title}</h3>
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
        <div className="card" style={{ padding: '36px', borderTop: '4px solid #0a385b' }}>
          <SectionLabel text="Overview" />
          <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#0a385b', fontWeight: '800' }}>What is IEEE?</h2>
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
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(10,56,91,0.08) !important; }`}</style>
  </div>
);

// ─── 2. KVITT Trust ───────────────────────────────────────────────────────────
export const KVITTTrust = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="Kongu Vellalar Institute of Technology Trust" subtitle="KVITT — Driving Educational Empowerment in the Kongu Region since 1983" />
    <div className="container">

      {/* History */}
      <div className="card" style={{ padding: '36px', marginBottom: '36px', borderTop: '4px solid #0a385b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={22} style={{ color: '#02619a' }} />
          </div>
          <div>
            <SectionLabel text="Founding Story" />
            <h2 style={{ fontSize: '22px', color: '#0a385b', fontWeight: '800', margin: 0 }}>History of the Trust</h2>
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
        <h2 style={{ fontSize: '22px', color: '#0a385b', fontWeight: '800', margin: '10px 0 24px' }}>Our Family of Institutions</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[
          { Icon: GraduationCap, title: 'Kongu Engineering College', desc: 'Our premier autonomous engineering campus offering UG, PG, and PhD programs in core and interdisciplinary streams.', accent: '#0a385b' },
          { Icon: BookOpen, title: 'Kongu Arts & Science College', desc: 'Offering programs in Computer Science, Humanities, and Commerce with a strong industry-ready curriculum.', accent: '#02619a' },
          { Icon: Shield, title: 'Kongu Polytechnic College', desc: 'Imparting quality practical diploma programs in core engineering disciplines, preparing skilled technicians.', accent: '#1d4ed8' },
        ].map(({ Icon, title, desc, accent }) => (
          <div key={title} className="card about-feature-card" style={{ padding: '28px', textAlign: 'center', borderTop: `3px solid ${accent}` }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon size={26} style={{ color: accent }} />
            </div>
            <h3 style={{ fontSize: '17px', marginBottom: '10px', fontWeight: '750', color: '#0a385b' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(10,56,91,0.08) !important; }`}</style>
  </div>
);

// ─── 3. KEC College ───────────────────────────────────────────────────────────
export const KonguEngineering = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="Kongu Engineering College" subtitle="Autonomous Institution | Affiliated to Anna University | NAAC A++ Accredited" />
    <div className="container">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '36px' }}>

        {/* Overview Card */}
        <div className="card" style={{ padding: '36px', borderTop: '4px solid #0a385b' }}>
          <SectionLabel text="Academic Overview" />
          <h2 style={{ fontSize: '20px', marginBottom: '14px', color: '#0a385b', fontWeight: '800' }}>About the College</h2>
          <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
            Kongu Engineering College (KEC) was established in 1984 under the KVITT trust. Located in a sprawling 167-acre eco-friendly green campus in Perundurai, Erode, KEC has earned a reputation as one of the best private engineering colleges in Tamil Nadu and India.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
            KEC is accredited by NAAC with 'A++' Grade and has consistently ranked high in NIRF. The college offers 14 UG programs, 19 PG programs, and doctoral research programs across all engineering disciplines.
          </p>
        </div>

        {/* Infrastructure Card */}
        <div className="card" style={{ padding: '36px', borderTop: '4px solid #02619a' }}>
          <SectionLabel text="Infrastructure" />
          <h2 style={{ fontSize: '20px', marginBottom: '18px', color: '#0a385b', fontWeight: '800' }}>Key Facilities</h2>
          <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
            {[
              "Highly equipped Research Laboratories in all departments",
              "Central library with 100,000+ volumes and digital databases",
              "Technology Business Incubator (TBI) supported by DST, Govt of India",
              "Advanced High Performance Computing (HPC) facilities",
              "Active student placement cell with industry partnerships"
            ].map((infra, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '13.5px', color: 'var(--text-muted)', alignItems: 'flex-start' }}>
                <CheckCircle2 size={15} style={{ color: '#02619a', flexShrink: 0, marginTop: '2px' }} />
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
      <div className="card" style={{ padding: '36px', marginBottom: '32px', borderTop: '4px solid #0a385b' }}>
        <SectionLabel text="Innovation Wing" />
        <h2 style={{ fontSize: '22px', marginBottom: '14px', color: '#0a385b', fontWeight: '800' }}>Empowering Innovation</h2>
        <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          The <strong>KEC Students Research Cell (SRC)</strong> is a specialized research wing that supports undergraduate and postgraduate students in translating theoretical engineering knowledge into functional physical and software prototypes.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          Working hand-in-hand with professional bodies like the IEEE Student Branch, KEC SRC hosts project contests, provides funding grants for promising ideas, and pairs students with expert faculty mentors.
        </p>
      </div>

      <SectionLabel text="Support Programs" />
      <h2 style={{ fontSize: '22px', color: '#0a385b', fontWeight: '800', margin: '10px 0 24px' }}>How SRC Supports Students</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[
          { Icon: Award, title: 'Seed Funding', desc: 'Grants financial assistance for component procurement and assembly of engineering projects with promising innovation potential.', accent: '#0a385b' },
          { Icon: Shield, title: 'Patent Assistance', desc: 'Offers IP support and legal guidance for students filing patents on original prototypes developed under research programs.', accent: '#02619a' },
          { Icon: BookOpen, title: 'Conference Sponsorship', desc: 'Reimburses registration and travel fees for peer-reviewed conference paper presentations at national and international forums.', accent: '#1d4ed8' },
        ].map(({ Icon, title, desc, accent }) => (
          <div key={title} className="card about-feature-card" style={{ padding: '28px', borderTop: `3px solid ${accent}` }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={20} style={{ color: accent }} />
            </div>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '750', color: '#0a385b' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(10,56,91,0.08) !important; }`}</style>
  </div>
);

// ─── 5. IEEE KEC SB ───────────────────────────────────────────────────────────
export const IEEEKECSB = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="IEEE KEC Student Branch" subtitle="Empowering Student Engineering Leadership and Global Professional Collaboration" />
    <div className="container">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        <div className="card" style={{ padding: '36px', borderTop: '4px solid #0a385b' }}>
          <SectionLabel text="Branch Overview" />
          <h2 style={{ fontSize: '20px', marginBottom: '14px', color: '#0a385b', fontWeight: '800' }}>Student Branch Overview</h2>
          <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
            The <strong>IEEE Kongu Engineering College Student Branch (IEEE KEC SB)</strong> was established to inspire technical innovation among students and provide them with a platform for professional growth. We regularly organize workshops, hackathons, and guest lectures on cutting-edge technologies.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
            As part of the <strong>IEEE Madras Section</strong>, our branch acts as a gateway for students to interact with global researchers, participate in international contests, and access IEEE's vast digital libraries and resources.
          </p>
        </div>

        <div className="card" style={{ padding: '36px', borderTop: '4px solid #02619a' }}>
          <SectionLabel text="Objectives" />
          <h2 style={{ fontSize: '20px', marginBottom: '18px', color: '#0a385b', fontWeight: '800' }}>Branch Activities & Objectives</h2>
          <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '14px', padding: 0, margin: 0 }}>
            {[
              "Imparting professional ethics and technical competencies",
              "Supporting participation in national and international hackathons",
              "Hosting guest lectures and mentorship networks with industry leaders",
              "Enhancing public speaking and organizational leadership capabilities",
              "Facilitating volunteer opportunities and global professional networking"
            ].map((activity, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '13.5px', color: 'var(--text-muted)', alignItems: 'flex-start' }}>
                <CheckCircle2 size={15} style={{ color: '#02619a', flexShrink: 0, marginTop: '2px' }} />
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// ─── 6. KEC SPS Chapter ───────────────────────────────────────────────────────
export const KECSPS = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader
      title="IEEE KEC Signal Processing Society"
      subtitle="IEEE KEC SPS Student Branch Chapter"
      bgImageGrad="linear-gradient(135deg, #072a44 0%, #00629b 100%)"
    />
    <div className="container">

      <div className="card" style={{ padding: '36px', marginBottom: '32px', borderTop: '4px solid #00629b' }}>
        <SectionLabel text="Chapter Overview" />
        <h2 style={{ fontSize: '22px', marginBottom: '14px', color: '#0a385b', fontWeight: '800' }}>Signal Processing Society Chapter</h2>
        <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          The <strong>IEEE KEC Signal Processing Society (SPS) Student Chapter</strong> is dedicated to the study, research, and application of signal processing techniques including image processing, computer vision, speech and audio processing, machine learning models, and communications.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          We organize hands-on training programs in Python, MATLAB, and microcontroller deployments to build student skills in processing real-world sensor streams and signals.
        </p>
      </div>

      <SectionLabel text="Focus Areas" />
      <h2 style={{ fontSize: '22px', color: '#0a385b', fontWeight: '800', margin: '10px 0 24px' }}>Technical Focus Areas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[
          { Icon: Award, title: 'Image & Vision', desc: 'Computer vision algorithms, edge detection, and deep learning for object recognition and visual data analysis.', accent: '#0a385b' },
          { Icon: Users, title: 'Speech & Bio-Signals', desc: 'Processing techniques for audio, EMG, and ECG signals for medical and assistive technology applications.', accent: '#00629b' },
          { Icon: Shield, title: 'Embedded DSP', desc: 'Hardware-level signal analysis on microcontrollers, IoT boards, and FPGA systems for real-time deployment.', accent: '#1d4ed8' },
        ].map(({ Icon, title, desc, accent }) => (
          <div key={title} className="card about-feature-card" style={{ padding: '28px', borderTop: `3px solid ${accent}` }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={20} style={{ color: accent }} />
            </div>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '750', color: '#0a385b' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(10,56,91,0.08) !important; }`}</style>
  </div>
);

// ─── 7. KEC WIE Group ─────────────────────────────────────────────────────────
export const KECWIE = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader
      title="IEEE KEC Women in Engineering"
      subtitle="IEEE KEC WIE Affinity Group — Inspiring the Next Generation of Female Engineers"
      bgImageGrad="linear-gradient(135deg, #0d3856 0%, #02619a 100%)"
    />
    <div className="container">

      <div className="card" style={{ padding: '36px', marginBottom: '32px', borderTop: '4px solid #02619a' }}>
        <SectionLabel text="Affinity Group" />
        <h2 style={{ fontSize: '22px', marginBottom: '14px', color: '#0a385b', fontWeight: '800' }}>Women in Engineering Affinity Group</h2>
        <p style={{ marginBottom: '14px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          The <strong>IEEE Women in Engineering (WIE) Affinity Group at Kongu Engineering College</strong> is part of the largest international professional network dedicated to promoting women engineers and scientists, and inspiring young girls to follow their interest in scientific careers.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.7' }}>
          WIE KEC organizes coding camps, mentorship sessions, leadership forums, and community development workshops. We strive to provide resources, peer encouragement, and visibility to female engineering students at KEC.
        </p>
      </div>

      <SectionLabel text="Core Programs" />
      <h2 style={{ fontSize: '22px', color: '#0a385b', fontWeight: '800', margin: '10px 0 24px' }}>Our Flagship Initiatives</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {[
          { Icon: Users, title: 'Mentorship Forums', desc: 'Interactive sessions connecting current female students with successful alumni in tech leadership roles across the industry.', accent: '#0a385b' },
          { Icon: BookOpen, title: 'Coding Bootcamps', desc: 'Dedicated tech bootcamps in web development, database systems, and mobile application development for women engineers.', accent: '#02619a' },
          { Icon: Sparkles, title: 'Outreach & Welfare', desc: 'Community outreach workshops to promote digital literacy and STEM awareness among rural school girls in the Kongu region.', accent: '#7e22ce' },
        ].map(({ Icon, title, desc, accent }) => (
          <div key={title} className="card about-feature-card" style={{ padding: '28px', borderTop: `3px solid ${accent}` }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={20} style={{ color: accent }} />
            </div>
            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '750', color: '#0a385b' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`.about-feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(10,56,91,0.08) !important; }`}</style>
  </div>
);
