import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export function VerificationBadge({ isVerified = false, showUnverified = false, size = 'md' }) {
  const iconSize = size === 'sm' ? 12 : 14;

  if (isVerified) {
    return (
      <span
        title="Student identity verified by college email/domain"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: size === 'sm' ? '1px 6px' : '2px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
          fontWeight: '600',
          backgroundColor: 'var(--accent-success-bg)',
          color: 'var(--accent-success)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          letterSpacing: '0.01em',
        }}
      >
        <CheckCircle2 size={iconSize} />
        <span>Verified Student</span>
      </span>
    );
  }

  if (showUnverified) {
    return (
      <span
        title="Verification pending approval by platform administrator"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: size === 'sm' ? '1px 6px' : '2px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
          fontWeight: '500',
          backgroundColor: 'var(--accent-warning-bg)',
          color: 'var(--accent-warning)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <Clock size={iconSize} />
        <span>Pending Verification</span>
      </span>
    );
  }

  return null;
}

export default VerificationBadge;

