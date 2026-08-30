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
import Documents from './pages/Documents';
import SocietyPage from './pages/SocietyPage';
import APSPage from './pages/APSPage';
import ComputerSocietyPage from './pages/ComputerSocietyPage';
import WIEPage from './pages/WIEPage';
import RASPage from './pages/RASPage';
import PESPage from './pages/PESPage';
import ComSocPage from './pages/ComSocPage';

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

import SocietiesPage from './pages/SocietiesPage';

import RequestFormPage from './pages/RequestFormPage';
import RequestFormsListing from './pages/RequestFormsListing';

import './App.css';
import API from './services/api';

function App() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Backend Connection Test
  useEffect(() => {
    console.log("Attempting to connect to Backend URL:", API);
    
    // We try to fetch the /events route (or any route) to see if the server responds
    fetch(`${API}/events`)
      .then(response => {
        if (response.ok) {
           console.log("✅ SUCCESSFULLY CONNECTED TO BACKEND! Data was retrieved.");
        } else {
           console.log("✅ SUCCESSFULLY CONNECTED TO BACKEND! (The server responded, even though this specific route might be protected/empty. Status:", response.status, ")");
        }
      })
      .catch(error => console.error("❌ FAILED TO CONNECT TO BACKEND! Make sure the backend server is running.", error));
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Wait for page transition and render
    const timer = setTimeout(() => {
      const selectors = 'section, .card, .scroll-reveal, .execomm-clickable-card, .achievement-row, .event-card-container, .contact-container, .about-section, .operational-committees-section, .media-gallery-card, .news-card';
      const elementsToReveal = document.querySelectorAll(selectors);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('scroll-visible');
            } else {
              entry.target.classList.remove('scroll-visible');
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      elementsToReveal.forEach((el) => {
        if (!el.classList.contains('scroll-reveal')) {
          el.classList.add('scroll-reveal');
        }
        observer.observe(el);
      });

      return () => {
        elementsToReveal.forEach((el) => observer.unobserve(el));
      };
    }, 150);

    return () => clearTimeout(timer);
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
          
          {/* About / Societies Routes */}
          <Route path="/societies" element={<SocietiesPage />} />
          <Route path="/about/ieee" element={<IEEEGlobal />} />
          <Route path="/about/kvitt" element={<KVITTTrust />} />
          <Route path="/about/kec" element={<KonguEngineering />} />
          <Route path="/about/kec-src" element={<KECSRC />} />
          <Route path="/about/ieee-kec-sb" element={<SocietiesPage />} />
          <Route path="/about/kec-sps" element={<KECSPS />} />
          <Route path="/about/kec-wie" element={<KECWIE />} />
          <Route path="/about" element={<SocietiesPage />} />
          
          {/* Request Form Routes */}
          <Route path="/request/forms" element={<RequestFormsListing />} />
          <Route path="/request/:slug" element={<RequestFormPage />} />

          {/* Committee Routes */}
          <Route path="/faculties" element={<Execomm />} />
          <Route path="/execomm" element={<Execomm />} />
          <Route path="/execomm/faculties" element={<Execomm />} />
          <Route path="/execomm/students" element={<Execomm />} />
          <Route path="/committee" element={<Committees />} />

          {/* Redesigned Execomm Society Routes */}
          <Route path="/execomm/ap-s" element={<APSPage />} />
          <Route path="/execomm/computer-society" element={<ComputerSocietyPage />} />
          <Route path="/execomm/wie" element={<WIEPage />} />
          <Route path="/execomm/ras" element={<RASPage />} />
          <Route path="/execomm/pes" element={<PESPage />} />
          <Route path="/execomm/comsoc" element={<ComSocPage />} />

          {/* Alternate spelling / fallback routes */}
          <Route path="/execcomm/ap-s" element={<APSPage />} />
          <Route path="/execcomm/computer-society" element={<ComputerSocietyPage />} />
          <Route path="/execcomm/wie" element={<WIEPage />} />
          <Route path="/execcomm/ras" element={<RASPage />} />
          <Route path="/execcomm/pes" element={<PESPage />} />
          <Route path="/execcomm/comsoc" element={<ComSocPage />} />

          {/* Legacy /excomm/ fallback routes */}
          <Route path="/excomm/ap-s" element={<APSPage />} />
          <Route path="/excomm/computer-society" element={<ComputerSocietyPage />} />
          <Route path="/excomm/wie" element={<WIEPage />} />
          <Route path="/excomm/ras" element={<RASPage />} />
          <Route path="/excomm/pes" element={<PESPage />} />
          <Route path="/excomm/comsoc" element={<ComSocPage />} />

          {/* Fallback route handler for dynamic paths */}
          <Route path="/excomm/:societyId" element={<SocietyPage />} />
          <Route path="/execomm/:societyId" element={<SocietyPage />} />

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

          {/* Documents Route */}
          <Route path="/documents" element={<Documents />} />

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

        @media (max-width: 768px) {
          .scroll-top-btn {
            width: 40px !important;
            height: 40px !important;
            bottom: 90px !important;
            right: 20px !important;
          }
        }

        @media (max-width: 480px) {
          .scroll-top-btn {
            width: 36px !important;
            height: 36px !important;
            bottom: 80px !important;
            right: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
