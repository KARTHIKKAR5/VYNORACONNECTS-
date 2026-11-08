import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { RESOURCE_CATEGORIES, RESOURCE_TYPES, ENGINEERING_BRANCHES } from '../../services/resourcesService.js';

export function ResourceFilters({
  search,
  setSearch,
  category,
  setCategory,
  branch,
  setBranch,
  type,
  setType,
  totalResults,
  onReset,
}) {
  const hasActiveFilters = search || category !== 'All' || branch !== 'All' || type !== 'all';

  return (
    <div className="filters-container">
      {/* Search Input Bar */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search study notes, roadmaps, DSA guides, author or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search-resources-input"
        />
        {search && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearch('')}
            aria-label="Clear search input"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdowns Bar */}
      <div className="filters-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filters:</span>
        </div>

        {/* Category Filter */}
        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          id="filter-category"
        >
          {RESOURCE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Branch Filter */}
        <select
          className="filter-select"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          id="filter-branch"
        >
          {ENGINEERING_BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b === 'All' ? 'All Branches' : `${b} Department`}
            </option>
          ))}
        </select>

        {/* Type / Format Filter */}
        <select
          className="filter-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          id="filter-type"
        >
          {RESOURCE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline btn-sm"
            style={{ marginLeft: 'auto' }}
            id="btn-reset-filters"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span className="results-count">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'educational resource' : 'educational resources'}
        </span>
      </div>
    </div>
  );
}

