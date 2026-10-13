import React, { useState } from 'react';

export function PortfolioEditModal({ portfolio, onSave, onClose }) {
  // Form state
  const [formData, setFormData] = useState({
    name: portfolio.name || '',
    title: portfolio.title || '',
    department: portfolio.department || '',
    academicYear: portfolio.academicYear || '',
    college: portfolio.college || '',
    bio: portfolio.bio || '',
    github: portfolio.socialProfiles?.github || '',
    linkedin: portfolio.socialProfiles?.linkedin || '',
    leetcode: portfolio.socialProfiles?.leetcode || '',
    website: portfolio.socialProfiles?.website || '',
    skillsLanguages: portfolio.skills?.languages?.join(', ') || '',
    skillsFrontend: portfolio.skills?.frontend?.join(', ') || '',
    skillsBackend: portfolio.skills?.backend?.join(', ') || '',
    skillsDatabases: portfolio.skills?.databases?.join(', ') || '',
    skillsTools: portfolio.skills?.tools?.join(', ') || ''
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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student Name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Student Name must be at least 2 characters.';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required.';
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College/University name is required.';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Short biography is required.';
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio should be at least 10 characters.';
    }

    // URL validations
    if (formData.github && !validateUrl(formData.github)) {
      newErrors.github = 'Enter a valid URL (starting with http:// or https://)';
    }

    if (formData.linkedin && !validateUrl(formData.linkedin)) {
      newErrors.linkedin = 'Enter a valid LinkedIn URL.';
    }

    if (formData.leetcode && !validateUrl(formData.leetcode)) {
      newErrors.leetcode = 'Enter a valid LeetCode URL.';
    }

    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Enter a valid website URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Format updated data
    const parseCommaList = (str) =>
      str
        ? str
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : [];

    const updatedPortfolio = {
      ...portfolio,
      name: formData.name.trim(),
      title: formData.title.trim(),
      department: formData.department.trim(),
      academicYear: formData.academicYear.trim(),
      college: formData.college.trim(),
      bio: formData.bio.trim(),
      socialProfiles: {
        ...portfolio.socialProfiles,
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
        leetcode: formData.leetcode.trim(),
        website: formData.website.trim()
      },
      skills: {
        languages: parseCommaList(formData.skillsLanguages),
        frontend: parseCommaList(formData.skillsFrontend),
        backend: parseCommaList(formData.skillsBackend),
        databases: parseCommaList(formData.skillsDatabases),
        tools: parseCommaList(formData.skillsTools)
      }
    };

    onSave(updatedPortfolio);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <div>
            <h3>Edit Student Portfolio</h3>
            <p className="modal-subtitle">Update your profile, verified campus affiliations, and technical skills</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-portfolio-form">
          {/* Section: Basic Identity */}
          <div className="form-section-title">
            <span>👤</span> Basic Profile Information
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Surya Prakash"
              />
              {errors.name && <span className="field-error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">Professional Headline / Tagline</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Full-Stack Developer & Systems Enthusiast"
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department *</label>
              <input
                id="department"
                name="department"
                type="text"
                className={`form-input ${errors.department ? 'input-error' : ''}`}
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science & Engineering"
              />
              {errors.department && <span className="field-error-text">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="academicYear">Academic Year</label>
              <input
                id="academicYear"
                name="academicYear"
                type="text"
                className="form-input"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="e.g. 3rd Year (Class of 2026)"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="college">College / University *</label>
              <input
                id="college"
                name="college"
                type="text"
                className={`form-input ${errors.college ? 'input-error' : ''}`}
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Vynora Institute of Technology"
              />
              {errors.college && <span className="field-error-text">{errors.college}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">Biography *</label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              className={`form-textarea ${errors.bio ? 'input-error' : ''}`}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell other students about your interests, technical background, and what you're working on..."
            />
            {errors.bio && <span className="field-error-text">{errors.bio}</span>}
          </div>

          {/* Section: Social Links */}
          <div className="form-section-title">
            <span>🌐</span> External Coding & Social Profiles
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="github">GitHub URL</label>
              <input
                id="github"
                name="github"
                type="url"
                className={`form-input ${errors.github ? 'input-error' : ''}`}
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
              {errors.github && <span className="field-error-text">{errors.github}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="linkedin">LinkedIn URL</label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                className={`form-input ${errors.linkedin ? 'input-error' : ''}`}
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
              {errors.linkedin && <span className="field-error-text">{errors.linkedin}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="leetcode">LeetCode URL</label>
              <input
                id="leetcode"
                name="leetcode"
                type="url"
                className={`form-input ${errors.leetcode ? 'input-error' : ''}`}
                value={formData.leetcode}
                onChange={handleChange}
                placeholder="https://leetcode.com/u/username"
              />
              {errors.leetcode && <span className="field-error-text">{errors.leetcode}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="website">Personal Website / Portfolio URL</label>
              <input
                id="website"
                name="website"
                type="url"
                className={`form-input ${errors.website ? 'input-error' : ''}`}
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
              {errors.website && <span className="field-error-text">{errors.website}</span>}
            </div>
          </div>

          {/* Section: Technical Skills (Comma-separated) */}
          <div className="form-section-title">
            <span>💻</span> Skills (Comma-Separated)
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="skillsLanguages">Programming Languages</label>
              <input
                id="skillsLanguages"
                name="skillsLanguages"
                type="text"
                className="form-input"
                value={formData.skillsLanguages}
                onChange={handleChange}
                placeholder="JavaScript, TypeScript, Python, C++"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skillsFrontend">Frontend Technologies</label>
              <input
                id="skillsFrontend"
                name="skillsFrontend"
                type="text"
                className="form-input"
                value={formData.skillsFrontend}
                onChange={handleChange}
                placeholder="React, Vite, HTML5, CSS3, Tailwind CSS"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skillsBackend">Backend Technologies</label>
              <input
                id="skillsBackend"
                name="skillsBackend"
                type="text"
                className="form-input"
                value={formData.skillsBackend}
                onChange={handleChange}
                placeholder="Node.js, Express, REST APIs, Socket.IO"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skillsDatabases">Databases</label>
              <input
                id="skillsDatabases"
                name="skillsDatabases"
                type="text"
                className="form-input"
                value={formData.skillsDatabases}
                onChange={handleChange}
                placeholder="MongoDB, PostgreSQL, Redis"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PortfolioEditModal;
