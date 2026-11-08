import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import {
  createOpportunity,
  validateOpportunityForm,
  OPPORTUNITY_TYPES,
  WORK_MODES,
} from '../../services/opportunitiesService.js';

export function CreateOpportunityModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    organizerName: '',
    organizerUrl: '',
    type: 'hackathon',
    mode: 'online',
    city: '',
    description: '',
    eligibility: '',
    deadlineAt: '',
    applicationUrl: '',
    prizeDescription: '',
    stipendDescription: '',
    teamMin: 1,
    teamMax: 1,
    skills: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateOpportunityForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        teamMin: parseInt(formData.teamMin, 10) || 1,
        teamMax: parseInt(formData.teamMax, 10) || 1,
        skills: formData.skills
          ? formData.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
          : [],
      };

      const result = await createOpportunity(payload);
      setSuccessMessage(result.message || 'Opportunity submitted for review!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        if (onCreated) {
          onCreated(result.data);
        }
      }, 1500);
    } catch (err) {
      if (err.name === 'ValidationError') {
        setErrors(err.errors || {});
      } else {
        setServerError(err.message || 'Failed to submit opportunity.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="modal-title">Post Opportunity</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {successMessage ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--accent-success)', margin: '0 auto 12px' }} />
            <h3>Opportunity Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <div className="alert-info" style={{ marginBottom: '18px', padding: '10px 14px' }}>
              <Shield size={16} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem' }}>
                All student-submitted opportunities are reviewed by moderation to prevent spam, verify deadlines, and validate official application links.
              </span>
            </div>

            {serverError && (
              <div className="error-banner" style={{ marginBottom: '16px', padding: '10px 14px' }}>
                <AlertCircle size={16} className="error-banner-icon" />
                <span style={{ fontSize: '0.85rem' }}>{serverError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Title / Role Name *</label>
              <input
                type="text"
                name="title"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g. HackVynora 2026 or Software Engineering Summer Intern"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div className="form-group">
                <label className="form-label">Organizer / Company *</label>
                <input
                  type="text"
                  name="organizerName"
                  className={`form-input ${errors.organizerName ? 'input-error' : ''}`}
                  placeholder="e.g. Google, IEEE Student Branch"
                  value={formData.organizerName}
                  onChange={handleChange}
                />
                {errors.organizerName && <span className="error-text">{errors.organizerName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Opportunity Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {OPPORTUNITY_TYPES.filter(t => t.value !== 'all').map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div className="form-group">
                <label className="form-label">Participation / Work Mode</label>
                <select
                  name="mode"
                  className="form-select"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  {WORK_MODES.filter(m => m.value !== 'all').map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City / Location (If on-site)</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  placeholder="e.g. Bengaluru, Hyderabad"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div className="form-group">
                <label className="form-label">Application Deadline *</label>
                <input
                  type="date"
                  name="deadlineAt"
                  className={`form-input ${errors.deadlineAt ? 'input-error' : ''}`}
                  value={formData.deadlineAt}
                  onChange={handleChange}
                />
                {errors.deadlineAt && <span className="error-text">{errors.deadlineAt}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Stipend or Prize Pool (Optional)</label>
                <input
                  type="text"
                  name="prizeDescription"
                  className="form-input"
                  placeholder="e.g. ₹50,000 / month or ₹2,00,000 Prize Pool"
                  value={formData.prizeDescription}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">Official Application / Registration URL *</label>
              <input
                type="url"
                name="applicationUrl"
                className={`form-input ${errors.applicationUrl ? 'input-error' : ''}`}
                placeholder="https://company.com/apply or https://hackathon.devpost.com"
                value={formData.applicationUrl}
                onChange={handleChange}
              />
              {errors.applicationUrl && <span className="error-text">{errors.applicationUrl}</span>}
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">Eligibility Requirements *</label>
              <input
                type="text"
                name="eligibility"
                className={`form-input ${errors.eligibility ? 'input-error' : ''}`}
                placeholder="e.g. B.Tech 2026/2027 batch, open to all colleges, teams of 2-4"
                value={formData.eligibility}
                onChange={handleChange}
              />
              {errors.eligibility && <span className="error-text">{errors.eligibility}</span>}
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">Description &amp; Guidelines *</label>
              <textarea
                name="description"
                rows={3}
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                placeholder="Detail the opportunity structure, challenge statements, rounds, or responsibilities..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">Skills / Tags (comma-separated)</label>
              <input
                type="text"
                name="skills"
                className="form-input"
                placeholder="react, python, machine-learning, system-design"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

