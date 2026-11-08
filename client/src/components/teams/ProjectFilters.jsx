import React from 'react';
import { PROJECT_CATEGORIES } from '../../services/projectsService.js';

export function ProjectFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  tag,
  onTagChange,
  recruitingOnly,
  onRecruitingToggle,
  sortBy,
  onSortChange,
  onReset,
}) {
  const commonTags = ['react', 'python', 'nodejs', 'pytorch', 'solidity', 'webrtc', 'pwa'];

  return (
    <div className="filters-container">
      {/* Top Search & Controls Row */}
      <div className="filters-main-row">
        <div className="search-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="Search projects by title, description or keyword..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Search projects"
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="sort-wrap">
          <label htmlFor="sort-select" className="sort-label">Sort:</label>
          <select
            id="sort-select"
            className="filter-select"
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="openings">Most Open Positions</option>
            <option value="members">Team Size</option>
          </select>
        </div>

        <label className="recruiting-toggle-label">
          <input
            type="checkbox"
            checked={recruitingOnly}
            onChange={e => onRecruitingToggle(e.target.checked)}
          />
          <span>Open Positions Only</span>
        </label>
      </div>

      {/* Category Pills */}
      <div className="categories-bar" role="tablist" aria-label="Project Categories">
        {PROJECT_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            className={`category-pill ${category === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Popular Tech Tag Quick Filter */}
      <div className="tech-tags-bar">
        <span className="tags-label">Popular Tech:</span>
        {commonTags.map(t => (
          <button
            key={t}
            type="button"
            className={`tag-filter-pill ${tag.toLowerCase() === t ? 'active' : ''}`}
            onClick={() => onTagChange(tag.toLowerCase() === t ? '' : t)}
          >
            #{t}
          </button>
        ))}
        {(search || category !== 'All' || tag || recruitingOnly) && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={onReset}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default ProjectFilters;

