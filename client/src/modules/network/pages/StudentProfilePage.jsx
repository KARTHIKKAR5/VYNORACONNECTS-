import React, { useState } from 'react';
import useStudentProfile from '../hooks/useStudentProfile.js';
import ProfileHeader from '../components/ProfileHeader.jsx';
import SkillTag from '../components/SkillTag.jsx';
import ReportUserDialog from '../components/ReportUserDialog.jsx';
import BlockUserDialog from '../components/BlockUserDialog.jsx';
import { ArrowLeft, BookOpen, Layers, Shield, Sparkles, AlertCircle } from 'lucide-react';

export function StudentProfilePage({
  userId,
  onBack = () => {},
  onEditClick = () => {},
}) {
  const {
    profile,
    loading,
    error,
    handleConnect,
    handleAccept,
    handleReject,
    handleCancel,
    handleRemove,
    handleReport,
    handleBlock,
  } = useStudentProfile(userId);

  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '24px 0' }}>
        <div className="card skeleton" style={{ height: '160px', borderRadius: 'var(--radius-xl)', marginBottom: '20px' }} />
        <div className="card skeleton" style={{ height: '220px', borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 24px',
          }}
        >
          <AlertCircle size={36} style={{ color: 'var(--accent-warning)', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Profile Unavailable
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
            {error || 'This student profile could not be found or has been blocked.'}
          </p>
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back to Discovery</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Back to Directory Button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ gap: '8px', padding: '6px 10px', color: 'var(--text-secondary)' }}
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Students</span>
        </button>
      </div>

      {/* Main Profile Header */}
      <ProfileHeader
        student={profile}
        isSelf={profile.isSelf}
        onEditClick={onEditClick}
        onConnect={handleConnect}
        onAccept={handleAccept}
        onReject={handleReject}
        onCancel={handleCancel}
        onRemove={handleRemove}
        onReportClick={() => setReportOpen(true)}
        onBlockClick={() => setBlockOpen(true)}
      />

      {/* Bio / About Section */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            About
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
          {profile.bio || 'This student has not added a bio yet.'}
        </p>
      </div>

      {/* Skills & Competencies Section */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BookOpen size={18} style={{ color: 'var(--accent-success)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            Skills &amp; Technical Tools
          </h2>
        </div>

        {profile.skills && profile.skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.skills.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            No technical skills listed.
          </p>
        )}
      </div>

      {/* Interests & Topics Section */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Layers size={18} style={{ color: 'var(--accent-info)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            Interests &amp; Areas of Exploration
          </h2>
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
            No interests listed.
          </p>
        )}
      </div>

      {/* Trust & Safety Modals */}
      <ReportUserDialog
        isOpen={reportOpen}
        student={profile}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReport}
      />

      <BlockUserDialog
        isOpen={blockOpen}
        student={profile}
        onClose={() => setBlockOpen(false)}
        onConfirm={async () => {
          await handleBlock();
          onBack();
        }}
      />
    </div>
  );
}

export default StudentProfilePage;

