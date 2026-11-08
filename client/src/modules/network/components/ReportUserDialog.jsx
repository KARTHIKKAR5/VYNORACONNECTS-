import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

const REPORT_CATEGORIES = [
  { id: 'harassment', label: 'Harassment or Unwanted Communication' },
  { id: 'impersonation', label: 'Impersonation or Fake Student Profile' },
  { id: 'spam', label: 'Spam, Ads, or Commercial Solicitation' },
  { id: 'inappropriate', label: 'Inappropriate Content or Academic Misconduct' },
  { id: 'other', label: 'Other Reason' },
];

export function ReportUserDialog({
  isOpen = false,
  student = null,
  onClose = () => {},
  onSubmit = () => {},
}) {
  const [category, setCategory] = useState('harassment');
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(student._id, category, explanation);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setExplanation('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} style={{ color: 'var(--accent-danger)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Report {student.name}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '4px' }}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ color: 'var(--accent-success)', fontWeight: '600', fontSize: '1rem' }}>
              Report submitted successfully.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Thank you for keeping the Vynora student community safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Your report will be forwarded directly to the central Trust &amp; Safety moderation team. Reports are
              confidential.
            </p>

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-danger-bg)',
                  border: '1px solid var(--accent-danger)',
                  color: 'var(--accent-danger)',
                  fontSize: '0.825rem',
                  marginBottom: '14px',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                Reason for report:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REPORT_CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="reportCategory"
                      value={cat.id}
                      checked={category === cat.id}
                      onChange={() => setCategory(cat.id)}
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="report-explanation"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}
              >
                Additional Details (Optional):
              </label>
              <textarea
                id="report-explanation"
                className="form-textarea"
                rows={3}
                style={{ width: '100%', fontSize: '0.85rem', resize: 'vertical' }}
                placeholder="Provide any relevant context for the moderation team..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                maxLength={500}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportUserDialog;

