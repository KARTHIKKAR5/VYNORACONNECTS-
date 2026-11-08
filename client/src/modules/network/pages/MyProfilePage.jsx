import React, { useState } from 'react';
import useStudentProfile from '../hooks/useStudentProfile.js';
import ProfileHeader from '../components/ProfileHeader.jsx';
import SkillTag from '../components/SkillTag.jsx';
import PrivacySettingsForm from '../components/PrivacySettingsForm.jsx';
import { User, Shield, CheckCircle, Circle, Edit3, Sparkles, BookOpen, Layers } from 'lucide-react';

export function MyProfilePage({
  onEditClick = () => {},
  initialTab = 'overview', // 'overview' | 'privacy'
}) {
  const { profile, loading, saving, error, updateProfile } = useStudentProfile('me');
  const [subTab, setSubTab] = useState(initialTab);

  if (loading) {
    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '24px 0' }}>
        <div className="card skeleton" style={{ height: '180px', borderRadius: 'var(--radius-xl)', marginBottom: '20px' }} />
        <div className="card skeleton" style={{ height: '240px', borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-danger)' }}>{error || 'Unable to load your profile.'}</p>
      </div>
    );
  }

  // Transparent completeness checklist based on actual available fields
  const checklist = [
    { label: 'College & department specified', done: Boolean(profile.college && profile.branch) },
    { label: 'Academic study year selected', done: Boolean(profile.studyYear) },
    { label: 'Personal bio added (300 char max)', done: Boolean(profile.bio && profile.bio.trim().length > 10) },
    { label: 'At least 3 technical skills listed', done: Boolean(profile.skills && profile.skills.length >= 3) },
    { label: 'At least 2 interests listed', done: Boolean(profile.interests && profile.interests.length >= 2) },
    { label: 'At least 1 external portfolio link', done: Boolean(profile.links && (profile.links.github || profile.links.linkedin || profile.links.website)) },
  ];

  const completedCount = checklist.filter((item) => item.done).length;

  const handleSavePrivacy = async (visibility) => {
    await updateProfile({ ...profile, visibility });
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Profile Header */}
      <ProfileHeader
        student={profile}
        isSelf={true}
        onEditClick={onEditClick}
      />

      {/* Sub-Tabs: Overview vs Privacy */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '24px',
        }}
      >
        <button
          type="button"
          className="tab-btn"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: subTab === 'overview' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: subTab === 'overview' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: subTab === 'overview' ? '600' : '400',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
          onClick={() => setSubTab('overview')}
        >
          Profile Overview
        </button>

        <button
          type="button"
          className="tab-btn"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: subTab === 'privacy' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: subTab === 'privacy' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: subTab === 'privacy' ? '600' : '400',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
          onClick={() => setSubTab('privacy')}
        >
          Privacy &amp; Visibility
        </button>
      </div>

      {subTab === 'privacy' ? (
        <PrivacySettingsForm
          initialVisibility={profile.visibility}
          onSave={handleSavePrivacy}
          isSaving={saving}
        />
      ) : (
        <>
          {/* Profile Completeness Checklist (Transparent, non-fabricated) */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Profile Completeness Checklist
                </h3>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {completedCount} of {checklist.length} items complete
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.825rem',
                    color: item.done ? 'var(--text-secondary)' : 'var(--text-muted)',
                  }}
                >
                  {item.done ? (
                    <CheckCircle size={14} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
                  ) : (
                    <Circle size={14} style={{ color: 'var(--border-hover)', flexShrink: 0 }} />
                  )}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About / Bio */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  About Me
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--accent-primary)' }}
                onClick={onEditClick}
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
              {profile.bio || 'You have not added a bio yet. Click Edit to introduce yourself.'}
            </p>
          </div>

          {/* Skills */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: 'var(--accent-success)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  My Skills
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--accent-primary)' }}
                onClick={onEditClick}
              >
                <Edit3 size={14} />
                <span>Manage</span>
              </button>
            </div>
            {profile.skills && profile.skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.skills.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                No skills added yet.
              </p>
            )}
          </div>

          {/* Interests */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} style={{ color: 'var(--accent-info)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Interests
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--accent-primary)' }}
                onClick={onEditClick}
              >
                <Edit3 size={14} />
                <span>Manage</span>
              </button>
            </div>
            {profile.interests && profile.interests.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.825rem',
                      fontWeight: '500',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                No interests added yet.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MyProfilePage;

