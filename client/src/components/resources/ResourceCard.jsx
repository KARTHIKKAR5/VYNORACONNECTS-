import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, User } from 'lucide-react';

export function ResourceCard({ resource, onSelect }) {
  const {
    id,
    title,
    description,
    category,
    type,
    tags = [],
    contributor,
    sourceUrl,
    isVerified,
  } = resource;

  const typeBadgeClass = `badge-${type || 'notes'}`;

  return (
    <article className="card" id={`resource-card-${id}`}>
      <div className="card-top">
        <span className={`card-type-badge ${typeBadgeClass}`}>
          {type || 'Resource'}
        </span>
        {isVerified ? (
          <span className="verified-pill" title="Verified by campus academic board">
            <ShieldCheck size={12} />
            Verified
          </span>
        ) : (
          <span className="unverified-pill">Community</span>
        )}
      </div>

      <h3 className="card-title" onClick={() => onSelect(resource)} style={{ cursor: 'pointer' }}>
        {title}
      </h3>

      <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 600 }}>
        {category}
      </div>

      <p className="card-description">{description}</p>

      {tags.length > 0 && (
        <div className="card-tags">
          {tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="tag-badge">
              #{tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="tag-badge">+{tags.length - 4}</span>
          )}
        </div>
      )}

      <div className="card-meta-row">
        {contributor && (
          <div className="meta-item" title={contributor.college || 'Student Contributor'}>
            <User size={14} />
            <span>{contributor.name}</span>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button
          type="button"
          onClick={() => onSelect(resource)}
          className="btn btn-secondary btn-sm"
          id={`btn-view-resource-${id}`}
        >
          <BookOpen size={14} />
          View Details
        </button>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            title="Open external source (opens in new tab)"
            id={`link-source-${id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
            Source
          </a>
        )}
      </div>
    </article>
  );
}
