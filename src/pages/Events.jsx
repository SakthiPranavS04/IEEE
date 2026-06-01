import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ExternalLink, ChevronRight } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
    color: '#ffffff',
    padding: '50px 0',
    textAlign: 'center',
    marginBottom: '40px'
  }}>
    <div className="container">
      <h1 className="font-serif" style={{ fontSize: '32px', color: '#ffffff', marginBottom: '8px' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '15px', color: '#d0e4f2' }}>{subtitle}</p>}
    </div>
  </div>
);

const Events = () => {
  const location = useLocation();
  const isUpcoming = location.pathname.includes('/upcoming');

  const upcomingEvents = [
    {
      title: "Hands-on Workshop: Flutter Application Development",
      desc: "Learn to build cross-platform mobile applications from scratch. Topics include widgets, state management, and API integration. Open to all branches.",
      date: "June 12, 2026",
      time: "09:00 AM - 04:30 PM",
      venue: "Advanced Computing Lab, KEC",
      tag: "Workshop",
      link: "https://forms.gle/mockregister"
    },
    {
      title: "GreenTech Hackathon 2026",
      desc: "A 24-hour national hackathon challenging student groups to solve sustainability problems using hardware prototypes or intelligent software.",
      date: "June 26-27, 2026",
      time: "Starting 10:00 AM",
      venue: "KEC Technology Business Incubator",
      tag: "Hackathon",
      link: "https://forms.gle/mockregister"
    },
    {
      title: "IEEE Membership Awareness Drive",
      desc: "Learn about the benefits of IEEE student membership, research databases access, grants, societies, and international networking events.",
      date: "July 03, 2026",
      time: "02:00 PM - 04:00 PM",
      venue: "Seminar Hall, CSE Dept, KEC",
      tag: "Seminar",
      link: "https://forms.gle/mockregister"
    }
  ];

  const pastEvents = [
    {
      title: "Workshop on Digital Signal Processing & IoT",
      desc: "A 3-day practical bootcamp focusing on capturing and processing real-time sensor waveforms using ESP32 and DSP filtering algorithms.",
      date: "May 18, 2026",
      venue: "DSP Lab, ECE Dept, KEC",
      tag: "SPS Chapter",
      highlights: "50+ participants built smart ECG filter prototypes."
    },
    {
      title: "WIE CodeQuest: Coding Bootcamp for Girls",
      desc: "A bootcamp dedicated to teaching web building, database structure, and frontend hosting to young female engineers.",
      date: "April 24, 2026",
      venue: "Internet Lab, KEC",
      tag: "WIE Group",
      highlights: "Participated by 80 girls, 5 projects were selected for incubation support."
    },
    {
      title: "National Conference on Computing & Communication (NCCC 2026)",
      desc: "Flagship paper presentation event featuring research papers from student groups across the region, judged by Anna University faculty.",
      date: "March 15, 2026",
      venue: "Maharaja Auditorium, KEC",
      tag: "Conference",
      highlights: "30+ research papers published in local IEEE digital archives."
    },
    {
      title: "Guest Lecture: Opportunities in Edge AI & TinyML",
      desc: "A seminar on running micro neural-network models directly on resource-constrained microcontrollers.",
      date: "February 12, 2026",
      venue: "Mechanical Dept Seminar Hall, KEC",
      tag: "Guest Lecture",
      highlights: "Delivered by senior R&D engineer from Intel India."
    }
  ];

  const currentEvents = isUpcoming ? upcomingEvents : pastEvents;

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '80px', minHeight: '60vh' }}>
      <PageHeader
        title={isUpcoming ? "Upcoming Events" : "Past Events"}
        subtitle={isUpcoming ? "Register and participate in our upcoming programs" : "Review our past workshops, guest lectures, and hackathons"}
      />

      <div className="container">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center' }}>
          <Link to="/events/upcoming" className={`btn ${isUpcoming ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '30px' }}>
            Upcoming
          </Link>
          <Link to="/events/past" className={`btn ${!isUpcoming ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '30px' }}>
            Past Events
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {currentEvents.map((evt, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--primary)',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {evt.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--primary)', lineHeight: '1.4' }}>{evt.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>{evt.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <Calendar size={14} style={{ color: 'var(--secondary)' }} />
                    <span>{evt.date}</span>
                  </div>
                  {evt.time && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <Clock size={14} style={{ color: 'var(--secondary)' }} />
                      <span>{evt.time}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <MapPin size={14} style={{ color: 'var(--secondary)' }} />
                    <span>{evt.venue}</span>
                  </div>
                </div>
              </div>

              <div>
                {isUpcoming ? (
                  <a
                    href={evt.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '6px', display: 'flex', gap: '6px' }}
                  >
                    Register Now <ExternalLink size={14} />
                  </a>
                ) : (
                  <div style={{
                    backgroundColor: 'rgba(2, 97, 154, 0.05)',
                    borderLeft: '3px solid var(--secondary)',
                    padding: '12px',
                    borderRadius: '0 4px 4px 0',
                    fontSize: '13px',
                    color: 'var(--primary)',
                    fontWeight: '550'
                  }}>
                    <strong>Highlight:</strong> {evt.highlights}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
