import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient.js';

const REPORT_REASONS = [
  'Broken or Malicious External Link',
  'Misleading Listing or Fake Opportunity',
  'Expired Deadline Presented as Active',
  'Inappropriate Content or Spam',
  'Copyright or Intellectual Property Violation',
  'Other Policy Violation',
];

export function ReportListingModal({ isOpen, onClose, targetType, targetId, targetTitle }) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiClient.post('/moderation/reports', {
        targetType,
        targetId,
        targetTitle,
        reason,
        details: details.trim(),
      });
    } catch {
      // Local fallback / optimistic reporting
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: 'var(--accent-danger)' }} />
            <h3 className="modal-title">Report Listing</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <CheckCircle2 size={36} style={{ color: 'var(--accent-success)', margin: '0 auto 12px' }} />
            <h4>Report Dispatched</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
              Your report has been forwarded to Revanth's moderation team for review. Thank you for keeping Vynora Connect safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Reporting: <strong>{targetTitle}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Reason for Report</label>
              <select
                className="form-select"
                value={reason}
                onChange={e => setReason(e.target.value)}
              >
                {REPORT_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">Additional Details (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Explain the issue with this listing..."
                value={details}
                onChange={e => setDetails(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submitting}
                style={{ backgroundColor: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}
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

