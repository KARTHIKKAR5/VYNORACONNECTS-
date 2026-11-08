import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  createResource,
} from '../../services/resourcesService.js';

export function CreateResourceModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    type: 'notes',
    sourceUrl: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFeedback, setServerFeedback] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerFeedback(null);
    setIsSubmitting(true);

    try {
      const result = await createResource(formData);
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
          message: err.message || 'Failed to submit resource. Please verify fields and try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">Share a Learning Resource</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            id="btn-close-resource-modal"
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
                      (Notice: Backend MongoDB server is offline in Week 1. Resource is saved in session memory.)
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="res-title" className="form-label">
                Resource Title
                <span className="form-label-required">*</span>
              </label>
              <input
                type="text"
                id="res-title"
                name="title"
                className={`form-control ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g., Complete Dynamic Programming Visual Notes"
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
                <label htmlFor="res-category" className="form-label">
                  Category
                  <span className="form-label-required">*</span>
                </label>
                <select
                  id="res-category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {RESOURCE_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="res-type" className="form-label">
                  Resource Type
                  <span className="form-label-required">*</span>
                </label>
                <select
                  id="res-type"
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {RESOURCE_TYPES.filter((t) => t.value !== 'all').map((t) => (
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

            <div className="form-group">
              <label htmlFor="res-source" className="form-label">
                Source or Repository URL
                <span className="form-label-required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  id="res-source"
                  name="sourceUrl"
                  className={`form-control ${errors.sourceUrl ? 'input-error' : ''}`}
                  placeholder="https://github.com/... or https://..."
                  value={formData.sourceUrl}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ paddingLeft: '36px' }}
                />
                <LinkIcon
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}
                />
              </div>
              {errors.sourceUrl ? (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.sourceUrl}</span>
                </div>
              ) : (
                <div className="form-help-text">Only secure URLs (http:// or https://) are accepted.</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="res-tags" className="form-label">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="res-tags"
                name="tags"
                className="form-control"
                placeholder="dsa, algorithms, python, notes"
                value={formData.tags}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="form-help-text">Add up to 8 keywords to help peers find this resource.</div>
            </div>

            <div className="form-group">
              <label htmlFor="res-description" className="form-label">
                Description & Notes
                <span className="form-label-required">*</span>
              </label>
              <textarea
                id="res-description"
                name="description"
                rows={4}
                className={`form-control ${errors.description ? 'input-error' : ''}`}
                placeholder="Describe what this resource covers, who it is for, and why students will find it useful..."
                value={formData.description}
                onChange={handleChange}
                maxLength={2000}
                disabled={isSubmitting}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.description ? (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.description}</span>
                  </div>
                ) : <span />}
                <span className="form-help-text">{formData.description.length}/2000</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              id="btn-cancel-resource-modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="btn-submit-resource"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Publish Resource'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
