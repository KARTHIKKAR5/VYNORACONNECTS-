import React from 'react';

export default function EventStatusBadge({ status, isOnline }) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'UPCOMING':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#34D399',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          label: 'Open'
        };
      case 'FULL':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#F87171',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          label: 'Full'
        };
      case 'CLOSED':
        return {
          backgroundColor: 'rgba(163, 163, 163, 0.15)',
          color: '#A3A3A3',
          border: '1px solid rgba(163, 163, 163, 0.3)',
          label: 'Closed'
        };
      case 'CANCELLED':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#FCA5A5',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          label: 'Cancelled'
        };
      case 'PAST':
        return {
          backgroundColor: 'rgba(115, 115, 115, 0.15)',
          color: '#737373',
          border: '1px solid rgba(115, 115, 115, 0.3)',
          label: 'Past'
        };
      default:
        return {
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          color: '#818CF8',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          label: status
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {isOnline && (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#A5B4FC',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🌐 Online
        </span>
      )}
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '3px 8px',
          borderRadius: '9999px',
          backgroundColor: badge.backgroundColor,
          color: badge.color,
          border: badge.border
        }}
      >
        {badge.label}
      </span>
    </div>
  );
}