import React, { useState, useEffect } from 'react';
import { Image, FileText, X, Maximize2 } from 'lucide-react';

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
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <h1 className="font-serif" style={{ fontSize: '38px', color: '#ffffff', marginBottom: '8px', fontWeight: '800' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>}
    </div>
  </div>
);

const Media = () => {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'news' | 'research'
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeFolder, setActiveFolder] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newsCarouselIndex, setNewsCarouselIndex] = useState(0);

  const defaultMediaVideos = [
    {
      title: "IEEE KEC SB Decade Celebration Promo",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      desc: "An overview reel capturing 10 years of student leadership, technical symposiums, and outreach drives."
    },
    {
      title: "GreenTech Hackathon Pitch Finalists",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      desc: "Recap video showcasing student project prototypes and presentation pitches at Perundurai."
    }
  ];

  const [selectedCat, setSelectedCat] = useState('All');
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
    const storedVideos = localStorage.getItem('ieee_media_videos_v1');
    if (storedVideos) {
      setMediaVideos(JSON.parse(storedVideos));
    } else {
      localStorage.setItem('ieee_media_videos_v1', JSON.stringify(defaultMediaVideos));
    }
  }, []);

  // Predefined default gallery fallback
  const defaultGallery = [
    {
      id: 1,
      title: "Sports & Athletics",
      cat: "Campus Life",
      text: "State-level facilities",
      images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=max"]
    },
    {
      id: 2,
      title: "Cultural Events",
      cat: "Events",
      text: "Annual tech fest & symposiums",
      images: ["https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=max"]
    },
    {
      id: 3,
      title: "Learning Spaces",
      cat: "Academic",
      text: "24/7 library access",
      images: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=max"]
    },
    {
      id: 4,
      title: "Student Clubs",
      cat: "Engagement",
      text: "50+ active clubs",
      images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=max"]
    },
    {
      id: 5,
      title: "World-Class Hostel Facilities",
      cat: "Living",
      text: "Separate hostels for boys & girls with modern amenities, Wi-Fi, and 24/7 security",
      images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=max"]
    },
    {
      id: 6,
      title: "Transport Facilities",
      cat: "Services",
      text: "Extensive bus network for easy commute",
      images: ["https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=800&auto=format&fit=max"]
    },
    {
      id: 7,
      title: "Smart Auditoriums",
      cat: "Infrastructure",
      text: "Air-conditioned seminar halls with advanced AV systems",
      images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=max"]
    },
    {
      id: 8,
      title: "Research Labs",
      cat: "Innovation",
      text: "Advanced centers for computing and hardware testing",
      images: ["https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=max"]
    },
    {
      id: 9,
      title: "Green Campus",
      cat: "Environment",
      text: "Solar energy grids and eco-friendly spaces",
      images: ["https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=max"]
    },
    {
      id: 10,
      title: "Main Campus Gateway",
      cat: "KEC",
      text: "Welcome to Kongu Engineering College autonomous campus",
      images: ["https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=max"]
    }
  ];

  // Default news items
  const defaultNews = [
    {
      id: 1,
      title: "IEEE Student Branch KEC wins Best Branch Laurels",
      cat: "Award",
      source: "Erode Daily",
      date: "Oct 14, 2025",
      snippet: "Kongu Engineering College student branch recognized under Madras Section for outstanding technical contributions and volunteering.",
      color: "#8b5cf6"
    },
    {
      id: 2,
      title: "Students showcase Smart Assistive Device at State Expo",
      cat: "Exhibition",
      source: "Tech Journal",
      date: "Nov 02, 2025",
      snippet: "Sponsored by IEEE SPS and KEC SRC, a student team built a voice-assisted glove prototype for quadriplegic rehabilitation.",
      color: "#06b6d4"
    },
    {
      id: 3,
      title: "National Hackathon on Green Energy hosted by KEC IEEE SB",
      cat: "Hackathon",
      source: "The Campus News",
      date: "Jan 18, 2026",
      snippet: "More than 50 teams from across Southern India participated to pitch solar tracking and smart grid distribution prototypes.",
      color: "#10b981"
    }
  ];

  useEffect(() => {
    // Load and migrate gallery items if they are old or lack images
    const storedGallery = localStorage.getItem('ieee_gallery_items');
    let parsedGallery = storedGallery ? JSON.parse(storedGallery) : null;
    if (!parsedGallery || parsedGallery.length === 0 || !parsedGallery[0].images || parsedGallery[0].title === 'Flutter Bootcamp 2026') {
      localStorage.setItem('ieee_gallery_items', JSON.stringify(defaultGallery));
      parsedGallery = defaultGallery;
    } else {
      // Migrate existing localStorage gallery items from fit=crop to fit=max
      let migrated = false;
      const updatedGallery = parsedGallery.map(item => {
        if (item.images) {
          const updatedImages = item.images.map(img => {
            if (typeof img === 'string' && img.includes('fit=crop')) {
              migrated = true;
              return img.replace('fit=crop', 'fit=max');
            }
            return img;
          });
          return { ...item, images: updatedImages };
        }
        return item;
      });
      if (migrated) {
        localStorage.setItem('ieee_gallery_items', JSON.stringify(updatedGallery));
        parsedGallery = updatedGallery;
      }
    }
    setGalleryItems(parsedGallery);

    // Load Research Papers
    const storedPapers = localStorage.getItem('ieee_research_papers');
    if (storedPapers) {
      setResearchPapers(JSON.parse(storedPapers));
    } else {
      setResearchPapers([]);
    }

    // Load and migrate news items
    const storedNews = localStorage.getItem('ieee_news_items');
    let parsedNews = storedNews ? JSON.parse(storedNews) : null;
    if (!parsedNews || parsedNews.length === 0 || !parsedNews[0].cat) {
      localStorage.setItem('ieee_news_items', JSON.stringify(defaultNews));
      parsedNews = defaultNews;
    }
    setNewsItems(parsedNews);

    // Escape key listener for lightbox modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const uniqueCats = ['All', ...new Set(galleryItems.map(item => item.cat || 'General'))];
  const filteredGallery = selectedCat === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.cat === selectedCat);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px', minHeight: '70vh' }}>
      <PageHeader
        title="Media Center"
        subtitle="Explore photo logs of our workshops, projects, and newspaper highlights"
      />

      <div className="container">
        {/* Toggle gallery vs news */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
          <button
            onClick={() => { setActiveTab('gallery'); setActiveFolder(null); }}
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'gallery' ? 'var(--gradient-cyber)' : '#ffffff',
              color: activeTab === 'gallery' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'gallery' ? '0 4px 15px rgba(6, 182, 212, 0.35)' : 'var(--shadow-sm)',
              transition: 'all 0.25s ease'
            }}
          >
            Photo Gallery
          </button>
          <button
            onClick={() => { setActiveTab('news'); setActiveFolder(null); }}
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'news' ? 'var(--gradient-cyber)' : '#ffffff',
              color: activeTab === 'news' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'news' ? '0 4px 15px rgba(6, 182, 212, 0.35)' : 'var(--shadow-sm)',
              transition: 'all 0.25s ease'
            }}
          >
            News Clippings
          </button>
          <button
            onClick={() => { setActiveTab('research'); setActiveFolder(null); }}
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'research' ? 'var(--gradient-cyber)' : '#ffffff',
              color: activeTab === 'research' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'research' ? '0 4px 15px rgba(6, 182, 212, 0.35)' : 'var(--shadow-sm)',
              transition: 'all 0.25s ease'
            }}
          >
            Research Papers & Projects
          </button>
        </div>

        {/* Gallery tab view - Bento Grid */}
        {activeTab === 'gallery' && (
          <>
            {activeFolder ? (
              <div className="animate-fade-in">
                {/* Header card / block for folder */}
                <div style={{ marginBottom: '32px' }}>
                  <button 
                    onClick={() => setActiveFolder(null)}
                    className="back-to-albums-btn"
                  >
                    ← Back to Albums
                  </button>
                  
                  <div className="album-header-card">
                    {/* Background image covering the entire container */}
                    {activeFolder.images && activeFolder.images[0] && (
                      <img 
                        src={activeFolder.images[0]} 
                        alt={activeFolder.title} 
                        className="album-header-cover-img" 
                      />
                    )}

                    {/* Gradient overlay for readability */}
                    <div className="album-header-overlay" />

                    {/* Category pill badge in top-right */}
                    <span className="album-header-badge-tr">
                      {activeFolder.cat}
                    </span>

                    {/* Bottom-left aligned text content */}
                    <div className="album-header-text-bottom-left">
                      <h2 className="font-serif album-header-title-premium">
                        {activeFolder.title}
                      </h2>
                      <p className="album-header-subtitle-premium">
                        {activeFolder.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid of images in this folder (excluding cover photo) */}
                <div className="folder-images-grid">
                  {activeFolder.images && activeFolder.images.length > 1 ? (
                    activeFolder.images.slice(1).map((imgUrl, imgIdx) => (
                      <div 
                        key={imgIdx}
                        onClick={() => {
                          setSelectedImage(activeFolder);
                          setLightboxIndex(imgIdx + 1);
                        }}
                        className="folder-image-card"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${activeFolder.title} - ${imgIdx + 2}`} 
                          className="folder-image"
                        />
                        <div className="folder-image-overlay">
                          <span style={{ color: '#ffffff', fontSize: '12.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            View Photo
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                      <Image size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                      <p style={{ fontSize: '15px', fontWeight: '600' }}>No other pictures in this album yet</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>


                {filteredGallery.length > 0 ? (
                  <div className="gallery-bento-grid">
                    {filteredGallery.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`gallery-bento-card ${idx === 4 ? 'span-3' : 'span-1'}`}
                        onClick={() => {
                          setActiveFolder(item);
                        }}
                      >
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="gallery-bento-card-image"
                          />
                        ) : (
                          <div className="gallery-bento-card-placeholder" style={{
                            width: '100%',
                            height: '100%',
                            background: 'var(--gradient-cyber)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Image size={48} color="#ffffff" style={{ opacity: 0.6 }} />
                          </div>
                        )}

                        {/* Category Tag */}
                        <span className="gallery-bento-card-badge">{item.cat}</span>

                        {/* Overlay Content */}
                        <div className="gallery-bento-card-overlay">
                          <h3 className="gallery-bento-card-title">{item.title}</h3>
                          <p className="gallery-bento-card-text">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    <Image size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                    <p style={{ fontSize: '15px', fontWeight: '600' }}>No albums found in category "{selectedCat}"</p>
                  </div>
                )}

                {/* Video Highlights & Memories */}
                {mediaVideos && mediaVideos.length > 0 && (
                  <div style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid var(--border-subtle)' }}>
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
                        Media Stream
                      </span>
                      <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', marginTop: '10px' }}>Video Highlights & Memories</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Watch recap reels and student presentations from flagship events</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                      {mediaVideos.map((video, idx) => (
                        <div key={idx} className="card scroll-reveal fade-up" style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                            <iframe
                              src={formatEmbedUrl(video.url)}
                              width="100%"
                              height="200"
                              style={{ border: 0, display: 'block' }}
                              allowFullScreen=""
                              title={video.title}
                            />
                          </div>
                          <h3 style={{ fontSize: '15.5px', color: 'var(--primary)', fontWeight: '800', margin: '0 0 6px 0' }}>{video.title}</h3>
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

        {/* News tab view - 3D Slider Carousel */}
        {activeTab === 'news' && (
          <>
            {newsItems.length > 0 ? (
              <div style={{
                position: 'relative',
                width: '100%',
                margin: '0 auto',
                paddingBottom: '20px'
              }}>
                {/* Navigation Arrows */}
                <button
                  onClick={() => setNewsCarouselIndex(newsCarouselIndex === 0 ? newsItems.length - 1 : newsCarouselIndex - 1)}
                  className="news-slider-arrow left"
                >
                  ‹
                </button>

                <button
                  onClick={() => setNewsCarouselIndex((newsCarouselIndex + 1) % newsItems.length)}
                  className="news-slider-arrow right"
                >
                  ›
                </button>

                {/* Carousel Container */}
                <div className="news-slider-track">
                  {[...Array(Math.min(3, newsItems.length))].map((_, offset) => {
                    if (newsItems.length === 0) return null;
                    const itemIndex = (newsCarouselIndex + offset - 1 + newsItems.length) % newsItems.length;
                    const news = newsItems[itemIndex];
                    const isCenter = offset === 1;
                    
                    if (!news) return null;
                    
                    return (
                      <div
                        key={`${news.id}-${offset}`}
                        className={`news-slide-card ${isCenter ? 'center' : 'side'}`}
                        onClick={() => {
                          if (!isCenter) {
                            setNewsCarouselIndex(itemIndex);
                          }
                        }}
                      >
                        {/* Cover Image or Gradient */}
                        <div className="news-slide-cover">
                          {news.image ? (
                            <img src={news.image} alt={news.title} className="news-slide-cover-img" />
                          ) : (
                            <div className="news-slide-cover-gradient" style={{
                              background: `linear-gradient(135deg, ${news.color || 'var(--secondary)'} 0%, ${news.color || 'var(--secondary)'}dd 100%)`
                            }}>
                              <div className="news-slide-cover-circle" />
                              <FileText size={isCenter ? 54 : 38} color="#ffffff" style={{ opacity: 0.9, zIndex: 1 }} />
                            </div>
                          )}

                          {/* Source / Category Badge */}
                          <span className="news-card-badge">
                            {news.cat || news.source}
                          </span>
                        </div>

                        {/* Content Section */}
                        <div className="news-slide-content">
                          <div>
                            <div className="news-slide-meta">
                              <span>{news.date}</span>
                              <span>•</span>
                              <span>{news.source}</span>
                            </div>
                            <h3 className="news-slide-title">
                              {news.title}
                            </h3>
                            {isCenter && (
                              <p className="news-slide-snippet">
                                {news.snippet}
                              </p>
                            )}
                          </div>

                          {isCenter && (
                            <div className="news-slide-link">
                              Learn more →
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Carousel Indicators */}
                <div className="news-slider-dots">
                  {newsItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewsCarouselIndex(idx)}
                      className={`news-slider-dot ${newsCarouselIndex === idx ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                <FileText size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No news updates yet</p>
                <p style={{ fontSize: '14px' }}>Check back soon for the latest news and announcements</p>
              </div>
            )}
          </>
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
                  borderRadius: '12px',
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
                      borderRadius: '8px',
                      backgroundColor: 'rgba(79, 70, 229, 0.08)',
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
                        backgroundColor: 'rgba(79, 70, 229, 0.05)',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        marginBottom: '6px'
                      }}>
                        {paper.category}
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0' }}>📅 {paper.year}</p>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '16px',
                    color: 'var(--primary)',
                    fontWeight: '700',
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

                  {paper.fileUrl && (
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: 'rgba(79, 70, 229, 0.05)',
                        color: 'var(--secondary)',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: 'auto',
                        border: '1px solid var(--border-subtle)'
                      }}
                      className="paper-download-btn"
                    >
                      <FileText size={16} />
                      Download PDF
                    </a>
                  )}
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
                <p style={{ fontSize: '15px', fontWeight: '600' }}>No research papers or projects published yet</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Student research and project work will be showcased here</p>
              </div>
            )}
          </div>
        )}
      </div>

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
              borderRadius: '12px',
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
            <div style={{ padding: '32px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase' }}>
                {selectedImage.cat}
              </span>
              <h3 style={{ fontSize: '22px', color: 'var(--primary)', margin: '8px 0 12px' }}>{selectedImage.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>{selectedImage.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
