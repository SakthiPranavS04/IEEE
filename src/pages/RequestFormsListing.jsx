import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight, FileText, Sparkles, X, Lock } from 'lucide-react';

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
      <h1 className="font-serif" style={{ fontSize: '38px', color: '#ffffff', marginBottom: '12px', fontWeight: '800' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '580px', margin: '0 auto' }}>
          {subtitle}
        </p>
      )}
    </div>
    {/* Decorative Wave Bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)', zIndex: 2 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,101.4,227.14,83.56,258.14,76.22,290.41,68.22,321.39,56.44Z" fill="var(--bg-light)"></path>
      </svg>
    </div>
  </div>
);

const CATEGORIES = ['All', 'Membership', 'Finance', 'Event Management', 'Administration'];

const CATEGORY_COLORS = {
  'Membership': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'Finance': { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  'Event Management': { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
  'Administration': { bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' }
};

const getCategoryStyle = (category) => CATEGORY_COLORS[category] || { bg: 'var(--accent-light)', color: 'var(--primary)', border: '#c3d9ea' };

const RequestFormsListing = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const navigate = useNavigate();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  useEffect(() => {
    // Load request forms from localStorage
    const loadForms = () => {
      setLoading(true);
      const stored = localStorage.getItem('ieee_request_forms');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setForms(parsed);
        } catch (e) {
          console.error("Error reading request forms", e);
        }
      }
      // Add a slight delay to show premium shimmer skeletons
      setTimeout(() => {
        setLoading(false);
      }, 600);
    };

    loadForms();
  }, []);

  // Filter forms based on search query, category, and active status
  const filteredForms = forms.filter(form => {
    const isMatchedActive = form.is_active;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      form.form_name.toLowerCase().includes(query) ||
      (form.description && form.description.toLowerCase().includes(query)) ||
      (form.category && form.category.toLowerCase().includes(query));
      
    const matchesCategory = selectedCategory === 'All' || form.category === selectedCategory;
    return isMatchedActive && matchesSearch && matchesCategory;
  });

  // Sort forms by display order ascending
  const sortedForms = [...filteredForms].sort((a, b) => {
    const orderA = a.display_order !== undefined ? Number(a.display_order) : 999;
    const orderB = b.display_order !== undefined ? Number(b.display_order) : 999;
    return orderA - orderB;
  });

  const handleFormClick = (e, form) => {
    e.preventDefault();
    const isPinEnabled = localStorage.getItem('ieee_pin_enabled') !== 'false';
    if (isPinEnabled && form.is_confidential && sessionStorage.getItem('ieee_unlocked') !== 'true') {
      setTargetUrl(`/request/${form.route_slug}`);
      setPinInput('');
      setPinError('');
      setShowPinModal(true);
    } else {
      navigate(`/request/${form.route_slug}`);
    }
  };

  const handlePinSubmit = () => {
    const correctPin = localStorage.getItem('ieee_access_pin') || '1234';
    if (pinInput === correctPin) {
      sessionStorage.setItem('ieee_unlocked', 'true');
      setShowPinModal(false);
      navigate(targetUrl);
    } else {
      setPinError('Incorrect PIN');
    }
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '75vh', fontFamily: 'var(--font-sans)' }}>
      <PageHeader 
        title="Request Forms" 
        subtitle="Access online portals and submission guidelines for memberships, financial closures, and event organization proposals." 
      />

      <div className="container">
        {/* Controls: Search & Category Chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          marginBottom: '32px',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Search bar and title */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
                <h2 style={{ fontSize: '20px', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>Available Services</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px', margin: 0 }}>Select a service template below to start your request submission.</p>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-subtle)',
                  fontSize: '13.5px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  color: 'var(--text-dark)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters Row */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)', marginRight: '8px' }}>Filter by Category:</span>
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    borderRadius: '30px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: active ? 'var(--gradient-cyber)' : '#f1f5f9',
                    color: active ? '#ffffff' : '#475569',
                    boxShadow: active ? '0 4px 10px rgba(6, 182, 212, 0.25)' : 'none'
                  }}
                  className="cat-chip-hover"
                >
                  {cat === 'All' ? 'All templates' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Card Display Grid */}
        {loading ? (
          /* Loading Skeletons */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card" style={{ padding: '28px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', minHeight: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '100px', height: '20px', backgroundColor: '#f1f5f9', borderRadius: '4px' }} className="skeleton-shimmer" />
                </div>
                <div style={{ width: '80%', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '10px' }} className="skeleton-shimmer" />
                <div style={{ width: '100%', height: '36px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '24px' }} className="skeleton-shimmer" />
                <div style={{ width: '100%', height: '44px', backgroundColor: '#f1f5f9', borderRadius: '8px' }} className="skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : sortedForms.length > 0 ? (
          /* Card Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {sortedForms.map((form) => {
              const catStyle = getCategoryStyle(form.category || 'Membership');
              return (
                <div
                  key={form.id}
                  className="card request-card"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                    padding: 0
                  }}
                >
                  {/* Card Top Accent Bar */}
                  <div style={{
                    height: '4px',
                    background: 'var(--gradient-colorful)'
                  }} />

                  <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Badge Row */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                      <span style={{
                        backgroundColor: catStyle.bg,
                        color: catStyle.color,
                        border: `1px solid ${catStyle.border}`,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {form.category || 'Membership'}
                      </span>
                    </div>

                    {/* Title */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        color: 'var(--primary)',
                        lineHeight: '1.45',
                        fontWeight: '800',
                        margin: 0
                      }}>
                        {form.form_name}
                      </h3>
                      {form.is_confidential && localStorage.getItem('ieee_pin_enabled') !== 'false' && (
                        <div style={{ padding: '2px', backgroundColor: '#fee2e2', borderRadius: '4px', color: '#ef4444', display: 'flex' }} title="Confidential - Requires PIN">
                          <Lock size={14} />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '13.5px',
                      marginBottom: '24px',
                      lineHeight: '1.65',
                      flex: 1
                    }}>
                      {form.description || 'No description provided.'}
                    </p>

                    {/* CTA Register Button */}
                    <button
                      onClick={(e) => handleFormClick(e, form)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'var(--gradient-colorful)',
                        color: '#ffffff',
                        padding: '11px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        letterSpacing: '0.3px',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                      }}
                      className="request-register-btn"
                    >
                      {form.is_confidential && localStorage.getItem('ieee_pin_enabled') !== 'false' && sessionStorage.getItem('ieee_unlocked') !== 'true' ? 'Unlock Form' : 'Register'} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="card" style={{
            padding: '60px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(79, 70, 229, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)'
            }}>
              <FileText size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', margin: '0 0 6px 0' }}>No request forms found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', margin: 0 }}>There are currently no active request templates matching your filters or search query.</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              style={{
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: 'var(--secondary)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '50%', color: '#ef4444', marginBottom: '16px' }}>
              <Lock size={28} />
            </div>
            <h3 style={{ fontSize: '20px', color: '#0f172a', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Confidential Form</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              Please enter the shared Access PIN to view this confidential request form.
            </p>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${pinError ? '#ef4444' : '#cbd5e1'}`,
                fontSize: '16px',
                outline: 'none',
                textAlign: 'center',
                letterSpacing: '4px',
                marginBottom: '8px'
              }}
              autoFocus
            />
            {pinError && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>{pinError}</div>}
            
            <div style={{ display: 'flex', gap: '12px', marginTop: pinError ? '0' : '24px' }}>
              <button
                onClick={() => setShowPinModal(false)}
                style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                style={{ flex: 1, padding: '12px', backgroundColor: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .request-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.1) !important;
          border-color: rgba(79, 70, 229, 0.3) !important;
        }
        .request-register-btn:hover {
          background: var(--gradient-colorful) !important;
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.35);
          transform: translateY(-1px);
        }
        .cat-chip-hover:hover:not(:disabled) {
          background-color: #e2e8f0 !important;
          transform: translateY(-1px);
        }
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
        }
        .skeleton-shimmer::after {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 20%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
          content: '';
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default RequestFormsListing;
