import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export function ReasonModal({
  isOpen,
  title,
  subtitle,
  reasonLabel = 'Reason for this action',
  placeholder = 'Provide specific justification for the audit trail...',
  confirmText = 'Submit Action',
  isDestructive = false,
  onConfirm,
  onClose,
  extraField = null,
}) {
  const [reason, setReason] = useState('');
  const [extraVal, setExtraVal] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      setError('Please provide a meaningful reason (minimum 5 characters) for audit trail compliance.');
      return;
    }
    setError('');
    onConfirm({ reason: reason.trim(), extra: extraVal });
    setReason('');
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reason-modal-title">
      <div className="modal-container" style={{ maxWidth: '520px' }}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div>
              <h3 className="modal-title" id="reason-modal-title">{title}</h3>
              {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            <div className="callout-info" style={{ marginBottom: 0 }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Immutable Audit Requirement:</strong> Platform Owner actions require an explicit reason that will be logged permanently in the system security audit trail.
              </div>
            </div>

            {extraField && (
              <div className="form-group">
                <label className="form-label">{extraField.label}</label>
                {extraField.type === 'select' ? (
                  <select
                    className="form-select"
                    value={extraVal}
                    onChange={(e) => setExtraVal(e.target.value)}
                  >
                    {extraField.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder={extraField.placeholder}
                    value={extraVal}
                    onChange={(e) => setExtraVal(e.target.value)}
                  />
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label form-label-required">{reasonLabel}</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder={placeholder}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
              />
              {error && <span className="form-error">{error}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReasonModal;
