import React, { useState } from 'react';
import { MARKETPLACE_CATEGORIES } from '../../data/marketplaceData';

export function CreateListingModal({
  onSave,
  onClose,
  initialData = null,
  isEditMode = false
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    description: initialData?.description || '',
    category: initialData?.category || 'DEVELOPMENT',
    pricingModel: initialData?.pricing?.model || 'FIXED',
    amount: initialData?.pricing?.amount !== undefined ? initialData.pricing.amount : 2500,
    currency: initialData?.pricing?.currency || 'INR',
    negotiable: initialData?.pricing?.negotiable || false,
    deliveryValue: initialData?.deliveryTime?.value || 5,
    deliveryUnit: initialData?.deliveryTime?.unit || 'DAYS',
    skills: initialData?.skills ? initialData.skills.join(', ') : '',
    portfolioLabel: initialData?.portfolioLinks?.[0]?.label || '',
    portfolioUrl: initialData?.portfolioLinks?.[0]?.url || ''
  });

  const [errors, setErrors] = useState({});

  const validateUrl = (url) => {
    if (!url || url.trim() === '') return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const errs = {};

    if (!formData.title.trim()) {
      errs.title = 'Title is required.';
    } else if (formData.title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters.';
    } else if (formData.title.trim().length > 100) {
      errs.title = 'Title cannot exceed 100 characters.';
    }

    if (!formData.summary.trim()) {
      errs.summary = 'Short summary is required.';
    } else if (formData.summary.trim().length < 10) {
      errs.summary = 'Summary must be at least 10 characters.';
    }

    if (!formData.description.trim()) {
      errs.description = 'Detailed description is required.';
    } else if (formData.description.trim().length < 30) {
      errs.description = 'Description must be at least 30 characters.';
    }

    if (!formData.category) {
      errs.category = 'Category selection is required.';
    }

    if (formData.pricingModel !== 'NEGOTIABLE') {
      if (formData.amount === '' || formData.amount === null || Number(formData.amount) < 0) {
        errs.amount = 'Valid positive amount is required.';
      }
    }

    if (!formData.deliveryValue || Number(formData.deliveryValue) < 1) {
      errs.deliveryValue = 'Delivery duration must be at least 1 unit.';
    }

    if (formData.portfolioUrl && !validateUrl(formData.portfolioUrl)) {
      errs.portfolioUrl = 'Enter a valid URL (http:// or https://).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (publishNow = false) => {
    if (!validateForm()) return;

    const parsedSkills = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Student Service'];

    const portfolioLinks = [];
    if (formData.portfolioUrl.trim()) {
      portfolioLinks.push({
        label: formData.portfolioLabel.trim() || 'Work Sample',
        url: formData.portfolioUrl.trim()
      });
    }

    const payload = {
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      description: formData.description.trim(),
      category: formData.category,
      tags: parsedSkills.slice(0, 5),
      pricing: {
        model: formData.pricingModel,
        amount: formData.pricingModel === 'NEGOTIABLE' ? 0 : Number(formData.amount),
        currency: formData.currency,
        negotiable: formData.negotiable
      },
      deliveryTime: {
        value: Number(formData.deliveryValue),
        unit: formData.deliveryUnit
      },
      skills: parsedSkills,
      portfolioLinks,
      publishNow
    };

    onSave(payload, isEditMode ? initialData.id : null);
  };

  return (
    <div className="mono-modal-backdrop" onClick={onClose}>
      <div className="mono-modal mono-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mono-modal-header">
          <div>
            <span className="mono-badge mono-badge-subtle">
              {isEditMode ? 'EDIT LISTING' : 'NEW LISTING'}
            </span>
            <h2 className="mono-modal-title">
              {isEditMode ? 'Update Service Listing' : 'Offer a Campus Service'}
            </h2>
          </div>
          <button className="mono-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="mono-form">
          <div className="mono-modal-body">
            {/* Section: General Info */}
            <div className="mono-form-section">
              <h4 className="mono-section-heading">1. General Information</h4>

              <div className="mono-form-group">
                <label className="mono-label">Listing Title *</label>
                <input
                  type="text"
                  name="title"
                  className={`mono-input ${errors.title ? 'mono-input-error' : ''}`}
                  placeholder="e.g. Full-Stack Web Development for Campus Projects"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <span className="mono-field-error">{errors.title}</span>}
              </div>

              <div className="mono-form-grid-2">
                <div className="mono-form-group">
                  <label className="mono-label">Category *</label>
                  <select
                    name="category"
                    className="mono-select full-width"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {MARKETPLACE_CATEGORIES.filter(c => c.id !== 'ALL').map(c => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mono-form-group">
                  <label className="mono-label">Short Summary *</label>
                  <input
                    type="text"
                    name="summary"
                    className={`mono-input ${errors.summary ? 'mono-input-error' : ''}`}
                    placeholder="Brief 1-sentence overview for catalog cards"
                    value={formData.summary}
                    onChange={handleChange}
                  />
                  {errors.summary && <span className="mono-field-error">{errors.summary}</span>}
                </div>
              </div>

              <div className="mono-form-group">
                <label className="mono-label">Detailed Description * (min 30 characters)</label>
                <textarea
                  name="description"
                  rows="4"
                  className={`mono-textarea ${errors.description ? 'mono-input-error' : ''}`}
                  placeholder="Detail what you provide, requirements from the client, tools used, and deliverables..."
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <span className="mono-field-error">{errors.description}</span>}
              </div>
            </div>

            {/* Section: Pricing & Delivery */}
            <div className="mono-form-section">
              <h4 className="mono-section-heading">2. Pricing & Delivery Estimate</h4>

              <div className="mono-form-grid-3">
                <div className="mono-form-group">
                  <label className="mono-label">Pricing Model *</label>
                  <select
                    name="pricingModel"
                    className="mono-select full-width"
                    value={formData.pricingModel}
                    onChange={handleChange}
                  >
                    <option value="FIXED">Fixed Price</option>
                    <option value="HOURLY">Hourly Rate</option>
                    <option value="NEGOTIABLE">Negotiable</option>
                  </select>
                </div>

                {formData.pricingModel !== 'NEGOTIABLE' && (
                  <div className="mono-form-group">
                    <label className="mono-label">Amount (₹) *</label>
                    <input
                      type="number"
                      name="amount"
                      min="0"
                      className={`mono-input ${errors.amount ? 'mono-input-error' : ''}`}
                      value={formData.amount}
                      onChange={handleChange}
                    />
                    {errors.amount && <span className="mono-field-error">{errors.amount}</span>}
                  </div>
                )}

                <div className="mono-form-group">
                  <label className="mono-label">Estimated Duration *</label>
                  <div className="mono-duration-row">
                    <input
                      type="number"
                      name="deliveryValue"
                      min="1"
                      className="mono-input duration-input"
                      value={formData.deliveryValue}
                      onChange={handleChange}
                    />
                    <select
                      name="deliveryUnit"
                      className="mono-select"
                      value={formData.deliveryUnit}
                      onChange={handleChange}
                    >
                      <option value="DAYS">Days</option>
                      <option value="WEEKS">Weeks</option>
                      <option value="MONTHS">Months</option>
                    </select>
                  </div>
                  {errors.deliveryValue && <span className="mono-field-error">{errors.deliveryValue}</span>}
                </div>
              </div>

              <div className="mono-checkbox-row">
                <label className="mono-checkbox-label">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                  />
                  <span>Open to budget negotiation with peers</span>
                </label>
              </div>
            </div>

            {/* Section: Skills & Portfolio */}
            <div className="mono-form-section">
              <h4 className="mono-section-heading">3. Skills & Proof of Work</h4>

              <div className="mono-form-group">
                <label className="mono-label">Skills & Technologies (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="mono-input"
                  placeholder="e.g. React, Node.js, Express, MongoDB, Figma"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="mono-form-grid-2">
                <div className="mono-form-group">
                  <label className="mono-label">Portfolio Link Label</label>
                  <input
                    type="text"
                    name="portfolioLabel"
                    className="mono-input"
                    placeholder="e.g. GitHub Repo / Behance / Demo"
                    value={formData.portfolioLabel}
                    onChange={handleChange}
                  />
                </div>

                <div className="mono-form-group">
                  <label className="mono-label">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    className={`mono-input ${errors.portfolioUrl ? 'mono-input-error' : ''}`}
                    placeholder="https://..."
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                  />
                  {errors.portfolioUrl && <span className="mono-field-error">{errors.portfolioUrl}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="mono-modal-footer">
            <button type="button" className="mono-btn mono-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="mono-btn mono-btn-outline"
              onClick={() => handleSubmit(false)}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="mono-btn mono-btn-primary"
              onClick={() => handleSubmit(true)}
            >
              {isEditMode ? 'Save & Publish' : 'Publish Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListingModal;
