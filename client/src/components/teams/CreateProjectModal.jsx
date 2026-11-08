import React, { useState } from 'react';
import { PROJECT_CATEGORIES, PROJECT_VISIBILITY, validateProjectForm } from '../../services/projectsService.js';

export function CreateProjectModal({ projectToEdit = null, onClose, onSave }) {
  const isEditing = Boolean(projectToEdit);

  const [formData, setFormData] = useState({
    title: projectToEdit?.title || '',
    tagline: projectToEdit?.tagline || '',
    category: projectToEdit?.category || 'Web Application',
    visibility: projectToEdit?.visibility || 'public',
    problemStatement: projectToEdit?.problemStatement || '',
    goals: projectToEdit?.goals || '',
    summary: projectToEdit?.summary || '',
    description: projectToEdit?.description || '',
    recruitmentRequirements: projectToEdit?.recruitmentRequirements || '',
    tags: projectToEdit?.tags ? projectToEdit.tags.join(', ') : '',
    maxCapacity: projectToEdit?.team?.maxCapacity || 8,
    openRoles: projectToEdit?.openRoles
      ? projectToEdit.openRoles.map(r => ({
          id: r.id,
          title: r.title,
          skillsRequired: Array.isArray(r.skillsRequired) ? r.skillsRequired.join(', ') : r.skillsRequired,
          description: r.description || '',
          openings: r.openings || 1,
        }))
      : [
          {
            title: 'Frontend Developer',
            skillsRequired: 'React, Tailwind, JavaScript',
            description: 'Build user interfaces and client interactions.',
            openings: 1,
          },
        ],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleRoleChange = (index, field, value) => {
    setFormData(prev => {
      const updatedRoles = [...prev.openRoles];
      updatedRoles[index] = { ...updatedRoles[index], [field]: value };
      return { ...prev, openRoles: updatedRoles };
    });
  };

  const addRole = () => {
    setFormData(prev => ({
      ...prev,
      openRoles: [
        ...prev.openRoles,
        {
          title: '',
          skillsRequired: '',
          description: '',
          openings: 1,
        },
      ],
    }));
  };

  const removeRole = (index) => {
    setFormData(prev => ({
      ...prev,
      openRoles: prev.openRoles.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validation = validateProjectForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Failed to save project.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="create-proj-title">
      <div className="modal-container modal-lg">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="create-proj-title">
              {isEditing ? 'Edit Project Details' : 'Create New Project & Form Team'}
            </h2>
            <p className="modal-subtitle">
              Showcase your project, define your mission, and recruit skilled teammates across campuses.
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body form-scrollable">
          {errors.general && (
            <div className="error-banner" role="alert">
              {errors.general}
            </div>
          )}

          {/* Project Title & Tagline */}
          <div className="form-group">
            <label className="form-label" htmlFor="proj-title-input">
              Project Title <span className="required-star">*</span>
            </label>
            <input
              id="proj-title-input"
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. AI-Powered Campus Transit Tracker"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              maxLength={100}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proj-tagline-input">
              Tagline (One-sentence pitch) <span className="required-star">*</span>
            </label>
            <input
              id="proj-tagline-input"
              type="text"
              className={`form-control ${errors.tagline ? 'is-invalid' : ''}`}
              placeholder="e.g. Real-time GPS and occupancy tracking for campus shuttle buses"
              value={formData.tagline}
              onChange={e => handleChange('tagline', e.target.value)}
              maxLength={160}
            />
            {errors.tagline && <span className="form-error">{errors.tagline}</span>}
          </div>

          {/* Category & Visibility */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="proj-cat-select">
                Category <span className="required-star">*</span>
              </label>
              <select
                id="proj-cat-select"
                className="form-control"
                value={formData.category}
                onChange={e => handleChange('category', e.target.value)}
              >
                {PROJECT_CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-vis-select">
                Visibility Controls <span className="required-star">*</span>
              </label>
              <select
                id="proj-vis-select"
                className="form-control"
                value={formData.visibility}
                onChange={e => handleChange('visibility', e.target.value)}
              >
                <option value="public">Public (Visible across all colleges)</option>
                <option value="campus-only">Campus Only (Restricted to your college)</option>
                <option value="private">Private (Team members only)</option>
              </select>
              {errors.visibility && <span className="form-error">{errors.visibility}</span>}
            </div>
          </div>

          {/* Problem Statement & Project Goals */}
          <div className="form-group">
            <label className="form-label" htmlFor="proj-problem-input">
              Problem Statement <span className="required-star">*</span>
            </label>
            <textarea
              id="proj-problem-input"
              className={`form-control ${errors.problemStatement ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="What core problem or gap are you solving? (min 20 chars)"
              value={formData.problemStatement}
              onChange={e => handleChange('problemStatement', e.target.value)}
              maxLength={1000}
            />
            {errors.problemStatement && <span className="form-error">{errors.problemStatement}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proj-goals-input">
              Project Goals <span className="required-star">*</span>
            </label>
            <textarea
              id="proj-goals-input"
              className={`form-control ${errors.goals ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="What are the key milestones and intended outcomes? (min 20 chars)"
              value={formData.goals}
              onChange={e => handleChange('goals', e.target.value)}
              maxLength={1000}
            />
            {errors.goals && <span className="form-error">{errors.goals}</span>}
          </div>

          {/* Summary & Full Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="proj-summary-input">
              Brief Summary <span className="required-star">*</span>
            </label>
            <textarea
              id="proj-summary-input"
              className={`form-control ${errors.summary ? 'is-invalid' : ''}`}
              rows="2"
              placeholder="Short overview for listings and previews (min 20 chars)"
              value={formData.summary}
              onChange={e => handleChange('summary', e.target.value)}
              maxLength={500}
            />
            {errors.summary && <span className="form-error">{errors.summary}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proj-desc-input">
              Detailed Description &amp; Architecture <span className="required-star">*</span>
            </label>
            <textarea
              id="proj-desc-input"
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              rows="4"
              placeholder="In-depth explanation of system design, architecture, and roadmap (min 30 chars)"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              maxLength={3000}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {/* Technology Stack Tags */}
          <div className="form-group">
            <label className="form-label" htmlFor="proj-tags-input">
              Technology Stack (comma-separated tags)
            </label>
            <input
              id="proj-tags-input"
              type="text"
              className="form-control"
              placeholder="e.g. react, nodejs, pytorch, mongodb, figma"
              value={formData.tags}
              onChange={e => handleChange('tags', e.target.value)}
            />
            <span className="form-help">Separate technology keywords with commas.</span>
          </div>

          {/* Recruitment Requirements Text */}
          <div className="form-group">
            <label className="form-label" htmlFor="proj-recruitment-input">
              Recruitment Requirements &amp; Expectations
            </label>
            <textarea
              id="proj-recruitment-input"
              className="form-control"
              rows="2"
              placeholder="Describe collaboration style, weekly time commitment, or learning prerequisites..."
              value={formData.recruitmentRequirements}
              onChange={e => handleChange('recruitmentRequirements', e.target.value)}
              maxLength={1000}
            />
          </div>

          {/* Open Positions Builder */}
          <div className="form-section-box">
            <div className="section-header-row">
              <div>
                <h4 className="section-box-title">Available Team Positions</h4>
                <p className="section-box-subtitle">
                  Define roles you are recruiting for. Projects with 0 open positions will be marked as fully staffed.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addRole}
              >
                + Add Position
              </button>
            </div>

            {formData.openRoles.map((role, idx) => (
              <div key={idx} className="role-builder-card">
                <div className="role-builder-header">
                  <span className="role-num-badge">Role #{idx + 1}</span>
                  {formData.openRoles.length > 1 && (
                    <button
                      type="button"
                      className="btn-text-danger"
                      onClick={() => removeRole(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Role Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ML Engineer, UI Designer"
                      value={role.title}
                      onChange={e => handleRoleChange(idx, 'title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Available Openings</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="5"
                      value={role.openings}
                      onChange={e => handleRoleChange(idx, 'openings', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Python, PyTorch, Docker"
                    value={role.skillsRequired}
                    onChange={e => handleRoleChange(idx, 'skillsRequired', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role Expectations / Brief Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brief description of responsibilities..."
                    value={role.description}
                    onChange={e => handleRoleChange(idx, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Modal Footer Buttons */}
          <div className="modal-footer modal-footer-pinned">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Project...' : isEditing ? 'Save Changes' : 'Publish Project & Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;

