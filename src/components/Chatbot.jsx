import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! 👋 I am your KEC IEEE Student Branch Assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { text: 'How to join IEEE?', keyword: 'join' },
    { text: 'Membership Benefits', keyword: 'benefits' },
    { text: 'Upcoming Events', keyword: 'events' },
    { text: 'Research Cell (SRC)', keyword: 'src' },
    { text: 'Contact Info', keyword: 'contact' }
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate typing and response
    setIsTyping(true);
    setTimeout(() => {
      let botResponseText = '';
      const cleanText = text.toLowerCase();

      if (cleanText.includes('join') || cleanText.includes('register') || cleanText.includes('membership')) {
        botResponseText = 'To join the KEC IEEE Student Branch, register on the official IEEE Portal: https://www.ieee.org/membership/join/index.html. For details on student discounts and local chapter registration, please contact our Branch Counselor on the Contact page!';
      } else if (cleanText.includes('benefit') || cleanText.includes('advantage') || cleanText.includes('value')) {
        botResponseText = 'IEEE members enjoy: 1️⃣ Access to IEEE Xplore digital library, 2️⃣ Huge discounts on international conferences & events, 3️⃣ Networking with global industry leaders, 4️⃣ Hands-on technical workshops, and 5️⃣ Immediate leadership growth in committees.';
      } else if (cleanText.includes('event') || cleanText.includes('upcoming') || cleanText.includes('hackathon') || cleanText.includes('workshop')) {
        botResponseText = 'We host annual technical events like TechSummit, Women in Data Science symposia, and Signal Processing bootcamps. Visit our dynamic Events page to register for upcoming guest lectures and hackathons!';
      } else if (cleanText.includes('src') || cleanText.includes('research') || cleanText.includes('cell')) {
        botResponseText = 'The KEC Students Research Cell (KEC SRC) supports student innovations by offering hardware/software mentoring, research guidance, and seed funding to turn ideas into peer-reviewed conference publications.';
      } else if (cleanText.includes('contact') || cleanText.includes('email') || cleanText.includes('phone') || cleanText.includes('address') || cleanText.includes('location')) {
        botResponseText = '📧 Email: ieee@kongu.edu\n📞 Phone: +91 4294 226555\n📍 Location: IEEE Student Branch, Kongu Engineering College Campus, Perundurai, Erode - 638060, Tamil Nadu, India.';
      } else if (cleanText.includes('hello') || cleanText.includes('hi') || cleanText.includes('hey') || cleanText.includes('greetings')) {
        botResponseText = 'Hello there! 😊 How can I help you explore IEEE activities or membership at KEC today?';
      } else {
        botResponseText = "Thank you for reaching out! I'm trained to help with questions about KEC IEEE SB membership, events, research cells, and contact details. Try asking about 'joining', 'benefits', or use one of the quick suggestion chips below.";
      }

      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
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
          bottom: '30px',
          right: '30px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#02619a',
          backgroundImage: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
          color: '#ffffff',
          border: '2px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(10, 56, 91, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className={`chatbot-trigger ${isOpen ? 'active' : ''}`}
        title="Chat with KEC IEEE Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="bubble-icon" />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '360px',
          height: '500px',
          maxHeight: 'calc(100vh - 150px)',
          maxWidth: 'calc(100vw - 60px)',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 12px 32px rgba(10, 56, 91, 0.2)',
          border: '1px solid #d0e4f2',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chat-slide-up 0.30s cubic-bezier(0.165, 0.84, 0.44, 1) forwards'
        }} className="chatbot-window">
          {/* Header Panel */}
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#0a385b',
            backgroundImage: 'linear-gradient(90deg, #0a385b 0%, #02619a 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #0f4875'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Bot size={20} style={{ color: '#c9ebff' }} />
                <span style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#2ecc71',
                  border: '2px solid #0a385b'
                }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', lineHeight: '1.2' }}>IEEE KEC Assistant</h4>
                <span style={{ fontSize: '10px', color: '#c9ebff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={8} /> Online & Ready
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              className="chat-header-close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Listing Box */}
          <div style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
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
                    backgroundColor: '#02619a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    <Bot size={14} />
                  </div>
                )}
                <div style={{ maxWidth: '80%' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    backgroundColor: msg.sender === 'user' ? '#02619a' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#0a1c2a',
                    fontSize: '13.5px',
                    lineHeight: '1.5',
                    boxShadow: '0 2px 6px rgba(10, 56, 91, 0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #eef6fc',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    color: '#8ca6b9',
                    marginTop: '4px',
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
                    backgroundColor: '#c9ebff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#02619a',
                    flexShrink: 0
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
                  backgroundColor: '#02619a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Bot size={14} />
                </div>
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '14px 14px 14px 2px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #eef6fc',
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
            padding: '10px 16px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #eef6fc',
            overflowX: 'auto',
            maxHeight: '80px'
          }} className="chat-chips-container">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(reply.text)}
                style={{
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#02619a',
                  backgroundColor: '#f5faff',
                  border: '1px solid #c9ebff',
                  borderRadius: '20px',
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
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #eef6fc',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <input
              type="text"
              placeholder="Ask me something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputValue);
              }}
              style={{
                flexGrow: 1,
                padding: '10px 16px',
                fontSize: '13px',
                border: '1px solid #d0e4f2',
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
                backgroundColor: '#02619a',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="chat-send-btn-hover"
            >
              <Send size={15} style={{ marginLeft: '2px' }} />
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Animations & Pseudo Classes */}
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
          background-image: linear-gradient(135deg, #02619a 0%, #0a385b 100%) !important;
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
        .chat-header-close:hover {
          color: #ffffff !important;
          transform: scale(1.1);
        }
        .chat-chip-hover:hover {
          background-color: #02619a !important;
          color: #ffffff !important;
          border-color: #02619a !important;
        }
        .chat-input-focus:focus {
          border-color: #02619a !important;
          background-color: #ffffff !important;
        }
        .chat-send-btn-hover:hover {
          background-color: #0a385b !important;
          transform: scale(1.05);
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #8ca6b9;
          display: inline-block;
          animation: typing-bouncing 1.4s infinite ease-in-out;
        }
        @keyframes typing-bouncing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .chat-messages-container::-webkit-scrollbar {
          width: 6px;
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

        /* Responsive Chatbot */
        @media (max-width: 768px) {
          .chatbot-window {
            width: calc(100vw - 80px) !important;
            height: 60vh !important;
            bottom: 90px !important;
            right: 16px !important;
            left: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .chatbot-trigger {
            width: 48px !important;
            height: 48px !important;
            bottom: 20px !important;
            right: 12px !important;
          }
          .chatbot-window {
            width: calc(100vw - 32px) !important;
            height: 70vh !important;
            bottom: 80px !important;
            right: 8px !important;
            left: 8px !important;
            borderRadius: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
