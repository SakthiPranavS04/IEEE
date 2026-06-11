import React, { useState } from 'react';
import { X } from 'lucide-react';

const GallerySection = ({ gallery }) => {
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="society-section">
      <div className="container">
        <h2 className="committee-section-title font-serif scroll-reveal fade-up">Society Gallery</h2>
        <p className="committee-section-subtitle scroll-reveal fade-up">Highlights from recent workshops, symposiums, and collaborative contests</p>

        <div className="masonry-gallery-grid scroll-reveal zoom-in">
          {gallery.map((img, idx) => {
            // Alternate classes to simulate masonry spacing
            const isTall = idx === 1 || idx === 3;
            const isWide = idx === 2;
            
            return (
              <div 
                key={idx}
                className={`masonry-gallery-item ${isTall ? 'tall' : ''} ${isWide ? 'wide' : ''}`}
                onClick={() => setLightboxImage(img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightboxImage(img);
                  }
                }}
              >
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  className="masonry-gallery-image"
                  loading="lazy" 
                />
                <div className="masonry-gallery-overlay">
                  <p className="masonry-gallery-caption">{img.caption}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="lightbox-backdrop"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close"
              onClick={() => setLightboxImage(null)}
              aria-label="Close Lightbox"
            >
              <X size={28} />
            </button>
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.caption} 
              className="lightbox-image" 
            />
            <p className="lightbox-caption">{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
