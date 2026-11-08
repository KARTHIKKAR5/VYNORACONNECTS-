import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react';
import {
  OPPORTUNITY_TYPES,
  createOpportunity,
} from '../../services/opportunitiesService.js';

export function CreateOpportunityModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    type: 'internship',
    summary: '',
    eligibility: '',
    deadline: '',
    location: '',
    remote: false,
    stipendOrPrize: '',
    applicationUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFeedback, setServerFeedback] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerFeedback(null);
    setIsSubmitting(true);

    try {
      const result = await createOpportunity(formData);
      setServerFeedback({
        type: 'success',
        message: result.message,
        isPersisted: result.isPersistedToDatabase,
      });

      setTimeout(() => {
        onCreated(result.data);
        onClose();
      }, 1200);
    } catch (err) {
      if (err.name === 'ValidationError' && err.errors) {
        setErrors(err.errors);
      } else {
        setServerFeedback({
          type: 'error',
          message: err.message || 'Failed to submit opportunity. Please verify fields and try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-opp-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-opp-title">Post a Student Opportunity</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            id="btn-close-opp-modal"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverFeedback && (
              <div
                className={serverFeedback.type === 'success' ? 'alert-success' : 'error-banner'}
                style={{ marginBottom: '16px' }}
              >
                {serverFeedback.type === 'success' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} className="error-banner-icon" />
                )}
                <div>
                  <div style={{ fontWeight: 600 }}>{serverFeedback.message}</div>
                  {serverFeedback.type === 'success' && !serverFeedback.isPersisted && (
                    <div style={{ fontSize: '0.78rem', marginTop: '2px', opacity: 0.9 }}>
                      (Notice: Backend MongoDB server is offline in Week 1. Opportunity saved in session memory.)
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="opp-title" className="form-label">
                Opportunity Title / Role
                <span className="form-label-required">*</span>
              </label>
              <input
                type="text"
                id="opp-title"
                name="title"
                className={`form-control ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g., Summer Machine Learning Research Fellow 2027"
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
                disabled={isSubmitting}
              />
              {errors.title && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="opp-org" className="form-label">
                  Organization / Company / Club
                  <span className="form-label-required">*</span>
                </label>
                <input
                  type="text"
                  id="opp-org"
                  name="organization"
                  className={`form-control ${errors.organization ? 'input-error' : ''}`}
                  placeholder="e.g., Google DeepMind, ACM Chapter"
                  value={formData.organization}
                  onChange={handleChange}
                  maxLength={80}
                  disabled={isSubmitting}
                />
                {errors.organization && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.organization}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="opp-type" className="form-label">
                  Opportunity Type
                  <span className="form-label-required">*</span>
                </label>
                <select
                  id="opp-type"
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {OPPORTUNITY_TYPES.filter((t) => t.value !== 'all').map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.type}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="opp-deadline" className="form-label">
                  Application Deadline
                  <span className="form-label-required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    id="opp-deadline"
                    name="deadline"
                    className={`form-control ${errors.deadline ? 'input-error' : ''}`}
                    value={formData.deadline}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.deadline && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.deadline}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="opp-stipend" className="form-label">
                  Stipend / Prize Pool / Grant
                </label>
                <input
                  type="text"
                  id="opp-stipend"
                  name="stipendOrPrize"
                  className="form-control"
                  placeholder="e.g., ₹45,000 / mo or ₹2,00,000 Prize"
                  value={formData.stipendOrPrize}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="opp-location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  id="opp-location"
                  name="location"
                  className="form-control"
                  placeholder="e.g., Bengaluru, India or Virtual"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group" style={{ justifyContent: 'center', paddingTop: '28px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    id="opp-remote"
                    name="remote"
                    checked={formData.remote}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
                  />
                  <span>Remote / Virtual Opportunity</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="opp-app-url" className="form-label">
                Application Portal URL
                <span className="form-label-required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  id="opp-app-url"
                  name="applicationUrl"
                  className={`form-control ${errors.applicationUrl ? 'input-error' : ''}`}
                  placeholder="https://careers.example.com/apply or https://..."
                  value={formData.applicationUrl}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ paddingLeft: '36px' }}
                />
                <LinkIcon
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}
                />
              </div>
              {errors.applicationUrl ? (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.applicationUrl}</span>
                </div>
              ) : (
                <div className="form-help-text">Only secure URLs (http:// or https://) are accepted.</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="opp-eligibility" className="form-label">
                Eligibility Criteria
                <span className="form-label-required">*</span>
              </label>
              <input
                type="text"
                id="opp-eligibility"
                name="eligibility"
                className={`form-control ${errors.eligibility ? 'input-error' : ''}`}
                placeholder="e.g., Pre-final or final year B.Tech students in CSE/ECE with CGPA >= 7.0"
                value={formData.eligibility}
                onChange={handleChange}
                maxLength={300}
                disabled={isSubmitting}
              />
              {errors.eligibility && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.eligibility}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="opp-summary" className="form-label">
                Description & Requirements
                <span className="form-label-required">*</span>
              </label>
              <textarea
                id="opp-summary"
                name="summary"
                rows={4}
                className={`form-control ${errors.summary ? 'input-error' : ''}`}
                placeholder="Describe role responsibilities, team culture, selection process, and what students will work on..."
                value={formData.summary}
                onChange={handleChange}
                maxLength={2000}
                disabled={isSubmitting}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.summary ? (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.summary}</span>
                  </div>
                ) : <span />}
                <span className="form-help-text">{formData.summary.length}/2000</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              id="btn-cancel-opp-modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="btn-submit-opp"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Post Opportunity'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
