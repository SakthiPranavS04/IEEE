import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Image, FileText, X } from 'lucide-react';

const carouselArrowStyle = {
  position: 'absolute',
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
  zIndex: 10,
};

const handleCarouselArrowHover = (e, active) => {
  e.currentTarget.style.backgroundColor = active ? '#02619a' : 'rgba(2, 97, 154, 0.1)';
  e.currentTarget.style.color = active ? '#ffffff' : '#02619a';
};

const getGalleryLayoutClass = (index) => {
  const position = index % 10;
  return position === 4 ? 'gallery-masonry-card--wide' : 'gallery-masonry-card--standard';
};

const PhotoGalleryGrid = ({ items, onViewItem }) => (
  <>
    <div className="photo-gallery-masonry">
      {items.map((item, index) => {
        const hasImages = item.images?.length > 0;
        return (
          <article
            key={item.id}
            className={`gallery-masonry-card ${getGalleryLayoutClass(index)}`}
            onClick={() => hasImages && onViewItem(item)}
            onKeyDown={(e) => {
              if (hasImages && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onViewItem(item);
              }
            }}
            role={hasImages ? 'button' : 'article'}
            tabIndex={hasImages ? 0 : -1}
            aria-label={hasImages ? `View photos: ${item.title}` : item.title}
          >
            <div className="gallery-masonry-card__media">
              {hasImages ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="gallery-masonry-card__img"
                  loading="lazy"
                />
              ) : (
                <div className="gallery-masonry-card__placeholder">
                  <Image size={52} strokeWidth={1.25} />
                </div>
              )}
            </div>

            <div className="gallery-masonry-card__overlay" aria-hidden="true" />
            <div className="gallery-masonry-card__shine" aria-hidden="true" />

            <div className="gallery-masonry-card__content">
              <span className="gallery-masonry-card__category">{item.cat}</span>
              <h3 className="gallery-masonry-card__title">{item.title}</h3>
              <p className="gallery-masonry-card__desc">{item.text}</p>
            </div>

            {hasImages && item.images.length > 1 && (
              <span className="gallery-masonry-card__count" aria-hidden="true">
                {item.images.length} photos
              </span>
            )}
          </article>
        );
      })}
    </div>

    <style>{`
      .photo-gallery-masonry {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
        width: 100%;
      }

      .gallery-masonry-card {
        position: relative;
        border-radius: 18px;
        overflow: hidden;
        cursor: pointer;
        min-height: 280px;
        background-color: #0a385b;
        box-shadow: 0 6px 24px rgba(10, 56, 91, 0.1);
        transition:
          transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        outline: none;
      }

      .gallery-masonry-card--wide {
        grid-column: span 3;
        min-height: 240px;
      }

      .gallery-masonry-card:focus-visible {
        box-shadow: 0 0 0 3px #ffffff, 0 0 0 6px #02619a;
      }

      .gallery-masonry-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 28px 56px rgba(10, 56, 91, 0.24);
      }

      .gallery-masonry-card__media {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }

      .gallery-masonry-card__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1);
        transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform;
      }

      .gallery-masonry-card:hover .gallery-masonry-card__img {
        transform: scale(1.1);
      }

      .gallery-masonry-card__placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(145deg, #0a385b 0%, #02619a 55%, #00629b 100%);
        color: rgba(255, 255, 255, 0.45);
        transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .gallery-masonry-card:hover .gallery-masonry-card__placeholder {
        transform: scale(1.06);
      }

      .gallery-masonry-card__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          rgba(5, 23, 38, 0.92) 0%,
          rgba(5, 23, 38, 0.45) 38%,
          rgba(5, 23, 38, 0.08) 68%,
          transparent 100%
        );
        transition: background 0.5s ease;
        z-index: 1;
        pointer-events: none;
      }

      .gallery-masonry-card:hover .gallery-masonry-card__overlay {
        background: linear-gradient(
          to top,
          rgba(5, 23, 38, 0.97) 0%,
          rgba(5, 23, 38, 0.62) 48%,
          rgba(2, 97, 154, 0.2) 100%
        );
      }

      .gallery-masonry-card__shine {
        position: absolute;
        inset: 0;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        opacity: 0;
        transition: opacity 0.45s ease;
        z-index: 3;
        pointer-events: none;
      }

      .gallery-masonry-card:hover .gallery-masonry-card__shine {
        opacity: 1;
      }

      .gallery-masonry-card__content {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 22px 22px 20px;
        z-index: 2;
        transform: translateY(0);
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .gallery-masonry-card:hover .gallery-masonry-card__content {
        transform: translateY(-8px);
      }

      .gallery-masonry-card__category {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #90caf9;
        margin-bottom: 8px;
        opacity: 0.9;
        transition: color 0.3s ease, opacity 0.3s ease;
      }

      .gallery-masonry-card:hover .gallery-masonry-card__category {
        color: #d5efff;
        opacity: 1;
      }

      .gallery-masonry-card__title {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        line-height: 1.35;
        margin: 0;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
      }

      .gallery-masonry-card--wide .gallery-masonry-card__title {
        font-size: 22px;
      }

      .gallery-masonry-card__desc {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.82);
        line-height: 1.55;
        margin: 0;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition:
          max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 0.4s ease,
          margin-top 0.4s ease;
      }

      .gallery-masonry-card:hover .gallery-masonry-card__desc {
        max-height: 72px;
        opacity: 1;
        margin-top: 8px;
      }

      .gallery-masonry-card__count {
        position: absolute;
        top: 14px;
        right: 14px;
        z-index: 2;
        background: rgba(10, 56, 91, 0.82);
        backdrop-filter: blur(8px);
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        transition: transform 0.4s ease, background 0.3s ease;
      }

      .gallery-masonry-card:hover .gallery-masonry-card__count {
        transform: translateY(-2px);
        background: rgba(2, 97, 154, 0.9);
      }

      @media (max-width: 1024px) {
        .photo-gallery-masonry {
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .gallery-masonry-card--wide {
          grid-column: span 2;
        }

        .gallery-masonry-card {
          min-height: 240px;
        }

        .gallery-masonry-card__title {
          font-size: 16px;
        }

        .gallery-masonry-card--wide .gallery-masonry-card__title {
          font-size: 18px;
        }
      }

      @media (max-width: 600px) {
        .photo-gallery-masonry {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .gallery-masonry-card--wide {
          grid-column: span 1;
        }

        .gallery-masonry-card {
          min-height: 220px;
        }

        .gallery-masonry-card__desc {
          max-height: 60px;
          opacity: 1;
          margin-top: 6px;
        }
      }
    `}</style>
  </>
);

const SlideCarousel = ({ items, currentIndex, onIndexChange, variant = 'gallery', onViewItem }) => {
  if (items.length === 0) return null;

  const goPrev = () => onIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  const goNext = () => onIndexChange((currentIndex + 1) % items.length);

  return (
    <div style={{ position: 'relative', width: '100%', margin: '0 auto', paddingBottom: '20px' }}>
      <button
        onClick={goPrev}
        style={{ ...carouselArrowStyle, left: '0' }}
        onMouseEnter={(e) => handleCarouselArrowHover(e, true)}
        onMouseLeave={(e) => handleCarouselArrowHover(e, false)}
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        onClick={goNext}
        style={{ ...carouselArrowStyle, right: '0' }}
        onMouseEnter={(e) => handleCarouselArrowHover(e, true)}
        onMouseLeave={(e) => handleCarouselArrowHover(e, false)}
        aria-label="Next slide"
      >
        ›
      </button>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        padding: '0 60px',
        minHeight: '400px',
      }}>
        {[...Array(Math.min(3, items.length))].map((_, offset) => {
          const itemIndex = (currentIndex + offset - 1 + items.length) % items.length;
          const item = items[itemIndex];
          const isCenter = offset === 1;

          if (!item) return null;

          const coverImage = variant === 'gallery'
            ? item.images?.[0]
            : item.image;

          const badge = variant === 'gallery' ? item.cat : item.source;
          const title = item.title;
          const description = variant === 'gallery' ? item.text : item.snippet;

          return (
            <div
              key={`${item.id}-${offset}`}
              style={{
                flex: isCenter ? '0 0 380px' : '0 0 280px',
                height: isCenter ? '420px' : '320px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isCenter ? 1 : 0.6,
                transform: `scale(${isCenter ? 1 : 0.85})`,
                cursor: 'pointer',
              }}
              onClick={() => {
                if (!isCenter) onIndexChange(itemIndex);
              }}
            >
              <div
                className="card"
                style={{
                  padding: 0,
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
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: isCenter ? '260px' : '200px',
                    backgroundColor: variant === 'news' && !coverImage && item.color
                      ? undefined
                      : '#0a385b',
                    background: variant === 'news' && !coverImage && item.color
                      ? `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`
                      : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    color: 'rgba(255,255,255,0.85)',
                    flexShrink: 0,
                  }}
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : variant === 'gallery' ? (
                    <Image size={isCenter ? 60 : 40} style={{ opacity: 0.6 }} />
                  ) : (
                    <FileText size={isCenter ? 60 : 40} style={{ opacity: 0.6 }} />
                  )}

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
                      pointerEvents: 'none',
                      maxWidth: '70%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {badge}
                  </span>

                  {variant === 'gallery' && item.images?.length > 1 && (
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
                        pointerEvents: 'none',
                      }}
                    >
                      📁 {item.images.length}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    padding: isCenter ? '24px' : '18px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {variant === 'news' && isCenter && item.date && (
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                        {item.date}
                      </span>
                    )}
                    <h3
                      style={{
                        fontSize: isCenter ? '17px' : '15px',
                        color: '#0a385b',
                        marginBottom: '8px',
                        fontWeight: '700',
                        lineHeight: '1.4',
                      }}
                    >
                      {title}
                    </h3>
                    {isCenter && (
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#64748b',
                          lineHeight: '1.5',
                          margin: 0,
                        }}
                      >
                        {description}
                      </p>
                    )}
                  </div>

                  {isCenter && variant === 'gallery' && item.images?.length > 0 && onViewItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewItem(item);
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
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#02619a';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f4f8';
                        e.currentTarget.style.color = '#02619a';
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

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onIndexChange(idx)}
            style={{
              width: currentIndex === idx ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: currentIndex === idx ? '#02619a' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/news')) return 'news';
    if (location.pathname.includes('/gallery')) return 'gallery';
    return 'gallery';
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [newsCarouselIndex, setNewsCarouselIndex] = useState(0);

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

  useEffect(() => {
    if (location.pathname.includes('/news')) setActiveTab('news');
    else if (location.pathname.includes('/gallery')) setActiveTab('gallery');
  }, [location.pathname]);

  useEffect(() => {
    setNewsCarouselIndex(0);
  }, [activeTab]);

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

        {/* Gallery tab view - Masonry grid */}
        {activeTab === 'gallery' && (
          <>
            {galleryItems.length > 0 ? (
              <PhotoGalleryGrid
                items={galleryItems}
                onViewItem={(item) => {
                  setSelectedImage(item);
                  setLightboxIndex(0);
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <Image size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                <p style={{ fontSize: '15px', fontWeight: '600' }}>No gallery items yet</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Photo galleries will appear here</p>
              </div>
            )}
          </>
        )}

        {/* News tab view - Sliding Carousel */}
        {activeTab === 'news' && (
          <>
            {newsItems.length > 0 ? (
              <SlideCarousel
                items={newsItems}
                currentIndex={newsCarouselIndex}
                onIndexChange={setNewsCarouselIndex}
                variant="news"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
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
