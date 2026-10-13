import React from 'react';

export function InquiryDetailsModal({
  inquiry,
  onClose,
  onAccept,
  onDecline,
  onCancel,
  currentUserId = 'usr-surya-01'
}) {
  if (!inquiry) return null;

  const isRecipient = inquiry.recipientId === currentUserId;
  const isRequester = inquiry.requesterId === currentUserId;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="mono-status-pill status-pending font-mono">⏳ PENDING DECISION</span>;
      case 'ACCEPTED':
        return <span className="mono-status-pill status-published font-mono">✓ ACCEPTED</span>;
      case 'DECLINED':
        return <span className="mono-status-pill status-archived font-mono">✕ DECLINED</span>;
      case 'CANCELLED':
        return <span className="mono-status-pill status-draft font-mono">⊘ CANCELLED</span>;
      case 'COMPLETED':
        return <span className="mono-status-pill status-published font-mono">★ COMPLETED</span>;
      default:
        return <span className="mono-status-pill font-mono">{status}</span>;
    }
  };

  return (
    <div className="mono-modal-backdrop" onClick={onClose}>
      <div className="mono-modal mono-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mono-modal-header">
          <div>
            <div className="mono-modal-tags-row">
              {getStatusBadge(inquiry.status)}
              <span className="mono-badge mono-badge-subtle font-mono">ID: {inquiry.id}</span>
            </div>
            <h2 className="mono-modal-title">{inquiry.subject}</h2>
          </div>
          <button className="mono-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mono-modal-body">
          {/* Metadata Specs Strip */}
          <div className="mono-specs-grid">
            <div className="mono-spec-item">
              <span className="mono-spec-label">Service Listing</span>
              <span className="mono-spec-val">{inquiry.listingTitle}</span>
              <span className="mono-spec-sub font-mono">ID: {inquiry.listingId}</span>
            </div>
            <div className="mono-spec-item">
              <span className="mono-spec-label">Parties Involved</span>
              <span className="mono-spec-val">
                Client: {inquiry.requesterName}
              </span>
              <span className="mono-spec-sub">
                Provider: {inquiry.recipientName}
              </span>
            </div>
            <div className="mono-spec-item">
              <span className="mono-spec-label">Proposed Budget</span>
              <span className="mono-spec-val font-mono">
                {inquiry.budget?.amount > 0 ? `₹${Number(inquiry.budget.amount).toLocaleString()}` : 'Negotiable'}
              </span>
              {inquiry.requestedDeadline && (
                <span className="mono-spec-sub">
                  Target: {new Date(inquiry.requestedDeadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="mono-detail-section">
            <h4 className="mono-section-heading">Initial Message / Pitch</h4>
            <p className="mono-detail-text">"{inquiry.message}"</p>
          </div>

          {/* Project Requirements */}
          {inquiry.requirements && (
            <div className="mono-detail-section">
              <h4 className="mono-section-heading">Project Scope & Deliverables</h4>
              <p className="mono-detail-text">{inquiry.requirements}</p>
            </div>
          )}

          {/* Chat Integration / Lifecycle Info */}
          {inquiry.status === 'ACCEPTED' && (
            <div className="mono-notice-box success">
              <span className="mono-notice-icon">💬</span>
              <div>
                <strong>Inquiry Accepted — Chat Bridge Active:</strong>
                <p>
                  This inquiry has been accepted by the provider. Real-time communication and file exchanges are bound to conversation thread <code>{inquiry.conversationId || 'conv-vynora-bridge'}</code> via the Messages module.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mono-modal-footer">
          <button className="mono-btn mono-btn-secondary" onClick={onClose}>
            Close
          </button>

          {isRecipient && inquiry.status === 'PENDING' && (
            <>
              <button
                className="mono-btn mono-btn-danger"
                onClick={() => {
                  onDecline(inquiry.id);
                  onClose();
                }}
              >
                Decline Request
              </button>
              <button
                className="mono-btn mono-btn-primary"
                onClick={() => {
                  onAccept(inquiry.id);
                  onClose();
                }}
              >
                Accept Inquiry
              </button>
            </>
          )}

          {isRequester && inquiry.status === 'PENDING' && (
            <button
              className="mono-btn mono-btn-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this pending inquiry?')) {
                  onCancel(inquiry.id);
                  onClose();
                }
              }}
            >
              Cancel Inquiry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InquiryDetailsModal;
