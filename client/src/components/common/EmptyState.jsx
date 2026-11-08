import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export function EmptyState({
  title = 'No records found',
  description = 'No results match your current filters. Try refining your search query or resetting filters.',
  onReset,
  actionLabel = 'Reset Filters',
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">
        <SearchX size={28} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-text">{description}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          id="btn-empty-reset"
        >
          <RotateCcw size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
