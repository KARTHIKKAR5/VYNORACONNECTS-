import React, { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  User,
  Calendar,
  ThumbsUp,
  Bookmark,
  Flag,
  Share2,
} from 'lucide-react';
import { toggleBookmarkResource, upvoteResource } from '../../services/resourcesService.js';
import { ReportListingModal } from '../common/ReportListingModal.jsx';

export function ResourceDetails({ resource, onBack }) {
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
    difficulty = 'beginner',
    createdAt,
    upvotesCount: initialUpvotes = 0,
    hasUpvoted: initialHasUpvoted = false,
    isBookmarked: initialBookmarked = false,
  } = resource;

  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBookmarkToggle = async () => {
    const res = await toggleBookmarkResource(id);
    setIsBookmarked(res.isBookmarked);
  };

  const handleUpvoteToggle = async () => {
    const res = await upvoteResource(id);
    setUpvotes(res.upvotesCount);
    setHasUpvoted(res.hasUpvoted);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="details-container">
      <button type="button" onClick={onBack} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} />
        Back to Resources
      </button>

      <div className="card details-card">
        <div className="details-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <span className={`card-type-badge badge-${type || 'notes'}`}>{type || 'Resource'}</span>
            <span className="tag-badge">{category}</span>
            <span className="tag-badge">{branch}</span>
            <span className="tag-badge" style={{ textTransform: 'capitalize' }}>{difficulty}</span>
            {isVerified && (
              <span className="verified-pill">
                <ShieldCheck size={12} /> Verified
              </span>
            )}
          </div>

          <h1 className="details-title">{title}</h1>

          <div className="details-meta-bar">
            {contributor && (
              <div className="meta-item">
                <User size={15} />
                <span>Contributed by <strong>{contributor.name}</strong> ({contributor.college || 'Vynora Campus'})</span>
              </div>
            )}
            {createdAt && (
              <div className="meta-item">
                <Calendar size={15} />
                <span>Published on {new Date(createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="details-body">
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Overview &amp; Notes</h4>
          <p className="details-description" style={{ whiteSpace: 'pre-line' }}>{description}</p>

          {tags.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.85rem' }}>Topic Tags</h4>
              <div className="card-tags">
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag-badge">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="details-actions-bar">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={16} />
                Open Resource Link
              </a>
            )}

            <button
              type="button"
              className={`btn ${isBookmarked ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleBookmarkToggle}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              {isBookmarked ? 'Saved to Bookmarks' : 'Save Resource'}
            </button>

            <button
              type="button"
              className={`btn ${hasUpvoted ? 'btn-primary' : 'btn-outline'}`}
              onClick={handleUpvoteToggle}
            >
              <ThumbsUp size={16} fill={hasUpvoted ? 'currentColor' : 'none'} />
              <span>{upvotes} Upvotes</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleShare}>
              <Share2 size={14} />
              {copied ? 'Link Copied' : 'Share'}
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setIsReportOpen(true)}
              style={{ color: 'var(--accent-danger)' }}
              title="Report broken link or incorrect material"
            >
              <Flag size={14} />
              Report
            </button>
          </div>
        </div>
      </div>

      <ReportListingModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="resource"
        targetId={id}
        targetTitle={title}
      />
    </div>
  );
}

