import React from 'react';
import { getInitials, formatStudyYear, truncateText } from '../utils/profileFormatters.js';
import VerificationBadge from './VerificationBadge.jsx';
import SkillTag from './SkillTag.jsx';
import ConnectionActionButton from './ConnectionActionButton.jsx';
import { Building2, GraduationCap } from 'lucide-react';

export function StudentCard({
  student,
  onSelectStudent = () => {},
  onConnect = () => {},
  onAccept = () => {},
  onReject = () => {},
  onCancel = () => {},
  onRemove = () => {},
}) {
  if (!student) return null;

  const initials = getInitials(student.name);

  return (
    <div
      className="card student-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        transition: 'var(--transition-fast)',
        cursor: 'pointer',
      }}
      onClick={() => onSelectStudent(student)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectStudent(student);
        }
      }}
    >
      <div>
        {/* Top: Avatar, Name & Verification */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '1.1rem',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {student.name}
              </h3>
              <VerificationBadge isVerified={student.isVerified} size="sm" />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginTop: '4px',
              }}
            >
              <Building2 size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {student.college}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              <GraduationCap size={13} style={{ flexShrink: 0 }} />
              <span>
                {formatStudyYear(student.studyYear)} &bull; {student.branch}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '16px',
            }}
          >
            {truncateText(student.bio, 110)}
          </p>
        )}

        {/* Skills Chips */}
        {student.skills && student.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {student.skills.slice(0, 4).map((skill) => (
              <SkillTag key={skill} skill={skill} size="sm" />
            ))}
            {student.skills.length > 4 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  alignSelf: 'center',
                  marginLeft: '2px',
                }}
              >
                +{student.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px',
          marginTop: '8px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="btn btn-ghost"
          style={{ fontSize: '0.8rem', padding: '4px 8px', color: 'var(--accent-primary)' }}
          onClick={() => onSelectStudent(student)}
        >
          View Profile &rarr;
        </button>

        <ConnectionActionButton
          status={student.connectionStatus || 'not_connected'}
          isSelf={student.isSelf}
          size="sm"
          onConnect={() => onConnect(student._id)}
          onAccept={() => onAccept(student.connectionId)}
          onReject={() => onReject(student.connectionId)}
          onCancel={() => onCancel(student.connectionId)}
          onRemove={() => onRemove(student.connectionId)}
        />
      </div>
    </div>
  );
}

export default StudentCard;

