import React from 'react';
import { X, History, ShieldAlert, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';

export function AuditDetailModal({
  log,
  isOpen,
  onClose,
}) {
  if (!isOpen || !log) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="audit-modal-title">
      <div className="modal-container" style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={18} color="var(--text-secondary)" />
            </div>
            <div>
              <h3 className="modal-title" id="audit-modal-title">Security Event #{log.id}</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Read-Only Notice */}
          <div className="callout-info" style={{ marginBottom: 0 }}>
            <div>
              <strong>Security Invariant:</strong> Audit logs are cryptographically verifiable, append-only records. Entries cannot be edited, modified, or deleted by any administrative user.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <span className="form-label">Authorized Actor</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{log.actorName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Actor ID: {log.actorId}</div>
            </div>

            <div className="form-group">
              <span className="form-label">Action Performed</span>
              <span className="cell-code" style={{ fontWeight: 700, color: 'var(--color-info-text)' }}>{log.action}</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Category: {log.actionCategory}</div>
            </div>

            <div className="form-group">
              <span className="form-label">Target Entity</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{log.targetName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.targetType} • ID: {log.targetId}</div>
            </div>

            <div className="form-group">
              <span className="form-label">Execution Result</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span className="badge badge-success">{log.result}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Documented Justification &amp; Notes</span>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {log.reason || 'No additional commentary provided.'}
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Network Origin</span>
            <span className="cell-code" style={{ width: 'fit-content' }}>IP Address: {log.ipAddress || '10.24.8.1 (Internal Gateway)'}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditDetailModal;
