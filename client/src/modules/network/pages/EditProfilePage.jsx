import React, { useState } from 'react';
import useStudentProfile from '../hooks/useStudentProfile.js';
import {
  ALLOWED_BRANCHES,
  ALLOWED_STUDY_YEARS,
  PROFILE_LIMITS,
  COMMON_SKILLS,
  COMMON_INTERESTS,
  validateProfileInput,
} from '../schemas/profileSchema.js';
import SkillTag from '../components/SkillTag.jsx';
import { Save, X, ArrowLeft, Plus, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export function EditProfilePage({
  onCancel = () => {},
  onSaveSuccess = () => {},
}) {
  const { profile, loading, saving, error: fetchError, updateProfile } = useStudentProfile('me');

  const [formData, setFormData] = useState(null);
  const [initialJson, setInitialJson] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);

  // Initialize form state when profile is loaded
  React.useEffect(() => {
    if (profile && !formData) {
      const initial = {
        branch: profile.branch || '',
        studyYear: profile.studyYear || 1,
        bio: profile.bio || '',
        skills: [...(profile.skills || [])],
        interests: [...(profile.interests || [])],
        links: {
          github: profile.links?.github || '',
          linkedin: profile.links?.linkedin || '',
          website: profile.links?.website || '',
        },
      };
      setFormData(initial);
      setInitialJson(JSON.stringify(initial));
    }
  }, [profile, formData]);

  if (loading || !formData) {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '24px 0' }}>
        <div className="card skeleton" style={{ height: '380px', borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  const isDirty = JSON.stringify(formData) !== initialJson;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleLinkChange = (linkKey, value) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [linkKey]: value },
    }));
    if (fieldErrors[linkKey]) {
      setFieldErrors((prev) => ({ ...prev, [linkKey]: null }));
    }
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (!trimmed) return;
    if (formData.skills.includes(trimmed)) return;
    if (formData.skills.length >= PROFILE_LIMITS.SKILL_MAX_COUNT) {
      setFieldErrors((prev) => ({
        ...prev,
        skills: `Maximum ${PROFILE_LIMITS.SKILL_MAX_COUNT} skills allowed.`,
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddInterest = (interestToAdd) => {
    const trimmed = (interestToAdd || newInterest).trim();
    if (!trimmed) return;
    if (formData.interests.includes(trimmed)) return;
    if (formData.interests.length >= PROFILE_LIMITS.INTEREST_MAX_COUNT) {
      setFieldErrors((prev) => ({
        ...prev,
        interests: `Maximum ${PROFILE_LIMITS.INTEREST_MAX_COUNT} interests allowed.`,
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, interests: [...prev.interests, trimmed] }));
    setNewInterest('');
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interestToRemove),
    }));
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowUnsavedPrompt(true);
    } else {
      onCancel();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateProfileInput(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    try {
      await updateProfile(formData);
      onSaveSuccess();
    } catch (err) {
      setSubmitError(err.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ gap: '6px', color: 'var(--text-secondary)' }}
          onClick={handleCancelClick}
        >
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          Edit Profile
        </h1>
        <div style={{ width: '80px' }} />
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedPrompt && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            className="modal-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '420px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-warning)', marginBottom: '12px' }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Discard Unsaved Changes?</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              You have modified your profile information. Exiting now will discard your changes.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowUnsavedPrompt(false)}
              >
                Keep Editing
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onCancel}
              >
                Discard &amp; Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {submitError && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-danger-bg)',
              border: '1px solid var(--accent-danger)',
              color: 'var(--accent-danger)',
              fontSize: '0.875rem',
              marginBottom: '20px',
            }}
          >
            {submitError}
          </div>
        )}

        {/* Section 1: Academic Information */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Academic Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* College (Read-only / verified) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                College (Verified Identity)
              </label>
              <input
                type="text"
                className="form-input"
                value={profile.college || ''}
                disabled
                style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                title="College identity is linked to your verified student account."
              />
            </div>

            {/* Branch / Department */}
            <div>
              <label
                htmlFor="edit-branch"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}
              >
                Branch / Department <span style={{ color: 'var(--accent-danger)' }}>*</span>
              </label>
              <select
                id="edit-branch"
                className="form-select"
                value={formData.branch}
                onChange={(e) => handleFieldChange('branch', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Select Department</option>
                {ALLOWED_BRANCHES.filter((b) => b !== 'All Branches').map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
              {fieldErrors.branch && (
                <span style={{ display: 'block', color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '4px' }}>
                  {fieldErrors.branch}
                </span>
              )}
            </div>

            {/* Study Year */}
            <div>
              <label
                htmlFor="edit-year"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}
              >
                Study Year <span style={{ color: 'var(--accent-danger)' }}>*</span>
              </label>
              <select
                id="edit-year"
                className="form-select"
                value={formData.studyYear}
                onChange={(e) => handleFieldChange('studyYear', Number(e.target.value))}
                style={{ width: '100%' }}
              >
                {ALLOWED_STUDY_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                    {y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Bio */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label
              htmlFor="edit-bio"
              style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}
            >
              Short Bio
            </label>
            <span
              style={{
                fontSize: '0.75rem',
                color:
                  formData.bio.length > PROFILE_LIMITS.BIO_MAX_LENGTH
                    ? 'var(--accent-danger)'
                    : 'var(--text-muted)',
              }}
            >
              {formData.bio.length} / {PROFILE_LIMITS.BIO_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="edit-bio"
            className="form-textarea"
            rows={4}
            value={formData.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            placeholder="Tell other students what you build, what you are learning, or what hackathons/projects you want to collaborate on..."
            style={{ width: '100%', resize: 'vertical' }}
            maxLength={PROFILE_LIMITS.BIO_MAX_LENGTH}
          />
          {fieldErrors.bio && (
            <span style={{ display: 'block', color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '4px' }}>
              {fieldErrors.bio}
            </span>
          )}
        </div>

        {/* Section 3: Skills */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Technical Skills ({formData.skills.length}/{PROFILE_LIMITS.SKILL_MAX_COUNT})
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              className="form-input"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill (e.g. Docker, Next.js, GraphQL)..."
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleAddSkill()}
              disabled={!newSkill.trim()}
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>

          {/* Current Skills Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {formData.skills.map((skill) => (
              <SkillTag
                key={skill}
                skill={skill}
                onRemove={() => handleRemoveSkill(skill)}
              />
            ))}
          </div>

          {/* Suggested Common Skills */}
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Suggested:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {COMMON_SKILLS.filter((s) => !formData.skills.includes(s))
              .slice(0, 8)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  + {s}
                </button>
              ))}
          </div>
          {fieldErrors.skills && (
            <span style={{ display: 'block', color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '6px' }}>
              {fieldErrors.skills}
            </span>
          )}
        </div>

        {/* Section 4: Interests */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Interests ({formData.interests.length}/{PROFILE_LIMITS.INTEREST_MAX_COUNT})
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              className="form-input"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest (e.g. Open Source, AI)..."
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleAddInterest()}
              disabled={!newInterest.trim()}
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.interests.map((interest) => (
              <span
                key={interest}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          {fieldErrors.interests && (
            <span style={{ display: 'block', color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '6px' }}>
              {fieldErrors.interests}
            </span>
          )}
        </div>

        {/* Section 5: Portfolio Links */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Portfolio &amp; External Profiles
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label
                htmlFor="edit-github"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}
              >
                GitHub Profile URL
              </label>
              <input
                id="edit-github"
                type="url"
                className="form-input"
                value={formData.links.github}
                onChange={(e) => handleLinkChange('github', e.target.value)}
                placeholder="https://github.com/username"
                style={{ width: '100%' }}
              />
              {fieldErrors.github && (
                <span style={{ display: 'block', color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '4px' }}>
                  {fieldErrors.github}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-linkedin"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}
              >
                LinkedIn Profile URL
              </label>
              <input
                id="edit-linkedin"
                type="url"
                className="form-input"
                value={formData.links.linkedin}
                onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                style={{ width: '100%' }}
              />
              {fieldErrors.linkedin && (
                <span style={{ display: 'block', color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '4px' }}>
                  {fieldErrors.linkedin}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-website"
                style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}
              >
                Personal Website / Portfolio URL
              </label>
              <input
                id="edit-website"
                type="url"
                className="form-input"
                value={formData.links.website}
                onChange={(e) => handleLinkChange('website', e.target.value)}
                placeholder="https://yourportfolio.dev"
                style={{ width: '100%' }}
              />
              {fieldErrors.website && (
                <span style={{ display: 'block', color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '4px' }}>
                  {fieldErrors.website}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancelClick}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !isDirty}
            style={{ minWidth: '130px' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;

