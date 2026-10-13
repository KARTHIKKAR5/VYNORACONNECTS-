import React from 'react';
import { MARKETPLACE_CATEGORIES, PRICING_MODELS } from '../../data/marketplaceData';

export function MarketplaceFilters({
  activeCategory,
  onSelectCategory,
  activePriceModel,
  onSelectPriceModel,
  activeSort,
  onSelectSort,
  totalResults = 0
}) {
  return (
    <div className="mono-filters-container">
      {/* Category Pills Bar */}
      <div className="mono-categories-bar">
        {MARKETPLACE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`mono-cat-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className="mono-cat-icon">{cat.icon}</span>
            <span className="mono-cat-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Secondary Controls Bar: Price model filter, sorting, result counter */}
      <div className="mono-controls-bar">
        <div className="mono-controls-left">
          <span className="mono-results-count font-mono">
            {totalResults} {totalResults === 1 ? 'service' : 'services'} available
          </span>

          {/* Price Model Filter */}
          <div className="mono-filter-dropdown-group">
            <label className="mono-filter-label">Pricing:</label>
            <select
              className="mono-select"
              value={activePriceModel}
              onChange={(e) => onSelectPriceModel(e.target.value)}
            >
              <option value="ALL">All Models</option>
              <option value="FIXED">Fixed Price</option>
              <option value="HOURLY">Hourly Rate</option>
              <option value="NEGOTIABLE">Negotiable</option>
            </select>
          </div>
        </div>

        <div className="mono-controls-right">
          <label className="mono-filter-label">Sort by:</label>
          <select
            className="mono-select"
            value={activeSort}
            onChange={(e) => onSelectSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceFilters;
