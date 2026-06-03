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
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'news'
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  // Predefined default gallery fallback
  const defaultGallery = [
    { id: 1, title: "Flutter Bootcamp 2026", cat: "Workshop", text: "Students developing cross-platform applications." },
    { id: 2, title: "National Expo Presentation", cat: "Exhibition", text: "KEC SRC teams displaying agricultural automation solutions." },
    { id: 3, title: "WIE Career Panel", cat: "Seminar", text: "Interactive panel discussion with tech industry experts." },
    { id: 4, title: "SPS Embedded DSP Lab Session", cat: "Hands-on", text: "Coding digital filters on microcontrollers." },
    { id: 5, title: "GreenTech Hackathon Pitching", cat: "Hackathon", text: "Teams presenting prototypes to judges." },
    { id: 6, title: "Branch Executive Committee Meet", cat: "Meeting", text: "Faculty advisor and branch officers discussing yearly plans." },
  ];

  useEffect(() => {
    const storedGallery = localStorage.getItem('ieee_gallery_items');
    if (storedGallery) {
      setGalleryItems(JSON.parse(storedGallery));
    } else {
      localStorage.setItem('ieee_gallery_items', JSON.stringify(defaultGallery));
      setGalleryItems(defaultGallery);
    }
  }, []);

  const newsItems = [
    {
      title: "IEEE Student Branch KEC wins Best Branch Laurels",
      source: "Erode Daily",
      date: "Oct 14, 2025",
      snippet: "Kongu Engineering College student branch recognized under Madras Section for outstanding technical contributions and volunteering."
    },
    {
      title: "Students showcase Smart Assistive Device at State Expo",
      source: "Tech Journal",
      date: "Nov 02, 2025",
      snippet: "Sponsored by IEEE SPS and KEC SRC, a student team built a voice-assisted glove prototype for quadriplegic rehabilitation."
    },
    {
      title: "National Hackathon on Green Energy hosted by KEC IEEE SB",
      source: "The Campus News",
      date: "Jan 18, 2026",
      snippet: "More than 50 teams from across Southern India participated to pitch solar tracking and smart grid distribution prototypes."
    }
  ];

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
        </div>

        {/* Gallery tab view */}
        {activeTab === 'gallery' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {galleryItems.map(item => (
              <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* SVG Visual Placeholder representation of event image */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #072a44 0%, #02619a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  <Image size={40} style={{ opacity: 0.8 }} />
                  <button
                    onClick={() => setSelectedImage(item)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
                <div style={{ padding: '24px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>{item.cat}</span>
                  <h3 style={{ fontSize: '16px', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News tab view */}
        {activeTab === 'news' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', marginInline: 'auto' }}>
            {newsItems.map((news, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', gap: '24px', alignItems: 'start', padding: '28px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0
                }}>
                  <FileText size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--secondary)' }}>{news.source}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{news.date}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', color: 'var(--primary)', marginBottom: '8px' }}>{news.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>{news.snippet}</p>
                </div>
              </div>
            ))}
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
              height: '350px',
              background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Image size={80} style={{ opacity: 0.5 }} />
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
