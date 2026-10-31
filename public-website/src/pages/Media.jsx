import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Image, 
  FileText, 
  X, 
  Maximize2, 
  Download, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  Tag, 
  Sparkles,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import API from '../services/api';

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
      position: 'absolute', top: '-10%', right: '-8%',
      width: '320px', height: '320px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.12) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <h1 className="font-serif" style={{ fontSize: '38px', color: '#ffffff', marginBottom: '8px', fontWeight: '800' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>{subtitle}</p>}
    </div>
    {/* Decorative Wave Bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)', zIndex: 2 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,101.4,227.14,83.56,258.14,76.22,290.41,68.22,321.39,56.44Z" fill="var(--bg-light)"></path>
      </svg>
    </div>
  </div>
);

// Society Configuration with Official Branding Colors
export const SOCIETIES = [
  { id: 'All', name: 'All Societies', color: '#0a385b', bg: '#e0f2fe' },
  { id: 'CS', name: 'IEEE Computer Society', short: 'Computer Society', color: '#ea580c', bg: '#ffedd5' },
  { id: 'APS', name: 'IEEE Antennas & Propagation Society', short: 'APS', color: '#1e3a8a', bg: '#dbeafe' },
  { id: 'WIE', name: 'IEEE Women in Engineering', short: 'WIE', color: '#9333ea', bg: '#f3e8ff' },
  { id: 'RAS', name: 'IEEE Robotics & Automation Society', short: 'RAS', color: '#dc2626', bg: '#fee2e2' },
  { id: 'PES', name: 'IEEE Power & Energy Society', short: 'PES', color: '#16a34a', bg: '#dcfce7' },
  { id: 'ComSoc', name: 'IEEE Communications Society', short: 'ComSoc', color: '#0284c7', bg: '#e0f2fe' },
  { id: 'SB', name: 'KEC IEEE SB', short: 'KEC IEEE SB', color: '#0f766e', bg: '#ccfbf1' }
];

export const getSocietyMeta = (catOrName) => {
  if (!catOrName) return { name: 'KEC IEEE SB', short: 'KEC IEEE SB', color: '#0f766e', bg: '#ccfbf1' };
  const lower = catOrName.toLowerCase();
  if (lower.includes('computer') || lower.includes('cs')) {
    return { name: 'IEEE Computer Society', short: 'Computer Society', color: '#ea580c', bg: '#ffedd5' };
  }
  if (lower.includes('antenna') || lower.includes('aps') || lower.includes('ap-s')) {
    return { name: 'IEEE Antennas & Propagation Society', short: 'APS', color: '#1e3a8a', bg: '#dbeafe' };
  }
  if (lower.includes('women') || lower.includes('wie')) {
    return { name: 'IEEE Women in Engineering', short: 'WIE', color: '#9333ea', bg: '#f3e8ff' };
  }
  if (lower.includes('robot') || lower.includes('ras')) {
    return { name: 'IEEE Robotics & Automation Society', short: 'RAS', color: '#dc2626', bg: '#fee2e2' };
  }
  if (lower.includes('power') || lower.includes('energy') || lower.includes('pes')) {
    return { name: 'IEEE Power & Energy Society', short: 'PES', color: '#16a34a', bg: '#dcfce7' };
  }
  if (lower.includes('comsoc') || lower.includes('communicat')) {
    return { name: 'IEEE Communications Society', short: 'ComSoc', color: '#0284c7', bg: '#e0f2fe' };
  }
  return { name: catOrName || 'KEC IEEE SB', short: catOrName || 'KEC IEEE SB', color: '#0f766e', bg: '#ccfbf1' };
};

const Media = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'newsletters' | 'research'
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeFolder, setActiveFolder] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [selectedSocietyFilter, setSelectedSocietyFilter] = useState('All');
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  useEffect(() => {
    if (location.pathname.includes('/newsletters') || location.pathname.includes('/news')) {
      setActiveTab('newsletters');
    } else if (location.pathname.includes('/gallery')) {
      setActiveTab('gallery');
    }
  }, [location.pathname]);

  const defaultMediaVideos = [
    {
      title: "KEC IEEE SB Decade Celebration Promo Reel",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      desc: "An overview reel capturing 10 years of student leadership, technical symposiums, and outreach drives at Kongu Engineering College."
    },
    {
      title: "GreenTech Hackathon Pitch Finalists - KEC SRC",
      url: "https://youtu.be/8qGIyNu5Qqo",
      desc: "Recap video showcasing student project prototypes and presentation pitches at Perundurai campus."
    }
  ];

  const [mediaVideos, setMediaVideos] = useState(defaultMediaVideos);

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

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API}/videos`);
        if (res.ok) {
          const data = await res.json();
          const mappedVideos = data.map(v => ({
            id: v._id,
            title: v.title,
            url: v.url,
            desc: v.description || v.desc || ''
          }));
          setMediaVideos(mappedVideos.length > 0 ? mappedVideos : defaultMediaVideos);
        } else {
          setMediaVideos(defaultMediaVideos);
        }
      } catch (err) {
        setMediaVideos(defaultMediaVideos);
      }
    };
    fetchVideos();
  }, []);

  // Predefined default gallery fallback showcasing each society with rich photo sets
  const defaultGallery = [
    {
      id: 1,
      title: "HackOverflow 2025 - 24hr Flagship Hackathon",
      cat: "IEEE Computer Society",
      text: "Over 200+ student developers solving problem statements in Generative AI, Cloud infrastructure, and Decentralized Web.",
      images: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=max",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=max",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=max"
      ]
    },
    {
      id: 2,
      title: "RF & Microstrip Antenna Design Hands-on Workshop",
      cat: "IEEE Antennas & Propagation Society",
      text: "Students exploring High-Frequency Structure Simulator (HFSS) and Vector Network Analyzers for Sub-6 GHz wireless applications.",
      images: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=max",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=max",
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=800&auto=format&fit=max"
      ]
    },
    {
      id: 3,
      title: "Women in Tech Leadership Summit & Mentorship Bootcamp",
      cat: "IEEE Women in Engineering",
      text: "Celebrating women innovators with leadership talks, coding hack challenges, and career guidance by industry alumnae.",
      images: [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=max",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=max",
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=max"
      ]
    },
    {
      id: 4,
      title: "Autonomous Rovers & Drone Robotics Arena",
      cat: "IEEE Robotics & Automation Society",
      text: "Competitive obstacle-course challenge testing ROS navigation, computer vision tracking, and microcontroller hardware.",
      images: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=max",
        "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800&auto=format&fit=max",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=max"
      ]
    },
    {
      id: 5,
      title: "Smart Solar Grids & Electric Mobility Colloquium",
      cat: "IEEE Power & Energy Society",
      text: "Industry guest lectures and project demonstration of solar battery balancing systems and clean energy charging infrastructure.",
      images: [
        "https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=max",
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=max",
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=max"
      ]
    },
    {
      id: 6,
      title: "5G Telemetry & Software Defined Radio Masterclass",
      cat: "IEEE Communications Society",
      text: "Hands-on GNU Radio and RTL-SDR spectrum analysis sessions for students pursuing next-gen telecommunication protocols.",
      images: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=max",
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=max",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=max"
      ]
    },
    {
      id: 7,
      title: "KEC IEEE SB Annual Investiture & General Body Gala",
      cat: "KEC IEEE SB",
      text: "The annual induction of incoming Student Branch office bearers, section awards distribution, and alumni reunion.",
      images: [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=max",
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=max",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=max"
      ]
    },
    {
      id: 8,
      title: "KEC SRC - Student Research Cell Hardware Demonstrations",
      cat: "KEC IEEE SB",
      text: "Inter-disciplinary hardware prototypes funded by KEC Student Research Cell displayed for peer critique and review.",
      images: [
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200&auto=format&fit=max",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=max"
      ]
    }
  ];

  // Default Newsletters items
  const defaultNewsletters = [
    {
      id: 1,
      title: "KEC IEEE SB Horizon - Annual Newsletter",
      society: "KEC IEEE SB",
      volume: "Volume 8 • Issue 1",
      date: "January 2026",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=max",
      editorial: "A Year of Breakthroughs, Section Awards, and 40+ Flagship Technical Initiatives across Kongu Engineering College.",
      highlights: [
        "IEEE Madras Section Outstanding Branch Recognition",
        "Student Branch Executive Committee 2025-26 Inductions",
        "Decade Gala & Technical Outreach across rural schools",
        "Over 12 student research papers published in IEEE Xplore"
      ],
      pages: 28,
      editor: "Student Branch Editorial Board"
    },
    {
      id: 2,
      title: "ByteWave - Computer Society Newsletter",
      society: "IEEE Computer Society",
      volume: "Quarterly Bulletin • Issue 4",
      date: "October 2025",
      cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=max",
      editorial: "Exploring Artificial Intelligence, Open-Source Contributions, and Cloud-Native Innovations.",
      highlights: [
        "HackOverflow 2025 Grand Finale Winning Innovations",
        "Roadmap: Mastering Fullstack Web Development in 2026",
        "Interview with KEC Alumni working at Tier-1 Tech Giants",
        "Hands-on Guide: Docker, Kubernetes & CI/CD Pipelines"
      ],
      pages: 18,
      editor: "CS Society Web & Content Team"
    },
    {
      id: 3,
      title: "Empower - WIE Affinity Group Newsletter",
      society: "IEEE Women in Engineering",
      volume: "Annual Edition • Vol. 5",
      date: "December 2025",
      cover: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=max",
      editorial: "Fostering Women in Science, Technology, and Leadership through Mentorship and Peer Support.",
      highlights: [
        "Keynote Reflections: Women Tech Leaders in Semiconductor Design",
        "EmpowerHER Hackathon Winners and Prototype Demos",
        "Mentorship Circles for Junior Year Engineering Women",
        "Community Outreach: Digital Literacy in Rural Perundurai"
      ],
      pages: 22,
      editor: "WIE Student Coordinators"
    },
    {
      id: 4,
      title: "Spark & Waves - APS Chapter Technical Digest",
      society: "IEEE Antennas & Propagation Society",
      volume: "Technical Monograph • Issue 2",
      date: "November 2025",
      cover: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=max",
      editorial: "Frontiers in Microstrip Antennas, Microwave Circuit Design, and High-Frequency RF Simulation.",
      highlights: [
        "Sub-6 GHz 5G Dual-Band Patch Antenna Design Study",
        "Laboratory Testing on Vector Network Analyzer (VNA)",
        "Student Delegation at IEEE MAPCON Conference",
        "Upcoming RF Hardware Design Competition Announcement"
      ],
      pages: 16,
      editor: "APS Editorial Team"
    },
    {
      id: 5,
      title: "RoboPulse - RAS & PES Joint Engineering Bulletin",
      society: "IEEE Robotics & Automation Society",
      volume: "Hardware Special • Issue 3",
      date: "August 2025",
      cover: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=max",
      editorial: "Robotics, Embedded Systems, and Clean Energy Storage Innovations by KEC Student Innovators.",
      highlights: [
        "ROS2 Autonomous Mobile Robot Navigation Case Study",
        "Solar Energy Maximum Power Point Tracking (MPPT) Systems",
        "RoboClash Battlebot Tournament Championship Highlights",
        "EV Battery Thermal Management Hardware Prototype"
      ],
      pages: 20,
      editor: "RAS & PES Technical Committee"
    },
    {
      id: 6,
      title: "SignalLine - ComSoc Student Chapter Edition",
      society: "IEEE Communications Society",
      volume: "Telecom Review • Issue 1",
      date: "September 2025",
      cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=max",
      editorial: "Broadband, Optical Fiber Communication, and Software Defined Radio Protocols.",
      highlights: [
        "Satellite Telemetry & Ground Station Tracking in KEC",
        "Introduction to GNU Radio and Software Defined Receivers",
        "Optical Time-Domain Reflectometer (OTDR) Workshop",
        "Next Frontiers in 6G and Terahertz Communications"
      ],
      pages: 14,
      editor: "ComSoc Publication Desk"
    }
  ];

  const handleDownloadNewsletter = (newsletter, e) => {
    e.stopPropagation();
    let content = `========================================================================\n`;
    content += `         KONGU ENGINEERING COLLEGE IEEE STUDENT BRANCH (KEC IEEE SB)   \n`;
    content += `                         BRANCH CODE: 30041                             \n`;
    content += `                    OFFICIAL STUDENT NEWSLETTER                         \n`;
    content += `========================================================================\n\n`;
    content += `Title:        ${newsletter.title}\n`;
    content += `Society:      ${newsletter.society}\n`;
    content += `Volume/Issue: ${newsletter.volume}\n`;
    content += `Date:         ${newsletter.date}\n`;
    content += `Editor:       ${newsletter.editor}\n`;
    content += `Pages:        ${newsletter.pages} Pages\n\n`;
    content += `Editorial Summary:\n`;
    content += `${newsletter.editorial}\n\n`;
    content += `Key Featured Articles & Highlights:\n`;
    newsletter.highlights.forEach((h, i) => {
      content += `  ${i + 1}. ${h}\n`;
    });
    content += `\n------------------------------------------------------------------------\n`;
    content += `Verified Publication Record | KEC IEEE SB Media & Publication Committee\n`;
    content += `Website: https://ieee-kec.org | Branch Code: 30041\n`;
    content += `========================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    const filename = `${newsletter.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_edition.txt`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleDownloadPaper = async (paper, e) => {
    e.preventDefault();
    const fileUrl = paper.fileUrl;
    if (!fileUrl) return;

    if (fileUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${paper.title.replace(/\s+/g, '_')}_document`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    let content = `========================================================================\n`;
    content += `         IEEE KONGU ENGINEERING COLLEGE STUDENT BRANCH (KEC IEEE SB)   \n`;
    content += `                     RESEARCH & PROJECT PUBLICATIONS                    \n`;
    content += `========================================================================\n\n`;
    content += `Title:       ${paper.title}\n`;
    content += `Authors:     ${paper.authors}\n`;
    content += `Category:    ${paper.category}\n`;
    content += `Year:        ${paper.year}\n\n`;
    content += `Description/Abstract:\n`;
    content += `${paper.desc}\n\n`;
    content += `------------------------------------------------------------------------\n`;
    content += `Status: Verified Publication Record\n`;
    content += `KEC IEEE Student Branch (Branch Code: 30041) - Research Portal\n`;
    content += `========================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    const filename = `${paper.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_publication.txt`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const [galleryRes, newsRes] = await Promise.all([
          fetch(`${API}/gallery`),
          fetch(`${API}/announcements`)
        ]);
        
        if (galleryRes.ok) {
          const gData = await galleryRes.json();
          const mappedGallery = gData.map(g => ({
            id: g._id,
            title: g.title,
            cat: g.category || 'KEC IEEE SB',
            text: g.description,
            images: g.images && g.images.length > 0 ? g.images : []
          }));
          setGalleryItems(mappedGallery.length > 0 ? mappedGallery : defaultGallery);
        } else {
          setGalleryItems(defaultGallery);
        }

        if (newsRes.ok) {
          const nData = await newsRes.json();
          if (nData && nData.length > 0) {
            const mappedNews = nData.filter(n => n.isActive).map(n => ({
              id: n._id,
              title: n.title,
              society: n.category || 'KEC IEEE SB',
              volume: n.source || 'Issue 2025-26',
              date: new Date(n.date || n.createdAt).toLocaleDateString(),
              cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=max',
              editorial: n.content,
              highlights: [
                n.content.slice(0, 100) + '...',
                "Technical contributions under IEEE Madras Section",
                "Full project and research write-up inside"
              ],
              pages: 12,
              editor: 'Editorial Board'
            }));
            setNewsletters(mappedNews.length > 0 ? [...mappedNews, ...defaultNewsletters] : defaultNewsletters);
          } else {
            setNewsletters(defaultNewsletters);
          }
        } else {
          setNewsletters(defaultNewsletters);
        }
      } catch (err) {
        setGalleryItems(defaultGallery);
        setNewsletters(defaultNewsletters);
      }
    };
    
    fetchMediaData();

    // Load Research Papers
    const fetchResearch = async () => {
      try {
        const res = await fetch(`${API}/research`);
        if (res.ok) {
          const data = await res.json();
          const mappedPapers = data.map(p => ({
            id: p._id,
            title: p.title,
            authors: p.authors,
            category: p.category,
            desc: p.desc,
            year: p.year,
            fileUrl: p.fileUrl
          }));
          setResearchPapers(mappedPapers);
        } else {
          setResearchPapers([]);
        }
      } catch (err) {
        setResearchPapers([]);
      }
    };
    fetchResearch();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
        setSelectedNewsletter(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter gallery items by selected society
  const filteredGallery = selectedSocietyFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => {
        const meta = getSocietyMeta(item.cat);
        const filterMeta = SOCIETIES.find(s => s.id === selectedSocietyFilter);
        if (!filterMeta) return true;
        return meta.short.toLowerCase().includes(filterMeta.short.toLowerCase()) || 
               item.cat.toLowerCase().includes(filterMeta.id.toLowerCase());
      });

  // Filter newsletters by selected society
  const filteredNewsletters = selectedSocietyFilter === 'All'
    ? newsletters
    : newsletters.filter(item => {
        const meta = getSocietyMeta(item.society);
        const filterMeta = SOCIETIES.find(s => s.id === selectedSocietyFilter);
        if (!filterMeta) return true;
        return meta.short.toLowerCase().includes(filterMeta.short.toLowerCase()) || 
               item.society.toLowerCase().includes(filterMeta.id.toLowerCase());
      });

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px', minHeight: '70vh' }}>
      <PageHeader
        title="Media & Publications Center"
        subtitle="Explore photo logs of our technical societies, flagship newsletters, and research publications"
      />

      <div className="container">
        {/* Toggle gallery vs newsletters vs research */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveTab('gallery'); setActiveFolder(null); }}
            style={{
              padding: '12px 28px',
              fontSize: '14.5px',
              fontWeight: '700',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'gallery' ? 'var(--gradient-cyber)' : '#ffffff',
              color: activeTab === 'gallery' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'gallery' ? '0 4px 15px rgba(6, 182, 212, 0.35)' : 'var(--shadow-sm)',
              transition: 'all 0.25s ease'
            }}
          >
            <Image size={17} />
            Photo Gallery
          </button>
          
          <button
            onClick={() => { setActiveTab('newsletters'); setActiveFolder(null); }}
            style={{
              padding: '12px 28px',
              fontSize: '14.5px',
              fontWeight: '700',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'newsletters' ? 'var(--gradient-cyber)' : '#ffffff',
              color: activeTab === 'newsletters' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'newsletters' ? '0 4px 15px rgba(6, 182, 212, 0.35)' : 'var(--shadow-sm)',
              transition: 'all 0.25s ease'
            }}
          >
            <BookOpen size={17} />
            Newsletters
          </button>

          <button
            onClick={() => { setActiveTab('research'); setActiveFolder(null); }}
            style={{
              padding: '12px 28px',
              fontSize: '14.5px',
              fontWeight: '700',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'research' ? 'var(--gradient-cyber)' : '#ffffff',
              color: activeTab === 'research' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'research' ? '0 4px 15px rgba(6, 182, 212, 0.35)' : 'var(--shadow-sm)',
              transition: 'all 0.25s ease'
            }}
          >
            <FileText size={17} />
            Research Papers & Projects
          </button>
        </div>

        {/* Society Filter Bar with Specific Society Colors */}
        {(activeTab === 'gallery' || activeTab === 'newsletters') && !activeFolder && (
          <div style={{
            background: '#ffffff',
            padding: '16px 20px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '36px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              paddingRight: '12px',
              borderRight: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap'
            }}>
              <Filter size={15} />
              Societies:
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
              {SOCIETIES.map(soc => {
                const isSelected = selectedSocietyFilter === soc.id;
                return (
                  <button
                    key={soc.id}
                    onClick={() => setSelectedSocietyFilter(soc.id)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '24px',
                      fontSize: '13px',
                      fontWeight: isSelected ? '700' : '600',
                      cursor: 'pointer',
                      border: isSelected ? `2px solid ${soc.color}` : '1px solid #e2e8f0',
                      background: isSelected ? soc.color : '#ffffff',
                      color: isSelected ? '#ffffff' : soc.color,
                      boxShadow: isSelected ? `0 4px 12px ${soc.color}40` : 'none',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isSelected ? '#ffffff' : soc.color,
                      display: 'inline-block'
                    }} />
                    {soc.short || soc.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery tab view - Bento Grid with Society Specific Color Backgrounds */}
        {activeTab === 'gallery' && (
          <>
            {activeFolder ? (
              <div className="animate-fade-in">
                {/* Header card / block for folder */}
                <div style={{ marginBottom: '32px' }}>
                  <button 
                    onClick={() => setActiveFolder(null)}
                    className="back-to-albums-btn"
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      padding: '8px 18px',
                      borderRadius: '20px',
                      color: 'var(--primary)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginBottom: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    ← Back to All Albums
                  </button>
                  
                  {(() => {
                    const socMeta = getSocietyMeta(activeFolder.cat);
                    return (
                      <div className="album-header-card" style={{
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        minHeight: '260px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '36px',
                        boxShadow: 'var(--shadow-md)',
                        borderTop: `5px solid ${socMeta.color}`
                      }}>
                        {/* Background image covering the entire container */}
                        {activeFolder.images && activeFolder.images[0] && (
                          <img 
                            src={activeFolder.images[0]} 
                            alt={activeFolder.title} 
                            className="album-header-cover-img" 
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              zIndex: 0
                            }}
                          />
                        )}

                        {/* Gradient overlay for readability */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(to top, rgba(5, 23, 38, 0.95) 0%, rgba(5, 23, 38, 0.6) 50%, rgba(5, 23, 38, 0.2) 100%)`,
                          zIndex: 1
                        }} />

                        {/* Society badge in top-right with specific society color as background */}
                        <span style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          background: socMeta.color,
                          color: '#ffffff',
                          padding: '8px 18px',
                          borderRadius: '24px',
                          fontSize: '13px',
                          fontWeight: '800',
                          letterSpacing: '0.5px',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                          zIndex: 2,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Sparkles size={14} />
                          {socMeta.name}
                        </span>

                        {/* Bottom-left aligned text content */}
                        <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
                          <h2 className="font-serif" style={{ color: '#ffffff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
                            {activeFolder.title}
                          </h2>
                          <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                            {activeFolder.text}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Grid of images in this folder */}
                <div className="folder-images-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  {activeFolder.images && activeFolder.images.length > 0 ? (
                    activeFolder.images.map((imgUrl, imgIdx) => (
                      <div 
                        key={imgIdx}
                        onClick={() => {
                          setSelectedImage(activeFolder);
                          setLightboxIndex(imgIdx);
                        }}
                        style={{
                          height: '220px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        className="folder-image-card"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${activeFolder.title} - ${imgIdx + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(5, 23, 38, 0.45)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                        >
                          <span style={{
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: '700',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(4px)',
                            padding: '6px 14px',
                            borderRadius: '20px'
                          }}>
                            View High-Res Photo ↗
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                      <Image size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                      <p style={{ fontSize: '15px', fontWeight: '600' }}>No pictures in this album yet</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {filteredGallery.length > 0 ? (
                  <div className="gallery-bento-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                  }}>
                    {filteredGallery.map((item) => {
                      const socMeta = getSocietyMeta(item.cat);
                      return (
                        <div
                          key={item.id}
                          className="card"
                          onClick={() => setActiveFolder(item)}
                          style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.25s ease',
                            position: 'relative'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 12px 24px ${socMeta.color}25`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                          }}
                        >
                          {/* Image Thumbnail Container */}
                          <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(135deg, ${socMeta.color} 0%, #0a385b 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Image size={48} color="#ffffff" style={{ opacity: 0.6 }} />
                              </div>
                            )}

                            {/* Specific Society Color as the Name Background */}
                            <div style={{
                              position: 'absolute',
                              top: '14px',
                              left: '14px',
                              background: socMeta.color,
                              color: '#ffffff',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '800',
                              letterSpacing: '0.4px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                              zIndex: 3,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffffff' }} />
                              {socMeta.name}
                            </div>

                            {/* Photo Count Pill */}
                            {item.images && item.images.length > 1 && (
                              <div style={{
                                position: 'absolute',
                                bottom: '14px',
                                right: '14px',
                                background: 'rgba(5, 23, 38, 0.8)',
                                backdropFilter: 'blur(4px)',
                                color: '#ffffff',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '700',
                                zIndex: 3,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <Image size={12} />
                                {item.images.length} Photos
                              </div>
                            )}
                          </div>

                          {/* Album Details */}
                          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{
                              fontSize: '17px',
                              fontWeight: '800',
                              color: 'var(--primary)',
                              marginBottom: '8px',
                              lineHeight: '1.4'
                            }}>
                              {item.title}
                            </h3>
                            <p style={{
                              fontSize: '13.5px',
                              color: 'var(--text-muted)',
                              lineHeight: '1.5',
                              margin: '0 0 16px 0',
                              flex: 1
                            }}>
                              {item.text}
                            </p>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: '12px',
                              borderTop: '1px solid var(--border-subtle)',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              color: socMeta.color
                            }}>
                              <span>Open Photo Album</span>
                              <ChevronRight size={16} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    <Image size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                    <p style={{ fontSize: '16px', fontWeight: '700' }}>No albums found for the selected society</p>
                    <button
                      onClick={() => setSelectedSocietyFilter('All')}
                      style={{
                        marginTop: '12px',
                        background: 'var(--gradient-cyber)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      View All Societies
                    </button>
                  </div>
                )}

                {/* Video Highlights & Memories */}
                {mediaVideos && mediaVideos.length > 0 && (
                  <div style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                      <span style={{
                        padding: '4px 14px',
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--primary)',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        Video Highlights & Reels
                      </span>
                      <h2 className="font-serif" style={{ fontSize: '28px', color: 'var(--primary)', marginTop: '10px', fontWeight: '800' }}>
                        Video Highlights & Memories
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginTop: '6px' }}>
                        Watch recap reels and student presentations from flagship events at Kongu Engineering College
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                      {mediaVideos.map((video, idx) => (
                        <div key={idx} className="card" style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                            <iframe
                              src={formatEmbedUrl(video.url)}
                              width="100%"
                              height="210"
                              style={{ border: 0, display: 'block' }}
                              allowFullScreen
                              title={video.title}
                            />
                          </div>
                          <h3 style={{ fontSize: '16px', color: 'var(--primary)', fontWeight: '800', margin: '0 0 6px 0' }}>{video.title}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{video.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Newsletters tab view (Replaces News Clippings) */}
        {activeTab === 'newsletters' && (
          <div className="animate-fade-in">
            <div style={{
              textAlign: 'center',
              marginBottom: '36px',
              maxWidth: '700px',
              margin: '0 auto 36px'
            }}>
              <span style={{
                padding: '4px 14px',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                color: 'var(--secondary)',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '8px'
              }}>
                Publications & Editions
              </span>
              <h2 className="font-serif" style={{ fontSize: '30px', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>
                KEC IEEE SB Official Newsletters
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginTop: '8px', lineHeight: '1.6' }}>
                Curated digests, student research reports, and technical milestones published by our Student Branch and specialized Society chapters.
              </p>
            </div>

            {filteredNewsletters.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '28px'
              }}>
                {filteredNewsletters.map((item) => {
                  const socMeta = getSocietyMeta(item.society);
                  return (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.25s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = `0 12px 24px ${socMeta.color}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      }}
                    >
                      {/* Top Cover Banner */}
                      <div style={{
                        position: 'relative',
                        height: '180px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={item.cover}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(to top, rgba(5, 23, 38, 0.9) 0%, rgba(5, 23, 38, 0.3) 100%)`
                        }} />

                        {/* Society Name with specific society color as background */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: socMeta.color,
                          color: '#ffffff',
                          padding: '5px 12px',
                          borderRadius: '16px',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          letterSpacing: '0.4px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                          {socMeta.name}
                        </div>

                        {/* Date badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          background: 'rgba(255,255,255,0.92)',
                          color: 'var(--primary)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Calendar size={12} />
                          {item.date}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: socMeta.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '6px'
                        }}>
                          {item.volume}
                        </span>

                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: 'var(--primary)',
                          margin: '0 0 10px 0',
                          lineHeight: '1.4'
                        }}>
                          {item.title}
                        </h3>

                        <p style={{
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                          lineHeight: '1.5',
                          marginBottom: '16px'
                        }}>
                          {item.editorial}
                        </p>

                        {/* Highlights list */}
                        <div style={{
                          background: socMeta.bg,
                          padding: '12px 14px',
                          borderRadius: '10px',
                          marginBottom: '18px',
                          border: `1px solid ${socMeta.color}30`
                        }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: socMeta.color, textTransform: 'uppercase', marginBottom: '6px' }}>
                            Featured in this Issue:
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#1e293b', lineHeight: '1.5' }}>
                            {item.highlights.slice(0, 3).map((h, hIdx) => (
                              <li key={hIdx} style={{ marginBottom: '3px' }}>{h}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                          marginTop: 'auto',
                          display: 'flex',
                          gap: '10px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-subtle)'
                        }}>
                          <button
                            onClick={() => setSelectedNewsletter(item)}
                            style={{
                              flex: 1,
                              padding: '9px 14px',
                              background: '#ffffff',
                              border: `1.5px solid ${socMeta.color}`,
                              color: socMeta.color,
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <BookOpen size={15} />
                            Preview
                          </button>

                          <button
                            onClick={(e) => handleDownloadNewsletter(item, e)}
                            style={{
                              flex: 1,
                              padding: '9px 14px',
                              background: socMeta.color,
                              border: 'none',
                              color: '#ffffff',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: `0 3px 10px ${socMeta.color}35`,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Download size={15} />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <BookOpen size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                <p style={{ fontSize: '16px', fontWeight: '700' }}>No newsletters found for the selected society</p>
                <button
                  onClick={() => setSelectedSocietyFilter('All')}
                  style={{
                    marginTop: '12px',
                    background: 'var(--gradient-cyber)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  View All Societies
                </button>
              </div>
            )}
          </div>
        )}

        {/* Research Papers tab view */}
        {activeTab === 'research' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {researchPapers.length > 0 ? (
              researchPapers.map(paper => (
                <div key={paper.id} className="card" style={{
                  padding: '28px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      flexShrink: 0
                    }}>
                      <FileText size={28} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--secondary)',
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        backgroundColor: 'rgba(var(--secondary-rgb), 0.05)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        marginBottom: '6px'
                      }}>
                        {paper.category}
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0' }}>📅 {paper.year}</p>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '16.5px',
                    color: 'var(--primary)',
                    fontWeight: '800',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {paper.title}
                  </h3>

                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    👥 {paper.authors}
                  </p>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    flex: 1
                  }}>
                    {paper.desc}
                  </p>

                  <button
                    onClick={(e) => handleDownloadPaper(paper, e)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: 'rgba(var(--secondary-rgb), 0.05)',
                      color: 'var(--secondary)',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginTop: 'auto',
                      border: '1px solid var(--border-subtle)'
                    }}
                    className="paper-download-btn"
                  >
                    <Download size={16} />
                    Download Paper Abstract
                  </button>
                </div>
              ))
            ) : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--text-muted)'
              }}>
                <FileText size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                <p style={{ fontSize: '16px', fontWeight: '700' }}>No research papers or projects published yet</p>
                <p style={{ fontSize: '13.5px', marginTop: '8px' }}>Student research and project work from KEC SRC will be showcased here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Newsletter Reader Modal */}
      {selectedNewsletter && (
        <div 
          onClick={() => setSelectedNewsletter(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 23, 38, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '680px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              cursor: 'default',
              position: 'relative',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            {(() => {
              const socMeta = getSocietyMeta(selectedNewsletter.society);
              return (
                <div style={{
                  padding: '24px 28px',
                  background: `linear-gradient(135deg, ${socMeta.color} 0%, #0a385b 100%)`,
                  color: '#ffffff',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => setSelectedNewsletter(null)}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={20} />
                  </button>

                  <span style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '4px 12px',
                    borderRadius: '14px',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    {selectedNewsletter.volume} • {selectedNewsletter.date}
                  </span>

                  <h3 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', color: '#ffffff' }}>
                    {selectedNewsletter.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#e2e8f0', margin: 0 }}>
                    Published by: {selectedNewsletter.editor} (KEC IEEE SB)
                  </p>
                </div>
              );
            })()}

            {/* Modal Body */}
            <div style={{ padding: '28px', overflowY: 'auto' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                Editorial Summary
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                {selectedNewsletter.editorial}
              </p>

              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
                Featured Articles & Key Coverage
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {selectedNewsletter.highlights.map((h, i) => (
                  <div key={i} style={{
                    padding: '12px 16px',
                    background: 'var(--bg-light)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--gradient-cyber)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800',
                      flexShrink: 0
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155' }}>{h}</span>
                  </div>
                ))}
              </div>

              {/* Download Action inside modal */}
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setSelectedNewsletter(null)}
                  style={{
                    padding: '10px 20px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={(e) => handleDownloadNewsletter(selectedNewsletter, e)}
                  style={{
                    padding: '10px 22px',
                    background: 'var(--gradient-cyber)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)'
                  }}
                >
                  <Download size={16} />
                  Download Full Newsletter Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Image Zoom Viewer */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 23, 38, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
            cursor: 'pointer'
          }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
          >
            <X size={24} />
          </button>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '680px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              cursor: 'default',
              position: 'relative'
            }}
          >
            <div style={{
              height: '380px',
              backgroundColor: '#051726',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {selectedImage.images && selectedImage.images.length > 0 ? (
                <img 
                  src={selectedImage.images[lightboxIndex]} 
                  alt={selectedImage.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              ) : (
                <Image size={80} style={{ opacity: 0.5 }} />
              )}

              {/* Slider Navigation arrows */}
              {selectedImage.images && selectedImage.images.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxIndex((prev) => (prev === 0 ? selectedImage.images.length - 1 : prev - 1))}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      backgroundColor: 'rgba(10,56,91,0.85)',
                      border: 'none',
                      color: '#ffffff',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setLightboxIndex((prev) => (prev === selectedImage.images.length - 1 ? 0 : prev + 1))}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      backgroundColor: 'rgba(10,56,91,0.85)',
                      border: 'none',
                      color: '#ffffff',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    ›
                  </button>

                  {/* Bullet slide indicators */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    {selectedImage.images.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: lightboxIndex === i ? '#ffffff' : 'rgba(255,255,255,0.4)',
                          transition: 'background-color 0.2s'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Modal Info Area */}
            {(() => {
              const socMeta = getSocietyMeta(selectedImage.cat);
              return (
                <div style={{ padding: '28px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: socMeta.color,
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                    {socMeta.name}
                  </div>
                  <h3 style={{ fontSize: '20px', color: 'var(--primary)', margin: '4px 0 10px', fontWeight: '800' }}>
                    {selectedImage.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
                    {selectedImage.text}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
