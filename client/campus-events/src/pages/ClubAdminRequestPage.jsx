import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Send, AlertCircle, Info } from 'lucide-react';
import { clubsEventsApi } from '../services/clubsEventsApi';

export default function ClubAdminRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    proposedClubName: '',
    collegeName: '',
    applicantName: 'Sindhu Mandati',
    applicantEmail: 'sindhu@vynora.edu',
    applicantRole: 'Club President / Lead Organizer',
    officialContact: '+91 98765 43210',
    websiteOrSocial: '',
    justification: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.proposedClubName || !formData.collegeName || !formData.justification) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(false);
    try {
      await clubsEventsApi.submitAdminRequest({
        ...formData,
        officialLinks: [formData.websiteOrSocial].filter(Boolean)
      });
      navigate('/clubs/admin/status');
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>
      <Link
        to="/clubs"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Club Directory
      </Link>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '32px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={24} color="var(--accent)" />
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Apply for Club Admin Access</h1>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
          Only platform-approved administrators of a verified college club can publish official club events.
          Applications are independently audited by the platform owner (Revanth) to protect students from unverified events.
        </p>

        {/* Notice Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '28px',
            color: '#A5B4FC',
            fontSize: '13px',
            lineHeight: 1.5
          }}
        >
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            Self-approval is strictly prevented by server architecture. Once submitted, your application status will be tracked on your personal status dashboard.
          </span>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              color: '#FCA5A5',
              fontSize: '13px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Proposed Club Name *
              </label>
              <input
                type="text"
                placeholder="e.g. AI & Robotics Innovation Club"
                value={formData.proposedClubName}
                onChange={(e) => setFormData({ ...formData, proposedClubName: e.target.value })}
                required
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                College / University *
              </label>
              <input
                type="text"
                placeholder="e.g. SR University, IIT Hyderabad..."
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                required
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Your Official Role in Club *
              </label>
              <input
                type="text"
                value={formData.applicantRole}
                onChange={(e) => setFormData({ ...formData, applicantRole: e.target.value })}
                required
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Official Social / Website / Instagram Link
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/your_club"
                value={formData.websiteOrSocial}
                onChange={(e) => setFormData({ ...formData, websiteOrSocial: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Justification & Verification Details *
            </label>
            <textarea
              rows={4}
              placeholder="Explain the mission of your club, faculty advisors, and proof of student leadership representation..."
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              required
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Send size={16} /> Submit Application for Owner Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}