import React from 'react';
import { X, UserCheck, Building2, GraduationCap, Link2, CheckCircle2, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';

export function ApplicationDetailModal({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) {
  if (!isOpen || !application) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
      <div className="modal-container modal-lg">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={22} color="var(--color-info)" />
            </div>
            <div>
              <h2 className="modal-title" id="app-modal-title">Club Admin Candidate Review</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{application.applicantName}</span>
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Target Club & College Target Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Building2 size={16} color="var(--color-purple)" />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Requested Club</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{application.clubName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-purple)', fontWeight: 600, marginTop: 2 }}>
                Proposed Role: {application.assignedRole || 'Club Administrator'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <GraduationCap size={16} color="var(--color-info)" />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Associated College</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{application.collegeName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Academic Dept: {application.department} ({application.studentYear})
              </div>
            </div>
          </div>

          {/* Applicant Statement of Purpose */}
          <div className="form-group">
            <span className="form-label">Application Motivation &amp; Leadership Experience</span>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {application.reason}
            </div>
          </div>

          {/* Applicant Verification Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <span className="form-label">Applicant Email</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{application.applicantEmail}</span>
            </div>
            <div className="form-group">
              <span className="form-label">Student ID</span>
              <span className="cell-code" style={{ display: 'inline-block', width: 'fit-content' }}>{application.applicantId}</span>
            </div>
            {application.portfolioUrl && (
              <div className="form-group">
                <span className="form-label">Portfolio / Activity Profile</span>
                <a href={application.portfolioUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
                  <Link2 size={14} /> View Student Portfolio
                </a>
              </div>
            )}
          </div>

          {/* Security Rule Notice */}
          <div className="callout-security" style={{ marginBottom: 0 }}>
            <div>
              <strong>Security &amp; Privilege Rule:</strong> Approving this application will grant the student club administration authority <em>strictly scoped</em> to <strong>{application.clubName}</strong>. Club Admins never receive platform-owner or system-wide permissions.
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {application.status === 'pending' && (
            <>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  onClose();
                  onReject(application);
                }}
              >
                <XCircle size={16} /> Reject Application
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  onClose();
                  onApprove(application);
                }}
              >
                <CheckCircle2 size={16} /> Approve &amp; Assign to Club
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailModal;
