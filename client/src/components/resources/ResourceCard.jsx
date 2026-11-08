import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, User, Bookmark, ThumbsUp } from 'lucide-react';
import { toggleBookmarkResource, upvoteResource } from '../../services/resourcesService.js';

export function ResourceCard({ resource, onSelect }) {
  const {
    id,
    title,
    description,
    category,
    branch = 'General',
    type,
    tags = [],
    contributor,
    sourceUrl,
    isVerified,
    upvotesCount: initialUpvotes = 0,
    hasUpvoted: initialHasUpvoted = false,
    isBookmarked: initialBookmarked = false,
  } = resource;

  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);

  const handleBookmarkToggle = async (e) => {
    e.stopPropagation();
    const res = await toggleBookmarkResource(id);
    setIsBookmarked(res.isBookmarked);
  };

  const handleUpvoteToggle = async (e) => {
    e.stopPropagation();
    const res = await upvoteResource(id);
    setUpvotes(res.upvotesCount);
    setHasUpvoted(res.hasUpvoted);
  };

  const typeBadgeClass = `badge-${type || 'notes'}`;

  return (
    <article className="card" id={`resource-card-${id}`}>
      <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className={`card-type-badge ${typeBadgeClass}`}>
            {type || 'Resource'}
          </span>
          {branch && branch !== 'All' && (
            <span className="tag-badge" style={{ color: 'var(--text-secondary)' }}>
              {branch}
            </span>
          )}
        </div>

        <button
          type="button"
          className={`btn-icon ${isBookmarked ? 'active-bookmark' : ''}`}
          onClick={handleBookmarkToggle}
          title={isBookmarked ? 'Remove from Saved' : 'Save Resource'}
          aria-label="Bookmark resource"
          style={{ color: isBookmarked ? 'var(--accent-primary)' : 'var(--text-muted)' }}
        >
          <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3 className="card-title" onClick={() => onSelect(resource)} style={{ cursor: 'pointer', marginTop: '8px' }}>
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

      <div className="card-meta-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {contributor && (
          <div className="meta-item" title={contributor.college || 'Student Contributor'}>
            <User size={13} />
            <span>{contributor.name}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleUpvoteToggle}
          className="meta-item"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: hasUpvoted ? 'var(--accent-primary)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
          }}
          title="Upvote this resource"
        >
          <ThumbsUp size={13} fill={hasUpvoted ? 'currentColor' : 'none'} />
          <span>{upvotes}</span>
        </button>
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

