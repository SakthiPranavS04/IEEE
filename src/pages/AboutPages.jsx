import React from 'react';
import { Award, Shield, Users, Compass, BookOpen, Target, Landmark, GraduationCap } from 'lucide-react';

// Reusable Page Header
const PageHeader = ({ title, subtitle, bgImageGrad = 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)' }) => (
  <div style={{
    background: bgImageGrad,
    color: '#ffffff',
    padding: '60px 0',
    textAlign: 'center',
    marginBottom: '48px'
  }}>
    <div className="container">
      <h1 className="font-serif" style={{ fontSize: '36px', color: '#ffffff', marginBottom: '12px' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '600px', marginInline: 'auto' }}>{subtitle}</p>}
    </div>
  </div>
);

// 1. IEEE Global Page Component
export const IEEEGlobal = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="About IEEE" subtitle="Institute of Electrical and Electronics Engineers" />
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '10px' }}>What is IEEE?</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
            IEEE is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity. 
          </p>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
            Through its highly cited publications, conferences, technology standards, and professional and educational activities, IEEE is the trusted voice on a wide variety of areas ranging from aerospace systems, computers, and telecommunications to biomedical engineering, electric power, and consumer electronics.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            IEEE contains over 420,000 members in more than 160 countries, and sponsors more than 1,800 annual conferences and meetings worldwide.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'start' }}>
            <Target size={36} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Core Vision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                IEEE will be essential to the global technical community and to technical professionals everywhere, and be universally recognized for the contributions of technology and of technical professionals in improving global conditions.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'start' }}>
            <Compass size={36} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>IEEE Mission</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                IEEE's core purpose is to foster technological innovation and excellence for the benefit of humanity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 2. KVITT Trust Page Component
export const KVITTTrust = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="Kongu Vellalar Institute of Technology Trust (KVITT)" subtitle="Driving educational empowerment in the Kongu region" />
    <div className="container">
      <div className="card" style={{ padding: '40px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Landmark size={24} style={{ color: 'var(--primary)' }} />
          History of the Trust
        </h2>
        <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '16px' }}>
          Established in 1983 by 37 traditional patrons of the Kongu region, the **Kongu Vellalar Institute of Technology Trust (KVITT)** has been a pioneer in delivering quality technical and higher education to the rural and semi-urban student community in Tamil Nadu.
        </p>
        <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '16px' }}>
          The guiding principle of the trust has always been philanthropic educational service: to uplift society by creating institutions that provide top-tier scientific, engineering, and arts knowledge. From humble beginnings, the trust now manages multiple leading institutions, catering to the education of thousands of students.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <GraduationCap size={40} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Kongu Engineering College</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Our premier autonomous engineering campus offering UG, PG, and PhD programs.</p>
        </div>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <BookOpen size={40} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Kongu Arts & Science College</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Offering programs in Computer Science, Humanities, and Commerce.</p>
        </div>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <Shield size={40} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Kongu Polytechnic College</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Imparting quality practical diploma programs in core engineering disciplines.</p>
        </div>
      </div>
    </div>
  </div>
);

// 3. KEC College Page Component
export const KonguEngineering = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="Kongu Engineering College (KEC)" subtitle="Autonomous Institution | Affiliated to Anna University" />
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        <div className="card">
          <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>Academic Overview</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
            Kongu Engineering College (KEC) was established in 1984 under the KVITT trust. Located in a sprawling 167-acre eco-friendly green campus in Perundurai, Erode, KEC has earned a reputation as one of the best private engineering colleges in Tamil Nadu and India.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            KEC is accredited by NAAC with 'A++' Grade and has consistently ranked high in the National Institutional Ranking Framework (NIRF). The college offers 14 undergraduate programs, 19 postgraduate programs, and doctoral research programs across all engineering disciplines.
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>Key Infrastructure</h2>
          <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              "Highly equipped Research Laboratories in all departments",
              "Sprawling central library with over 100,000 volumes and digital databases",
              "Technology Business Incubator (TBI) supported by DST, Govt of India",
              "Advanced High Performance Computing (HPC) facilities",
              "Active student placement cell with industry partnerships"
            ].map((infra, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '15px', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>✓</span> {infra}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// 4. KEC SRC Page Component
export const KECSRC = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="KEC Students Research Cell (SRC)" subtitle="Supporting student innovation and prototype development" />
    <div className="container">
      <div className="card" style={{ padding: '40px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--primary)' }}>Empowering Innovation</h2>
        <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7' }}>
          The **KEC Students Research Cell (SRC)** is a specialized research wing that supports undergraduate and postgraduate students in translating theoretical engineering knowledge into functional physical and software prototypes. 
        </p>
        <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7' }}>
          Working hand-in-hand with professional bodies like the IEEE Student Branch, KEC SRC hosts project contests, provides funding grants for promising ideas, and pairs students with expert faculty mentors.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Seed Funding</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Grants financial assistance for component procurement and assembly of engineering projects.</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Patent Assistance</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Offers IP support and legal guidance for students filing patents on original prototypes.</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Conference Sponsorship</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Reimburses registration and travel fees for peer-reviewed conference paper presentations.</p>
        </div>
      </div>
    </div>
  </div>
);

// 5. About IEEE KEC SB Page Component
export const IEEEKECSB = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader title="IEEE KEC Student Branch" subtitle="Empowering student engineering leadership and collaboration" />
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        <div className="card">
          <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>Student Branch Overview</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            The **IEEE Kongu Engineering College Student Branch (IEEE KEC SB)** was established to inspire technical innovation among students and provide them with a platform for professional growth. We regularly organize workshops, hackathons, and guest lectures on cutting-edge technologies.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            As part of the **IEEE Madras Section**, our branch acts as a gateway for students to interact with global researchers, participate in international contests, and access IEEE's vast digital libraries and resources.
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>Branch Activities & Objectives</h2>
          <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              "Imparting professional ethics and technical competencies",
              "Supporting student participation in national and international hackathons",
              "Hosting guest lectures and mentorship networks with industry leaders",
              "Enhancing public speaking and organizational leadership capabilities",
              "Facilitating volunteer opportunities and global professional networking"
            ].map((activity, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '15px', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--secondary)' }}>🌿</span> {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// 6. KEC SPS Chapter Page Component
export const KECSPS = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader
      title="IEEE KEC Signal Processing Society"
      subtitle="IEEE KEC SPS Student Branch Chapter"
      bgImageGrad="linear-gradient(135deg, #072a44 0%, #00629b 100%)"
    />
    <div className="container">
      <div className="card" style={{ padding: '40px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--primary)' }}>Signal Processing Society Chapter</h2>
        <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7' }}>
          The **IEEE KEC Signal Processing Society (SPS) Student Chapter** is dedicated to the study, research, and application of signal processing techniques. This includes image processing, computer vision, speech and audio processing, machine learning models, and communications.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7' }}>
          We organize hands-on training programs in Python, MATLAB, and microcontroller deployments to build student skills in processing real-world sensor streams and signals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Image & Vision</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Focuses on computer vision algorithms, edge detection, and deep learning for object recognition.</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Speech & Bio-Signals</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Covers processing techniques for audio, EMG, and ECG signals for medical and assistive applications.</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Embedded DSP</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Focuses on hardware-level signal analysis on microcontrollers, IoT boards, and FPGA boards.</p>
        </div>
      </div>
    </div>
  </div>
);

// 7. KEC WIE Affinity Group Page Component
export const KECWIE = () => (
  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px' }}>
    <PageHeader
      title="IEEE KEC Women in Engineering"
      subtitle="IEEE KEC WIE Affinity Group"
      bgImageGrad="linear-gradient(135deg, #0d3856 0%, #02619a 100%)"
    />
    <div className="container">
      <div className="card" style={{ padding: '40px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--primary)' }}>Women in Engineering Affinity Group</h2>
        <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7' }}>
          The **IEEE Women in Engineering (WIE) Affinity Group at Kongu Engineering College** is part of the largest international professional network dedicated to promoting women engineers and scientists, and inspiring young girls to follow their interest in scientific careers.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7' }}>
          WIE KEC organizes coding camps, mentorship sessions, leadership forums, and community development workshops. We strive to provide resources, peer encouragement, and visibility to female engineering students at KEC.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Mentorship Forums</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Interactive sessions connecting current female students with successful alumni in tech leadership.</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Coding Bootcamps</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Dedicated tech bootcamps in web development, database systems, and mobile applications.</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)' }}>Outreach & Welfare</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Community outreach workshops to promote digital literacy among rural school girls.</p>
        </div>
      </div>
    </div>
  </div>
);
