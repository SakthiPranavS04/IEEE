import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageSquare, Award, Users, Zap, Globe } from 'lucide-react';
import { societiesData } from '../data/societiesData';

// Shared PageHeader component inside SocietiesPage
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
      background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.15) 0%, transparent 70%)', pointerEvents: 'none'
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
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)', zIndex: 2 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,101.4,227.14,83.56,258.14,76.22,290.41,68.22,321.39,56.44Z" fill="var(--bg-light)"></path>
      </svg>
    </div>
  </div>
);

const hexToRgb = (hex) => {
  if (!hex) return "15, 76, 92";
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `${r}, ${g}, ${b}`;
};

const getEventIcon = (key) => {
  if (key === 'ap-s') return <MessageSquare size={24} />;
  if (key === 'computer-society') return <Award size={24} />;
  if (key === 'wie') return <Users size={24} />;
  if (key === 'ras') return <Award size={24} />;
  if (key === 'pes') return <Zap size={24} />;
  if (key === 'comsoc') return <Globe size={24} />;
  return <BookOpen size={24} />;
};

const SocietiesPage = () => {
  useEffect(() => {
    document.title = "Technical Societies | IEEE KEC SB";
  }, []);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px' }}>
      <PageHeader 
        title="IEEE Technical Societies" 
        subtitle="Explore our specialized technical chapters and affinity groups driving learning and research at KEC" 
      />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginTop: '20px'
        }} className="societies-overview-grid">
          {Object.entries(societiesData).map(([key, soc]) => {
            const themeColor = soc.theme?.primary || 'var(--secondary)';
            return (
              <div 
                key={key} 
                className="card society-card-hover" 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  borderTop: `4px solid ${themeColor}`,
                  borderLeft: `1px solid rgba(${hexToRgb(themeColor)}, 0.1)`,
                  borderRight: `1px solid rgba(${hexToRgb(themeColor)}, 0.1)`,
                  borderBottom: `1px solid rgba(${hexToRgb(themeColor)}, 0.1)`,
                  borderRadius: '16px',
                  padding: '32px',
                  transition: 'all 0.3s ease',
                  height: '100%'
                }}
              >
                <div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    backgroundColor: `rgba(${hexToRgb(themeColor)}, 0.08)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: themeColor,
                    marginBottom: '20px'
                  }}>
                    {getEventIcon(key)}
                  </div>
                  <h3 style={{ fontSize: '19px', fontWeight: '800', marginBottom: '10px', color: 'var(--primary)' }}>
                    {soc.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.65', marginBottom: '24px', margin: '0' }}>
                    {soc.about?.overview || soc.tagline}
                  </p>
                </div>
                <Link to={`/execomm/${key}`} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: themeColor,
                  fontWeight: '700',
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginTop: 'auto'
                }}>
                  View Roster & Milestones <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .society-card-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .society-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02) !important;
        }
      `}</style>
    </div>
  );
};

export default SocietiesPage;
