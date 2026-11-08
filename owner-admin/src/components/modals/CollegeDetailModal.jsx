import React from 'react';
import { X, Building, Mail, Phone, Globe, MapPin, FileText, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';

export function CollegeDetailModal({
  college,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
}) {
  if (!isOpen || !college) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="college-modal-title">
      <div className="modal-container modal-lg">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={22} color="var(--color-info)" />
            </div>
            <div>
              <h2 className="modal-title" id="college-modal-title">{college.name}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                <span className="cell-code">{college.code}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AISHE: {college.aisheCode}</span>
                <StatusBadge status={college.status} />
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Institution Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <span className="form-label">Campus Location</span>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.85rem' }}>
                <MapPin size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{college.address}, {college.city}, {college.state}</span>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Official Website & Domain</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                <Globe size={16} color="var(--text-muted)" />
                <a href={college.website} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                  {college.domain}
                </a>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Primary Designated Contact</span>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>{college.contactPerson}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{college.contactDesignation}</div>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Contact Verification</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={14} color="var(--text-muted)" />
                  <span>{college.contactEmail}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={14} color="var(--text-muted)" />
                  <span>{college.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Notes */}
          {college.notes && (
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <span className="form-label" style={{ display: 'block', marginBottom: 4 }}>Institutional Notes & Accreditation</span>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>{college.notes}</p>
            </div>
          )}

          {/* Submitted Document Proofs */}
          <div className="form-group">
            <span className="form-label">Submitted Statutory Verification Evidence</span>
            <div className="document-pill-list">
              {college.documents && college.documents.length > 0 ? (
                college.documents.map(doc => (
                  <div key={doc.id} className="doc-item-pill">
                    <div className="doc-item-info">
                      <FileText size={16} color="var(--color-info)" />
                      <span style={{ fontWeight: 600 }}>{doc.title}</span>
                      <span className="cell-code">{doc.type}</span>
                    </div>
                    <span className="badge badge-success">Attested Document</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No additional statutory documents uploaded for this submission.
                </div>
              )}
            </div>
          </div>

          {/* Review Audit Meta */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            Submitted on: <strong>{new Date(college.submittedAt).toLocaleDateString()}</strong>
            {college.reviewedAt && (
              <span> • Reviewed on: <strong>{new Date(college.reviewedAt).toLocaleDateString()}</strong> by {college.reviewedBy}</span>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {college.status !== 'rejected' && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                onClose();
                onReject(college);
              }}
            >
              <XCircle size={16} /> Reject Submission
            </button>
          )}

          {college.status === 'pending' && (
            <button
              type="button"
              className="btn btn-outline-warning"
              onClick={() => {
                onClose();
                onRequestInfo(college);
              }}
            >
              <HelpCircle size={16} /> Request Information
            </button>
          )}

          {college.status !== 'approved' && (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                onClose();
                onApprove(college);
              }}
            >
              <CheckCircle2 size={16} /> Approve &amp; Verify College
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollegeDetailModal;
