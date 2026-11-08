import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import {
  OPPORTUNITY_TYPES,
  WORK_MODES,
  DEADLINE_STATUS_OPTIONS,
} from '../../services/opportunitiesService.js';

export function OpportunityFilters({
  search,
  setSearch,
  type,
  setType,
  mode,
  setMode,
  deadlineStatus,
  setDeadlineStatus,
  sortBy,
  setSortBy,
  totalResults,
  onReset,
}) {
  const hasActiveFilters = search || type !== 'all' || mode !== 'all' || deadlineStatus !== 'all';

  return (
    <div className="filters-container">
      {/* Search Input Bar */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search internships, hackathons, company name, skills or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search-opps-input"
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

        {/* Opportunity Type */}
        <select
          className="filter-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          id="filter-type"
        >
          {OPPORTUNITY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Work / Event Mode */}
        <select
          className="filter-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          id="filter-mode"
        >
          {WORK_MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Deadline Status */}
        <select
          className="filter-select"
          value={deadlineStatus}
          onChange={(e) => setDeadlineStatus(e.target.value)}
          id="filter-deadline"
        >
          {DEADLINE_STATUS_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          id="filter-sort"
        >
          <option value="deadline">Deadline Soonest</option>
          <option value="newest">Recently Posted</option>
        </select>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline btn-sm"
            style={{ marginLeft: 'auto' }}
            id="btn-reset-opp-filters"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span className="results-count">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'opportunity' : 'opportunities'}
        </span>
      </div>
    </div>
  );
}

