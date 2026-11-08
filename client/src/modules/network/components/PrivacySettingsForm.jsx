import React, { useState } from 'react';
import { Lock, Eye, Check, AlertCircle } from 'lucide-react';

export function PrivacySettingsForm({
  initialVisibility = { profile: 'students', showProjects: true, showLinks: true },
  onSave = () => {},
  isSaving = false,
}) {
  const [visibility, setVisibility] = useState(initialVisibility);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setVisibility((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(visibility);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Lock size={18} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
          Profile Privacy &amp; Visibility Preferences
        </h3>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Control who can discover your student profile across colleges and what details are visible.
        Sensitive account data (email, phone, credentials) are strictly protected on the backend.
      </p>

      {/* Profile Visibility Level */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>
          Who can see your profile:
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: visibility.profile === 'students' ? 'var(--accent-glow)' : 'var(--bg-elevated)',
              border: visibility.profile === 'students' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="profileVisibility"
              value="students"
              checked={visibility.profile === 'students'}
              onChange={() => handleChange('profile', 'students')}
              style={{ marginTop: '3px' }}
            />
            <div>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                All College Students (Recommended)
              </strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Visible to registered students across colleges in the Discovery directory.
              </div>
            </div>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: visibility.profile === 'connections' ? 'var(--accent-glow)' : 'var(--bg-elevated)',
              border: visibility.profile === 'connections' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="profileVisibility"
              value="connections"
              checked={visibility.profile === 'connections'}
              onChange={() => handleChange('profile', 'connections')}
              style={{ marginTop: '3px' }}
            />
            <div>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                Connections Only
              </strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Full profile visible only to students whose connection requests you have accepted.
              </div>
            </div>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: visibility.profile === 'private' ? 'var(--accent-glow)' : 'var(--bg-elevated)',
              border: visibility.profile === 'private' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="profileVisibility"
              value="private"
              checked={visibility.profile === 'private'}
              onChange={() => handleChange('profile', 'private')}
              style={{ marginTop: '3px' }}
            />
            <div>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                Private / Hidden
              </strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Hidden from student discovery. Only teammates on your active projects can view.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Field Toggles */}
      <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>
          Specific Field Controls:
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Show portfolio &amp; social links (GitHub, LinkedIn, Website) on public card
            </span>
            <input
              type="checkbox"
              checked={Boolean(visibility.showLinks)}
              onChange={(e) => handleChange('showLinks', e.target.checked)}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Show joined team projects and hackathon affiliations
            </span>
            <input
              type="checkbox"
              checked={Boolean(visibility.showProjects)}
              onChange={(e) => handleChange('showProjects', e.target.checked)}
            />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        {savedSuccess ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-success)', fontSize: '0.85rem' }}>
            <Check size={16} />
            <span>Privacy preferences saved successfully!</span>
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Changes will be enforced server-side.
          </span>
        )}

        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Privacy Preferences'}
        </button>
      </div>
    </form>
  );
}

export default PrivacySettingsForm;

