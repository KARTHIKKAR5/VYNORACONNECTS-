import React from 'react';
import { ExternalLink, ArrowRight, Tag } from 'lucide-react';

export function RecentResourcesSection({ resources = [], onViewAll, onSelectResource }) {
  return (
    <div className="dashboard-card resources-widget-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Shared Study Resources</h3>
          <p className="card-subtitle">Student notes, cheat sheets & roadmaps</p>
        </div>
        <button
          type="button"
          className="link-btn"
          onClick={onViewAll}
        >
          <span>All Resources</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="resources-card-list">
        {resources.map((res) => (
          <div key={res.id} className="resource-preview-item" id={`resource-preview-${res.id}`}>
            <div className="resource-header">
              <span className="resource-category-pill">
                <Tag size={11} />
                {res.category}
              </span>
              <span className="resource-type-badge">{res.type}</span>
            </div>

            <h4 className="resource-title">{res.title}</h4>
            <p className="resource-desc">{res.description}</p>

            <div className="resource-footer">
              <span className="resource-contributor">
                Shared by {res.contributorName || 'Student Contributor'}
              </span>

              <button
                type="button"
                className="btn btn-sm btn-outline resource-action-btn"
                onClick={() => onSelectResource(res)}
              >
                <span>View Resource</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
