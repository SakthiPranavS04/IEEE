import React, { useState } from 'react';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Join = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '',
    membershipType: 'Student',
    resume: '',
    portfolio: '',
    github: '',
    linkedin: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/join', formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting join request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <CheckCircle size={64} color="#10b981" style={{ marginBottom: '20px' }} />
        <h2 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Application Submitted!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px' }}>
          Thank you for your interest in joining IEEE. Our team will review your application and get back to you shortly.
        </p>
        <Link to="/" style={{ padding: '10px 24px', background: 'var(--gradient-colorful)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div style={{ backgroundColor: 'var(--primary)', padding: '60px 0', color: 'white', textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px', fontWeight: '800' }}>Join IEEE</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          Become a part of the world's largest technical professional organization.
        </p>
      </div>

      <div className="container" style={{ maxWidth: '800px', paddingBottom: '60px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <UserPlus size={28} color="var(--secondary)" />
            <h2 style={{ margin: 0, color: 'var(--primary)' }}>Application Form</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>Full Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>College/Institution *</label>
                <input required name="college" value={formData.college} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>Department *</label>
                <input required name="department" value={formData.department} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>Year of Study *</label>
                <select required name="year" value={formData.year} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}>
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>Membership Type *</label>
                <select required name="membershipType" value={formData.membershipType} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}>
                  <option value="Student">Student Member</option>
                  <option value="Professional">Professional Member</option>
                  <option value="Associate">Associate Member</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>Resume Link</label>
                <input name="resume" placeholder="Google Drive / Dropbox Link" value={formData.resume} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>Portfolio / Personal Website</label>
                <input name="portfolio" placeholder="https://..." value={formData.portfolio} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>GitHub Profile</label>
                <input name="github" placeholder="https://github.com/..." value={formData.github} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary)' }}>LinkedIn Profile</label>
                <input name="linkedin" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  backgroundColor: loading ? '#94a3b8' : 'var(--secondary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
