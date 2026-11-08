import React, { useState } from 'react';
import { X, BookPlus, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import {
  createResource,
  validateResourceForm,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  ENGINEERING_BRANCHES,
} from '../../services/resourcesService.js';

export function CreateResourceModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    category: 'Study Notes',
    branch: 'CSE',
    type: 'document',
    difficulty: 'beginner',
    description: '',
    sourceUrl: '',
    tags: '',
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

    const validation = validateResourceForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    try {
      const result = await createResource(formData);
      setSuccessMessage(result.message || 'Resource submitted for moderation review!');
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
        setServerError(err.message || 'Failed to submit resource. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookPlus size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="modal-title">Share Learning Material</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {successMessage ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--accent-success)', margin: '0 auto 12px' }} />
            <h3>Resource Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <div className="alert-info" style={{ marginBottom: '18px', padding: '10px 14px' }}>
              <Shield size={16} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem' }}>
                All student-shared resources are reviewed by moderation to ensure quality, accurate topics, and safe external links.
              </span>
            </div>

            {serverError && (
              <div className="error-banner" style={{ marginBottom: '16px', padding: '10px 14px' }}>
                <AlertCircle size={16} className="error-banner-icon" />
                <span style={{ fontSize: '0.85rem' }}>{serverError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Resource Title *</label>
              <input
                type="text"
                name="title"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g. Operating Systems Lecture Notes & Gate Solutions"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div className="form-group">
                <label className="form-label">Subject / Topic *</label>
                <input
                  type="text"
                  name="topic"
                  className={`form-input ${errors.topic ? 'input-error' : ''}`}
                  placeholder="e.g. DBMS, Concurrency, DSA"
                  value={formData.topic}
                  onChange={handleChange}
                />
                {errors.topic && <span className="error-text">{errors.topic}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Engineering Department</label>
                <select
                  name="branch"
                  className="form-select"
                  value={formData.branch}
                  onChange={handleChange}
                >
                  {ENGINEERING_BRANCHES.filter(b => b !== 'All').map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {RESOURCE_CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Format Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {RESOURCE_TYPES.filter(t => t.value !== 'all').map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">Direct Resource Link (URL) *</label>
              <input
                type="url"
                name="sourceUrl"
                className={`form-input ${errors.sourceUrl ? 'input-error' : ''}`}
                placeholder="https://drive.google.com/... or https://github.com/..."
                value={formData.sourceUrl}
                onChange={handleChange}
              />
              {errors.sourceUrl && <span className="error-text">{errors.sourceUrl}</span>}
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">Summary / Notes Description *</label>
              <textarea
                name="description"
                rows={3}
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                placeholder="Briefly describe what this note or roadmap covers and who it will help..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                className="form-input"
                placeholder="dsa, algorithms, gate, cse"
                value={formData.tags}
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

