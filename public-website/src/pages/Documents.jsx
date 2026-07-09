import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import API from '../services/api';
import { FileText, FileVideo, FileCode, FileArchive, Search, Download, Eye, X, Sparkles, Filter, ChevronRight, Image as ImageIcon, Lock } from 'lucide-react';

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

const CATEGORIES = [
  'All',
  'IEEE Forms',
  'Membership Documents',
  'Event Resources',
  'Workshop Materials',
  'Reports',
  'Certificates',
  'Others'
];

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [targetDoc, setTargetDoc] = useState(null);
  const [targetAction, setTargetAction] = useState('');
  const [globalPinEnabled, setGlobalPinEnabled] = useState(true);
  const [globalAccessPin, setGlobalAccessPin] = useState('1234');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API}/settings`);
        if (response.ok) {
          const settings = await response.json();
          const getVal = (key) => {
            const s = settings.find(s => s.key === key);
            return s ? s.value : null;
          };

          const isPinEnabled = getVal('ieee_pin_enabled');
          if (isPinEnabled !== null) setGlobalPinEnabled(isPinEnabled !== 'false');

          const accessPin = getVal('ieee_access_pin');
          if (accessPin) setGlobalAccessPin(accessPin);

          const docsData = getVal('ieee_documents');
          let parsedDocs = [];
          if (docsData) {
            try { parsedDocs = typeof docsData === 'string' ? JSON.parse(docsData) : docsData; } catch(e) {}
          }

          const mappedDocs = parsedDocs
            .filter(d => d.isVisible !== false)
            .map(d => ({
              id: d.id || d._id,
              name: d.name || d.title,
              title: d.title,
              category: d.category,
              mimeType: d.mimeType || (d.fileUrl?.endsWith('pdf') ? 'application/pdf' : 
                        d.fileUrl?.match(/\.(jpeg|jpg|gif|png)$/) ? 'image/jpeg' : 
                        'application/octet-stream'),
              fileUrl: d.fileUrl,
              size: d.size,
              description: d.description,
              is_confidential: d.is_confidential || false,
              isVisible: d.isVisible !== false,
              isFeatured: d.isFeatured,
              featuredOrder: d.featuredOrder,
              date: d.uploadDate || d.createdAt || d.date
            }));
          setDocuments(mappedDocs);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.error('Failed to fetch documents', err);
        setDocuments([]);
      }
    };
    
    fetchDocuments();
    
    // Simulate loading animation for rich UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  const isWordDocument = (mimeType) => {
    const type = (mimeType || '').toLowerCase();
    return type.includes('google-apps.document') || type.includes('word') || type.includes('docx') || type.includes('msword');
  };

  const getFileIcon = (mimeType) => {
    const type = (mimeType || '').toLowerCase();
    if (isWordDocument(type)) {
      return <FileText size={36} style={{ color: '#2563eb' }} />;
    } else if (type.includes('pdf')) {
      return <FileText size={36} style={{ color: '#ef4444' }} />;
    } else if (type.includes('image') || type.includes('png') || type.includes('jpeg') || type.includes('jpg')) {
      return <ImageIcon size={36} style={{ color: '#10b981' }} />;
    } else if (type.includes('video') || type.includes('mp4')) {
      return <FileVideo size={36} style={{ color: '#8b5cf6' }} />;
    } else if (type.includes('zip') || type.includes('rar') || type.includes('archive')) {
      return <FileArchive size={36} style={{ color: '#f59e0b' }} />;
    }
    return <FileCode size={36} style={{ color: '#64748b' }} />;
  };

  const isPreviewSupported = (mimeType) => {
    const type = (mimeType || '').toLowerCase();
    return isWordDocument(type) || type.includes('pdf') || type.includes('image') || type.includes('png') || type.includes('jpeg') || type.includes('jpg') || type.includes('video') || type.includes('mp4');
  };

  const getCleanFileType = (mimeType) => {
    const type = (mimeType || '').toLowerCase();
    if (isWordDocument(type)) return 'Word Doc';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('image') || type.includes('png') || type.includes('jpeg') || type.includes('jpg')) return 'Image';
    if (type.includes('video') || type.includes('mp4')) return 'Video';
    if (type.includes('zip') || type.includes('compressed')) return 'Archive';
    return 'Document';
  };

  const getDownloadUrl = (doc) => {
    if (doc.fileUrl) {
      return doc.fileUrl; // Use fileUrl directly if present from backend
    }
    if (isWordDocument(doc.mimeType)) {
      return `https://docs.google.com/document/d/${doc.id}/export?format=docx`;
    }
    return `https://drive.google.com/uc?export=download&id=${doc.id}`;
  };

  const executeAction = (doc, action) => {
    if (action === 'preview') {
      setPreviewDoc(doc);
    } else if (action === 'download') {
      window.open(getDownloadUrl(doc), '_blank');
    }
  };

  const handleAction = (doc, action) => {
    if (globalPinEnabled && doc.is_confidential && sessionStorage.getItem(`ieee_unlocked_doc_${doc.id}`) !== 'true') {
      setTargetDoc(doc);
      setTargetAction(action);
      setPinInput('');
      setPinError('');
      setShowPinModal(true);
    } else {
      executeAction(doc, action);
    }
  };

  const handleDownload = (doc) => {
    handleAction(doc, 'download');
  };

  const handlePreview = (doc) => {
    handleAction(doc, 'preview');
  };

  const handlePinSubmit = () => {
    if (pinInput === globalAccessPin) {
      sessionStorage.setItem(`ieee_unlocked_doc_${targetDoc.id}`, 'true');
      setShowPinModal(false);
      executeAction(targetDoc, targetAction);
    } else {
      setPinError('Incorrect PIN');
    }
  };

  // Filtering Logic
  const filteredDocuments = documents.filter(doc => {
    const isMatchedActive = doc.isVisible !== false;
    const isDocLocked = doc.is_confidential && globalPinEnabled && sessionStorage.getItem(`ieee_unlocked_doc_${doc.id}`) !== 'true';
    
    const query = searchQuery.toLowerCase().trim();
    
    let matchesSearch = false;
    let matchesCategory = false;

    if (isDocLocked) {
      // Security: Prevent search filter from leaking hidden filenames
      matchesSearch = !query || 
        'confidential document'.includes(query) ||
        'restricted file'.includes(query);
      matchesCategory = selectedCategory === 'All' || selectedCategory === 'Confidential';
    } else {
      matchesSearch = !query || 
        doc.title.toLowerCase().includes(query) ||
        (doc.description && doc.description.toLowerCase().includes(query)) ||
        (doc.category && doc.category.toLowerCase().includes(query)) ||
        doc.name.toLowerCase().includes(query);
        
      matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    }
    
    
    // 3. File type filter
    const docCleanType = getCleanFileType(doc.mimeType).toLowerCase();
    let matchesType = true;
    if (selectedType !== 'All') {
      if (selectedType === 'word') {
        matchesType = docCleanType.includes('word');
      } else if (selectedType === 'pdf') {
        matchesType = docCleanType.includes('pdf');
      } else if (selectedType === 'image') {
        matchesType = docCleanType.includes('image');
      } else if (selectedType === 'video') {
        matchesType = docCleanType.includes('video');
      } else {
        matchesType = !docCleanType.includes('word') && !docCleanType.includes('pdf') && !docCleanType.includes('image') && !docCleanType.includes('video');
      }
    }

    return matchesSearch && matchesCategory && matchesType;
  });

  // Featured documents logic
  const featuredDocuments = documents
    .filter(doc => doc.isFeatured)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '70vh', fontFamily: 'var(--font-sans)' }}>
      <PageHeader
        title="Documents Repository"
        subtitle="A centralized repository of IEEE KEC Student Branch Word templates — forms, attendance sheets, proposals, and event resources."
      />

      <div className="container">
        {/* Featured Section */}
        {!loading && featuredDocuments.length > 0 && searchQuery === '' && selectedCategory === 'All' && selectedType === 'All' && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sparkles size={18} style={{ color: '#f59e0b' }} />
              <h2 className="font-serif" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Featured Documents</h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {featuredDocuments.map(doc => {
                const isPinEnabled = localStorage.getItem('ieee_pin_enabled') !== 'false';
                const isDocLocked = doc.is_confidential && isPinEnabled && sessionStorage.getItem(`ieee_unlocked_doc_${doc.id}`) !== 'true';
                return (
                  <div
                    key={`featured-${doc.id}`}
                    className="card doc-card featured-glow"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1.5px solid rgba(245, 158, 11, 0.35)',
                      boxShadow: 'var(--shadow-md)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Featured
                    </span>

                    <div>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          backgroundColor: isDocLocked ? '#fee2e2' : (doc.is_confidential ? '#dcfce7' : 'rgba(245, 158, 11, 0.08)'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getFileIcon(doc.mimeType, isDocLocked, doc.is_confidential)}
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: isDocLocked ? '#ef4444' : (doc.is_confidential ? '#22c55e' : '#64748b'), fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {isDocLocked ? 'Confidential' : (doc.is_confidential ? 'Unlocked Confidential' : doc.category)}
                          </span>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                            {isDocLocked ? 'Restricted File' : `${getCleanFileType(doc.mimeType)} • ${doc.size}`}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.4', margin: 0 }}>
                          {isDocLocked ? 'Confidential Document' : doc.title}
                        </h3>
                        {doc.is_confidential && localStorage.getItem('ieee_pin_enabled') !== 'false' && (
                          isDocLocked ? (
                            <div style={{ padding: '2px', backgroundColor: '#fee2e2', borderRadius: '4px', color: '#ef4444', display: 'flex' }} title="Confidential - Requires PIN">
                              <Lock size={14} />
                            </div>
                          ) : (
                            <div style={{ padding: '2px', backgroundColor: '#dcfce7', borderRadius: '4px', color: '#22c55e', display: 'flex' }} title="Confidential - Unlocked">
                              <Unlock size={14} />
                            </div>
                          )
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                        {isDocLocked ? 'This document is confidential. Please enter the Access PIN to unlock and view its details.' : (doc.description || 'No description provided.')}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: 'auto' }}>
                      {isDocLocked ? (
                        <button
                          onClick={() => handlePreview(doc)}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '9px 12px',
                            backgroundColor: 'var(--secondary)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease'
                          }}
                          className="doc-btn-download"
                        >
                          <Lock size={14} /> Unlock Document
                        </button>
                      ) : (
                        <>
                          {isPreviewSupported(doc.mimeType) && (
                            <button
                              onClick={() => handlePreview(doc)}
                              style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '9px 12px',
                                border: '1.5px solid var(--secondary)',
                                color: 'var(--secondary)',
                                background: 'transparent',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease'
                              }}
                              className="doc-btn-preview"
                            >
                              <Eye size={14} /> Preview
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(doc)}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '9px 12px',
                              backgroundColor: 'var(--secondary)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease'
                            }}
                            className="doc-btn-download"
                          >
                            <Download size={14} /> Download
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Controls Row */}
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
          {/* Top Row: Search & Dropdown */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h2 style={{ fontSize: '20px', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>All Repository Materials</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px', margin: 0 }}>Browse documents, search keywords, or filter by category.</p>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: '560px',
              justifyContent: 'flex-end'
            }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search repository..."
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

              {/* File Type Filter Dropdown */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-subtle)',
                  fontSize: '13.5px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  color: 'var(--text-dark)',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Formats</option>
                <option value="word">Word Docs</option>
                <option value="pdf">PDFs</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="other">Other formats</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Chips */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)', marginRight: '8px' }}>Categories:</span>
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
                  {cat === 'All' ? 'All categories' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', minHeight: '200px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#f1f5f9' }} className="skeleton-shimmer" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ width: '40%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '4px' }} className="skeleton-shimmer" />
                    <div style={{ width: '60%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '4px' }} className="skeleton-shimmer" />
                  </div>
                </div>
                <div style={{ width: '80%', height: '14px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '10px' }} className="skeleton-shimmer" />
                <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '24px' }} className="skeleton-shimmer" />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, height: '36px', backgroundColor: '#f1f5f9', borderRadius: '6px' }} className="skeleton-shimmer" />
                  <div style={{ flex: 1, height: '36px', backgroundColor: '#f1f5f9', borderRadius: '6px' }} className="skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Documents Cards Grid */}
            {filteredDocuments.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                {filteredDocuments.map(doc => {
                  const isPinEnabled = localStorage.getItem('ieee_pin_enabled') !== 'false';
                  const isDocLocked = doc.is_confidential && isPinEnabled && sessionStorage.getItem(`ieee_unlocked_doc_${doc.id}`) !== 'true';
                  return (
                    <div
                      key={doc.id}
                      className="card doc-card"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-sm)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        height: '100%'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            backgroundColor: isDocLocked ? '#fee2e2' : (doc.is_confidential ? '#dcfce7' : 'rgba(var(--secondary-rgb), 0.05)'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getFileIcon(doc.mimeType, isDocLocked, doc.is_confidential)}
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: isDocLocked ? '#ef4444' : (doc.is_confidential ? '#22c55e' : 'var(--secondary)'), fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {isDocLocked ? 'Confidential' : (doc.is_confidential ? 'Unlocked Confidential' : doc.category)}
                            </span>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                              {isDocLocked ? 'Restricted File' : `${getCleanFileType(doc.mimeType)} • ${doc.size}`}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.45', margin: 0 }}>
                            {isDocLocked ? 'Confidential Document' : doc.title}
                          </h3>
                          {doc.is_confidential && localStorage.getItem('ieee_pin_enabled') !== 'false' && (
                            isDocLocked ? (
                              <div style={{ padding: '2px', backgroundColor: '#fee2e2', borderRadius: '4px', color: '#ef4444', display: 'flex' }} title="Confidential - Requires PIN">
                                <Lock size={14} />
                              </div>
                            ) : (
                              <div style={{ padding: '2px', backgroundColor: '#dcfce7', borderRadius: '4px', color: '#22c55e', display: 'flex' }} title="Confidential - Unlocked">
                                <Unlock size={14} />
                              </div>
                            )
                          )}
                        </div>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '20px' }}>
                          {isDocLocked ? 'This document is confidential. Please enter the Access PIN to unlock and view its details.' : (doc.description || 'No description provided.')}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: 'auto' }}>
                        {isDocLocked ? (
                          <button
                            onClick={() => handlePreview(doc)}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              backgroundColor: 'var(--secondary)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease'
                            }}
                            className="doc-btn-download"
                          >
                            <Lock size={13} /> Unlock Document
                          </button>
                        ) : (
                          <>
                            {isPreviewSupported(doc.mimeType) && (
                              <button
                                onClick={() => handlePreview(doc)}
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  padding: '8px 12px',
                                  border: '1.5px solid var(--secondary)',
                                  color: 'var(--secondary)',
                                  background: 'transparent',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  transition: 'all 0.25s ease'
                                }}
                                className="doc-btn-preview"
                              >
                                <Eye size={13} /> Preview
                              </button>
                            )}
                            <button
                              onClick={() => handleDownload(doc)}
                              style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                backgroundColor: 'var(--secondary)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease'
                              }}
                              className="doc-btn-download"
                            >
                              <Download size={13} /> Download
                            </button>
                          </>
                        )}
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
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(79, 70, 229, 0.05)', display: 'flex', alignItems: 'center', justifycontent: 'center', color: 'var(--secondary)' }}>
                  <Filter size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', margin: '0 0 6px 0' }}>No documents found</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', margin: 0 }}>We couldn't find any documents matching your current filters or search query.</p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedType('All');
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
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '50vw',
            maxWidth: '50vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-premium)',
            border: '1.5px solid var(--border-subtle)',
            animation: 'modal-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              background: 'linear-gradient(180deg, #0f172a 0%, #030712 100%)',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#ffffff', wordBreak: 'break-all', paddingRight: '12px' }}>
                  {previewDoc.title}
                </h3>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginTop: '2px' }}>
                  File: {previewDoc.name} ({previewDoc.size})
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => handleDownload(previewDoc)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  className="modal-download-btn"
                  title="Download file"
                >
                  <Download size={14} /> Download
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="modal-close-btn"
                  title="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Direct Iframe Preview */}
            <div style={{
              flex: 1,
              backgroundColor: '#0f172a',
              position: 'relative',
              minHeight: '400px',
              height: '85vh'
            }}>
              <iframe
                src={`https://drive.google.com/file/d/${previewDoc.id}/preview`}
                title={`Preview ${previewDoc.title}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#ffffff'
                }}
                allow="autoplay"
              />
            </div>
          </div>
        </div>,
        document.body
      )}

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
            <h3 style={{ fontSize: '20px', color: '#0f172a', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Confidential Document</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              Please enter the shared Access PIN to {targetAction} this confidential document.
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
        .doc-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .doc-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(79, 70, 229, 0.08) !important;
          border-color: rgba(79, 70, 229, 0.22) !important;
        }
        .featured-glow {
          box-shadow: 0 10px 24px rgba(245, 158, 11, 0.1) !important;
        }
        .featured-glow:hover {
          border-color: #d97706 !important;
          box-shadow: 0 20px 45px rgba(245, 158, 11, 0.18) !important;
          transform: translateY(-5px);
        }
        .cat-chip-hover:hover:not(:disabled) {
          background-color: #e2e8f0 !important;
          color: 'var(--text-dark)' !important;
          transform: translateY(-1px);
        }
        .doc-btn-preview:hover {
          background-color: rgba(79, 70, 229, 0.05) !important;
          transform: translateY(-1px);
        }
        .doc-btn-download:hover {
          background-color: #02619a !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          transform: translateY(-1px);
        }
        .modal-download-btn:hover {
          background-color: rgba(255, 255, 255, 0.25) !important;
        }
        .modal-close-btn:hover {
          background-color: rgba(255, 255, 255, 0.25) !important;
        }
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
        }
        .skeleton-shimmer::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
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
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Documents;
