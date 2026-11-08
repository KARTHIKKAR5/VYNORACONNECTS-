import React from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck, User, Calendar, Tag, Layers, Share2 } from 'lucide-react';

export function ResourceDetails({ resource, onBack }) {
  if (!resource) {
    return (
      <div className="details-wrapper">
        <button type="button" onClick={onBack} className="btn btn-secondary btn-sm" id="btn-back-to-resources">
          <ArrowLeft size={16} /> Back to Resources
        </button>
        <div className="empty-state" style={{ marginTop: '24px' }}>
          <h3>Resource Not Found</h3>
          <p>The requested educational resource could not be found or has been removed.</p>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    type,
    tags = [],
    contributor,
    sourceUrl,
    createdAt,
    isVerified,
  } = resource;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Resource link copied to clipboard!');
    }
  };

  return (
    <div className="details-wrapper">
      <div className="back-btn-row">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          id="btn-back-to-resources"
        >
          <ArrowLeft size={16} />
          Back to Resources
        </button>
      </div>

      <article className="details-card">
        <div className="details-header">
          <div className="details-pill-row">
            <span className={`card-type-badge badge-${type || 'notes'}`}>
              {type || 'Resource'}
            </span>
            <span className="tag-badge" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
              {category}
            </span>
            {isVerified ? (
              <span className="verified-pill">
                <ShieldCheck size={14} />
                Verified Academic Resource
              </span>
            ) : (
              <span className="unverified-pill" style={{ fontSize: '0.8rem' }}>
                Community Submitted
              </span>
            )}
          </div>

          <h1 className="details-title">{title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {contributor && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="var(--accent-primary)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{contributor.name}</span>
                {contributor.college && <span>({contributor.college})</span>}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} />
              <span>Published {formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div>
            <div className="info-tile-label">Category</div>
            <div className="info-tile-val">{category || 'General'}</div>
          </div>
          <div>
            <div className="info-tile-label">Resource Format</div>
            <div className="info-tile-val" style={{ textTransform: 'capitalize' }}>
              {type || 'Study Material'}
            </div>
          </div>
          <div>
            <div className="info-tile-label">Trust Status</div>
            <div className="info-tile-val" style={{ color: isVerified ? 'var(--accent-success)' : 'var(--text-secondary)' }}>
              {isVerified ? 'Official / Verified' : 'Community Shared'}
            </div>
          </div>
        </div>

        <div className="details-section-title">
          <Layers size={18} />
          Resource Overview & Content
        </div>

        <div className="details-body-text">{description}</div>

        {tags.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div className="details-section-title">
              <Tag size={16} />
              Topics & Skill Keywords
            </div>
            <div className="card-tags">
              {tags.map((tag, idx) => (
                <span key={idx} className="tag-badge" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="details-action-bar">
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-outline"
              id="btn-share-resource"
            >
              <Share2 size={16} />
              Share Link
            </button>
          </div>

          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              id="btn-open-external-source"
            >
              <ExternalLink size={16} />
              Open Source Material
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
