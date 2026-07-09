import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../services/api';
import { Calendar, MapPin, Clock, ExternalLink, CheckCircle2, Sparkles, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

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
      background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.12) 0%, transparent 70%)', pointerEvents: 'none'
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

const TAG_COLORS = {
  'Workshop':      { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'Hackathon':     { bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
  'Seminar':       { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  'Conference':    { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
  'Guest Lecture': { bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
  'SPS Chapter':   { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  'WIE Group':     { bg: '#fdf2f8', color: '#9d174d', border: '#fbcfe8' },
};

const getTagStyle = (tag) => TAG_COLORS[tag] || { bg: 'var(--accent-light)', color: 'var(--primary)', border: '#c3d9ea' };

const Events = () => {
  const isEventCompleted = (dateStr) => {
    try {
      const today = new Date("2026-06-04");
      let normalized = dateStr;
      if (normalized.includes('-')) {
        const parts = normalized.split('-');
        const yearMatch = normalized.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : "2026";
        const dayMatch = parts[1].match(/\d+/);
        const monthMatch = normalized.match(/[a-zA-Z]+/);
        if (dayMatch && monthMatch) {
          normalized = `${monthMatch[0]} ${dayMatch[0]}, ${year}`;
        }
      } else {
        const words = normalized.trim().split(/\s+/);
        if (words.length === 2) {
          normalized = `${words[0]} 28, ${words[1]}`;
        }
      }
      const parsedDate = new Date(normalized);
      return parsedDate < today;
    } catch (e) {
      return false;
    }
  };

  const isEventNear = (dateStr) => {
    try {
      const today = new Date("2026-06-04");
      let normalized = dateStr;
      if (normalized.includes('-')) {
        const parts = normalized.split('-');
        const yearMatch = normalized.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : "2026";
        const dayMatch = parts[0].match(/\d+/);
        const monthMatch = normalized.match(/[a-zA-Z]+/);
        if (dayMatch && monthMatch) {
          normalized = `${monthMatch[0]} ${dayMatch[0]}, ${year}`;
        }
      } else {
        const words = normalized.trim().split(/\s+/);
        if (words.length === 2) {
          normalized = `${words[0]} 28, ${words[1]}`;
        }
      }
      const parsedDate = new Date(normalized);
      const diffTime = parsedDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 10;
    } catch (e) {
      return false;
    }
  };

  const location = useLocation();
  const isUpcoming = location.pathname.includes('/upcoming');

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [isUpcoming]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        const eventsArray = Array.isArray(data) ? data : (data.events || []);

        const upcoming = [];
        const past = [];

        eventsArray.forEach(evt => {
          if (isEventCompleted(evt.date)) {
            past.push(evt);
          } else {
            upcoming.push(evt);
          }
        });

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const defaultEventsStats = [
    { label: "Total Events Conducted", count: "80+" },
    { label: "Technical Workshops", count: "45" },
    { label: "Hackathons Conducted", count: "15" },
    { label: "Total Participants", count: "3000+" }
  ];

  const [selectedTag, setSelectedTag] = useState('All');
  const [eventsStats, setEventsStats] = useState(defaultEventsStats);
  const [currentHighlightIdx, setCurrentHighlightIdx] = useState(0);

  const highlightItems = [
    { quote: "The Edge AI seminar gave me the exact code model I needed to deploy on my final year Arduino project.", student: "Abirami R.", role: "IV Year CSE" },
    { quote: "Flutter bootcamp was extremely hands-on. We deployed a live app to our devices by the end of the day.", student: "Gautham V.", role: "III Year IT" },
    { quote: "Winning the GreenTech expo provided us with ₹10,000 seed funding and SRC incubation office workspace.", student: "Vijay R.", role: "IV Year ECE" }
  ];
  const [eventPhilosophy, setEventPhilosophy] = useState({
    title: "Learn, Create & Collaborate",
    description: "At IEEE KEC SB, our events are designed around practical engineering experience. We bridge the gap between academic theory and active technology deployment through hands-on hackathons, research publications, and peer-to-peer programming."
  });

  useEffect(() => {
    setSelectedTag('All');
  }, [isUpcoming]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API}/settings`);
        if (response.ok) {
          const settings = await response.json();
          const getVal = (key) => {
            const s = settings.find(s => s.key === key);
            return s ? s.value : null;
          };
          
          const stats = getVal('ieee_events_stats_v1');
          if (stats) {
            try { setEventsStats(typeof stats === 'string' ? JSON.parse(stats) : stats); } catch(e){}
          }
          
          const philosophy = getVal('ieee_events_philosophy_v1');
          if (philosophy) {
            try { setEventPhilosophy(typeof philosophy === 'string' ? JSON.parse(philosophy) : philosophy); } catch(e){}
          }
        }
      } catch (err) {
        console.error('Failed to load event settings', err);
      }
    };
    fetchSettings();
  }, []);

  const currentEvents = isUpcoming ? upcomingEvents : pastEvents;
  const filteredEvents = currentEvents;
  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 3);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '60vh' }}>
      <PageHeader
        title={isUpcoming ? "Upcoming Events" : "Past Events"}
        subtitle={
          isUpcoming
            ? "Register and participate in our upcoming programs"
            : "A record of our past workshops, guest lectures, and hackathons"
        }
      />

      <div className="container">

        {/* Toggle Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', justifyContent: 'center' }}>
          {[
            { to: '/events/upcoming', label: 'Upcoming Events', active: isUpcoming },
            { to: '/events/past',     label: 'Past Events',     active: !isUpcoming },
          ].map(({ to, label, active }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: '10px 28px',
                fontSize: '14px',
                fontWeight: '700',
                borderRadius: '30px',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.3px',
                transition: 'all 0.25s ease',
                background: active ? 'var(--gradient-colorful)' : '#ffffff',
                color: active ? '#ffffff' : '#64748b',
                boxShadow: active
                  ? '0 4px 15px rgba(var(--secondary-rgb), 0.35)'
                  : '0 2px 6px rgba(0, 0, 0, 0.06)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>


        {/* Section intro label */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{
              padding: '6px 14px',
              backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
              color: 'var(--secondary)',
              border: '1px solid rgba(var(--secondary-rgb), 0.15)',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '750',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <Sparkles size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {isUpcoming ? 'Upcoming Programs' : 'Completed Programs'}
            </span>
            <h2 className="font-serif" style={{ fontSize: '24px', color: 'var(--primary)', marginTop: '10px', fontWeight: '800' }}>
              {isUpcoming ? 'Programs Open for Registration' : 'Historical Event Archive'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              {isUpcoming
                ? 'Browse and register for our upcoming technical events and seminars.'
                : 'A comprehensive log of events completed by KEC IEEE Student Branch.'}
            </p>
          </div>

          {filteredEvents.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: '700',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: 'transparent',
                border: '1.5px solid var(--secondary)',
                color: 'var(--secondary)',
                whiteSpace: 'nowrap'
              }}
              className="view-all-btn"
            >
              {showAll ? 'Show Less' : 'View All Events'}
            </button>
          )}
        </div>

        {/* Event Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading events...</p>
          </div>
        ) : error ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--error)' }}>
            Error loading events: {error}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {displayedEvents.map((evt, idx) => {
              const isPast = isEventCompleted(evt.date);
              const isNear = isEventNear(evt.date);
              const shouldShowNewBadge = !isPast && (evt.showNewBadge || isNear);
              const tagStyle = getTagStyle(evt.tag);
              return (
                <div
                  key={idx}
                  className="card event-card"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    opacity: isPast ? 0.82 : 1,
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    padding: 0,
                  }}
                >
                  {/* NEW Badge / Sticker */}
                  {shouldShowNewBadge && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 3,
                      filter: 'drop-shadow(0 2px 6px rgba(239, 68, 68, 0.45))',
                    }} className="new-badge-pulse">
                      <svg viewBox="0 0 100 100" width="38" height="38">
                        <path d="M 50 5 L 62 18 L 79 12 L 82 30 L 98 33 L 90 50 L 98 67 L 82 70 L 79 88 L 62 82 L 50 95 L 38 82 L 21 88 L 18 70 L 2 67 L 10 50 L 2 33 L 18 30 L 21 12 L 38 18 Z" fill="#ef4444" />
                        <text x="50" y="55" fill="white" fontSize="16" fontWeight="900" textAnchor="middle" transform="rotate(-15 50 55)">NEW</text>
                      </svg>
                    </div>
                  )}
                  {/* Card Top Accent Bar */}
                  <div style={{
                    height: '4px',
                    background: isPast
                      ? 'linear-gradient(90deg, #cbd5e1 0%, #94a3b8 100%)'
                      : 'var(--gradient-colorful)'
                  }} />

                  <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1, gap: '0' }}>
                    {/* Tag + Status Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{
                        backgroundColor: tagStyle.bg,
                        color: tagStyle.color,
                        border: `1px solid ${tagStyle.border}`,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {evt.tag}
                      </span>
                      {isPast && (
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', fontWeight: '700',
                          color: '#64748b', backgroundColor: '#f1f5f9',
                          padding: '4px 10px', borderRadius: '20px',
                          border: '1px solid #e2e8f0',
                          textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}>
                          <CheckCircle2 size={11} />
                          Completed
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '17px',
                      marginBottom: '10px',
                      color: isPast ? '#475569' : 'var(--primary)',
                      lineHeight: '1.45',
                      fontWeight: '750'
                    }}>
                      {evt.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '13.5px',
                      marginBottom: '20px',
                      lineHeight: '1.65',
                      flex: 1
                    }}>
                      {evt.description || evt.desc}
                    </p>

                    {/* Meta Info */}
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: '8px',
                      borderTop: '1px solid var(--border-subtle)', paddingTop: '16px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <Calendar size={13} style={{ color: isPast ? '#94a3b8' : 'var(--secondary)', flexShrink: 0 }} />
                        <span>{evt.date}</span>
                      </div>
                      {evt.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          <Clock size={13} style={{ color: isPast ? '#94a3b8' : 'var(--secondary)', flexShrink: 0 }} />
                          <span>{evt.time}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <MapPin size={13} style={{ color: isPast ? '#94a3b8' : 'var(--secondary)', flexShrink: 0 }} />
                        <span>{evt.location || evt.venue}</span>
                      </div>
                    </div>

                    {/* CTA or Highlight */}
                    {isUpcoming ? (
                      <a
                         href={evt.link}
                         target="_blank"
                         rel="noopener noreferrer"
                         style={{
                           display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                           background: 'var(--gradient-colorful)', color: '#ffffff',
                           padding: '11px 20px', borderRadius: '8px',
                           fontSize: '14px', fontWeight: '700',
                           textDecoration: 'none',
                           transition: 'all 0.25s ease',
                           letterSpacing: '0.3px',
                           boxShadow: '0 4px 12px rgba(var(--secondary-rgb), 0.25)'
                         }}
                         className="event-register-btn"
                       >
                         Register Now <ExternalLink size={14} />
                       </a>
                    ) : (
                      <div style={{
                        backgroundColor: '#f8fafc',
                        borderLeft: '3px solid #94a3b8',
                        padding: '12px 14px',
                        borderRadius: '0 6px 6px 0',
                        fontSize: '13px', color: '#475569', fontWeight: '500',
                        lineHeight: '1.55'
                      }}>
                        <strong style={{ color: '#334155', display: 'block', marginBottom: '2px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event Highlight</strong>
                        {evt.highlights}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No events found matching category "{selectedTag}"
          </div>
        )}

        {/* IEEE Event Philosophy Section */}
        {eventPhilosophy && (
          <div className="card scroll-reveal fade-up" style={{
            marginTop: '56px',
            marginBottom: '56px',
            padding: '40px 36px',
            background: 'rgba(var(--secondary-rgb), 0.03)',
            borderLeft: '4px solid var(--secondary)',
            borderRadius: '0 12px 12px 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--secondary)' }}>Our Philosophy</span>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)', marginTop: '8px', marginBottom: '14px' }}>
                {eventPhilosophy.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.65', margin: 0 }}>
                {eventPhilosophy.description}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '800', margin: '0 0 6px 0' }}>Practical First</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: 0 }}>All workshops involve hardware assembly or live code compilation.</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '800', margin: '0 0 6px 0' }}>Global Standards</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: 0 }}>Curriculums review official IEEE publications and documentation.</p>
              </div>
            </div>
          </div>
        )}

        {/* Participation Highlights Section */}
        <div style={{ marginTop: '64px', borderTop: '1px solid var(--border-subtle)', paddingTop: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 className="font-serif" style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px' }}>
              Participation Highlights
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--secondary)', margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
              Hear what student members have to say about our recent tech bootcamps
            </p>
          </div>

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 40px' }}>
            {highlightItems.length > 0 && (
              <div className="card" style={{
                position: 'relative',
                padding: '40px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '200px',
                justifyContent: 'center'
              }}>
                <Quote size={40} style={{ color: 'rgba(var(--secondary-rgb), 0.15)', marginBottom: '16px' }} />
                <p style={{
                  fontSize: '15.5px',
                  lineHeight: '1.7',
                  color: 'var(--text-dark)',
                  fontStyle: 'italic',
                  marginBottom: '20px',
                  fontWeight: '500'
                }}>
                  "{highlightItems[currentHighlightIdx].quote}"
                </p>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)', margin: '0 0 2px 0' }}>
                    — {highlightItems[currentHighlightIdx].student}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {highlightItems[currentHighlightIdx].role}
                  </span>
                </div>
              </div>
            )}

            {/* Carousel Navigation Buttons */}
            {highlightItems.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentHighlightIdx((prev) => (prev - 1 + highlightItems.length) % highlightItems.length)}
                  style={{
                    position: 'absolute',
                    left: '-10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    zIndex: 2,
                    transition: 'all 0.2s ease'
                  }}
                  className="carousel-btn"
                  title="Previous highlight"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentHighlightIdx((prev) => (prev + 1) % highlightItems.length)}
                  style={{
                    position: 'absolute',
                    right: '-10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    zIndex: 2,
                    transition: 'all 0.2s ease'
                  }}
                  className="carousel-btn"
                  title="Next highlight"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dots indicator */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
              {highlightItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHighlightIdx(idx)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: idx === currentHighlightIdx ? 'var(--secondary)' : 'rgba(var(--secondary-rgb), 0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease'
                  }}
                  title={`Go to highlight ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .event-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(var(--secondary-rgb), 0.1) !important;
          border-color: rgba(var(--secondary-rgb), 0.3) !important;
        }
        .event-register-btn:hover {
          background: var(--gradient-colorful) !important;
          box-shadow: 0 6px 18px rgba(var(--secondary-rgb), 0.4);
          transform: translateY(-1px);
        }
        @keyframes pulse-glow {
          0% { transform: scale(1); filter: drop-shadow(0 2px 6px rgba(239, 68, 68, 0.45)); }
          50% { transform: scale(1.06); filter: drop-shadow(0 2px 14px rgba(239, 68, 68, 0.7)); }
          100% { transform: scale(1); filter: drop-shadow(0 2px 6px rgba(239, 68, 68, 0.45)); }
        }
        .new-badge-pulse {
          animation: pulse-glow 2.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Events;
