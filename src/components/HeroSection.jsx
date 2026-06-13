import React from 'react';

const HeroSection = ({ name, motto, description, heroImage, heroVideo, logoText }) => {
  return (
    <section 
      className="society-hero" 
      style={{ backgroundImage: `url(${heroImage})` }}
      aria-label="Society Banner"
    >
      {heroVideo && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      )}
      <div className="society-hero-overlay" style={{ zIndex: 1 }} />
      <div className="society-hero-content container" style={{ zIndex: 2 }}>
        <h1 className="society-hero-title font-serif">{name}</h1>
        <div style={{
          fontSize: '15px',
          fontWeight: '750',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: '#ffffff',
          marginBottom: '16px',
          opacity: 0.9,
          display: 'inline-block',
          borderBottom: '2px solid var(--society-primary)',
          paddingBottom: '6px'
        }}>
          {motto}
        </div>
        <p className="society-hero-desc">{description}</p>
      </div>
    </section>
  );
};

export default HeroSection;
