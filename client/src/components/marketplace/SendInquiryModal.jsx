import React, { useState } from 'react';

export function SendInquiryModal({
  listing,
  onClose,
  onSubmit,
  currentUserId = 'usr-surya-01'
}) {
  if (!listing) return null;

  const isSelf = listing.ownerId === currentUserId;

  const [formData, setFormData] = useState({
    subject: `Inquiry regarding "${listing.title.slice(0, 45)}"`,
    message: '',
    requirements: '',
    budgetAmount: listing.pricing?.amount || '',
    deadline: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required.';
    } else if (formData.subject.trim().length < 5) {
      errs.subject = 'Subject must be at least 5 characters.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Message is required.';
    } else if (formData.message.trim().length < 20) {
      errs.message = 'Message must be at least 20 characters.';
    }

    if (formData.budgetAmount && Number(formData.budgetAmount) < 0) {
      errs.budgetAmount = 'Budget amount cannot be negative.';
    }

    if (formData.deadline) {
      const selected = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected <= today) {
        errs.deadline = 'Deadline must be a future date.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSelf) return;
    if (!validate()) return;

    onSubmit(listing.id, {
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      requirements: formData.requirements.trim(),
      budget: {
        amount: Number(formData.budgetAmount) || 0,
        currency: 'INR'
      },
      requestedDeadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
    });
  };

  return (
    <div className="mono-modal-backdrop" onClick={onClose}>
      <div className="mono-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mono-modal-header">
          <div>
            <span className="mono-badge mono-badge-subtle font-mono">INITIATE INQUIRY</span>
            <h2 className="mono-modal-title">Request Project Consultation</h2>
            <p className="mono-modal-sub">
              To: <strong>{listing.ownerName}</strong> ({listing.ownerDept})
            </p>
          </div>
          <button className="mono-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {isSelf ? (
          <div className="mono-modal-body">
            <div className="mono-notice-box error">
              <span className="mono-notice-icon">⛔</span>
              <div>
                <strong>Self-Inquiry Prohibited:</strong>
                <p>
                  You are the verified owner of this service listing. The Vynora Connect authorization policy strictly prohibits submitting inquiries to your own service.
                </p>
              </div>
            </div>
            <div className="mono-modal-footer">
              <button className="mono-btn mono-btn-secondary" onClick={onClose}>
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mono-form">
            <div className="mono-modal-body">
              <div className="mono-form-group">
                <label className="mono-label">Inquiry Subject *</label>
                <input
                  type="text"
                  className={`mono-input ${errors.subject ? 'mono-input-error' : ''}`}
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, subject: e.target.value }));
                    if (errors.subject) setErrors(prev => ({ ...prev, subject: null }));
                  }}
                />
                {errors.subject && <span className="mono-field-error">{errors.subject}</span>}
              </div>

              <div className="mono-form-group">
                <label className="mono-label">Message / Project Overview * (min 20 chars)</label>
                <textarea
                  rows="4"
                  className={`mono-textarea ${errors.message ? 'mono-input-error' : ''}`}
                  placeholder="Introduce yourself and explain the project scope, expected deliverables, and how you'd like to collaborate..."
                  value={formData.message}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, message: e.target.value }));
                    if (errors.message) setErrors(prev => ({ ...prev, message: null }));
                  }}
                />
                {errors.message && <span className="mono-field-error">{errors.message}</span>}
              </div>

              <div className="mono-form-group">
                <label className="mono-label">Specific Technical Requirements (Optional)</label>
                <textarea
                  rows="2"
                  className="mono-textarea"
                  placeholder="Specific tech stacks, authentication requirements, APIs, or design references..."
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                />
              </div>

              <div className="mono-form-grid-2">
                <div className="mono-form-group">
                  <label className="mono-label">Proposed Budget (₹ INR)</label>
                  <input
                    type="number"
                    min="0"
                    className={`mono-input ${errors.budgetAmount ? 'mono-input-error' : ''}`}
                    placeholder="e.g. 3500"
                    value={formData.budgetAmount}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, budgetAmount: e.target.value }));
                      if (errors.budgetAmount) setErrors(prev => ({ ...prev, budgetAmount: null }));
                    }}
                  />
                  {errors.budgetAmount && <span className="mono-field-error">{errors.budgetAmount}</span>}
                </div>

                <div className="mono-form-group">
                  <label className="mono-label">Requested Completion Deadline</label>
                  <input
                    type="date"
                    className={`mono-input ${errors.deadline ? 'mono-input-error' : ''}`}
                    value={formData.deadline}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, deadline: e.target.value }));
                      if (errors.deadline) setErrors(prev => ({ ...prev, deadline: null }));
                    }}
                  />
                  {errors.deadline && <span className="mono-field-error">{errors.deadline}</span>}
                </div>
              </div>
            </div>

            <div className="mono-modal-footer">
              <button type="button" className="mono-btn mono-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="mono-btn mono-btn-primary">
                Submit Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SendInquiryModal;
