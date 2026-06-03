import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Check, Trash2, Edit3, Plus, Image as ImageIcon, BarChart3, Database } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'gallery'

  // Stats State
  const [memberCount, setMemberCount] = useState('480+');
  const [papersCount, setPapersCount] = useState('120+');
  const [statsSaved, setStatsSaved] = useState(false);

  // Gallery CRUD State
  const [galleryItems, setGalleryItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [currentItemId, setCurrentItemId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCat, setFormCat] = useState('Workshop');
  const [formText, setFormText] = useState('');

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
    // Check if session exists
    const adminSession = sessionStorage.getItem('ieee_admin_session');
    if (adminSession === 'active') {
      setIsLoggedIn(true);
    }

    // Load initial values
    setMemberCount(localStorage.getItem('ieee_member_count') || '480+');
    setPapersCount(localStorage.getItem('ieee_papers_count') || '120+');

    const storedGallery = localStorage.getItem('ieee_gallery_items');
    if (storedGallery) {
      setGalleryItems(JSON.parse(storedGallery));
    } else {
      localStorage.setItem('ieee_gallery_items', JSON.stringify(defaultGallery));
      setGalleryItems(defaultGallery);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'ieee@kongu.edu' && password === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('ieee_admin_session', 'active');
      setLoginError('');
    } else {
      setLoginError('Invalid Email or Password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('ieee_admin_session');
    setEmail('');
    setPassword('');
  };

  const handleSaveStats = (e) => {
    e.preventDefault();
    localStorage.setItem('ieee_member_count', memberCount);
    localStorage.setItem('ieee_papers_count', papersCount);
    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 3000);
  };

  // Gallery CRUD Operations
  const openAddModal = () => {
    setModalMode('add');
    setCurrentItemId(null);
    setFormTitle('');
    setFormCat('Workshop');
    setFormText('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setCurrentItemId(item.id);
    setFormTitle(item.title);
    setFormCat(item.cat);
    setFormText(item.text);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formText.trim()) return;

    let updatedList = [];
    if (modalMode === 'add') {
      const newItem = {
        id: galleryItems.length > 0 ? Math.max(...galleryItems.map(i => i.id)) + 1 : 1,
        title: formTitle,
        cat: formCat,
        text: formText
      };
      updatedList = [...galleryItems, newItem];
    } else {
      updatedList = galleryItems.map(item => 
        item.id === currentItemId 
          ? { ...item, title: formTitle, cat: formCat, text: formText }
          : item
      );
    }

    setGalleryItems(updatedList);
    localStorage.setItem('ieee_gallery_items', JSON.stringify(updatedList));
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      const updatedList = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updatedList);
      localStorage.setItem('ieee_gallery_items', JSON.stringify(updatedList));
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '75vh',
        backgroundColor: '#f5faff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div className="card" style={{
          maxWidth: '420px',
          width: '100%',
          padding: '36px',
          boxShadow: '0 8px 30px rgba(10, 56, 91, 0.08)',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #d0e4f2'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#02619a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0a385b', marginBottom: '8px' }}>Admin Login</h2>
            <p style={{ fontSize: '13px', color: '#8ca6b9' }}>Authorize to manage branch portal database</p>
          </div>

          {loginError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px',
              border: '1px solid #fca5a5'
            }}>
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d0e4f2',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f8fafc'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d0e4f2',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f8fafc'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#02619a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '10px'
              }}
              className="admin-login-btn"
            >
              Sign In
            </button>
          </form>
        </div>

        <style>{`
          .admin-login-btn:hover {
            background-color: #0a385b !important;
            box-shadow: 0 4px 12px rgba(10,56,91,0.2);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', paddingBottom: '80px' }}>
      {/* Header Panel */}
      <div style={{
        background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
        color: '#ffffff',
        padding: '30px 0',
        marginBottom: '40px'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#ffffff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={28} /> Admin Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#d0e4f2', marginTop: '4px' }}>Welcome! You have full access to CRUD operations on website metrics and photo gallery logs.</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1.5px solid #ffffff',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            className="admin-logout-btn"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <div className="container">
        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '700',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'stats' ? '#02619a' : '#ffffff',
              color: activeTab === 'stats' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'stats' ? '0 4px 12px rgba(10,56,91,0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <BarChart3 size={16} /> Manage Statistics
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '700',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'gallery' ? '#02619a' : '#ffffff',
              color: activeTab === 'gallery' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'gallery' ? '0 4px 12px rgba(10,56,91,0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ImageIcon size={16} /> Manage Photo Gallery
          </button>
        </div>

        {/* Tab 1: Statistics Update Panel */}
        {activeTab === 'stats' && (
          <div className="card animate-fade-in" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', color: '#0a385b', marginBottom: '8px', fontWeight: '800' }}>Update Overview Counters</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>Modify the counters rendered in the metrics panel on the Home page.</p>

            {statsSaved && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <Check size={18} /> Counters successfully updated in local storage!
              </div>
            )}

            <form onSubmit={handleSaveStats} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '8px' }}>Active Members Count</label>
                <input
                  type="text"
                  required
                  value={memberCount}
                  onChange={(e) => setMemberCount(e.target.value)}
                  placeholder="e.g. 480+"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '8px' }}>Research Papers Count</label>
                <input
                  type="text"
                  required
                  value={papersCount}
                  onChange={(e) => setPapersCount(e.target.value)}
                  placeholder="e.g. 120+"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                  transition: 'all 0.2s ease'
                }}
                className="admin-save-btn"
              >
                Save Updates
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Gallery CRUD Operations */}
        {activeTab === 'gallery' && (
          <div className="animate-fade-in">
            {/* Title & Add Option */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Media Gallery Log</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Total Items: {galleryItems.length}</p>
              </div>
              <button
                onClick={openAddModal}
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2,97,154,0.2)',
                  transition: 'all 0.2s ease'
                }}
                className="admin-add-btn"
              >
                <Plus size={16} /> Add Photo Log
              </button>
            </div>

            {/* Gallery CRUD List Table */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Category</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Title / Event</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Description</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryItems.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: idx < galleryItems.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                          }}>
                            {item.cat}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'top', minWidth: '180px' }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#64748b', verticalAlign: 'top', minWidth: '240px' }}>
                          {item.text}
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'top', textAlign: 'center', width: '130px' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => openEditModal(item)}
                              title="Edit Event"
                              style={{
                                color: '#02619a',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                borderRadius: '4px',
                                padding: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              className="action-btn-hover-edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              title="Delete Event"
                              style={{
                                color: '#ef4444',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                borderRadius: '4px',
                                padding: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              className="action-btn-hover-delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CRUD Add/Edit Overlay Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 23, 38, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card" style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            animation: 'modal-slide-up 0.25s ease-out'
          }}>
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#0a385b',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                {modalMode === 'add' ? 'Add Photo Log' : 'Edit Photo Log'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveItem} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Category/Tag</label>
                <select
                  value={formCat}
                  onChange={(e) => setFormCat(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Hands-on">Hands-on</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flutter Workshop 2026"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Description</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Provide details about what occurred in this photo log..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 20px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: '#64748b',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: '#ffffff',
                    backgroundColor: '#02619a',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Button and Modal CSS */}
      <style>{`
        @keyframes modal-slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-logout-btn:hover {
          background-color: #ffffff !important;
          color: #0a385b !important;
        }
        .admin-save-btn:hover, .admin-add-btn:hover {
          background-color: #0a385b !important;
          box-shadow: 0 4px 12px rgba(10,56,91,0.2) !important;
        }
        .action-btn-hover-edit:hover {
          border-color: #02619a !important;
          background-color: #f0f7ff !important;
        }
        .action-btn-hover-delete:hover {
          border-color: #ef4444 !important;
          background-color: #fef2f2 !important;
        }
      `}</style>
    </div>
  );
};

export default Admin;
