import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { RESOURCE_CATEGORIES, RESOURCE_TYPES } from '../../services/resourcesService.js';

export function ResourceFilters({
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
  totalResults,
  onReset,
}) {
  const isFiltered = search.trim() !== '' || category !== 'All' || type !== 'all';

  return (
    <div className="filter-bar">
      <div className="search-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            id="resource-search-input"
            className="search-input"
            placeholder="Search study notes, roadmaps, algorithms, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch('')}
              title="Clear search"
              id="btn-clear-resource-search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          id="resource-type-select"
          className="filter-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {RESOURCE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline btn-sm"
            id="btn-reset-resource-filters"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="category-pills-row">
        <span className="category-label">
          <Filter size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Categories:
        </span>
        {RESOURCE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            id={`btn-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            className={`category-pill ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="active-filters-info">
        <span>Showing {totalResults} educational resources</span>
        {isFiltered && (
          <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}>
            Filtered Results
          </span>
        )}
      </div>
    </div>
  );
}
