import React, { useState } from 'react';
import {
  ALLOWED_COLLEGES,
  ALLOWED_BRANCHES,
  ALLOWED_STUDY_YEARS,
  COMMON_SKILLS,
  COMMON_INTERESTS,
} from '../schemas/profileSchema.js';
import SkillTag from './SkillTag.jsx';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export function StudentFilters({
  filters,
  onChange = () => {},
  onReset = () => {},
  totalResults = 0,
}) {
  const [expanded, setExpanded] = useState(false);

  const activeFiltersCount = [
    filters.college && filters.college !== 'All Colleges',
    filters.branch && filters.branch !== 'All Branches',
    Boolean(filters.studyYear),
    Boolean(filters.skill),
    Boolean(filters.interest),
  ].filter(Boolean).length;

  const handleSelectField = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  const handleToggleSkill = (skill) => {
    const nextSkill = filters.skill === skill ? '' : skill;
    handleSelectField('skill', nextSkill);
  };

  const handleToggleInterest = (interest) => {
    const nextInterest = filters.interest === interest ? '' : interest;
    handleSelectField('interest', nextInterest);
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      {/* Filters Summary & Controls Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}
          >
            <Filter size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Filters</span>
          </div>

          {activeFiltersCount > 0 && (
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)',
                fontWeight: '600',
              }}
            >
              {activeFiltersCount} active
            </span>
          )}

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ({totalResults} {totalResults === 1 ? 'student' : 'students'} found)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem', padding: '4px 8px', color: 'var(--text-muted)' }}
              onClick={onReset}
            >
              <RotateCcw size={13} />
              <span>Clear All</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => setExpanded(!expanded)}
          >
            <span>{expanded ? 'Fewer Filters' : 'More Filters'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Primary Filters Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginTop: '16px',
        }}
      >
        {/* College Filter */}
        <div>
          <label
            htmlFor="filter-college"
            style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}
          >
            College
          </label>
          <select
            id="filter-college"
            className="form-select"
            value={filters.college || 'All Colleges'}
            onChange={(e) => handleSelectField('college', e.target.value)}
            style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
          >
            {ALLOWED_COLLEGES.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <div>
          <label
            htmlFor="filter-branch"
            style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}
          >
            Branch / Department
          </label>
          <select
            id="filter-branch"
            className="form-select"
            value={filters.branch || 'All Branches'}
            onChange={(e) => handleSelectField('branch', e.target.value)}
            style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
          >
            {ALLOWED_BRANCHES.map((br) => (
              <option key={br} value={br}>
                {br}
              </option>
            ))}
          </select>
        </div>

        {/* Study Year Filter */}
        <div>
          <label
            htmlFor="filter-year"
            style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}
          >
            Academic Year
          </label>
          <select
            id="filter-year"
            className="form-select"
            value={filters.studyYear || ''}
            onChange={(e) => handleSelectField('studyYear', e.target.value)}
            style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
          >
            <option value="">All Years</option>
            {ALLOWED_STUDY_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
                {y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label
            htmlFor="filter-sort"
            style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}
          >
            Sort By
          </label>
          <select
            id="filter-sort"
            className="form-select"
            value={filters.sortBy || 'relevance'}
            onChange={(e) => handleSelectField('sortBy', e.target.value)}
            style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
          >
            <option value="relevance">Default (Relevance)</option>
            <option value="name">Name (A-Z)</option>
            <option value="college">College (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Expanded Filter Panel: Skill & Interest Chips */}
      {expanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Skill Filter Chips */}
          <div style={{ marginBottom: '14px' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Filter by Skill:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMMON_SKILLS.map((skill) => (
                <SkillTag
                  key={skill}
                  skill={skill}
                  size="sm"
                  selected={filters.skill === skill}
                  onClick={handleToggleSkill}
                />
              ))}
            </div>
          </div>

          {/* Interest Filter Chips */}
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Filter by Interest:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMMON_INTERESTS.map((interest) => {
                const isSelected = filters.interest === interest;
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: isSelected ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentFilters;

