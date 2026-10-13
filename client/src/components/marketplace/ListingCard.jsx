import React from 'react';

export function ListingCard({
  listing,
  onViewDetails,
  onInquire,
  isOwner = false
}) {
  const formatPrice = (pricing) => {
    if (!pricing) return 'Negotiable';
    if (pricing.model === 'NEGOTIABLE') return 'Negotiable';
    const symbol = pricing.currency === 'USD' ? '$' : pricing.currency === 'EUR' ? '€' : '₹';
    const amount = Number(pricing.amount || 0).toLocaleString();
    if (pricing.model === 'HOURLY') {
      return `${symbol}${amount} / hr`;
    }
    return `${symbol}${amount}`;
  };

  return (
    <div className="mono-card mono-listing-card">
      <div className="mono-card-top">
        <span className="mono-badge mono-badge-category">
          {listing.category}
        </span>
        <span className="mono-badge mono-badge-delivery">
          ⏱️ {listing.deliveryTime?.value} {listing.deliveryTime?.unit?.toLowerCase()}
        </span>
      </div>

      <h3 className="mono-listing-title" onClick={() => onViewDetails(listing)}>
        {listing.title}
      </h3>

      <p className="mono-listing-summary">
        {listing.summary}
      </p>

      {/* Skills Tags */}
      <div className="mono-skill-chips">
        {listing.skills?.slice(0, 4).map((skill) => (
          <span key={skill} className="mono-chip font-mono">
            {skill}
          </span>
        ))}
        {listing.skills?.length > 4 && (
          <span className="mono-chip mono-chip-more font-mono">
            +{listing.skills.length - 4}
          </span>
        )}
      </div>

      {/* Provider Details Line */}
      <div className="mono-provider-strip">
        <div className="mono-provider-info">
          <span className="mono-provider-name">
            {listing.ownerName}
            {isOwner && <span className="mono-owner-tag">You</span>}
          </span>
          <span className="mono-provider-dept">{listing.ownerDept}</span>
        </div>
        <div className="mono-price-block">
          <span className="mono-price-val font-mono">{formatPrice(listing.pricing)}</span>
          {listing.pricing?.negotiable && listing.pricing?.model !== 'NEGOTIABLE' && (
            <span className="mono-negotiable-sub">(negotiable)</span>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="mono-card-actions">
        <button
          className="mono-btn mono-btn-sm mono-btn-outline"
          onClick={() => onViewDetails(listing)}
        >
          View Details
        </button>
        <button
          className={`mono-btn mono-btn-sm ${isOwner ? 'mono-btn-disabled' : 'mono-btn-primary'}`}
          onClick={() => !isOwner && onInquire(listing)}
          disabled={isOwner}
          title={isOwner ? 'You cannot inquire on your own service' : 'Send project inquiry'}
        >
          {isOwner ? 'Your Listing' : 'Send Inquiry'}
        </button>
      </div>
    </div>
  );
}

export default ListingCard;
