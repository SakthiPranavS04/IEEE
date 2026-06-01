import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { ChevronUp } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Achievements from './pages/Achievements';
import Execomm from './pages/Execomm';
import Committees from './pages/Committees';
import Media from './pages/Media';
import Contact from './pages/Contact';

// About Pages
import {
  IEEEGlobal,
  KVITTTrust,
  KonguEngineering,
  KECSRC,
  IEEEKECSB,
  KECSPS,
  KECWIE
} from './pages/AboutPages';

import './App.css';

function App() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Sticky Header with dropdown navigation */}
      <Navbar />

      {/* Main Website Route Contents */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* About Routes */}
          <Route path="/about/ieee" element={<IEEEGlobal />} />
          <Route path="/about/kvitt" element={<KVITTTrust />} />
          <Route path="/about/kec" element={<KonguEngineering />} />
          <Route path="/about/kec-src" element={<KECSRC />} />
          <Route path="/about/ieee-kec-sb" element={<IEEEKECSB />} />
          <Route path="/about/kec-sps" element={<KECSPS />} />
          <Route path="/about/kec-wie" element={<KECWIE />} />
          <Route path="/about" element={<IEEEKECSB />} />

          {/* Committee Routes */}
          <Route path="/faculties" element={<Execomm />} />
          <Route path="/execomm" element={<Execomm />} />
          <Route path="/committee" element={<Committees />} />

          {/* Events Routes */}
          <Route path="/events/upcoming" element={<Events />} />
          <Route path="/events/past" element={<Events />} />

          {/* Achievements Route */}
          <Route path="/achievements" element={<Achievements />} />

          {/* Media Routes */}
          <Route path="/media/gallery" element={<Media />} />
          <Route path="/media/news" element={<Media />} />

          {/* Contact Route */}
          <Route path="/contact" element={<Contact />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Branded footer */}
      <Footer />

      {/* Back to Top Floating Button (positioned vertically above the chatbot trigger) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '102px',
            right: '35px',
            backgroundColor: '#0a385b', // Primary KSV Blue
            color: '#ffffff',
            border: '2px solid #ffffff',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transition: 'all 0.2s ease'
          }}
          className="scroll-top-btn"
          title="Scroll to Top"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {/* Floating Interactive Chatbot */}
      <Chatbot />

      <style>{`
        .scroll-top-btn:hover {
          background-color: #02619a !important;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important;
        }
      `}</style>
    </div>
  );
}

export default App;
