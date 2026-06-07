import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
    color: '#ffffff',
    padding: '60px 0',
    textAlign: 'center',
    marginBottom: '40px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Decorative orbs */}
    <div style={{
      position: 'absolute', top: '-10%', right: '-8%',
      width: '320px', height: '320px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.03)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.02)', pointerEvents: 'none'
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

  const location = useLocation();
  const isUpcoming = location.pathname.includes('/upcoming');

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const defaultUpcoming = [
      {
        id: 1,
        title: "Hands-on Workshop: Flutter Application Development",
        desc: "Learn to build cross-platform mobile applications from scratch. Topics include widgets, state management, and API integration. Open to all branches.",
        date: "June 12, 2026",
        time: "09:00 AM - 04:30 PM",
        venue: "Advanced Computing Lab, KEC",
        tag: "Workshop",
        link: "https://forms.gle/mockregister"
      },
      {
        id: 2,
        title: "GreenTech Hackathon 2026",
        desc: "A 24-hour national hackathon challenging student groups to solve sustainability problems using hardware prototypes or intelligent software.",
        date: "June 26-27, 2026",
        time: "Starting 10:00 AM",
        venue: "KEC Technology Business Incubator",
        tag: "Hackathon",
        link: "https://forms.gle/mockregister"
      },
      {
        id: 3,
        title: "IEEE Membership Awareness Drive",
        desc: "Learn about the benefits of IEEE student membership, research databases access, grants, societies, and international networking events.",
        date: "July 03, 2026",
        time: "02:00 PM - 04:00 PM",
        venue: "Seminar Hall, CSE Dept, KEC",
        tag: "Seminar",
        link: "https://forms.gle/mockregister"
      }
    ];

    const defaultPast = [
      {
        id: 101,
        title: "Workshop on Digital Signal Processing & IoT",
        desc: "A 3-day practical bootcamp focusing on capturing and processing real-time sensor waveforms using ESP32 and DSP filtering algorithms.",
        date: "May 18, 2026",
        venue: "DSP Lab, ECE Dept, KEC",
        tag: "SPS Chapter",
        highlights: "50+ participants built smart ECG filter prototypes."
      },
      {
        id: 102,
        title: "WIE CodeQuest: Coding Bootcamp for Girls",
        desc: "A bootcamp dedicated to teaching web building, database structure, and frontend hosting to young female engineers.",
        date: "April 24, 2026",
        venue: "Internet Lab, KEC",
        tag: "WIE Group",
        highlights: "Participated by 80 girls, 5 projects were selected for incubation support."
      },
      {
        id: 103,
        title: "National Conference on Computing & Communication (NCCC 2026)",
        desc: "Flagship paper presentation event featuring research papers from student groups across the region, judged by Anna University faculty.",
        date: "March 15, 2026",
        venue: "Maharaja Auditorium, KEC",
        tag: "Conference",
        highlights: "30+ research papers published in local IEEE digital archives."
      },
      {
        id: 104,
        title: "Guest Lecture: Opportunities in Edge AI & TinyML",
        desc: "A seminar on running micro neural-network models directly on resource-constrained microcontrollers.",
        date: "February 12, 2026",
        venue: "Mechanical Dept Seminar Hall, KEC",
        tag: "Guest Lecture",
        highlights: "Delivered by senior R&D engineer from Intel India."
      }
    ];

    const storedUpcoming = localStorage.getItem('ieee_events_upcoming');
    if (storedUpcoming) {
      setUpcomingEvents(JSON.parse(storedUpcoming));
    } else {
      localStorage.setItem('ieee_events_upcoming', JSON.stringify(defaultUpcoming));
      setUpcomingEvents(defaultUpcoming);
    }

    const storedPast = localStorage.getItem('ieee_events_past');
    if (storedPast) {
      setPastEvents(JSON.parse(storedPast));
    } else {
      localStorage.setItem('ieee_events_past', JSON.stringify(defaultPast));
      setPastEvents(defaultPast);
    }
  }, []);

  const currentEvents = isUpcoming ? upcomingEvents : pastEvents;

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
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', justifyContent: 'center' }}>
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
                backgroundColor: active ? '#0a385b' : '#ffffff',
                color: active ? '#ffffff' : '#64748b',
                boxShadow: active
                  ? '0 4px 14px rgba(10,56,91,0.25)'
                  : '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Section intro label */}
        <div style={{ marginBottom: '28px' }}>
          <span style={{
            padding: '4px 14px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--primary)',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <Sparkles size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {isUpcoming ? 'Upcoming Programs' : 'Completed Programs'}
          </span>
          <h2 className="font-serif" style={{ fontSize: '24px', color: '#0a385b', marginTop: '10px', fontWeight: '800' }}>
            {isUpcoming ? 'Programs Open for Registration' : 'Historical Event Archive'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {isUpcoming
              ? 'Browse and register for our upcoming technical events and seminars.'
              : 'A comprehensive log of events completed by KEC IEEE Student Branch.'}
          </p>
        </div>

        {/* Event Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {currentEvents.map((evt, idx) => {
            const isPast = isEventCompleted(evt.date);
            const tagStyle = getTagStyle(evt.tag);
            return (
              <div
                key={idx}
                className="card event-card"
                style={{
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
                {/* Card Top Accent Bar */}
                <div style={{
                  height: '4px',
                  background: isPast
                    ? 'linear-gradient(90deg, #cbd5e1 0%, #94a3b8 100%)'
                    : 'linear-gradient(90deg, #0a385b 0%, #02619a 100%)'
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
                    color: isPast ? '#475569' : '#0a385b',
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
                    {evt.desc}
                  </p>

                  {/* Meta Info */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    borderTop: '1px solid var(--border-subtle)', paddingTop: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <Calendar size={13} style={{ color: isPast ? '#94a3b8' : '#02619a', flexShrink: 0 }} />
                      <span>{evt.date}</span>
                    </div>
                    {evt.time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <Clock size={13} style={{ color: isPast ? '#94a3b8' : '#02619a', flexShrink: 0 }} />
                        <span>{evt.time}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <MapPin size={13} style={{ color: isPast ? '#94a3b8' : '#02619a', flexShrink: 0 }} />
                      <span>{evt.venue}</span>
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
                        backgroundColor: '#0a385b', color: '#ffffff',
                        padding: '11px 20px', borderRadius: '8px',
                        fontSize: '14px', fontWeight: '700',
                        textDecoration: 'none',
                        transition: 'all 0.25s ease',
                        letterSpacing: '0.3px'
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
      </div>

      <style>{`
        .event-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(10,56,91,0.10) !important;
        }
        .event-register-btn:hover {
          background-color: #02619a !important;
          box-shadow: 0 6px 16px rgba(2,97,154,0.28);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default Events;
