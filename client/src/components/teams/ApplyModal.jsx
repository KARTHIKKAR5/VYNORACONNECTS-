import React, { useState } from 'react';
import { validateJoinRequestForm } from '../../services/projectsService.js';
import { pointsServiceAdapter } from '../../services/pointsServiceAdapter.js';

export function ApplyModal({ project, initialRoleId = '', onClose, onSubmit }) {
  const openRoles = (project.openRoles || []).filter(
    r => r.status === 'open' && (r.openings - (r.filled || 0)) > 0
  );

  const [formData, setFormData] = useState({
    roleId: initialRoleId || (openRoles[0]?.id || ''),
    introduction: '',
    relevantSkills: 'React, Node.js, Git',
    experienceSummary: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRole = project.openRoles?.find(r => r.id === formData.roleId);

  // Evaluate candidate skills against role requirements transparently
  const candidateSkillsList = (formData.relevantSkills || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const evaluation = selectedRole
    ? pointsServiceAdapter.evaluateCandidateEligibility(
        selectedRole.skillsRequired || [],
        candidateSkillsList
      )
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validation = validateJoinRequestForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(project.id, formData);
      onClose();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Failed to submit application.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="apply-modal-title">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="category-badge">{project.category}</span>
            <h2 className="modal-title" id="apply-modal-title">Apply to Join Project</h2>
            <p className="modal-subtitle">Project: <strong>{project.title}</strong></p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {errors.general && (
            <div className="error-banner" role="alert">
              {errors.general}
            </div>
          )}

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label" htmlFor="role-select">
              Select Position to Apply For <span className="required-star">*</span>
            </label>
            <select
              id="role-select"
              className={`form-control ${errors.roleId ? 'is-invalid' : ''}`}
              value={formData.roleId}
              onChange={e => setFormData({ ...formData, roleId: e.target.value })}
            >
              <option value="">-- Choose an open role --</option>
              {openRoles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.openings - (r.filled || 0)} opening remaining)
                </option>
              ))}
            </select>
            {errors.roleId && <span className="form-error">{errors.roleId}</span>}
          </div>

          {/* Skill Matching Transparency Preview */}
          {selectedRole && evaluation && (
            <div className="evaluation-preview-box">
              <div className="evaluation-header">
                <span className="eval-title">Skill Alignment Preview</span>
                <span className="eval-status">
                  {evaluation.matchingSkills.length} / {selectedRole.skillsRequired?.length || 0} required skills matched
                </span>
              </div>
              <div className="matching-tags-row">
                {selectedRole.skillsRequired?.map((reqSkill, idx) => {
                  const isMatched = evaluation.matchingSkills.some(m => m.toLowerCase() === reqSkill.toLowerCase());
                  return (
                    <span key={idx} className={`eval-pill ${isMatched ? 'matched' : 'unmatched'}`}>
                      {isMatched ? '✓' : '○'} {reqSkill}
                    </span>
                  );
                })}
              </div>
              <p className="eval-note">
                Vynora Points integration: Candidate suitability is evaluated primarily through verified technical skills and project alignment.
              </p>
            </div>
          )}

          {/* Relevant Skills */}
          <div className="form-group">
            <label className="form-label" htmlFor="skills-input">
              Your Relevant Skills (comma-separated)
            </label>
            <input
              id="skills-input"
              type="text"
              className="form-control"
              placeholder="e.g. React, Node.js, Python, Tailwind"
              value={formData.relevantSkills}
              onChange={e => setFormData({ ...formData, relevantSkills: e.target.value })}
            />
          </div>

          {/* Introduction / Pitch */}
          <div className="form-group">
            <label className="form-label" htmlFor="intro-input">
              Introduction &amp; Why You Want to Join <span className="required-star">*</span>
            </label>
            <textarea
              id="intro-input"
              className={`form-control ${errors.introduction ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="Introduce yourself, your background, and why this project excites you (min 20 characters)..."
              value={formData.introduction}
              onChange={e => setFormData({ ...formData, introduction: e.target.value })}
              maxLength={1000}
            />
            {errors.introduction && <span className="form-error">{errors.introduction}</span>}
          </div>

          {/* Experience Summary */}
          <div className="form-group">
            <label className="form-label" htmlFor="exp-input">
              Relevant Project or Academic Experience <span className="required-star">*</span>
            </label>
            <textarea
              id="exp-input"
              className={`form-control ${errors.experienceSummary ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="Mention relevant coursework, hackathons, or past projects you've worked on (min 10 characters)..."
              value={formData.experienceSummary}
              onChange={e => setFormData({ ...formData, experienceSummary: e.target.value })}
              maxLength={1000}
            />
            {errors.experienceSummary && <span className="form-error">{errors.experienceSummary}</span>}
          </div>

          {/* Privacy Notice */}
          <div className="privacy-callout">
            <span className="privacy-badge">Privacy Safe</span>
            <p>
              Your verified academic summary (college, department, year, verified skills) will be shared with the Project Lead. Private contact information (email, phone) is never exposed.
            </p>
          </div>

          {/* Footer */}
          <div className="modal-footer">
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
              disabled={isSubmitting || openRoles.length === 0}
            >
              {isSubmitting ? 'Submitting Application...' : 'Send Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyModal;

