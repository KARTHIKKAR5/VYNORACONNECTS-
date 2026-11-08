import React, { useState } from 'react';
import { getInitials, formatStudyYear, formatRelativeTime } from '../utils/profileFormatters.js';
import VerificationBadge from './VerificationBadge.jsx';
import { Building2, Check, X, Clock, UserMinus } from 'lucide-react';

export function ConnectionRequestCard({
  item,
  type = 'received', // 'received' | 'sent' | 'connection'
  onAccept = () => {},
  onReject = () => {},
  onCancel = () => {},
  onRemove = () => {},
  onSelectStudent = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const student = item?.student;
  if (!student) return null;

  const initials = getInitials(student.name);

  const handleAction = async (fn, ...args) => {
    try {
      setLoading(true);
      await fn(...args);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      {/* Student Snippet */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          flex: 1,
          minWidth: '240px',
        }}
        onClick={() => onSelectStudent(student)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSelectStudent(student);
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '1rem',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {student.name}
            </span>
            <VerificationBadge isVerified={student.isVerified} size="sm" />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginTop: '2px',
            }}
          >
            <Building2 size={12} style={{ color: 'var(--text-muted)' }} />
            <span>{student.college}</span>
            <span>&bull;</span>
            <span>{student.branch}</span>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {type === 'received' && `Received ${formatRelativeTime(item.createdAt)}`}
            {type === 'sent' && `Sent ${formatRelativeTime(item.createdAt)}`}
            {type === 'connection' && `Connected ${formatRelativeTime(item.respondedAt || item.createdAt)}`}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {type === 'received' && (
          <>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{
                background: 'var(--accent-success)',
                borderColor: 'var(--accent-success)',
                gap: '4px',
              }}
              disabled={loading}
              onClick={() => handleAction(onAccept, item._id)}
            >
              <Check size={14} />
              <span>{loading ? 'Accepting...' : 'Accept'}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={loading}
              onClick={() => handleAction(onReject, item._id)}
            >
              <X size={14} />
              <span>Decline</span>
            </button>
          </>
        )}

        {type === 'sent' && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--text-muted)' }}
            disabled={loading}
            onClick={() => handleAction(onCancel, item._id)}
          >
            <Clock size={13} style={{ marginRight: '4px' }} />
            <span>Cancel Request</span>
          </button>
        )}

        {type === 'connection' && (
          <>
            {showConfirmRemove ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={loading}
                  onClick={() => handleAction(onRemove, item._id)}
                >
                  {loading ? 'Removing...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowConfirmRemove(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--text-muted)', gap: '4px' }}
                onClick={() => setShowConfirmRemove(true)}
                title="Remove this connection"
              >
                <UserMinus size={14} />
                <span>Remove</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ConnectionRequestCard;

