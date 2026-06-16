import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Sparkles, CheckCircle, Upload, Send, FileText } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => (
  <div style={{
    background: 'var(--gradient-primary)',
    color: '#ffffff',
    padding: '70px 0',
    textAlign: 'center',
    marginBottom: '48px',
    position: 'relative',
    overflow: 'hidden'
  }}>
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
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', left: '-5%',
      width: '260px', height: '260px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', pointerEvents: 'none'
    }} />
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <h1 className="font-serif" style={{ fontSize: '38px', color: '#ffffff', marginBottom: '12px', fontWeight: '800' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '16px', color: '#d0e4f2', maxWidth: '600px', marginInline: 'auto' }}>
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const RequestFormPage = () => {
  const { slug } = useParams();
  const [formConfig, setFormConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Success State
  const [submitted, setSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState('');

  // Form Fields State - Event Pre-proposal
  const [proposalData, setProposalData] = useState({
    title: '',
    society: 'IEEE KEC SB',
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPhone: '',
    eventStartDate: '',
    eventEndDate: '',
    venue: '',
    participantCount: '',
    budget: '',
    contactPersonPhone: '',
    mailForAcknowledge: '',
    speakerDetails: '',
    description: ''
  });

  // Form Fields State - Bill Settlement
  const [billData, setBillData] = useState({
    eventName: '',
    society: 'IEEE KEC SB',
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPhone: '',
    eventDate: '',
    actualParticipants: '',
    expenses: '',
    bankDetails: '',
    voucherName: '',
    voucherUrl: '',
    remarks: ''
  });

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setSubmitted(false);
    setSubmissionRef('');
    
    const stored = localStorage.getItem('ieee_request_forms');
    if (stored) {
      try {
        const forms = JSON.parse(stored);
        const matched = forms.find(f => f.route_slug === slug && f.is_active);
        if (matched) {
          setFormConfig(matched);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error loading request form config:", e);
        setError(true);
      }
    } else {
      setError(true);
    }
    setIsLoading(false);
  }, [slug]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBillData(prev => ({
        ...prev,
        voucherUrl: reader.result,
        voucherName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleProposalSubmit = (e) => {
    e.preventDefault();
    const refNum = 'PROP-' + Math.floor(100000 + Math.random() * 900000);
    const newSubmission = {
      id: 'SUB-' + Date.now(),
      refNum,
      form_slug: 'event-pre-proposal',
      form_name: 'Event Pre-Proposal',
      submitted_at: new Date().toISOString(),
      data: proposalData
    };

    const existing = JSON.parse(localStorage.getItem('ieee_form_submissions') || '[]');
    localStorage.setItem('ieee_form_submissions', JSON.stringify([newSubmission, ...existing]));

    setSubmissionRef(refNum);
    setSubmitted(true);
  };

  const handleBillSubmit = (e) => {
    e.preventDefault();
    const refNum = 'BILL-' + Math.floor(100000 + Math.random() * 900000);
    const newSubmission = {
      id: 'SUB-' + Date.now(),
      refNum,
      form_slug: 'bill-settlement',
      form_name: 'Bill Settlement',
      submitted_at: new Date().toISOString(),
      data: billData
    };

    const existing = JSON.parse(localStorage.getItem('ieee_form_submissions') || '[]');
    localStorage.setItem('ieee_form_submissions', JSON.stringify([newSubmission, ...existing]));

    setSubmissionRef(refNum);
    setSubmitted(true);
  };

  // Clean and prepare the embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    let cleanUrl = url.trim();

    if (cleanUrl.includes('docs.google.com/forms')) {
      const viewformIndex = cleanUrl.indexOf('/viewform');
      if (viewformIndex !== -1) {
        cleanUrl = cleanUrl.substring(0, viewformIndex + 9);
      }
      if (!cleanUrl.includes('embedded=true')) {
        cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + 'embedded=true';
      }
    }
    return cleanUrl;
  };

  if (error || !formConfig) {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <PageHeader title="Form Not Available" subtitle="The requested request form could not be found or is currently inactive." />
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '40px 20px' }}>
          <div className="card" style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            padding: '40px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>Unavailable Request Form</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
                This form has either been removed or temporarily deactivated by the ExeComm administrators. Please check the URL or contact us if you think this is a mistake.
              </p>
            </div>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                fontSize: '13.5px',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: 'var(--secondary)',
                border: 'none',
                borderRadius: '30px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-glow)'
              }}
              className="back-btn-hover"
            >
              <ArrowLeft size={16} /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(formConfig.google_form_url);
  const isOnscreenForm = slug === 'event-pre-proposal' || slug === 'bill-settlement';

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '85vh', fontFamily: 'var(--font-sans)' }}>
      <PageHeader 
        title={formConfig.form_name} 
        subtitle={submitted ? "Submission Received Successfully" : formConfig.description} 
      />
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        
        {submitted ? (
          /* Submission Success State */
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '650px',
            padding: '48px 32px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #dcdfe4',
            boxShadow: 'var(--shadow-premium)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              <CheckCircle size={48} />
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>Submission Completed</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', maxWidth: '500px', marginInline: 'auto' }}>
                Your request has been securely recorded in the IEEE KEC SB database. The advisory board will review the details and get back to you shortly.
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '16px 24px',
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '4px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '750', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reference Number</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--secondary)', fontFamily: 'monospace' }}>{submissionRef}</span>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '30px',
                  border: '1.5px solid var(--secondary)',
                  backgroundColor: '#ffffff',
                  color: 'var(--secondary)',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="btn-outline-hover"
              >
                Submit Another Request
              </button>
              <Link
                to="/"
                style={{
                  padding: '10px 24px',
                  borderRadius: '30px',
                  backgroundColor: 'var(--secondary)',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-glow)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                className="back-btn-hover"
              >
                <ArrowLeft size={16} /> Back to Home
              </Link>
            </div>
          </div>
        ) : isOnscreenForm ? (
          /* Custom Onscreen Forms */
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '800px',
            padding: '36px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {slug === 'event-pre-proposal' ? (
              /* Event Pre-Proposal Form */
              <form onSubmit={handleProposalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0a385b', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '8px' }}>
                  Event Information Form
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Workshop on Generative AI"
                      value={proposalData.title}
                      onChange={(e) => setProposalData({ ...proposalData, title: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Organizing Society / Chapter *</label>
                    <select
                      value={proposalData.society}
                      onChange={(e) => setProposalData({ ...proposalData, society: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="IEEE KEC SB">IEEE KEC SB</option>
                      <option value="Computer Society (CS Society)">Computer Society (CS Society)</option>
                      <option value="Women in Engineering (WIE)">Women in Engineering (WIE)</option>
                      <option value="Robotics and Automation Society (RAS)">Robotics and Automation Society (RAS)</option>
                      <option value="Power & Energy Society (PES)">Power & Energy Society (PES)</option>
                      <option value="Communications Society (ComSoc)">Communications Society (ComSoc)</option>
                      <option value="AP-S (Antennas and Propagation Society)">AP-S (Antennas and Propagation Society)</option>
                    </select>
                  </div>
                </div>

                <div className="onscreen-form-grid-2col">
                  {/* Row 1: Coordinator Name & Coordinator Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Full Name"
                      value={proposalData.coordinatorName}
                      onChange={(e) => setProposalData({ ...proposalData, coordinatorName: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@kongu.edu"
                      value={proposalData.coordinatorEmail}
                      onChange={(e) => setProposalData({ ...proposalData, coordinatorEmail: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  {/* Row 2: Coordinator Phone & Mail for Acknowledge */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={proposalData.coordinatorPhone}
                      onChange={(e) => setProposalData({ ...proposalData, coordinatorPhone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Mail for Acknowledge *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@kongu.edu"
                      value={proposalData.mailForAcknowledge}
                      onChange={(e) => setProposalData({ ...proposalData, mailForAcknowledge: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  {/* Row 3: Date of the Event Start & Date of the Event End */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Date of the Event Start *</label>
                    <input
                      type="date"
                      required
                      value={proposalData.eventStartDate}
                      onChange={(e) => setProposalData({ ...proposalData, eventStartDate: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Date of the Event End *</label>
                    <input
                      type="date"
                      required
                      value={proposalData.eventEndDate}
                      onChange={(e) => setProposalData({ ...proposalData, eventEndDate: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  {/* Row 4: Proposed Venue & Expected Participants */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Proposed Venue *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TBI Seminar Hall, KEC"
                      value={proposalData.venue}
                      onChange={(e) => setProposalData({ ...proposalData, venue: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Expected Participants</label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={proposalData.participantCount}
                      onChange={(e) => setProposalData({ ...proposalData, participantCount: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  {/* Row 5: Estimated Budget (INR) & Person to Contact for Doubts */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Estimated Budget (INR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Total cost in Rs."
                      value={proposalData.budget}
                      onChange={(e) => setProposalData({ ...proposalData, budget: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Person to Contact for Doubts *</label>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px', marginBottom: '6px' }}>Phone number</span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={proposalData.contactPersonPhone}
                      onChange={(e) => setProposalData({ ...proposalData, contactPersonPhone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Guest Speaker Details (Name, Designation, Org)</label>
                  <textarea
                    rows="3"
                    placeholder="Provide details about the speaker(s)..."
                    value={proposalData.speakerDetails}
                    onChange={(e) => setProposalData({ ...proposalData, speakerDetails: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Description & Objectives *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Briefly state the schedule, topics, syllabus, and expected outcome of the event..."
                    value={proposalData.description}
                    onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 30px',
                      backgroundColor: 'var(--secondary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-glow)'
                    }}
                    className="submit-btn-hover"
                  >
                    <Send size={16} /> Submit Pre-Proposal
                  </button>
                </div>
              </form>
            ) : (
              /* Bill Settlement Form */
              <form onSubmit={handleBillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0a385b', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '8px' }}>
                  Accounts Settlement Form
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name of the conducted event"
                      value={billData.eventName}
                      onChange={(e) => setBillData({ ...billData, eventName: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Organizing Society / Chapter *</label>
                    <select
                      value={billData.society}
                      onChange={(e) => setBillData({ ...billData, society: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="IEEE KEC SB">IEEE KEC SB</option>
                      <option value="Computer Society (CS Society)">Computer Society (CS Society)</option>
                      <option value="Women in Engineering (WIE)">Women in Engineering (WIE)</option>
                      <option value="Robotics and Automation Society (RAS)">Robotics and Automation Society (RAS)</option>
                      <option value="Power & Energy Society (PES)">Power & Energy Society (PES)</option>
                      <option value="Communications Society (ComSoc)">Communications Society (ComSoc)</option>
                      <option value="AP-S (Antennas and Propagation Society)">AP-S (Antennas and Propagation Society)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Full Name"
                      value={billData.coordinatorName}
                      onChange={(e) => setBillData({ ...billData, coordinatorName: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@kongu.edu"
                      value={billData.coordinatorEmail}
                      onChange={(e) => setBillData({ ...billData, coordinatorEmail: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={billData.coordinatorPhone}
                      onChange={(e) => setBillData({ ...billData, coordinatorPhone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Date *</label>
                    <input
                      type="date"
                      required
                      value={billData.eventDate}
                      onChange={(e) => setBillData({ ...billData, eventDate: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Total Attendance *</label>
                    <input
                      type="number"
                      required
                      placeholder="Number of participants"
                      value={billData.actualParticipants}
                      onChange={(e) => setBillData({ ...billData, actualParticipants: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Total Expenses (INR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Sum of bills spent"
                      value={billData.expenses}
                      onChange={(e) => setBillData({ ...billData, expenses: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Reimbursement Bank Details *</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Specify: Account Holder Name, Bank Name, Account Number, and IFSC Code"
                      value={billData.bankDetails}
                      onChange={(e) => setBillData({ ...billData, bankDetails: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14.5px', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Upload Voucher / Expense Scans *</label>
                    <div style={{
                      border: '2px dashed var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                      height: 'calc(100% - 24px)'
                    }}>
                      <input
                        type="file"
                        required={!billData.voucherUrl}
                        accept=".pdf, image/*"
                        onChange={handleFileUpload}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <Upload size={32} style={{ color: 'var(--secondary)', opacity: 0.8 }} />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>Click to upload files</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PDF or Image files, up to 10MB</span>
                      {billData.voucherName && (
                        <div style={{
                          marginTop: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                          maxWidth: '90%'
                        }}>
                          <FileText size={12} />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{billData.voucherName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Settlement Remarks / Feedback Summary</label>
                  <textarea
                    rows="3"
                    placeholder="Any comments, descriptions of expense differences, or event success points..."
                    value={billData.remarks}
                    onChange={(e) => setBillData({ ...billData, remarks: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 30px',
                      backgroundColor: 'var(--secondary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-glow)'
                    }}
                    className="submit-btn-hover"
                  >
                    <Send size={16} /> Submit Bill Settlement
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Fallback: Old Google Form Iframe */
          <div className="card" style={{ 
            width: '100%', 
            maxWidth: '860px', 
            padding: '0', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            position: 'relative',
            minHeight: '600px'
          }}>
            {isLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
                gap: '16px'
              }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>Loading Google Form securely...</p>
              </div>
            )}

            {embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="800"
                style={{ border: 'none', display: 'block', backgroundColor: '#ffffff' }}
                title={formConfig.form_name}
                onLoad={() => setIsLoading(false)}
              >
                Loading form...
              </iframe>
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <AlertCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '15px', fontWeight: '600' }}>Form URL has not been configured</p>
                <p style={{ fontSize: '13px', marginTop: '6px' }}>Please update the URL in the admin dashboard</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style>{`
        .onscreen-form-grid-2col {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 640px) {
          .onscreen-form-grid-2col {
            grid-template-columns: 1fr;
          }
        }
        .back-btn-hover:hover {
          background-color: #02619a !important;
          transform: translateY(-2px);
        }
        .submit-btn-hover {
          transition: all 0.2s ease;
        }
        .submit-btn-hover:hover {
          background-color: #02619a !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow-cyan) !important;
        }
        .btn-outline-hover {
          transition: all 0.2s ease;
        }
        .btn-outline-hover:hover {
          background-color: rgba(79, 70, 229, 0.05) !important;
          transform: translateY(-2px);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default RequestFormPage;
