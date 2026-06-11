import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveDropdown(null);
    setActiveSubDropdown(null);
  };

  const menuItems = [
    { name: 'Home', link: '/' },
    {
      name: 'Events',
      items: [
        { name: 'Upcoming Events', link: '/events/upcoming' },
        { name: 'Past Events', link: '/events/past' },
      ],
    },
    {
      name: 'Achievements',
      items: [
        { name: 'Student Achievements', link: '/achievements' },
      ],
    },
    {
      name: 'About',
      items: [
        { name: 'About IEEE KEC SB', link: '/about/ieee-kec-sb' },
        { name: 'IEEE KEC Internal Committee', link: '/faculties' },
        { name: 'Operational Committees', link: '/committee' },
      ],
    },
    {
      name: 'Execomm',
      items: [
        {
          name: 'Members & Coordinators',
          subItems: [
            { 
              name: 'Faculty Members', 
              link: '/execomm/faculties',
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            },
            { 
              name: 'Student Members', 
              link: '/execomm/students',
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            }
          ]
        },
        {
          name: 'Societies',
          subItems: [
            { 
              name: 'IEEE Student Branch', 
              link: '/execomm/student-branch',
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 19.1 14.2-14.2"/><path d="M12 2v20"/><path d="M20.2 6.8a10 10 0 0 0-16.4 0"/><path d="M3.8 17.2a10 10 0 0 0 16.4 0"/></svg>
            },
            { 
              name: 'IEEE Computer Society', 
              link: '/execomm/computer-society',
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" x2="12" y1="2" y2="22"/></svg>
            },
            { 
              name: 'IEEE Women in Engineering (WIE)', 
              link: '/execomm/wie',
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 5-12h-1.65a4 4 0 1 0-6.7 0H7a7 7 0 0 0 5 12z"/><path d="M12 2v2"/><path d="M12 8v2"/></svg>
            },
            { 
              name: 'IEEE Robotics & Automation Society (RAS)', 
              link: '/execomm/ras',
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="8" rx="2" ry="2"/><path d="M12 2v6"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/></svg>
            },
            { 
              name: 'IEEE Power & Energy Society (PES)', 
              link: '/execomm/pes',
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            },
            { 
              name: 'IEEE Communications Society (ComSoc)', 
              link: '/execomm/comsoc',
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 2.4-1 4.7-2.6 6.4L18 16a6 6 0 0 0 0-8L16.4 6.4c2-2 4.6-3 6.6-3z"/><path d="M12 6a6 6 0 0 1 6 6c0 1.5-.6 3-1.6 4L15 14a3 3 0 0 0 0-4l-1.6-1.6c1.2-1.2 2.8-1.8 3.8-1.8z"/><circle cx="12" cy="12" r="2"/></svg>
            }
          ]
        }
      ],
    },
    {
      name: 'Media',
      items: [
        { name: 'Gallery', link: '/media/gallery' },
        { name: 'News', link: '/media/news' },
      ],
    },
    {
      name: 'Downloads',
      items: [
        { name: 'IEEE Guidelines', link: '/about/ieee' }, // fallback
      ],
    },
    { name: 'Contact', link: '/contact' },
  ];

  const handleDropdownClick = (idx, e) => {
    if (window.innerWidth <= 1200) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === idx ? null : idx);
      setActiveSubDropdown(null);
    }
  };

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      color: '#ffffff'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 16px' }}>
        
        {/* Left Side: Transparent Logo Banner */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img 
            src="/assets/ieee_logo_white.png" 
            alt="IEEE Logo" 
            style={{ height: '52px', display: 'block', maxWidth: '100%' }} 
          />
        </Link>

        {/* Center: Navigation Menu */}
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center', marginRight: '16px' }}>
          {menuItems.map((item, idx) => {
            if (item.items) {
              const isExecomm = item.name === 'Execomm';
              return (
                <div key={idx} className="dropdown-parent" style={{ position: 'relative' }}>
                  <button
                    onClick={(e) => handleDropdownClick(idx, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'var(--transition-fast)',
                      whiteSpace: 'nowrap'
                    }}
                    className="nav-link-hover"
                  >
                    {item.name}
                    <ChevronDown size={12} style={{ opacity: 0.7 }} />
                  </button>
                  <div className="dropdown-menu" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(12px)', 
                    borderColor: 'var(--border-subtle)', 
                    borderRadius: '12px', 
                    boxShadow: 'var(--shadow-lg)', 
                    overflow: 'visible',
                    minWidth: isExecomm ? '260px' : '220px'
                  }}>
                    {item.items.map((subItem, sIdx) => {
                      if (subItem.subItems) {
                        return (
                          <div key={sIdx} className="submenu-parent">
                            <button
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '10px 20px',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: 'var(--text-dark)',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                borderBottom: '1px solid var(--border-subtle)',
                                borderLeft: '3px solid transparent'
                              }}
                              className="dropdown-item-hover-light"
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {subItem.name === 'Members & Coordinators' ? (
                                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                  </span>
                                ) : (
                                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 19.1 14.2-14.2"/><path d="M12 2v20"/><path d="M20.2 6.8a10 10 0 0 0-16.4 0"/><path d="M3.8 17.2a10 10 0 0 0 16.4 0"/></svg>
                                  </span>
                                )}
                                <span>{subItem.name}</span>
                              </div>
                              <ChevronRight size={12} style={{ opacity: 0.7 }} />
                            </button>
                            <div className="submenu-menu" style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              backdropFilter: 'blur(12px)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '12px',
                              boxShadow: 'var(--shadow-lg)',
                              minWidth: '260px'
                            }}>
                              {subItem.subItems.map((nestedItem, nIdx) => (
                                <NavLink
                                  key={nIdx}
                                  to={nestedItem.link}
                                  style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: isActive ? 'var(--secondary)' : 'var(--text-dark)',
                                    backgroundColor: isActive ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                                    textDecoration: 'none',
                                    borderBottom: nIdx === subItem.subItems.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                                    borderLeft: isActive ? '3px solid var(--secondary)' : '3px solid transparent'
                                  })}
                                  className="dropdown-item-hover-light"
                                >
                                  {nestedItem.icon && <span style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary)' }}>{nestedItem.icon}</span>}
                                  <span>{nestedItem.name}</span>
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <NavLink
                          key={sIdx}
                          to={subItem.link}
                          style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: isActive ? 'var(--secondary)' : 'var(--text-dark)',
                            backgroundColor: isActive ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                            textDecoration: 'none',
                            borderBottom: '1px solid var(--border-subtle)',
                            borderLeft: isActive ? '3px solid var(--secondary)' : '3px solid transparent'
                          })}
                          className="dropdown-item-hover-light"
                        >
                          {subItem.icon && <span style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary)' }}>{subItem.icon}</span>}
                          <span>{subItem.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={idx}
                to={item.link}
                style={({ isActive }) => ({
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                  background: isActive ? 'var(--gradient-colorful)' : 'transparent',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none'
                })}
                className={({ isActive }) => isActive ? '' : 'nav-link-hover'}
              >
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Side: Recommendation button & Logos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }} className="header-right">
          <Link
            to="/contact"
            style={{
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '20px',
              padding: '8px 20px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#ffffff',
              background: 'transparent',
              textDecoration: 'none',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
            className="rec-btn-hover"
          >
            Recommendation Letter
          </Link>

          {/* KEC logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a 
              href="https://kongu.ac.in/aboutkec" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'block' }}
            >
              <img 
                src="/assets/kec_logo.png" 
                alt="Kongu Engineering College Logo" 
                style={{ 
                  height: '32px', 
                  display: 'block',
                  cursor: 'pointer'
                }} 
              />
            </a>
          </div>

          {/* Admin Dashboard link */}
          <Link
            to="/admin"
            style={{
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#ffffff',
              background: 'var(--gradient-cyber)',
              textDecoration: 'none',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 10px rgba(6, 182, 212, 0.3)'
            }}
            className="admin-btn-hover"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Hamburger menu */}
        <button
          onClick={toggleMenu}
          className="menu-hamburger-btn"
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '8px',
            flexShrink: 0
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto',
          zIndex: 999,
          width: '100%'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item, idx) => {
              if (item.items) {
                const isDropdownOpen = activeDropdown === idx;
                return (
                  <div key={idx} style={{ borderBottom: '1px solid #0f4875' }}>
                    <button
                      onClick={(e) => handleDropdownClick(idx, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '12px 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {item.name}
                      <ChevronDown size={16} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition-fast)' }} />
                    </button>
                    {isDropdownOpen && (
                      <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        {item.items.map((subItem, sIdx) => {
                          if (subItem.subItems) {
                            const isSubDropdownOpen = activeSubDropdown === sIdx;
                            return (
                              <div key={sIdx}>
                                <button
                                  onClick={() => setActiveSubDropdown(isSubDropdownOpen ? null : sIdx)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '8px 0',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {subItem.name === 'Members & Coordinators' ? (
                                      <span style={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                      </span>
                                    ) : (
                                      <span style={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 19.1 14.2-14.2"/><path d="M12 2v20"/><path d="M20.2 6.8a10 10 0 0 0-16.4 0"/><path d="M3.8 17.2a10 10 0 0 0 16.4 0"/></svg>
                                      </span>
                                    )}
                                    <span>{subItem.name}</span>
                                  </div>
                                  <ChevronDown size={14} style={{ transform: isSubDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition-fast)', opacity: 0.7 }} />
                                </button>
                                {isSubDropdownOpen && (
                                  <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px', marginBottom: '8px' }}>
                                    {subItem.subItems.map((nestedItem, nIdx) => (
                                      <NavLink
                                        key={nIdx}
                                        to={nestedItem.link}
                                        onClick={() => setIsOpen(false)}
                                        style={({ isActive }) => ({
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          padding: '6px 8px',
                                          fontSize: '12px',
                                          color: isActive ? '#c9ebff' : 'rgba(255,255,255,0.7)',
                                          textDecoration: 'none',
                                          borderLeft: isActive ? '2px solid #c9ebff' : '2px solid transparent',
                                          paddingLeft: '8px'
                                        })}
                                      >
                                        {({ isActive }) => (
                                          <>
                                            {nestedItem.icon && (
                                              <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#c9ebff' : 'rgba(255,255,255,0.5)' }}>
                                                {nestedItem.icon}
                                              </span>
                                            )}
                                            <span>{nestedItem.name}</span>
                                          </>
                                        )}
                                      </NavLink>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
                            <NavLink
                              key={sIdx}
                              to={subItem.link}
                              onClick={() => setIsOpen(false)}
                              style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                fontSize: '13px',
                                color: isActive ? '#c9ebff' : 'rgba(255,255,255,0.8)',
                                textDecoration: 'none',
                                borderLeft: isActive ? '2px solid #c9ebff' : '2px solid transparent',
                                paddingLeft: '8px'
                              })}
                            >
                              {({ isActive }) => (
                                <>
                                  {subItem.icon && (
                                    <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#c9ebff' : 'rgba(255,255,255,0.5)' }}>
                                      {subItem.icon}
                                    </span>
                                  )}
                                  <span>{subItem.name}</span>
                                </>
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={idx}
                  to={item.link}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => ({
                    display: 'block',
                    padding: '12px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isActive ? '#c9ebff' : '#ffffff',
                    textDecoration: 'none',
                    borderBottom: '1px solid #0f4875'
                  })}
                >
                  {item.name}
                </NavLink>
              );
            })}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #0f4875' }}>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                style={{
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '20px',
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ffffff',
                  textDecoration: 'none'
                }}
              >
                Recommendation Letter
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'var(--gradient-cyber)',
                  color: '#ffffff',
                  borderRadius: '20px',
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nav-link-hover:hover {
          background-color: rgba(255,255,255,0.08) !important;
          color: #ffffff !important;
        }
        .dropdown-item-hover-light:hover {
          background-color: #f5faff !important;
          color: #02619a !important;
        }
        .rec-btn-hover:hover {
          background: var(--gradient-colorful) !important;
          color: #ffffff !important;
          border-color: transparent !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }
        .admin-btn-hover:hover {
          background: var(--gradient-colorful) !important;
          color: #ffffff !important;
          box-shadow: 0 6px 15px rgba(79, 70, 229, 0.4);
          transform: translateY(-1px);
        }

        /* Tablet and below */
        @media (max-width: 1024px) {
          .header-nav, .header-right {
            display: none !important;
          }
          .menu-hamburger-btn {
            display: block !important;
          }
        }

        /* Small screens */
        @media (max-width: 480px) {
          header {
            padding: 8px 0 !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
