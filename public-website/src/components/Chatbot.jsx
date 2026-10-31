import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, RotateCcw, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const initialBotMessage = {
    id: 1,
    sender: 'bot',
    text: "Hello! 👋 I am your **KEC IEEE SB Assistant**.\n\nI can help you with membership registration, exploring our 6 societies, executive committee details, upcoming events, or research opportunities. What would you like to know?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState([initialBotMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { text: '🚀 How to Join?', query: 'how to join' },
    { text: '🏛️ 6 Societies', query: 'societies' },
    { text: '👥 Execomm Team', query: 'execomm' },
    { text: '📅 Upcoming Events', query: 'events' },
    { text: '🔬 KEC SRC Research', query: 'research' },
    { text: '💳 Membership Fee & UPI', query: 'membership fee' },
    { text: '📞 Contact Details', query: 'contact' }
  ];

  const clearChat = () => {
    setMessages([initialBotMessage]);
  };

  const getKnowledgeResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. How to join / Membership
    if (q.includes('join') || q.includes('register') || q.includes('membership') || q.includes('admission') || q.includes('enroll') || q.includes('fee') || q.includes('payment') || q.includes('upi')) {
      return `### 🌟 Joining KEC IEEE SB (Branch Code: 30041)

Joining IEEE opens doors to global innovation and leadership!

**Quick Steps to Register:**
1. Navigate to our online form: **/request/membership**
2. Fill in your personal information, department, and roll number.
3. Complete the registration fee via the provided **UPI QR Code / ID**.
4. Upload your payment screenshot for immediate verification.

**Exclusive Member Benefits:**
• Free/discounted access to **IEEE Xplore Digital Library** (4.5M+ papers)
• Subsidized entry to regional conferences and hands-on bootcamps
• Leadership positions in Student Chapters & Operational Committees
• Direct project seed funding through KEC SRC`;
    }

    // 2. Societies
    if (q.includes('societ') || q.includes('chapter') || q.includes('aps') || q.includes('antennas') || q.includes('computer society') || q.includes('wie') || q.includes('ras') || q.includes('robotics') || q.includes('pes') || q.includes('power') || q.includes('comsoc') || q.includes('communication')) {
      return `### 🏛️ KEC IEEE SB Technical Societies

We host 6 active specialized societies:

1. **IEEE Computer Society (CS)**: AI/ML, full-stack dev, hackathons, and algorithm contests.
2. **IEEE Antennas & Propagation Society (APS)**: RF design, microstrip antennas, HFSS simulation. *(Faculty Advisor: Dr. T. Meeradevi)*
3. **IEEE Women in Engineering (WIE)**: Technical empowerment, hackathons, and diversity drives.
4. **IEEE Robotics & Automation Society (RAS)**: Autonomous robotics, ROS, IoT, and embedded controllers.
5. **IEEE Power & Energy Society (PES)**: Smart grid architecture, solar tracking, and sustainable electric power.
6. **IEEE Communications Society (ComSoc)**: 5G/6G wireless networks, satellite links, and optical comms.

💡 *Visit the **Societies** tab in the navigation bar to read full society charters and projects!*`;
    }

    // 3. Execomm / Leadership / Office Bearers
    if (q.includes('execomm') || q.includes('member') || q.includes('chairman') || q.includes('secretary') || q.includes('faculty') || q.includes('counselor') || q.includes('head') || q.includes('lead') || q.includes('office bearer')) {
      return `### 👥 Executive Committee (Execomm) Structure

Our executive committee is structured in a clear hierarchical order:

• **Faculty Advisory Board**: Branch Counselor and Chapter Faculty Advisors from core departments.
• **Student Branch Chair & Vice-Chair**: Spearheading annual strategy and section-level representation.
• **Core Secretariat**: Secretary, Joint Secretaries, and Treasurer managing operations and accounts.
• **Society Chairpersons**: Leading APS, CS, WIE, RAS, PES, and ComSoc.
• **Operational Committee Heads**: Web Team, Event Management, PR/Media, and Design.

👉 *Check out the **Execomm** page on our website for individual photos, credentials, and LinkedIn links!*`;
    }

    // 4. Events / Hackathons / Workshops
    if (q.includes('event') || q.includes('workshop') || q.includes('hackathon') || q.includes('past') || q.includes('upcoming') || q.includes('symposium') || q.includes('bootcamp')) {
      return `### 📅 Events & Technical Workshops

KEC IEEE SB conducts 70+ technical activities each academic year:

• **Upcoming Events**: Hands-on bootcamps on Generative AI, Antenna fabrication workshops, and IoT prototyping drives.
• **Flagship Events**: TechSummit, GreenTech Hackathon, IEEEXtreme 24hr programming challenge.
• **Past Events Gallery**: All event recaps, certificates, and slide decks are permanently documented.

🔗 *Visit our **Events** page to register for upcoming sessions or view past event highlights!*`;
    }

    // 5. Research Cell (KEC SRC) / Papers
    if (q.includes('src') || q.includes('research') || q.includes('paper') || q.includes('project') || q.includes('publish') || q.includes('patent') || q.includes('fund')) {
      return `### 🔬 KEC Students Research Cell (SRC)

The **Students Research Cell** is a dedicated innovation wing supporting student makers:

• **Seed Grants**: Up to ₹10,000 for hardware prototypes and experimental testbeds.
• **Faculty Mentorship**: Guidance from senior professors for publishing in Scopus / IEEE indexed conferences.
• **Lab Infrastructure**: 24/7 access to high-performance computing (HPC) and simulation toolkits.
• **Past Success**: Our student teams have received IEEE SPS Travel Grants to present research in South Korea!`;
    }

    // 6. Branch Code & College Details
    if (q.includes('branch code') || q.includes('code') || q.includes('college') || q.includes('kongu') || q.includes('kec') || q.includes('section') || q.includes('madras')) {
      return `### 🏫 KEC IEEE SB & College Information

• **Student Branch Code**: **30041**
• **Section**: IEEE Madras Section (Region 10 - Asia Pacific)
• **Chartered**: Since 2015 with over a decade of technical excellence
• **Institution**: Kongu Engineering College (Autonomous), NAAC A++ Accredited
• **Location**: Perundurai, Erode - 638060, Tamil Nadu, India.`;
    }

    // 7. Contact Details
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('address') || q.includes('location') || q.includes('reach') || q.includes('help') || q.includes('insta')) {
      return `### 📞 Contact & Social Connect

Feel free to get in touch with our team:

• **Email**: [ieee@kongu.edu](mailto:ieee@kongu.edu)
• **Phone**: +91 4294 226555
• **Instagram**: [@ieee_kec_sb](https://www.instagram.com/ieee_kec_sb/)
• **LinkedIn**: [KEC IEEE Student Branch](https://www.linkedin.com/company/ieee-kec-sb/)
• **Campus Address**: IEEE Student Branch Office, Kongu Engineering College Campus, Perundurai, Erode - 638060.`;
    }

    // 8. Greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('vanakkam') || q.includes('good morning') || q.includes('good evening')) {
      return `Hello! 😊 Welcome to KEC IEEE Student Branch.

How can I assist you today? You can ask about **joining membership**, **our 6 societies**, **executive committee**, **upcoming events**, or **research cell**.`;
    }

    // Fallback default response
    return `### 🤖 I'm here to help!

I couldn't find a direct match for your question. Here are common topics I know all about:

1. **Membership Registration**: Type *"how to join"* or *"membership fee"*
2. **Technical Societies**: Type *"societies"* (APS, CS, WIE, RAS, PES, ComSoc)
3. **Executive Committee**: Type *"execomm"* or *"office bearers"*
4. **Events & Workshops**: Type *"upcoming events"* or *"hackathons"*
5. **Research Cell**: Type *"KEC SRC"* or *"research funding"*
6. **Contact Info**: Type *"contact"* or *"email"*

Feel free to click any of the suggestion chips below!`;
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getKnowledgeResponse(text);
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div style={{ zIndex: 9999, position: 'relative' }}>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#0284c7',
          backgroundImage: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          border: '2px solid rgba(255, 255, 255, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className={`chatbot-trigger ${isOpen ? 'active' : ''}`}
        title="Chat with KEC IEEE Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} className="bubble-icon" />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '96px',
          right: '28px',
          width: '380px',
          height: '540px',
          maxHeight: 'calc(100vh - 120px)',
          maxWidth: 'calc(100vw - 40px)',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.25)',
          border: '1px solid rgba(2, 132, 199, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chat-slide-up 0.25s cubic-bezier(0.165, 0.84, 0.44, 1) forwards'
        }} className="chatbot-window">

          {/* Header Panel */}
          <div style={{
            padding: '14px 18px',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Bot size={20} style={{ color: '#38bdf8' }} />
                <span style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  border: '1.5px solid #0f172a',
                  boxShadow: '0 0 6px #22c55e'
                }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', lineHeight: '1.2' }}>KEC IEEE Assistant</h4>
                <span style={{ fontSize: '10.5px', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={10} style={{ color: '#38bdf8' }} /> Online & Ready to Help
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={clearChat}
                title="Reset conversation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                className="chat-header-btn"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                className="chat-header-btn"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Listing Box */}
          <div style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: '#f8fafc'
          }} className="chat-messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={14} />
                  </div>
                )}
                <div style={{ maxWidth: '85%' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: msg.sender === 'user' ? '#0284c7' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    fontSize: '13px',
                    lineHeight: '1.55',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{
                    fontSize: '9.5px',
                    color: '#94a3b8',
                    marginTop: '3px',
                    display: 'block',
                    textAlign: msg.sender === 'user' ? 'right' : 'left'
                  }}>
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#e0f2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284c7',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Animation Bubble */}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Bot size={14} />
                </div>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: '16px 16px 16px 2px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span className="typing-dot" style={{ animationDelay: '0s' }}></span>
                  <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            overflowX: 'auto',
            maxHeight: '75px'
          }} className="chat-chips-container">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(reply.query)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#0284c7',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                className="chat-chip-hover"
              >
                {reply.text}
              </button>
            ))}
          </div>

          {/* Message Input Panel */}
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <input
              type="text"
              placeholder="Ask anything about KEC IEEE SB..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputValue);
              }}
              style={{
                flexGrow: 1,
                padding: '10px 16px',
                fontSize: '13px',
                border: '1px solid #cbd5e1',
                borderRadius: '24px',
                outline: 'none',
                backgroundColor: '#f8fafc',
                transition: 'border 0.2s ease'
              }}
              className="chat-input-focus"
            />
            <button
              onClick={() => handleSend(inputValue)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              className="chat-send-btn-hover"
            >
              <Send size={15} style={{ marginLeft: '2px' }} />
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Animations & Styles */}
      <style>{`
        @keyframes chat-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .chatbot-trigger:hover {
          transform: scale(1.08);
          box-shadow: 0 10px 30px rgba(2, 132, 199, 0.6) !important;
        }
        .chatbot-trigger.active {
          transform: rotate(90deg);
        }
        .chatbot-trigger:hover .bubble-icon {
          animation: bubble-bounce 0.8s ease infinite;
        }
        @keyframes bubble-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .chat-header-btn:hover {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .chat-chip-hover:hover {
          background-color: #0284c7 !important;
          color: #ffffff !important;
          border-color: #0284c7 !important;
        }
        .chat-input-focus:focus {
          border-color: #0284c7 !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }
        .chat-send-btn-hover:hover {
          background-color: #0369a1 !important;
          transform: scale(1.05);
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #94a3b8;
          display: inline-block;
          animation: typing-bouncing 1.4s infinite ease-in-out;
        }
        @keyframes typing-bouncing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .chat-messages-container::-webkit-scrollbar {
          width: 5px;
        }
        .chat-messages-container::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .chat-messages-container::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
        .chat-chips-container::-webkit-scrollbar {
          height: 0px;
        }

        @media (max-width: 768px) {
          .chatbot-window {
            width: calc(100vw - 32px) !important;
            height: 65vh !important;
            bottom: 84px !important;
            right: 16px !important;
            left: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
