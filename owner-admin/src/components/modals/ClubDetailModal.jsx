import React from 'react';
import { X, Building2, Users, FileText, CheckCircle2, XCircle, HelpCircle, GraduationCap } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';

export function ClubDetailModal({
  club,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
}) {
  if (!isOpen || !club) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="club-modal-title">
      <div className="modal-container modal-lg">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--color-purple-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} color="var(--color-purple)" />
            </div>
            <div>
              <h2 className="modal-title" id="club-modal-title">{club.name}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                <span className="badge badge-purple">{club.category}</span>
                <StatusBadge status={club.status} />
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Associated College Relationship */}
          <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <GraduationCap size={24} color="var(--color-info)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Associated Verified College
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {club.collegeName}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <span className="form-label">Club Mission &amp; Purpose</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {club.description}
            </p>
          </div>

          {/* Leadership & Faculty Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <span className="form-label">Founding Student Lead</span>
              <div style={{ fontSize: '0.86rem' }}>
                <strong>{club.foundingLeadName}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{club.leadEmail}</div>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Faculty Advisor Endorsement</span>
              <div style={{ fontSize: '0.86rem' }}>
                <strong>{club.facultyAdvisor}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Department Verification Signoff</div>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Registered Members</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', fontWeight: 700 }}>
                <Users size={16} color="var(--text-muted)" />
                <span>{club.memberCount || 0} students enrolled</span>
              </div>
            </div>
          </div>

          {/* Charter & Bylaw Documents */}
          <div className="form-group">
            <span className="form-label">Submitted Club Constitution &amp; Evidence</span>
            <div className="document-pill-list">
              {club.documents && club.documents.length > 0 ? (
                club.documents.map(doc => (
                  <div key={doc.id} className="doc-item-pill">
                    <div className="doc-item-info">
                      <FileText size={16} color="var(--color-purple)" />
                      <span style={{ fontWeight: 600 }}>{doc.title}</span>
                      <span className="cell-code">{doc.type}</span>
                    </div>
                    <span className="badge badge-success">Verified Submission</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No charter documents attached with this submission.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {club.status !== 'rejected' && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                onClose();
                onReject(club);
              }}
            >
              <XCircle size={16} /> Reject Club
            </button>
          )}

          {club.status === 'pending' && (
            <button
              type="button"
              className="btn btn-outline-warning"
              onClick={() => {
                onClose();
                onRequestInfo(club);
              }}
            >
              <HelpCircle size={16} /> Request Information
            </button>
          )}

          {club.status !== 'approved' && (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                onClose();
                onApprove(club);
              }}
            >
              <CheckCircle2 size={16} /> Approve Club Verification
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubDetailModal;
