import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => setIsOpen(!isOpen);

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
        { name: 'IEEE KEC SB', link: '/execomm' },
        { name: 'IEEE KEC SPS Chapter', link: '/about/kec-sps' },
        { name: 'IEEE KEC WIE Group', link: '/about/kec-wie' },
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
    }
  };

  return (
    <header style={{
      backgroundColor: '#0a385b', /* Dark KSV Blue */
      borderBottom: '1px solid #0f4875',
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
                  <div className="dropdown-menu" style={{ backgroundColor: '#ffffff', borderColor: '#d0e4f2', boxShadow: 'var(--shadow-md)' }}>
                    {item.items.map((subItem, sIdx) => (
                      <NavLink
                        key={sIdx}
                        to={subItem.link}
                        style={({ isActive }) => ({
                          display: 'block',
                          padding: '10px 20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: isActive ? '#02619a' : '#0a1c2a',
                          backgroundColor: isActive ? '#f5faff' : 'transparent',
                          textDecoration: 'none',
                          borderBottom: '1px solid #eef6fc'
                        })}
                        className="dropdown-item-hover-light"
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={idx}
                to={item.link}
                style={({ isActive }) => ({
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: isActive ? '#0a385b' : 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  borderRadius: isActive ? '20px' : '4px',
                  textDecoration: 'none',
                  transition: 'var(--transition-fast)',
                  whiteSpace: 'nowrap'
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
              border: '1.5px solid #ffffff',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
            className="rec-btn-hover"
          >
            Recommendation
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
              border: '1.5px solid #ffffff',
              backgroundColor: '#ffffff',
              color: '#0a385b',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap'
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
          backgroundColor: '#0a385b',
          borderBottom: '1px solid #0f4875',
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
                        {item.items.map((subItem, sIdx) => (
                          <NavLink
                            key={sIdx}
                            to={subItem.link}
                            onClick={() => setIsOpen(false)}
                            style={({ isActive }) => ({
                              display: 'block',
                              padding: '8px',
                              fontSize: '13px',
                              color: isActive ? '#c9ebff' : 'rgba(255,255,255,0.8)',
                              textDecoration: 'none'
                            })}
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
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
                  border: '1.5px solid #ffffff',
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
                  backgroundColor: '#ffffff',
                  color: '#0a385b',
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

              return (
                <NavLink
                  key={idx}
                  to={item.link}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => ({
                    display: 'block',
                    padding: '10px 0',
                    fontSize: '15px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                style={{
                  border: '1.5px solid #ffffff',
                  borderRadius: '20px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ffffff',
                  textDecoration: 'none'
                }}
              >
                Recommendation Letter
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
          background-color: #ffffff !important;
          color: #0a385b !important;
        }
        .admin-btn-hover:hover {
          background-color: transparent !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
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
