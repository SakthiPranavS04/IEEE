import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'var(--gradient-primary)',
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
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', pointerEvents: 'none'
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
  </div>
);

const RequestFormPage = () => {
  const { slug } = useParams();
  const [formConfig, setFormConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    
    const stored = localStorage.getItem('ieee_request_forms');
    if (stored) {
      try {
        const forms = JSON.parse(stored);
        const matched = forms.find(f => f.route_slug === slug && f.is_active);
        if (matched) {
          setFormConfig(matched);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error loading request form config:", e);
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [slug]);

  // Clean and prepare the embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    let cleanUrl = url.trim();

    // If it's a short URL, we just try to render it (although redirect might block embedding).
    // If it's a docs.google.com link, we ensure embedded=true is appended
    if (cleanUrl.includes('docs.google.com/forms')) {
      const viewformIndex = cleanUrl.indexOf('/viewform');
      if (viewformIndex !== -1) {
        cleanUrl = cleanUrl.substring(0, viewformIndex + 9);
      }
      if (!cleanUrl.includes('embedded=true')) {
        cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + 'embedded=true';
      }
    }
    return cleanUrl;
  };

  if (error || !formConfig) {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <PageHeader title="Form Not Available" subtitle="The requested request form could not be found or is currently inactive." />
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '40px 20px' }}>
          <div className="card" style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            padding: '40px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>Unavailable Request Form</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
                This form has either been removed or temporarily deactivated by the ExeComm administrators. Please check the URL or contact us if you think this is a mistake.
              </p>
            </div>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                fontSize: '13.5px',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: 'var(--secondary)',
                border: 'none',
                borderRadius: '30px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-glow)'
              }}
              className="back-btn-hover"
            >
              <ArrowLeft size={16} /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(formConfig.google_form_url);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '85vh', fontFamily: 'var(--font-sans)' }}>
      <PageHeader 
        title={formConfig.form_name} 
        subtitle={formConfig.description} 
      />
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        
        {/* Frame container card */}
        <div className="card" style={{ 
          width: '100%', 
          maxWidth: '860px', 
          padding: '0', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-subtle)',
          backgroundColor: '#ffffff',
          position: 'relative',
          minHeight: '600px'
        }}>
          
          {/* Loading spinner state */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              gap: '16px'
            }}>
              <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>Loading Google Form securely...</p>
            </div>
          )}

          {/* Form Iframe */}
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="800"
              style={{ border: 'none', display: 'block', backgroundColor: '#ffffff' }}
              title={formConfig.form_name}
              onLoad={() => setIsLoading(false)}
            >
              Loading form...
            </iframe>
          ) : (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}>
              <AlertCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '15px', fontWeight: '600' }}>Form URL has not been configured</p>
              <p style={{ fontSize: '13px', marginTop: '6px' }}>Please update the URL in the admin dashboard</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .back-btn-hover:hover {
          background-color: #02619a !important;
          transform: translateY(-2px);
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default RequestFormPage;
