import React from 'react';

export function MarketplaceHero({
  searchQuery,
  onSearchChange,
  onExploreClick,
  onCreateClick,
  listingsCount = 0
}) {
  return (
    <div className="mono-hero">
      <div className="mono-hero-tag">
        <span className="mono-dot"></span>
        <span>CAMPUS SERVICE MARKETPLACE • PEER FREELANCE</span>
      </div>

      <h1 className="mono-hero-title">
        Discover & Offer Student Services
      </h1>

      <p className="mono-hero-subtitle">
        Connect with verified peer developers, designers, content writers, and academic mentors across campus departments.
      </p>

      {/* Hero Search Box */}
      <div className="mono-search-wrap">
        <div className="mono-search-input-box">
          <span className="mono-search-icon">🔍</span>
          <input
            type="text"
            className="mono-search-input"
            placeholder="Search by service title, skill (React, Figma, Python), or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="mono-search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="mono-hero-actions">
        <button className="mono-btn mono-btn-primary" onClick={onExploreClick}>
          <span>Explore Services ({listingsCount})</span>
          <span className="mono-arrow">↓</span>
        </button>
        <button className="mono-btn mono-btn-secondary" onClick={onCreateClick}>
          <span>+ Offer a Service</span>
        </button>
      </div>
    </div>
  );
}

export default MarketplaceHero;
