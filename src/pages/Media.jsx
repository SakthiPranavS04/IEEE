import React, { useState, useEffect } from 'react';
import { Image, FileText, X, Maximize2 } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
    color: '#ffffff',
    padding: '50px 0',
    textAlign: 'center',
    marginBottom: '40px'
  }}>
    <div className="container">
      <h1 className="font-serif" style={{ fontSize: '32px', color: '#ffffff', marginBottom: '8px' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '15px', color: '#d0e4f2' }}>{subtitle}</p>}
    </div>
  </div>
);

const Media = () => {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'news' | 'research'
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Predefined default gallery fallback
  const defaultGallery = [
    { id: 1, title: "Flutter Bootcamp 2026", cat: "Workshop", text: "Students developing cross-platform applications." },
    { id: 2, title: "National Expo Presentation", cat: "Exhibition", text: "KEC SRC teams displaying agricultural automation solutions." },
    { id: 3, title: "WIE Career Panel", cat: "Seminar", text: "Interactive panel discussion with tech industry experts." },
    { id: 4, title: "SPS Embedded DSP Lab Session", cat: "Hands-on", text: "Coding digital filters on microcontrollers." },
    { id: 5, title: "GreenTech Hackathon Pitching", cat: "Hackathon", text: "Teams presenting prototypes to judges." },
    { id: 6, title: "Branch Executive Committee Meet", cat: "Meeting", text: "Faculty advisor and branch officers discussing yearly plans." },
  ];

  // Default news items
  const defaultNews = [
    {
      id: 1,
      title: "IEEE Student Branch KEC wins Best Branch Laurels",
      source: "Erode Daily",
      date: "Oct 14, 2025",
      snippet: "Kongu Engineering College student branch recognized under Madras Section for outstanding technical contributions and volunteering.",
      color: "#f59e0b"
    },
    {
      id: 2,
      title: "Students showcase Smart Assistive Device at State Expo",
      source: "Tech Journal",
      date: "Nov 02, 2025",
      snippet: "Sponsored by IEEE SPS and KEC SRC, a student team built a voice-assisted glove prototype for quadriplegic rehabilitation.",
      color: "#8b5cf6"
    },
    {
      id: 3,
      title: "National Hackathon on Green Energy hosted by KEC IEEE SB",
      source: "The Campus News",
      date: "Jan 18, 2026",
      snippet: "More than 50 teams from across Southern India participated to pitch solar tracking and smart grid distribution prototypes.",
      color: "#10b981"
    }
  ];

  useEffect(() => {
    const storedGallery = localStorage.getItem('ieee_gallery_items');
    if (storedGallery) {
      setGalleryItems(JSON.parse(storedGallery));
    } else {
      localStorage.setItem('ieee_gallery_items', JSON.stringify(defaultGallery));
      setGalleryItems(defaultGallery);
    }

    // Load Research Papers
    const storedPapers = localStorage.getItem('ieee_research_papers');
    if (storedPapers) {
      setResearchPapers(JSON.parse(storedPapers));
    } else {
      setResearchPapers([]);
    }

    // Load News Items
    const storedNews = localStorage.getItem('ieee_news_items');
    if (storedNews) {
      setNewsItems(JSON.parse(storedNews));
    } else {
      localStorage.setItem('ieee_news_items', JSON.stringify(defaultNews));
      setNewsItems(defaultNews);
    }
  }, []);



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
            onClick={() => setActiveTab('gallery')}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'gallery' ? 'var(--primary)' : '#ffffff',
              color: activeTab === 'gallery' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Photo Gallery
          </button>
          <button
            onClick={() => setActiveTab('news')}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'news' ? 'var(--primary)' : '#ffffff',
              color: activeTab === 'news' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            News Clippings
          </button>
          <button
            onClick={() => setActiveTab('research')}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'research' ? 'var(--primary)' : '#ffffff',
              color: activeTab === 'research' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Research Papers
          </button>
        </div>

        {/* Gallery tab view - Carousel */}
        {activeTab === 'gallery' && (
          <>
            {galleryItems.length > 0 ? (
              <div style={{
                position: 'relative',
                width: '100%',
                margin: '0 auto',
                paddingBottom: '20px'
              }}>
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCarouselIndex(carouselIndex === 0 ? galleryItems.length - 1 : carouselIndex - 1)}
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(2, 97, 154, 0.1)',
                    border: '2px solid #02619a',
                    color: '#02619a',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#02619a';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(2, 97, 154, 0.1)';
                    e.target.style.color = '#02619a';
                  }}
                >
                  ‹
                </button>

                <button
                  onClick={() => setCarouselIndex((carouselIndex + 1) % galleryItems.length)}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(2, 97, 154, 0.1)',
                    border: '2px solid #02619a',
                    color: '#02619a',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#02619a';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(2, 97, 154, 0.1)';
                    e.target.style.color = '#02619a';
                  }}
                >
                  ›
                </button>

                {/* Carousel Container */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '0 60px',
                  minHeight: '400px'
                }}>
                  {[...Array(Math.min(3, galleryItems.length))].map((_, offset) => {
                    if (galleryItems.length === 0) return null;
                    const itemIndex = (carouselIndex + offset - 1 + galleryItems.length) % galleryItems.length;
                    const item = galleryItems[itemIndex];
                    const isCenter = offset === 1;
                    
                    if (!item) return null;
                    
                    return (
                      <div
                        key={`${item.id}-${offset}`}
                        style={{
                          flex: isCenter ? '0 0 380px' : '0 0 280px',
                          height: isCenter ? '420px' : '320px',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          opacity: isCenter ? 1 : 0.6,
                          transform: `scale(${isCenter ? 1 : 0.85})`,
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          if (!isCenter) {
                            setCarouselIndex(itemIndex);
                          }
                        }}
                      >
                        <div
                          className="card"
                          style={{
                            padding: '0',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            borderRadius: '16px',
                            boxShadow: isCenter 
                              ? '0 20px 40px rgba(10, 56, 91, 0.25)' 
                              : '0 8px 16px rgba(10, 56, 91, 0.12)',
                            border: isCenter ? '2px solid #e2e8f0' : '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            position: 'relative'
                          }}
                        >
                          {/* Image Section */}
                          <div
                            style={{
                              height: isCenter ? '260px' : '200px',
                              backgroundColor: '#0a385b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              overflow: 'hidden',
                              color: 'rgba(255,255,255,0.85)',
                              flexShrink: 0
                            }}
                          >
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <Image size={isCenter ? 60 : 40} style={{ opacity: 0.6 }} />
                            )}

                            {/* Category Badge */}
                            <span
                              style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: 'rgba(2, 97, 154, 0.9)',
                                color: '#ffffff',
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                pointerEvents: 'none'
                              }}
                            >
                              {item.cat}
                            </span>

                            {/* Image Count Badge */}
                            {item.images && item.images.length > 1 && (
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: '12px',
                                  left: '12px',
                                  backgroundColor: 'rgba(10, 56, 91, 0.85)',
                                  color: '#ffffff',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  pointerEvents: 'none'
                                }}
                              >
                                📁 {item.images.length}
                              </span>
                            )}
                          </div>

                          {/* Text Section */}
                          <div
                            style={{
                              padding: isCenter ? '24px' : '18px',
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <h3
                                style={{
                                  fontSize: isCenter ? '17px' : '15px',
                                  color: '#0a385b',
                                  marginBottom: '8px',
                                  fontWeight: '700',
                                  lineHeight: '1.4'
                                }}
                              >
                                {item.title}
                              </h3>
                              {isCenter && (
                                <p
                                  style={{
                                    fontSize: '13px',
                                    color: '#64748b',
                                    lineHeight: '1.5',
                                    margin: 0
                                  }}
                                >
                                  {item.text}
                                </p>
                              )}
                            </div>

                            {isCenter && item.images && item.images.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImage(item);
                                  setLightboxIndex(0);
                                }}
                                style={{
                                  marginTop: '12px',
                                  padding: '8px 16px',
                                  backgroundColor: '#f0f4f8',
                                  color: '#02619a',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#02619a';
                                  e.target.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = '#f0f4f8';
                                  e.target.style.color = '#02619a';
                                }}
                              >
                                View Photos
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Carousel Indicators */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '32px'
                  }}
                >
                  {galleryItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      style={{
                        width: carouselIndex === idx ? '28px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: carouselIndex === idx ? '#02619a' : '#cbd5e1',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <Image size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                <p style={{ fontSize: '15px', fontWeight: '600' }}>No gallery items yet</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Photo galleries will appear here</p>
              </div>
            )}
          </>
        )}

        {/* News tab view - 3 Column Grid */}
        {activeTab === 'news' && (
          <div style={{
            display: newsItems.length > 0 ? 'grid' : 'flex',
            gridTemplateColumns: newsItems.length > 0 ? 'repeat(auto-fill, minmax(330px, 1fr))' : '1fr',
            gap: '28px',
            alignItems: newsItems.length > 0 ? 'start' : 'center',
            justifyContent: newsItems.length > 0 ? 'auto' : 'center',
            minHeight: newsItems.length === 0 ? '400px' : 'auto'
          }}>
            {newsItems.length > 0 ? (
              newsItems.map((news) => (
                <div
                  key={news.id}
                  className="card"
                  style={{
                    overflow: 'hidden',
                    borderRadius: '14px',
                    boxShadow: '0 4px 15px rgba(10, 56, 91, 0.1)',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(10, 56, 91, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(10, 56, 91, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Color Header / Cover Image */}
                  <div
                    style={{
                      height: '140px',
                      background: news.image ? 'none' : `linear-gradient(135deg, ${news.color} 0%, ${news.color}dd 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {news.image ? (
                      <img src={news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <div
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            position: 'absolute',
                            right: '-20px',
                            top: '-20px'
                          }}
                        />
                        <FileText size={48} color="#ffffff" style={{ opacity: 0.9 }} />
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* Metadata */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#ffffff',
                            backgroundColor: news.color,
                            padding: '4px 12px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {news.source}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{news.date}</span>
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#0a385b',
                          marginBottom: '10px',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {news.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#64748b',
                        lineHeight: '1.6',
                        marginBottom: '12px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {news.snippet}
                    </p>

                    {/* Read More Link */}
                    <div
                      style={{
                        color: news.color,
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginTop: 'auto'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.gap = '8px';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.gap = '4px';
                      }}
                    >
                      Learn more →
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                <FileText size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No news updates yet</p>
                <p style={{ fontSize: '14px' }}>Check back soon for the latest news and announcements</p>
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
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
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
                      backgroundColor: '#e0eef7',
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
                        backgroundColor: '#f0f4f8',
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
                        backgroundColor: '#f0f4f8',
                        color: 'var(--primary)',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: 'auto',
                        border: '1px solid #cbd5e1'
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
                <p style={{ fontSize: '15px', fontWeight: '600' }}>No research papers published yet</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Student research work will be showcased here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / Image Zoom Viewer */}
      {selectedImage && (
        <div style={{
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
          padding: '24px'
        }}>
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
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
          <div style={{
            maxWidth: '680px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
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
