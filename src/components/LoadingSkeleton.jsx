import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-loader-container container" style={{ marginTop: '40px' }}>
      <div className="skeleton-banner skeleton-shimmer" style={{ height: '45vh', marginBottom: '40px' }} />
      <div className="skeleton-title skeleton-shimmer" style={{ height: '40px', width: '60%', marginBottom: '24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', marginTop: '30px' }}>
        <div>
          <div className="skeleton-text skeleton-shimmer" style={{ height: '20px', marginBottom: '12px', width: '90%' }} />
          <div className="skeleton-text skeleton-shimmer" style={{ height: '20px', marginBottom: '12px', width: '95%' }} />
          <div className="skeleton-text skeleton-shimmer" style={{ height: '20px', marginBottom: '12px', width: '80%' }} />
          <div className="skeleton-text skeleton-shimmer" style={{ height: '20px', marginBottom: '12px', width: '85%' }} />
        </div>
        <div>
          <div className="skeleton-text skeleton-shimmer" style={{ height: '60px', marginBottom: '15px' }} />
          <div className="skeleton-text skeleton-shimmer" style={{ height: '60px', marginBottom: '15px' }} />
          <div className="skeleton-text skeleton-shimmer" style={{ height: '60px' }} />
        </div>
      </div>
      <div className="skeleton-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '40px' }}>
        <div className="skeleton-card skeleton-shimmer" style={{ height: '320px', borderRadius: '20px' }} />
        <div className="skeleton-card skeleton-shimmer" style={{ height: '320px', borderRadius: '20px' }} />
        <div className="skeleton-card skeleton-shimmer" style={{ height: '320px', borderRadius: '20px' }} />
        <div className="skeleton-card skeleton-shimmer" style={{ height: '320px', borderRadius: '20px' }} />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
