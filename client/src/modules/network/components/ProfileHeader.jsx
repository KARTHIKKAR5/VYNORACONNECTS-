import React from 'react';
import { getInitials, formatStudyYear, sanitizeExternalUrl } from '../utils/profileFormatters.js';
import VerificationBadge from './VerificationBadge.jsx';
import ConnectionActionButton from './ConnectionActionButton.jsx';
import { Building2, GraduationCap, Github, Linkedin, Globe, ShieldAlert, Ban, Edit3 } from 'lucide-react';

export function ProfileHeader({
  student,
  isSelf = false,
  onEditClick = () => {},
  onConnect = () => {},
  onAccept = () => {},
  onReject = () => {},
  onCancel = () => {},
  onRemove = () => {},
  onReportClick = () => {},
  onBlockClick = () => {},
}) {
  if (!student) return null;

  const initials = getInitials(student.name);

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        marginBottom: '24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {/* Large Avatar */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '2rem',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-glow)',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        {/* Profile Info */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              {student.name}
            </h1>
            <VerificationBadge isVerified={student.isVerified} showUnverified={true} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: '4px',
            }}
          >
            <Building2 size={16} style={{ color: 'var(--text-muted)' }} />
            <span>{student.college}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            <GraduationCap size={16} />
            <span>
              {formatStudyYear(student.studyYear)} &bull; {student.branch}
            </span>
          </div>

          {/* External Social / Portfolio Links */}
          {student.links && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {student.links.github && (
                <a
                  href={sanitizeExternalUrl(student.links.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
              )}
              {student.links.linkedin && (
                <a
                  href={sanitizeExternalUrl(student.links.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>
              )}
              {student.links.website && (
                <a
                  href={sanitizeExternalUrl(student.links.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Globe size={14} />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
          {isSelf ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onEditClick}
              style={{ gap: '8px' }}
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <>
              <ConnectionActionButton
                status={student.connectionStatus || 'not_connected'}
                isSelf={false}
                onConnect={() => onConnect(student._id)}
                onAccept={() => onAccept(student.connectionId)}
                onReject={() => onReject(student.connectionId)}
                onCancel={() => onCancel(student.connectionId)}
                onRemove={() => onRemove(student.connectionId)}
              />

              {/* Safety Actions Dropdown / Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--text-muted)', fontSize: '0.75rem', gap: '4px' }}
                  onClick={onReportClick}
                  title="Report this student to trust & moderation"
                >
                  <ShieldAlert size={13} />
                  <span>Report</span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--text-muted)', fontSize: '0.75rem', gap: '4px' }}
                  onClick={onBlockClick}
                  title="Block this student"
                >
                  <Ban size={13} />
                  <span>Block</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;

