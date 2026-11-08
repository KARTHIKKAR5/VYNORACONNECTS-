import React, { useState } from 'react';
import { UserPlus, Check, Clock, UserX, AlertCircle } from 'lucide-react';

export function ConnectionActionButton({
  status = 'not_connected',
  isSelf = false,
  onConnect = () => {},
  onAccept = () => {},
  onReject = () => {},
  onCancel = () => {},
  onRemove = () => {},
  disabled = false,
  size = 'md',
}) {
  const [loading, setLoading] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const handleAction = async (fn, ...args) => {
    try {
      setLoading(true);
      await fn(...args);
    } finally {
      setLoading(false);
    }
  };

  if (isSelf) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: size === 'sm' ? '4px 10px' : '6px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
          fontWeight: '500',
          color: 'var(--text-muted)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        You
      </span>
    );
  }

  if (status === 'connected') {
    if (showConfirmRemove) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={disabled || loading}
            onClick={() => handleAction(onRemove)}
            title="Confirm removing this connection"
          >
            {loading ? 'Removing...' : 'Confirm Remove'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowConfirmRemove(false)}
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="btn btn-secondary"
        style={{
          fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
          padding: size === 'sm' ? '4px 10px' : '6px 14px',
          color: 'var(--accent-success)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        }}
        disabled={disabled || loading}
        onClick={() => setShowConfirmRemove(true)}
        title="Click to manage or remove connection"
      >
        <Check size={14} />
        <span>Connected</span>
      </button>
    );
  }

  if (status === 'pending_sent') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          style={{
            fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
            padding: size === 'sm' ? '4px 10px' : '6px 14px',
            color: 'var(--accent-warning)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
          }}
          disabled
        >
          <Clock size={14} />
          <span>Pending</span>
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          style={{
            fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
            padding: size === 'sm' ? '4px 8px' : '6px 10px',
            color: 'var(--text-muted)',
          }}
          disabled={disabled || loading}
          onClick={() => handleAction(onCancel)}
          title="Cancel sent request"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (status === 'pending_received') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{
            fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
            padding: size === 'sm' ? '4px 10px' : '6px 14px',
            background: 'var(--accent-success)',
            borderColor: 'var(--accent-success)',
          }}
          disabled={disabled || loading}
          onClick={() => handleAction(onAccept)}
        >
          <Check size={14} />
          <span>Accept</span>
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{
            fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
            padding: size === 'sm' ? '4px 10px' : '6px 14px',
          }}
          disabled={disabled || loading}
          onClick={() => handleAction(onReject)}
        >
          Decline
        </button>
      </div>
    );
  }

  // Default: not connected
  return (
    <button
      type="button"
      className="btn btn-primary"
      style={{
        fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
        padding: size === 'sm' ? '5px 12px' : '7px 16px',
      }}
      disabled={disabled || loading}
      onClick={() => handleAction(onConnect)}
    >
      <UserPlus size={14} />
      <span>{loading ? 'Connecting...' : 'Connect'}</span>
    </button>
  );
}

export default ConnectionActionButton;

