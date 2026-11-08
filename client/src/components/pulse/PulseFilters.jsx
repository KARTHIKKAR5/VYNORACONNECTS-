import React from 'react';
import { PULSE_FILTERS } from '../../services/pulseService.js';
import { Activity, Flame, Users, Briefcase, Calendar, FolderGit2 } from 'lucide-react';

export function PulseFilters({ activeFilter, onFilterChange }) {
  const getFilterIcon = (id) => {
    switch (id) {
      case 'all':
        return Flame;
      case 'connections':
        return Users;
      case 'opportunities':
        return Briefcase;
      case 'events':
        return Calendar;
      case 'projects':
        return FolderGit2;
      default:
        return Activity;
    }
  };

  return (
    <div className="pulse-filters-bar" role="tablist" aria-label="Pulse feed categories">
      {PULSE_FILTERS.map((filter) => {
        const Icon = getFilterIcon(filter.id);
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`pulse-filter-pill ${isActive ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
            id={`pulse-filter-${filter.id}`}
          >
            <Icon size={14} />
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
