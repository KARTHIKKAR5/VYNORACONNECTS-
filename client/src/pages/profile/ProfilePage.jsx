import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Mail,
  Edit3,
  Check,
  X,
  Plus,
  Shield,
  Sparkles,
  BookOpen,
  Code,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Editable Form State
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    college: user?.college || '',
    university: user?.university || '',
    degree: user?.degree || 'B.Tech',
    branch: user?.branch || '',
    academicYear: user?.academicYear || 'Third Year',
    graduationYear: user?.graduationYear || 2026,
    city: user?.city || '',
    state: user?.state || '',
    bio: user?.bio || '',
    portfolioUrl: user?.portfolioUrl || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    profileVisibility: user?.profileVisibility || 'students_only',
  });

  const [skillsList, setSkillsList] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [interestsList, setInterestsList] = useState(user?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    const checks = [
      Boolean(user?.firstName),
      Boolean(user?.college),
      Boolean(user?.branch),
      Boolean(user?.bio && user.bio.length > 20),
      Boolean(user?.skills && user.skills.length > 0),
      Boolean(user?.interests && user.interests.length > 0),
      Boolean(user?.githubUrl || user?.portfolioUrl || user?.linkedinUrl),
      Boolean(user?.city),
    ];
    checks.forEach((c) => {
      if (c) score += 12.5;
    });
    return Math.round(score);
  };

  const completionPct = calculateCompletion();

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmed = newSkill.trim();
      if (trimmed && !skillsList.includes(trimmed)) {
        setSkillsList([...skillsList, trimmed]);
        setNewSkill('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmed = newInterest.trim();
      if (trimmed && !interestsList.includes(trimmed)) {
        setInterestsList([...interestsList, trimmed]);
        setNewInterest('');
      }
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setInterestsList(interestsList.filter((i) => i !== interestToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...editForm,
        skills: skillsList,
        interests: interestsList,
      };
      const res = await authService.updateMe(payload);
      if (res?.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser(payload);
      }
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.displayName || `${user?.firstName || 'Student'} ${user?.lastName || ''}`.trim();
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="profile-page-wrapper">
      {/* Profile Header Banner Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-cover" />
        <div className="profile-hero-body">
          <div className="profile-hero-avatar-row">
            <div className="profile-avatar-large">
              {user?.profileImage || user?.avatar ? (
                <img
                  src={user.profileImage || user.avatar}
                  alt={displayName}
                  className="profile-avatar-img"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="profile-hero-actions">
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsEditing(true)}
                  id="edit-profile-btn"
                >
                  <Edit3 size={15} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={15} />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          <div className="profile-title-block">
            <div className="profile-name-row">
              <h1 className="profile-display-name">{displayName}</h1>
              <span className="profile-role-pill">
                <Sparkles size={12} />
                <span>Verified Student</span>
              </span>
            </div>

            <p className="profile-headline">
              {user?.degree || 'B.Tech'} in {user?.branch || 'Computer Science & Engineering'} &bull;{' '}
              {user?.college || 'Institution'}
            </p>

            <div className="profile-meta-chips">
              <span className="profile-meta-chip">
                <GraduationCap size={14} />
                <span>{user?.academicYear || 'Undergraduate'} &bull; Class of {user?.graduationYear || 2026}</span>
              </span>

              {(user?.city || user?.state) && (
                <span className="profile-meta-chip">
                  <MapPin size={14} />
                  <span>{[user?.city, user?.state].filter(Boolean).join(', ')}</span>
                </span>
              )}

              <span className="profile-meta-chip">
                <Mail size={14} />
                <span>{user?.email}</span>
              </span>

              <span className="profile-meta-chip">
                <Shield size={14} />
                <span>Visibility: {user?.profileVisibility ? user.profileVisibility.replace('_', ' ') : 'students only'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="profile-alert-success">
          <Check size={16} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Completion Meter */}
      <div className="profile-completion-card">
        <div className="completion-card-header">
          <div className="completion-title">
            <Award size={18} />
            <span>Profile Strength: <strong>{completionPct}%</strong></span>
          </div>
          <span className="completion-subtitle">
            {completionPct === 100 ? 'All profile sections completed!' : 'Complete your bio, skills and links to boost peer visibility.'}
          </span>
        </div>
        <div className="completion-bar-track">
          <div
            className="completion-bar-fill"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Edit Form Modal/Drawer OR Main Profile Details */}
      {isEditing ? (
        <div className="profile-edit-card">
          <div className="edit-card-header">
            <h2>Edit Your Student Profile</h2>
            <p>Update your academic information, bio, skills, and portfolio links.</p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSaveProfile} className="profile-edit-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  value={editForm.firstName}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  value={editForm.lastName}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">College / Institute Name</label>
              <input
                type="text"
                name="college"
                className="form-input"
                value={editForm.college}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Degree</label>
                <input
                  type="text"
                  name="degree"
                  className="form-input"
                  value={editForm.degree}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Branch / Department</label>
                <input
                  type="text"
                  name="branch"
                  className="form-input"
                  value={editForm.branch}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <select
                  name="academicYear"
                  className="form-input"
                  value={editForm.academicYear}
                  onChange={handleEditChange}
                >
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  className="form-input"
                  value={editForm.graduationYear}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={editForm.city}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  value={editForm.state}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / About Me</label>
              <textarea
                name="bio"
                className="form-input"
                rows={4}
                value={editForm.bio}
                onChange={handleEditChange}
                placeholder="Share your interests, recent projects, hackathon goals, or what you want to collaborate on..."
              />
            </div>

            {/* Skills Editor */}
            <div className="form-group">
              <label className="form-label">Technical Skills</label>
              <div className="inline-add-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add skill (e.g. Next.js, PyTorch)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
                <button type="button" className="btn btn-outline" onClick={handleAddSkill}>
                  <Plus size={16} />
                </button>
              </div>
              <div className="chip-cloud" style={{ marginTop: '8px' }}>
                {skillsList.map((skill) => (
                  <span key={skill} className="skill-chip">
                    <span>{skill}</span>
                    <X size={12} onClick={() => handleRemoveSkill(skill)} style={{ cursor: 'pointer' }} />
                  </span>
                ))}
              </div>
            </div>

            {/* Interests Editor */}
            <div className="form-group">
              <label className="form-label">Areas of Interest</label>
              <div className="inline-add-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add interest (e.g. Open Source, Web3)..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={handleAddInterest}
                />
                <button type="button" className="btn btn-outline" onClick={handleAddInterest}>
                  <Plus size={16} />
                </button>
              </div>
              <div className="chip-cloud" style={{ marginTop: '8px' }}>
                {interestsList.map((interest) => (
                  <span key={interest} className="interest-chip selected">
                    <span>{interest}</span>
                    <X size={12} onClick={() => handleRemoveInterest(interest)} style={{ cursor: 'pointer' }} />
                  </span>
                ))}
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                className="form-input"
                placeholder="https://github.com/..."
                value={editForm.githubUrl}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                className="form-input"
                placeholder="https://linkedin.com/in/..."
                value={editForm.linkedinUrl}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Portfolio URL</label>
              <input
                type="url"
                name="portfolioUrl"
                className="form-input"
                placeholder="https://yourwebsite.com"
                value={editForm.portfolioUrl}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Privacy</label>
              <select
                name="profileVisibility"
                className="form-input"
                value={editForm.profileVisibility}
                onChange={handleEditChange}
              >
                <option value="students_only">Verified Students Only (Recommended)</option>
                <option value="public">Public (Anyone with link)</option>
                <option value="connections_only">Connections Only</option>
              </select>
            </div>

            <div className="edit-form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                id="save-profile-btn"
              >
                {saving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Read-only Profile Sections Grid */
        <div className="profile-content-grid">
          {/* Left Column: About & Skills */}
          <div className="profile-main-column">
            {/* About Card */}
            <div className="profile-section-card">
              <div className="section-card-title">
                <User size={18} />
                <span>About</span>
              </div>
              <p className="profile-bio-text">
                {user?.bio || (
                  <span className="text-muted">
                    No bio added yet. Click &ldquo;Edit Profile&rdquo; to introduce yourself to peers.
                  </span>
                )}
              </p>
            </div>

            {/* Skills & Technologies */}
            <div className="profile-section-card">
              <div className="section-card-title">
                <Code size={18} />
                <span>Skills &amp; Technologies</span>
              </div>
              {user?.skills && user.skills.length > 0 ? (
                <div className="chip-cloud">
                  {user.skills.map((skill) => (
                    <span key={skill} className="skill-chip">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No skills listed yet.</p>
              )}
            </div>

            {/* Interests & Topics */}
            <div className="profile-section-card">
              <div className="section-card-title">
                <Sparkles size={18} />
                <span>Areas of Interest</span>
              </div>
              {user?.interests && user.interests.length > 0 ? (
                <div className="chip-cloud">
                  {user.interests.map((interest) => (
                    <span key={interest} className="interest-chip selected">{interest}</span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No interests listed yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: Links & Metadata */}
          <div className="profile-side-column">
            {/* Portfolio & Socials */}
            <div className="profile-section-card">
              <div className="section-card-title">
                <Globe size={18} />
                <span>Connected Profiles</span>
              </div>
              <div className="profile-links-list">
                {user?.githubUrl ? (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link-item"
                  >
                    <Github size={16} />
                    <span>GitHub Profile</span>
                  </a>
                ) : null}

                {user?.linkedinUrl ? (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link-item"
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn Profile</span>
                  </a>
                ) : null}

                {user?.portfolioUrl ? (
                  <a
                    href={user.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link-item"
                  >
                    <Globe size={16} />
                    <span>Personal Portfolio</span>
                  </a>
                ) : null}

                {!user?.githubUrl && !user?.linkedinUrl && !user?.portfolioUrl && (
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    No external links provided.
                  </p>
                )}
              </div>
            </div>

            {/* Education Summary */}
            <div className="profile-section-card">
              <div className="section-card-title">
                <BookOpen size={18} />
                <span>Academic Overview</span>
              </div>
              <div className="profile-edu-details">
                <div className="edu-detail-row">
                  <span className="edu-label">Institution:</span>
                  <span className="edu-val">{user?.college || 'N/A'}</span>
                </div>
                <div className="edu-detail-row">
                  <span className="edu-label">Degree:</span>
                  <span className="edu-val">{user?.degree || 'B.Tech'}</span>
                </div>
                <div className="edu-detail-row">
                  <span className="edu-label">Department:</span>
                  <span className="edu-val">{user?.branch || user?.department || 'CSE'}</span>
                </div>
                <div className="edu-detail-row">
                  <span className="edu-label">Academic Year:</span>
                  <span className="edu-val">{user?.academicYear || 'Third Year'}</span>
                </div>
                <div className="edu-detail-row">
                  <span className="edu-label">Graduation:</span>
                  <span className="edu-val">Class of {user?.graduationYear || 2026}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
