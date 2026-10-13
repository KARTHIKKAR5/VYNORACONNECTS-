import React, { useState } from 'react';

export function MyListingsView({
  listings = [],
  onEdit,
  onPublish,
  onArchive,
  onCreateNew,
  currentUserName = 'Surya Prakash'
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = listings.filter(l => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="mono-status-pill status-published">● Published</span>;
      case 'DRAFT':
        return <span className="mono-status-pill status-draft">○ Draft</span>;
      case 'ARCHIVED':
        return <span className="mono-status-pill status-archived">✕ Archived</span>;
      default:
        return <span className="mono-status-pill">{status}</span>;
    }
  };

  return (
    <div className="mono-my-listings-view">
      {/* Header bar */}
      <div className="mono-view-header">
        <div>
          <span className="mono-badge mono-badge-subtle font-mono">PROVIDER PORTAL</span>
          <h2 className="mono-view-title">My Service Offerings</h2>
          <p className="mono-view-desc">
            Manage your peer listings, drafts, pricing models, and catalog visibility.
          </p>
        </div>
        <button className="mono-btn mono-btn-primary" onClick={onCreateNew}>
          + Create New Listing
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="mono-status-tabs-row">
        {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map(st => (
          <button
            key={st}
            className={`mono-status-tab-btn ${statusFilter === st ? 'active' : ''}`}
            onClick={() => setStatusFilter(st)}
          >
            {st} ({listings.filter(l => st === 'ALL' || l.status === st).length})
          </button>
        ))}
      </div>

      {/* Listings Table / Cards */}
      {filtered.length === 0 ? (
        <div className="mono-empty-state">
          <span className="mono-empty-icon">📁</span>
          <h4>No {statusFilter.toLowerCase()} listings found</h4>
          <p>You haven't created any service listings under this filter yet.</p>
          <button className="mono-btn mono-btn-secondary" onClick={onCreateNew}>
            Create Service Listing
          </button>
        </div>
      ) : (
        <div className="mono-my-listings-list">
          {filtered.map(item => (
            <div key={item.id} className="mono-my-listing-row">
              <div className="mono-row-info">
                <div className="mono-row-title-line">
                  <h4 className="mono-row-title">{item.title}</h4>
                  {getStatusBadge(item.status)}
                </div>
                <p className="mono-row-summary">{item.summary}</p>
                <div className="mono-row-meta font-mono">
                  <span>Category: {item.category}</span>
                  <span>•</span>
                  <span>
                    Price:{' '}
                    {item.pricing?.model === 'NEGOTIABLE'
                      ? 'Negotiable'
                      : `₹${Number(item.pricing?.amount).toLocaleString()} (${item.pricing?.model})`}
                  </span>
                  <span>•</span>
                  <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mono-row-actions">
                <button
                  className="mono-btn mono-btn-sm mono-btn-outline"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>

                {item.status === 'DRAFT' && (
                  <button
                    className="mono-btn mono-btn-sm mono-btn-primary"
                    onClick={() => onPublish(item.id)}
                  >
                    Publish
                  </button>
                )}

                {item.status === 'PUBLISHED' && (
                  <button
                    className="mono-btn mono-btn-sm mono-btn-danger"
                    onClick={() => {
                      if (window.confirm(`Archive listing "${item.title}"? It will be hidden from public browsing.`)) {
                        onArchive(item.id);
                      }
                    }}
                  >
                    Archive
                  </button>
                )}

                {item.status === 'ARCHIVED' && (
                  <button
                    className="mono-btn mono-btn-sm mono-btn-outline"
                    onClick={() => onPublish(item.id)}
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListingsView;
