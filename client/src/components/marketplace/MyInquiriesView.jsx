import React, { useState } from 'react';

export function MyInquiriesView({
  receivedInquiries = [],
  sentInquiries = [],
  onAccept,
  onDecline,
  onCancel,
  onViewDetails
}) {
  const [activeTab, setActiveTab] = useState('RECEIVED'); // 'RECEIVED' | 'SENT'

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="mono-status-pill status-pending font-mono">⏳ PENDING</span>;
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

  const currentList = activeTab === 'RECEIVED' ? receivedInquiries : sentInquiries;

  return (
    <div className="mono-inquiries-view">
      <div className="mono-view-header">
        <div>
          <span className="mono-badge mono-badge-subtle font-mono">CONSULTATION HUB</span>
          <h2 className="mono-view-title">Inquiries & Communications</h2>
          <p className="mono-view-desc">
            Track student requests, scope agreements, and service consultations.
          </p>
        </div>
      </div>

      {/* Received vs Sent Tabs */}
      <div className="mono-tabs-bar">
        <button
          className={`mono-tab-nav-btn ${activeTab === 'RECEIVED' ? 'active' : ''}`}
          onClick={() => setActiveTab('RECEIVED')}
        >
          📥 Inquiries Received ({receivedInquiries.length})
        </button>
        <button
          className={`mono-tab-nav-btn ${activeTab === 'SENT' ? 'active' : ''}`}
          onClick={() => setActiveTab('SENT')}
        >
          📤 Inquiries Sent ({sentInquiries.length})
        </button>
      </div>

      {/* List / Table */}
      {currentList.length === 0 ? (
        <div className="mono-empty-state">
          <span className="mono-empty-icon">✉️</span>
          <h4>No {activeTab.toLowerCase()} inquiries</h4>
          <p>
            {activeTab === 'RECEIVED'
              ? 'When other students inquire about your service listings, they will appear here.'
              : 'You have not submitted inquiries to any peer service providers yet.'}
          </p>
        </div>
      ) : (
        <div className="mono-inquiries-list">
          {currentList.map(inq => {
            const isReceived = activeTab === 'RECEIVED';
            return (
              <div key={inq.id} className="mono-inquiry-card">
                <div className="mono-inquiry-header-line">
                  <div className="mono-inquiry-parties">
                    <span className="mono-inquiry-user-highlight">
                      {isReceived ? `From: ${inq.requesterName}` : `To: ${inq.recipientName}`}
                    </span>
                    <span className="mono-inquiry-listing-tag">
                      Listing: {inq.listingTitle}
                    </span>
                  </div>
                  <div className="mono-inquiry-date font-mono">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h4 className="mono-inquiry-subject" onClick={() => onViewDetails(inq)}>
                  {inq.subject}
                </h4>

                <p className="mono-inquiry-preview">
                  "{inq.message.slice(0, 160)}..."
                </p>

                <div className="mono-inquiry-footer-row">
                  <div className="mono-inquiry-stats font-mono">
                    {getStatusBadge(inq.status)}
                    {inq.budget?.amount > 0 && (
                      <span className="mono-inquiry-budget">
                        Budget: ₹{Number(inq.budget.amount).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Actions based on role and status */}
                  <div className="mono-inquiry-actions">
                    <button
                      className="mono-btn mono-btn-sm mono-btn-outline"
                      onClick={() => onViewDetails(inq)}
                    >
                      View Details
                    </button>

                    {isReceived && inq.status === 'PENDING' && (
                      <>
                        <button
                          className="mono-btn mono-btn-sm mono-btn-primary"
                          onClick={() => onAccept(inq.id)}
                        >
                          ✓ Accept
                        </button>
                        <button
                          className="mono-btn mono-btn-sm mono-btn-danger"
                          onClick={() => onDecline(inq.id)}
                        >
                          ✕ Decline
                        </button>
                      </>
                    )}

                    {!isReceived && inq.status === 'PENDING' && (
                      <button
                        className="mono-btn mono-btn-sm mono-btn-danger"
                        onClick={() => {
                          if (window.confirm('Cancel this pending inquiry?')) {
                            onCancel(inq.id);
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
          })}
        </div>
      )}
    </div>
  );
}

export default MyInquiriesView;
