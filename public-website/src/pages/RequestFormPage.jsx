import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Sparkles, CheckCircle, Upload, Send, FileText, Lock } from 'lucide-react';
import API from '../services/api';


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
      background: 'radial-gradient(circle, rgba(var(--secondary-rgb), 0.15) 0%, transparent 70%)', pointerEvents: 'none'
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
    {/* Decorative Wave Bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'translateY(1px)', zIndex: 2 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,101.4,227.14,83.56,258.14,76.22,290.41,68.22,321.39,56.44Z" fill="var(--bg-light)"></path>
      </svg>
    </div>
  </div>
);

const RequestFormPage = () => {
  const { slug } = useParams();
  const [formConfig, setFormConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lock State
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Success State
  const [submitted, setSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState('');

  // Form Fields State - Event Pre-proposal
  const [proposalData, setProposalData] = useState({
    title: '',
    society: '',
    eventType: '',
    eventCategory: '',
    eventMode: '',
    eventScope: '',
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
    organizer: '',
    eventType: '',
    eventCategory: '',
    eventMode: '',
    eventScope: '',
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPhone: '',
    eventStartDate: '',
    eventEndDate: '',
    venue: '',
    actualParticipants: '',
    totalExpenses: '',
    bankDetails: '',
    voucherName: '',
    voucherUrl: '',
    mailForAcknowledge: '',
    contactPersonPhone: '',
    remarks: ''
  });

  // Validation errors
  const [proposalErrors, setProposalErrors] = useState({});
  const [billErrors, setBillErrors] = useState({});

  // Form Fields State - Membership
  const [membershipData, setMembershipData] = useState({
    name: '',
    rollNumber: '',
    year: '',
    department: '',
    customDepartment: '',
    collegeEmail: '',
    personalEmail: '',
    contactNumber: '',
    transactionId: '',
    paymentScreenshotName: '',
    paymentScreenshotUrl: '',
    paymentStatus: '',
    membershipType: ''
  });
  const [membershipErrors, setMembershipErrors] = useState({});

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
          
          // Check if confidential and locked
          const isPinEnabled = localStorage.getItem('ieee_pin_enabled') !== 'false';
          const isUnlocked = sessionStorage.getItem(`ieee_unlocked_form_${slug}`) === 'true';
          if (isPinEnabled && matched.is_confidential && !isUnlocked) {
            setIsLocked(true);
          } else {
            setIsLocked(false);
          }
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

  const handlePinSubmit = () => {
    const correctPin = localStorage.getItem('ieee_access_pin') || '1234';
    if (pinInput === correctPin) {
      sessionStorage.setItem(`ieee_unlocked_form_${slug}`, 'true');
      setIsLocked(false);
    } else {
      setPinError('Incorrect PIN');
    }
  };

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

  const handlePaymentScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMembershipData(prev => ({
        ...prev,
        paymentScreenshotUrl: reader.result,
        paymentScreenshotName: file.name
      }));
      if (membershipErrors.paymentScreenshotUrl) setMembershipErrors(p => ({ ...p, paymentScreenshotUrl: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validateMembership = () => {
    const errs = {};
    const phoneRe = /^[+]?[0-9]{10,13}$/;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!membershipData.name.trim()) errs.name = 'Name is required.';
    if (!membershipData.rollNumber.trim()) errs.rollNumber = 'Roll number is required.';
    if (!membershipData.year) errs.year = 'Please select your year.';
    if (!membershipData.department) errs.department = 'Please select your department.';
    else if (membershipData.department === 'Other' && !membershipData.customDepartment.trim()) errs.customDepartment = 'Please specify your department.';
    if (!membershipData.collegeEmail.trim()) errs.collegeEmail = 'College mail ID is required.';
    else if (!emailRe.test(membershipData.collegeEmail)) errs.collegeEmail = 'Enter a valid email address.';
    if (!membershipData.personalEmail.trim()) errs.personalEmail = 'Personal mail ID is required.';
    else if (!emailRe.test(membershipData.personalEmail)) errs.personalEmail = 'Enter a valid email address.';
    if (!membershipData.contactNumber.trim()) errs.contactNumber = 'Contact number is required.';
    else if (!phoneRe.test(membershipData.contactNumber.replace(/\s/g, ''))) errs.contactNumber = 'Enter a valid 10-digit contact number.';
    if (!membershipData.transactionId.trim()) errs.transactionId = 'Transaction ID is required.';
    if (!membershipData.paymentScreenshotUrl) errs.paymentScreenshotUrl = 'Please upload a screenshot of payment.';
    if (!membershipData.paymentStatus) errs.paymentStatus = 'Please select payment status.';
    if (!membershipData.membershipType) errs.membershipType = 'Please select your IEEE membership type.';
    return errs;
  };

  const handleMembershipSubmit = async (e) => {
    e.preventDefault();
    const errs = validateMembership();
    if (Object.keys(errs).length > 0) { setMembershipErrors(errs); return; }
    setMembershipErrors({});
    
    try {
      const payload = {
        name: membershipData.name,
        email: membershipData.personalEmail || membershipData.collegeEmail,
        phone: membershipData.contactNumber,
        college: "Kongu Engineering College",
        department: membershipData.department === 'Other' ? membershipData.customDepartment : membershipData.department,
        year: membershipData.year,
        membershipType: membershipData.membershipType
      };

      const response = await fetch(`${API}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const refNum = 'MEM-' + Math.floor(100000 + Math.random() * 900000);
        // Keep the local storage save so the success screen still works perfectly
        const newSubmission = {
          id: 'SUB-' + Date.now(),
          refNum,
          form_slug: 'membership',
          form_name: 'Membership',
          submitted_at: new Date().toISOString(),
          data: membershipData
        };
        const existing = JSON.parse(localStorage.getItem('ieee_form_submissions') || '[]');
        localStorage.setItem('ieee_form_submissions', JSON.stringify([newSubmission, ...existing]));
        setSubmissionRef(refNum);
        setSubmitted(true);
      } else {
        alert("Failed to submit membership request. Please try again.");
      }
    } catch (error) {
      console.error("Membership submission error:", error);
      alert("Error connecting to the backend server. Make sure it is running.");
    }
  };

  const validateProposal = () => {
    const errs = {};
    const phoneRe = /^[+]?[0-9]{10,13}$/;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!proposalData.title.trim()) errs.title = 'Event name is required.';
    if (!proposalData.coordinatorName.trim()) errs.coordinatorName = 'Coordinator name is required.';
    if (!proposalData.coordinatorEmail.trim()) errs.coordinatorEmail = 'Coordinator email is required.';
    else if (!emailRe.test(proposalData.coordinatorEmail)) errs.coordinatorEmail = 'Enter a valid email address.';
    if (!proposalData.coordinatorPhone.trim()) errs.coordinatorPhone = 'Coordinator phone is required.';
    else if (!phoneRe.test(proposalData.coordinatorPhone.replace(/\s/g,''))) errs.coordinatorPhone = 'Enter a valid 10-digit phone number.';
    if (!proposalData.eventStartDate) errs.eventStartDate = 'Start date is required.';
    if (!proposalData.eventEndDate) errs.eventEndDate = 'End date is required.';
    if (proposalData.eventStartDate && proposalData.eventEndDate && proposalData.eventEndDate < proposalData.eventStartDate)
      errs.eventEndDate = 'End date must be after start date.';
    if (!proposalData.venue.trim()) errs.venue = 'Venue is required.';
    if (!proposalData.budget) errs.budget = 'Estimated budget is required.';
    else if (isNaN(proposalData.budget) || Number(proposalData.budget) <= 0) errs.budget = 'Enter a valid budget amount.';
    if (!proposalData.mailForAcknowledge.trim()) errs.mailForAcknowledge = 'Acknowledgement email is required.';
    else if (!emailRe.test(proposalData.mailForAcknowledge)) errs.mailForAcknowledge = 'Enter a valid email address.';
    if (!proposalData.contactPersonPhone.trim()) errs.contactPersonPhone = 'Contact person phone is required.';
    else if (!phoneRe.test(proposalData.contactPersonPhone.replace(/\s/g,''))) errs.contactPersonPhone = 'Enter a valid 10-digit phone number.';
    if (!proposalData.description.trim()) errs.description = 'Event description is required.';
    return errs;
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    const errs = validateProposal();
    if (Object.keys(errs).length > 0) { setProposalErrors(errs); return; }
    setProposalErrors({});
    
    const refNum = 'PROP-' + Math.floor(100000 + Math.random() * 900000);
    const payload = {
      referenceNumber: refNum,
      form_slug: 'event-pre-proposal',
      form_name: 'Event Pre-Proposal',
      data: proposalData
    };

    try {
      const response = await fetch(`${API}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmissionRef(refNum);
        setSubmitted(true);
      } else {
        alert("Failed to submit event pre-proposal. Please try again.");
      }
    } catch (error) {
      console.error("Proposal submission error:", error);
      alert("Error connecting to the backend server.");
    }
  };

  const validateBill = () => {
    const errs = {};
    const phoneRe = /^[+]?[0-9]{10,13}$/;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!billData.eventName.trim()) errs.eventName = 'Event name is required.';
    if (!billData.coordinatorName.trim()) errs.coordinatorName = 'Coordinator name is required.';
    if (!billData.coordinatorEmail.trim()) errs.coordinatorEmail = 'Coordinator email is required.';
    else if (!emailRe.test(billData.coordinatorEmail)) errs.coordinatorEmail = 'Enter a valid email address.';
    if (!billData.coordinatorPhone.trim()) errs.coordinatorPhone = 'Coordinator phone is required.';
    else if (!phoneRe.test(billData.coordinatorPhone.replace(/\s/g,''))) errs.coordinatorPhone = 'Enter a valid 10-digit phone number.';
    if (!billData.eventStartDate) errs.eventStartDate = 'Start date is required.';
    if (!billData.eventEndDate) errs.eventEndDate = 'End date is required.';
    if (billData.eventStartDate && billData.eventEndDate && billData.eventEndDate < billData.eventStartDate)
      errs.eventEndDate = 'End date must be after start date.';
    if (!billData.venue.trim()) errs.venue = 'Venue is required.';
    if (!billData.actualParticipants) errs.actualParticipants = 'Participant count is required.';
    else if (isNaN(billData.actualParticipants) || Number(billData.actualParticipants) <= 0) errs.actualParticipants = 'Enter a valid number.';
    if (!billData.totalExpenses) errs.totalExpenses = 'Total expenses is required.';
    else if (isNaN(billData.totalExpenses) || Number(billData.totalExpenses) <= 0) errs.totalExpenses = 'Enter a valid amount.';
    if (!billData.bankDetails.trim()) errs.bankDetails = 'Bank details are required.';
    if (!billData.voucherUrl) errs.voucherUrl = 'Please upload a voucher / expense scan.';
    if (!billData.mailForAcknowledge.trim()) errs.mailForAcknowledge = 'Acknowledgement email is required.';
    else if (!emailRe.test(billData.mailForAcknowledge)) errs.mailForAcknowledge = 'Enter a valid email address.';
    if (!billData.contactPersonPhone.trim()) errs.contactPersonPhone = 'Contact person phone is required.';
    else if (!phoneRe.test(billData.contactPersonPhone.replace(/\s/g,''))) errs.contactPersonPhone = 'Enter a valid 10-digit phone number.';
    return errs;
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    const errs = validateBill();
    if (Object.keys(errs).length > 0) { setBillErrors(errs); return; }
    setBillErrors({});
    
    const refNum = 'BILL-' + Math.floor(100000 + Math.random() * 900000);
    const payload = {
      referenceNumber: refNum,
      form_slug: 'bill-settlement',
      form_name: 'Bill Settlement',
      data: billData
    };

    try {
      const response = await fetch(`${API}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmissionRef(refNum);
        setSubmitted(true);
      } else {
        alert("Failed to submit bill settlement. Please try again.");
      }
    } catch (error) {
      console.error("Bill submission error:", error);
      alert("Error connecting to the backend server.");
    }
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

  if (isLocked) {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-light)', paddingBottom: '90px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <PageHeader title={formConfig.form_name} subtitle="Confidential request form" />
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '40px 20px' }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center',
            padding: '40px 32px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-premium)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={36} />
            </div>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Confidential Form</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
                Please enter the shared Access PIN to view and submit this confidential request form.
              </p>
            </div>
            
            <div style={{ width: '100%' }}>
              <input
                type="password"
                placeholder="Enter Access PIN"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1.5px solid ${pinError ? '#ef4444' : 'var(--border-subtle)'}`,
                  fontSize: '16px',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  backgroundColor: '#f8fafc',
                  color: 'var(--text-dark)',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
              {pinError && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '600' }}>{pinError}</div>}
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <Link
                to="/request/forms"
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                className="btn-outline-hover"
              >
                Go Back
              </Link>
              <button
                onClick={handlePinSubmit}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'var(--secondary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)'
                }}
              >
                Unlock Form
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(formConfig.google_form_url);
  const isOnscreenForm = slug === 'event-pre-proposal' || slug === 'bill-settlement' || slug === 'membership';

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
              <form onSubmit={handleProposalSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0a385b', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '8px' }}>
                  Event Information Form
                </h3>
                
                {/* Event Name - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Name *</label>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={proposalData.title}
                    onChange={(e) => { setProposalData({ ...proposalData, title: e.target.value }); if (proposalErrors.title) setProposalErrors(p => ({ ...p, title: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.title ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {proposalErrors.title && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.title}</span>}
                </div>

                {/* Organizer - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Organizer *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['Student Branch', 'WIE', 'APS', 'COMSOC', 'CS', 'PES', 'RAS'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="society"
                          value={opt}
                          checked={proposalData.society === opt}
                          onChange={(e) => setProposalData({ ...proposalData, society: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type of the Event - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Type of the Event *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['Technical', 'Non-technical', 'Administrative', 'Other'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="eventType"
                          value={opt}
                          checked={proposalData.eventType === opt}
                          onChange={(e) => setProposalData({ ...proposalData, eventType: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category of the Event - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Category of the Event *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {[
                      'Competition',
                      'Workshop',
                      'Field Visit',
                      'Guest lecture',
                      'National Conference / Intl. Conference',
                      'Seminar',
                      'Awareness Pgm',
                      'Quiz',
                      'Discussion Meeting',
                      'FDP',
                      'Technical Talk',
                      'DVP Talk'
                    ].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="eventCategory"
                          value={opt}
                          checked={proposalData.eventCategory === opt}
                          onChange={(e) => setProposalData({ ...proposalData, eventCategory: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mode of the Event - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Mode of the Event *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['In-Person', 'Online', 'Hybrid'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="eventMode"
                          value={opt}
                          checked={proposalData.eventMode === opt}
                          onChange={(e) => setProposalData({ ...proposalData, eventMode: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt === 'In-Person' ? 'In- Person' : opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type of Event - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Type of Event *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['Intra', 'Inter', 'Both'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="eventScope"
                          value={opt}
                          checked={proposalData.eventScope === opt}
                          onChange={(e) => setProposalData({ ...proposalData, eventScope: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Responsive 2-Column Grid (ONLY for marked fields in the 3rd image) */}
                <div className="onscreen-form-grid-2col">
                  {/* Coordinator Name & Coordinator Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Name *</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={proposalData.coordinatorName}
                      onChange={(e) => { setProposalData({ ...proposalData, coordinatorName: e.target.value }); if (proposalErrors.coordinatorName) setProposalErrors(p => ({ ...p, coordinatorName: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.coordinatorName ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {proposalErrors.coordinatorName && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.coordinatorName}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Email *</label>
                    <input
                      type="email"
                      placeholder="e.g. name@kongu.edu"
                      value={proposalData.coordinatorEmail}
                      onChange={(e) => { setProposalData({ ...proposalData, coordinatorEmail: e.target.value }); if (proposalErrors.coordinatorEmail) setProposalErrors(p => ({ ...p, coordinatorEmail: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.coordinatorEmail ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {proposalErrors.coordinatorEmail && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.coordinatorEmail}</span>}
                  </div>

                  {/* Coordinator Phone & Proposed Venue */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Phone *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={proposalData.coordinatorPhone}
                      onChange={(e) => { setProposalData({ ...proposalData, coordinatorPhone: e.target.value }); if (proposalErrors.coordinatorPhone) setProposalErrors(p => ({ ...p, coordinatorPhone: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.coordinatorPhone ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {proposalErrors.coordinatorPhone && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.coordinatorPhone}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Proposed Venue *</label>
                    <input
                      type="text"
                      placeholder="e.g. TBI Seminar Hall, KEC"
                      value={proposalData.venue}
                      onChange={(e) => { setProposalData({ ...proposalData, venue: e.target.value }); if (proposalErrors.venue) setProposalErrors(p => ({ ...p, venue: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.venue ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {proposalErrors.venue && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.venue}</span>}
                  </div>

                  {/* Date of the Event Start & Date of the Event End */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Date of the Event Start *</label>
                    <input
                      type="date"
                      value={proposalData.eventStartDate}
                      onChange={(e) => { setProposalData({ ...proposalData, eventStartDate: e.target.value }); if (proposalErrors.eventStartDate) setProposalErrors(p => ({ ...p, eventStartDate: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.eventStartDate ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {proposalErrors.eventStartDate && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.eventStartDate}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Date of the Event End *</label>
                    <input
                      type="date"
                      value={proposalData.eventEndDate}
                      onChange={(e) => { setProposalData({ ...proposalData, eventEndDate: e.target.value }); if (proposalErrors.eventEndDate) setProposalErrors(p => ({ ...p, eventEndDate: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.eventEndDate ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {proposalErrors.eventEndDate && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.eventEndDate}</span>}
                  </div>

                  {/* Expected Participants */}
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
                </div>

                {/* Mail for Acknowledge - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Mail for Acknowledge *</label>
                  <input
                    type="email"
                    placeholder="e.g. coordinator@example.com"
                    value={proposalData.mailForAcknowledge}
                    onChange={(e) => { setProposalData({ ...proposalData, mailForAcknowledge: e.target.value }); if (proposalErrors.mailForAcknowledge) setProposalErrors(p => ({ ...p, mailForAcknowledge: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.mailForAcknowledge ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {proposalErrors.mailForAcknowledge && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.mailForAcknowledge}</span>}
                </div>

                {/* Estimated Budget (INR) - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Estimated Budget (INR) *</label>
                  <input
                    type="number"
                    placeholder="Total cost in Rs."
                    value={proposalData.budget}
                    onChange={(e) => { setProposalData({ ...proposalData, budget: e.target.value }); if (proposalErrors.budget) setProposalErrors(p => ({ ...p, budget: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.budget ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {proposalErrors.budget && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.budget}</span>}
                </div>

                {/* Person to Contact for Doubts - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Person to Contact for Doubts *</label>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px', marginBottom: '6px' }}>Phone number</span>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={proposalData.contactPersonPhone}
                    onChange={(e) => { setProposalData({ ...proposalData, contactPersonPhone: e.target.value }); if (proposalErrors.contactPersonPhone) setProposalErrors(p => ({ ...p, contactPersonPhone: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.contactPersonPhone ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {proposalErrors.contactPersonPhone && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.contactPersonPhone}</span>}
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
                    placeholder="Briefly state the schedule, topics, syllabus, and expected outcome of the event..."
                    value={proposalData.description}
                    onChange={(e) => { setProposalData({ ...proposalData, description: e.target.value }); if (proposalErrors.description) setProposalErrors(p => ({ ...p, description: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${proposalErrors.description ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  {proposalErrors.description && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{proposalErrors.description}</span>}
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
            ) : slug === 'bill-settlement' ? (
              /* Bill Settlement Form */
              <form onSubmit={handleBillSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0a385b', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '8px' }}>
                  Accounts Settlement Form
                </h3>

                {/* Event Name - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Name *</label>
                  <input
                    type="text"
                    placeholder="Name of the conducted event"
                    value={billData.eventName}
                    onChange={(e) => { setBillData({ ...billData, eventName: e.target.value }); if (billErrors.eventName) setBillErrors(p => ({ ...p, eventName: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.eventName ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {billErrors.eventName && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.eventName}</span>}
                </div>

                {/* Organizer - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Organizer *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['Student Branch', 'WIE', 'APS', 'COMSOC', 'CS', 'PES', 'RAS'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="bill_organizer"
                          value={opt}
                          checked={billData.organizer === opt}
                          onChange={(e) => setBillData({ ...billData, organizer: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type of the Event - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Type of the Event *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['Technical', 'Non-technical', 'Administrative', 'Other'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="bill_eventType"
                          value={opt}
                          checked={billData.eventType === opt}
                          onChange={(e) => setBillData({ ...billData, eventType: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category of the Event - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Category of the Event *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {[
                      'Competition', 'Workshop', 'Field Visit', 'Guest lecture',
                      'National Conference / Intl. Conference', 'Seminar', 'Awareness Pgm',
                      'Quiz', 'Discussion Meeting', 'FDP', 'Technical Talk', 'DVP Talk'
                    ].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="bill_eventCategory"
                          value={opt}
                          checked={billData.eventCategory === opt}
                          onChange={(e) => setBillData({ ...billData, eventCategory: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mode of the Event - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Mode of the Event *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['In-Person', 'Online', 'Hybrid'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="bill_eventMode"
                          value={opt}
                          checked={billData.eventMode === opt}
                          onChange={(e) => setBillData({ ...billData, eventMode: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt === 'In-Person' ? 'In- Person' : opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type of Event (scope) - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Type of Event *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['Intra', 'Inter', 'Both'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="bill_eventScope"
                          value={opt}
                          checked={billData.eventScope === opt}
                          onChange={(e) => setBillData({ ...billData, eventScope: e.target.value })}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2-Column Grid Fields */}
                <div className="onscreen-form-grid-2col">
                  {/* Coordinator Name & Coordinator Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Name *</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={billData.coordinatorName}
                      onChange={(e) => { setBillData({ ...billData, coordinatorName: e.target.value }); if (billErrors.coordinatorName) setBillErrors(p => ({ ...p, coordinatorName: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.coordinatorName ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {billErrors.coordinatorName && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.coordinatorName}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Email *</label>
                    <input
                      type="email"
                      placeholder="e.g. name@kongu.edu"
                      value={billData.coordinatorEmail}
                      onChange={(e) => { setBillData({ ...billData, coordinatorEmail: e.target.value }); if (billErrors.coordinatorEmail) setBillErrors(p => ({ ...p, coordinatorEmail: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.coordinatorEmail ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {billErrors.coordinatorEmail && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.coordinatorEmail}</span>}
                  </div>

                  {/* Coordinator Phone & Proposed Venue */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Coordinator Phone *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={billData.coordinatorPhone}
                      onChange={(e) => { setBillData({ ...billData, coordinatorPhone: e.target.value }); if (billErrors.coordinatorPhone) setBillErrors(p => ({ ...p, coordinatorPhone: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.coordinatorPhone ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {billErrors.coordinatorPhone && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.coordinatorPhone}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Venue *</label>
                    <input
                      type="text"
                      placeholder="e.g. TBI Seminar Hall, KEC"
                      value={billData.venue}
                      onChange={(e) => { setBillData({ ...billData, venue: e.target.value }); if (billErrors.venue) setBillErrors(p => ({ ...p, venue: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.venue ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {billErrors.venue && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.venue}</span>}
                  </div>

                  {/* Date of the Event Start & End */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Date of the Event Start *</label>
                    <input
                      type="date"
                      value={billData.eventStartDate}
                      onChange={(e) => { setBillData({ ...billData, eventStartDate: e.target.value }); if (billErrors.eventStartDate) setBillErrors(p => ({ ...p, eventStartDate: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.eventStartDate ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {billErrors.eventStartDate && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.eventStartDate}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Date of the Event End *</label>
                    <input
                      type="date"
                      value={billData.eventEndDate}
                      onChange={(e) => { setBillData({ ...billData, eventEndDate: e.target.value }); if (billErrors.eventEndDate) setBillErrors(p => ({ ...p, eventEndDate: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.eventEndDate ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {billErrors.eventEndDate && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.eventEndDate}</span>}
                  </div>

                  {/* Total Attendance - stays in grid */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Total Attendance *</label>
                    <input
                      type="number"
                      placeholder="Actual number of participants"
                      value={billData.actualParticipants}
                      onChange={(e) => { setBillData({ ...billData, actualParticipants: e.target.value }); if (billErrors.actualParticipants) setBillErrors(p => ({ ...p, actualParticipants: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.actualParticipants ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {billErrors.actualParticipants && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.actualParticipants}</span>}
                  </div>
                </div>

                {/* Mail for Acknowledge - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Mail for Acknowledge *</label>
                  <input
                    type="email"
                    placeholder="e.g. coordinator@example.com"
                    value={billData.mailForAcknowledge}
                    onChange={(e) => { setBillData({ ...billData, mailForAcknowledge: e.target.value }); if (billErrors.mailForAcknowledge) setBillErrors(p => ({ ...p, mailForAcknowledge: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.mailForAcknowledge ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {billErrors.mailForAcknowledge && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.mailForAcknowledge}</span>}
                </div>

                {/* Total Expenses - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Total Expenses (INR) *</label>
                  <input
                    type="number"
                    placeholder="Sum of all bills spent"
                    value={billData.totalExpenses}
                    onChange={(e) => { setBillData({ ...billData, totalExpenses: e.target.value }); if (billErrors.totalExpenses) setBillErrors(p => ({ ...p, totalExpenses: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.totalExpenses ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {billErrors.totalExpenses && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.totalExpenses}</span>}
                </div>

                {/* Person to Contact for Doubts - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Person to Contact for Doubts *</label>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '-4px', marginBottom: '6px' }}>Phone number</span>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={billData.contactPersonPhone}
                    onChange={(e) => { setBillData({ ...billData, contactPersonPhone: e.target.value }); if (billErrors.contactPersonPhone) setBillErrors(p => ({ ...p, contactPersonPhone: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.contactPersonPhone ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {billErrors.contactPersonPhone && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.contactPersonPhone}</span>}
                </div>

                {/* Reimbursement Bank Details - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Reimbursement Bank Details *</label>
                  <textarea
                    rows="4"
                    placeholder="Specify: Account Holder Name, Bank Name, Account Number, and IFSC Code"
                    value={billData.bankDetails}
                    onChange={(e) => { setBillData({ ...billData, bankDetails: e.target.value }); if (billErrors.bankDetails) setBillErrors(p => ({ ...p, bankDetails: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${billErrors.bankDetails ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14.5px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  {billErrors.bankDetails && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.bankDetails}</span>}
                </div>

                {/* Upload Voucher - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Upload Voucher / Expense Scans *</label>
                  <div style={{
                    border: `2px dashed ${billErrors.voucherUrl ? '#ef4444' : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <input
                      type="file"
                      accept=".pdf, image/*"
                      onChange={(e) => { handleFileUpload(e); if (billErrors.voucherUrl) setBillErrors(p => ({ ...p, voucherUrl: '' })); }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <Upload size={32} style={{ color: 'var(--secondary)', opacity: 0.8 }} />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>Click to upload files</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PDF or Image files, up to 10MB</span>
                    {billData.voucherName && (
                      <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', maxWidth: '90%' }}>
                        <FileText size={12} />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{billData.voucherName}</span>
                      </div>
                    )}
                  </div>
                  {billErrors.voucherUrl && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{billErrors.voucherUrl}</span>}
                </div>

                {/* Settlement Remarks - Full Width */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Settlement Remarks / Feedback Summary</label>
                  <textarea
                    rows="3"
                    placeholder="Any comments, descriptions of expense differences, or event success points..."
                    value={billData.remarks}
                    onChange={(e) => setBillData({ ...billData, remarks: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
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
            ) : slug === 'membership' ? (
              /* IEEE Membership Camp Form */
              <form onSubmit={handleMembershipSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0a385b', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '8px' }}>
                  IEEE Membership Camp
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '-12px' }}>
                  {`"Great things happen when we come together" — Thankyou for being part of us" – Sherry Anderson`}
                </p>

                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Name (Dharshini S) *</label>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={membershipData.name}
                    onChange={(e) => { setMembershipData({ ...membershipData, name: e.target.value }); if (membershipErrors.name) setMembershipErrors(p => ({ ...p, name: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${membershipErrors.name ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {membershipErrors.name && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.name}</span>}
                </div>

                {/* Roll Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Roll Number (23ECR001) *</label>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={membershipData.rollNumber}
                    onChange={(e) => { setMembershipData({ ...membershipData, rollNumber: e.target.value }); if (membershipErrors.rollNumber) setMembershipErrors(p => ({ ...p, rollNumber: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${membershipErrors.rollNumber ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {membershipErrors.rollNumber && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.rollNumber}</span>}
                </div>

                {/* Year */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Year *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['II', 'III', 'IV'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="mem_year"
                          value={opt}
                          checked={membershipData.year === opt}
                          onChange={(e) => { setMembershipData({ ...membershipData, year: e.target.value }); if (membershipErrors.year) setMembershipErrors(p => ({ ...p, year: '' })); }}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {membershipErrors.year && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.year}</span>}
                </div>

                {/* Department */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Department *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['Civil', 'Mechanical', 'ECE', 'CSE', 'Chemical', 'EEE', 'EIE', 'IT', 'Mechatronics', 'FT', 'Automobile', 'CSD', 'AIML', 'AIDS', 'Other'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="mem_dept"
                          value={opt}
                          checked={membershipData.department === opt}
                          onChange={(e) => { 
                            setMembershipData({ ...membershipData, department: e.target.value, customDepartment: e.target.value === 'Other' ? membershipData.customDepartment : '' }); 
                            if (membershipErrors.department) setMembershipErrors(p => ({ ...p, department: '' })); 
                            if (membershipErrors.customDepartment) setMembershipErrors(p => ({ ...p, customDepartment: '' }));
                          }}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {membershipErrors.department && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.department}</span>}
                  
                  {/* Dynamic Custom Department Field */}
                  {membershipData.department === 'Other' && (
                    <div style={{ marginTop: '10px', paddingLeft: '4px' }}>
                      <input
                        type="text"
                        placeholder="Other:"
                        value={membershipData.customDepartment || ''}
                        onChange={(e) => {
                          setMembershipData({ ...membershipData, customDepartment: e.target.value });
                          if (membershipErrors.customDepartment) setMembershipErrors(p => ({ ...p, customDepartment: '' }));
                        }}
                        style={{ width: '100%', maxWidth: '320px', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${membershipErrors.customDepartment ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                      {membershipErrors.customDepartment && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.customDepartment}</span>}
                    </div>
                  )}
                </div>

                {/* 2-col grid: College Email + Personal Email */}
                <div className="onscreen-form-grid-2col">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>College Mail-ID *</label>
                    <input
                      type="email"
                      placeholder="Your answer"
                      value={membershipData.collegeEmail}
                      onChange={(e) => { setMembershipData({ ...membershipData, collegeEmail: e.target.value }); if (membershipErrors.collegeEmail) setMembershipErrors(p => ({ ...p, collegeEmail: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${membershipErrors.collegeEmail ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {membershipErrors.collegeEmail && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.collegeEmail}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Personal Mail-ID *</label>
                    <input
                      type="email"
                      placeholder="Your answer"
                      value={membershipData.personalEmail}
                      onChange={(e) => { setMembershipData({ ...membershipData, personalEmail: e.target.value }); if (membershipErrors.personalEmail) setMembershipErrors(p => ({ ...p, personalEmail: '' })); }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${membershipErrors.personalEmail ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {membershipErrors.personalEmail && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.personalEmail}</span>}
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Contact Number *</label>
                  <input
                    type="tel"
                    placeholder="Your answer"
                    value={membershipData.contactNumber}
                    onChange={(e) => { setMembershipData({ ...membershipData, contactNumber: e.target.value }); if (membershipErrors.contactNumber) setMembershipErrors(p => ({ ...p, contactNumber: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${membershipErrors.contactNumber ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {membershipErrors.contactNumber && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.contactNumber}</span>}
                </div>

                {/* Transaction ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Transaction ID *</label>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={membershipData.transactionId}
                    onChange={(e) => { setMembershipData({ ...membershipData, transactionId: e.target.value }); if (membershipErrors.transactionId) setMembershipErrors(p => ({ ...p, transactionId: '' })); }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${membershipErrors.transactionId ? '#ef4444' : '#cbd5e1'}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  {membershipErrors.transactionId && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.transactionId}</span>}
                </div>

                {/* Screenshot of Payment */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Screenshot of Payment *</label>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Upload 1 supported file: PDF or Image. Max 100 MB.</span>
                  <div style={{
                    border: `2px dashed ${membershipErrors.paymentScreenshotUrl ? '#ef4444' : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    padding: '20px 16px',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <input
                      type="file"
                      accept=".pdf, image/*"
                      onChange={handlePaymentScreenshotUpload}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <Upload size={28} style={{ color: 'var(--secondary)', opacity: 0.8 }} />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                      {membershipData.paymentScreenshotName ? membershipData.paymentScreenshotName : '+ Add file'}
                    </span>
                    {!membershipData.paymentScreenshotName && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PDF or Image, up to 100 MB</span>
                    )}
                  </div>
                  {membershipErrors.paymentScreenshotUrl && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.paymentScreenshotUrl}</span>}
                </div>

                {/* QR Code and Payment Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>QR code *</label>
                  <span style={{ display: 'block', fontSize: '14px', color: '#18181b', fontWeight: 'bold', textDecoration: 'underline', fontStyle: 'italic', marginBottom: '10px' }}>Rs.1560/-</span>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <img
                      src="/membership_qr.png"
                      alt="UPI QR Code Card"
                      style={{ width: '100%', maxWidth: '300px', height: 'auto', objectFit: 'contain', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['Paid', 'Not paid'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="mem_payment_status"
                          value={opt}
                          checked={membershipData.paymentStatus === opt}
                          onChange={(e) => { setMembershipData({ ...membershipData, paymentStatus: e.target.value }); if (membershipErrors.paymentStatus) setMembershipErrors(p => ({ ...p, paymentStatus: '' })); }}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {membershipErrors.paymentStatus && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.paymentStatus}</span>}
                </div>

                {/* IEEE Membership Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>IEEE Membership *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    {['New Member', 'Existing Member'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', width: 'fit-content' }}>
                        <input
                          type="radio"
                          name="mem_type"
                          value={opt}
                          checked={membershipData.membershipType === opt}
                          onChange={(e) => { setMembershipData({ ...membershipData, membershipType: e.target.value }); if (membershipErrors.membershipType) setMembershipErrors(p => ({ ...p, membershipType: '' })); }}
                          style={{ width: 'auto', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {membershipErrors.membershipType && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{membershipErrors.membershipType}</span>}
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
                    <Send size={16} /> Submit Membership
                  </button>
                </div>
              </form>
            ) : null}
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
          background-color: rgba(var(--secondary-rgb), 0.05) !important;
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
