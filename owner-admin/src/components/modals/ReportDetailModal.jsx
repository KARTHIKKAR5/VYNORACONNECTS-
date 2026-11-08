import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldCheck, User, CheckCircle2, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';

export function ReportDetailModal({
  report,
  isOpen,
  onClose,
  onResolve,
  onReject,
  onAssign,
}) {
  const [selectedMod, setSelectedMod] = useState('Ananya Sen (Moderator)');
  const [showAssignSelect, setShowAssignSelect] = useState(false);

  if (!isOpen || !report) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
      <div className="modal-container modal-lg">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={20} color="var(--color-danger)" />
            </div>
            <div>
              <h2 className="modal-title" id="report-modal-title">Moderation Incident #{report.id}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                <StatusBadge status={report.category} customLabel={report.category} />
                <StatusBadge status={report.priority} customLabel={`${report.priority.toUpperCase()} PRIORITY`} />
                <StatusBadge status={report.status} />
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Target & Reporter Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <span className="form-label" style={{ display: 'block', marginBottom: 4 }}>Reported Target Entity</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-danger-text)' }}>
                {report.targetName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Entity Type: <strong style={{ textTransform: 'capitalize' }}>{report.targetType}</strong> • ID: {report.targetId}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <span className="form-label" style={{ display: 'block', marginBottom: 4 }}>Reporting Student</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{report.reporterName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Reporter ID: {report.reporterId} • Submitted: {new Date(report.submittedAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <span className="form-label">Incident Description</span>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {report.description}
            </div>
          </div>

          {/* Evidence Snippet */}
          {report.evidenceSnippet && (
            <div className="form-group">
              <span className="form-label">Flagged Content / Evidence Snippet</span>
              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: '12px 14px', fontSize: '0.84rem', color: '#92400E', fontFamily: 'var(--font-mono)' }}>
                {report.evidenceSnippet}
              </div>
            </div>
          )}

          {/* Moderator Assignment Info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Assigned Moderator</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{report.assignedModerator || 'Unassigned (Awaiting Review)'}</span>
            </div>

            {report.status !== 'resolved' && (
              <div style={{ display: 'flex', gap: 8 }}>
                {showAssignSelect ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      value={selectedMod}
                      onChange={(e) => setSelectedMod(e.target.value)}
                    >
                      <option value="Ananya Sen (Staff Mod)">Ananya Sen (Staff Mod)</option>
                      <option value="Platform Owner (Revanth)">Platform Owner (Direct)</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onAssign(report.id, selectedMod);
                        setShowAssignSelect(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAssignSelect(true)}
                  >
                    Assign Moderator
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Resolution Summary if already resolved */}
          {report.resolutionNotes && (
            <div style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px', color: 'var(--color-success-text)' }}>
              <strong>Resolution Summary:</strong>
              <div style={{ fontSize: '0.85rem', marginTop: 4 }}>{report.resolutionNotes}</div>
              {report.resolutionAction && (
                <div style={{ fontSize: '0.78rem', marginTop: 4 }}>Action Taken: {report.resolutionAction}</div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {report.status !== 'resolved' && (
            <>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  onClose();
                  onReject(report);
                }}
              >
                <XCircle size={16} /> Dismiss Report
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  onClose();
                  onResolve(report);
                }}
              >
                <CheckCircle2 size={16} /> Resolve Incident
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportDetailModal;
