import React from 'react';

export function ListingDetailsModal({
  listing,
  onClose,
  onInquire,
  onEdit,
  isOwner = false
}) {
  if (!listing) return null;

  const formatPrice = (pricing) => {
    if (!pricing) return 'Negotiable';
    if (pricing.model === 'NEGOTIABLE') return 'Negotiable Rate';
    const symbol = pricing.currency === 'USD' ? '$' : pricing.currency === 'EUR' ? '€' : '₹';
    const amount = Number(pricing.amount || 0).toLocaleString();
    if (pricing.model === 'HOURLY') {
      return `${symbol}${amount} per hour`;
    }
    return `${symbol}${amount} fixed`;
  };

  return (
    <div className="mono-modal-backdrop" onClick={onClose}>
      <div className="mono-modal mono-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mono-modal-header">
          <div>
            <div className="mono-modal-tags-row">
              <span className="mono-badge mono-badge-category">{listing.category}</span>
              <span className="mono-badge mono-badge-subtle font-mono">
                ID: {listing.id}
              </span>
            </div>
            <h2 className="mono-modal-title">{listing.title}</h2>
          </div>
          <button className="mono-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mono-modal-body">
          {/* Quick Specifications Strip */}
          <div className="mono-specs-grid">
            <div className="mono-spec-item">
              <span className="mono-spec-label">Pricing Model</span>
              <span className="mono-spec-val font-mono">{formatPrice(listing.pricing)}</span>
              {listing.pricing?.negotiable && (
                <span className="mono-spec-sub">Open to budget negotiation</span>
              )}
            </div>
            <div className="mono-spec-item">
              <span className="mono-spec-label">Estimated Delivery</span>
              <span className="mono-spec-val font-mono">
                {listing.deliveryTime?.value} {listing.deliveryTime?.unit?.toLowerCase()}
              </span>
              <span className="mono-spec-sub">Direct milestone updates</span>
            </div>
            <div className="mono-spec-item">
              <span className="mono-spec-label">Service Provider</span>
              <span className="mono-spec-val">{listing.ownerName}</span>
              <span className="mono-spec-sub">{listing.ownerDept}</span>
            </div>
          </div>

          {/* Full Description */}
          <div className="mono-detail-section">
            <h4 className="mono-section-heading">Detailed Description</h4>
            <p className="mono-detail-text">{listing.description}</p>
          </div>

          {/* Skills Required / Provided */}
          <div className="mono-detail-section">
            <h4 className="mono-section-heading">Skills & Technology Stack</h4>
            <div className="mono-skill-chips-lg">
              {listing.skills?.map((skill) => (
                <span key={skill} className="mono-chip-lg font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Links */}
          {listing.portfolioLinks && listing.portfolioLinks.length > 0 && (
            <div className="mono-detail-section">
              <h4 className="mono-section-heading">Portfolio & Reference Work</h4>
              <div className="mono-links-list">
                {listing.portfolioLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono-portfolio-link"
                  >
                    <span>🔗 {link.label}</span>
                    <span className="mono-link-url font-mono">{link.url}</span>
                    <span className="mono-external-icon">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer on mock data */}
          <div className="mono-notice-box">
            <span className="mono-notice-icon">ℹ️</span>
            <p>
              <strong>Student Peer Service:</strong> This listing is provided by a verified campus peer. Vynora Connect recommends establishing milestones and reviewing code/deliverables before final completion.
            </p>
          </div>
        </div>

        <div className="mono-modal-footer">
          <button className="mono-btn mono-btn-secondary" onClick={onClose}>
            Close
          </button>
          {isOwner ? (
            <button className="mono-btn mono-btn-primary" onClick={() => onEdit(listing)}>
              ✏️ Edit Listing
            </button>
          ) : (
            <button className="mono-btn mono-btn-primary" onClick={() => onInquire(listing)}>
              💬 Send Inquiry to {listing.ownerName.split(' ')[0]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingDetailsModal;
