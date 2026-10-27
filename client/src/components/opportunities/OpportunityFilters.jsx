import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import {
  OPPORTUNITY_TYPES,
  DEADLINE_STATUS_OPTIONS,
} from '../../services/opportunitiesService.js';

export function OpportunityFilters({
  search,
  setSearch,
  type,
  setType,
  deadlineStatus,
  setDeadlineStatus,
  totalResults,
  onReset,
}) {
  const isFiltered = search.trim() !== '' || type !== 'all' || deadlineStatus !== 'all';

  return (
    <div className="filter-bar">
      <div className="search-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            id="opportunity-search-input"
            className="search-input"
            placeholder="Search internships, companies, hackathons, roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch('')}
              title="Clear search"
              id="btn-clear-opp-search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          id="opp-deadline-select"
          className="filter-select"
          value={deadlineStatus}
          onChange={(e) => setDeadlineStatus(e.target.value)}
        >
          {DEADLINE_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline btn-sm"
            id="btn-reset-opp-filters"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="category-pills-row">
        <span className="category-label">
          <Filter size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Type:
        </span>
        {OPPORTUNITY_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            id={`btn-opp-type-${t.value}`}
            className={`category-pill ${type === t.value ? 'active' : ''}`}
            onClick={() => setType(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="active-filters-info">
        <span>Showing {totalResults} available opportunities</span>
        {isFiltered && (
          <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}>
            Filtered Results
          </span>
        )}
      </div>
    </div>
  );
}
