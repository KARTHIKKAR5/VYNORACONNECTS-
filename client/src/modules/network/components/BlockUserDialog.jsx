import React, { useState } from 'react';
import { Ban, X, AlertTriangle } from 'lucide-react';

export function BlockUserDialog({
  isOpen = false,
  student = null,
  onClose = () => {},
  onConfirm = () => {},
}) {
  const [blocking, setBlocking] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !student) return null;

  const handleBlock = async () => {
    try {
      setBlocking(true);
      setError(null);
      await onConfirm(student._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to block student.');
      setBlocking(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '440px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ban size={20} style={{ color: 'var(--accent-danger)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Block {student.name}?
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '4px' }}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            marginBottom: '16px',
          }}
        >
          <AlertTriangle size={20} style={{ color: 'var(--accent-danger)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Blocking <strong>{student.name}</strong> will:
            <ul style={{ paddingLeft: '18px', margin: '6px 0 0 0' }}>
              <li>Remove any active or pending connection.</li>
              <li>Hide their profile from your discovery feed.</li>
              <li>Prevent mutual messages or team invitations.</li>
            </ul>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-danger-bg)',
              color: 'var(--accent-danger)',
              fontSize: '0.825rem',
              marginBottom: '14px',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={blocking}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            disabled={blocking}
            onClick={handleBlock}
          >
            {blocking ? 'Blocking...' : 'Confirm Block'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlockUserDialog;

