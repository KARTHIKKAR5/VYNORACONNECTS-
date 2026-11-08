import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Clock,
} from 'lucide-react';

export function PulseCard({ activity, onActionClick }) {
  const [likes, setLikes] = useState(activity?.metrics?.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!activity) return null;

  const {
    actor,
    activityDescription,
    targetTitle,
    summary,
    badge,
    previewImage,
    timestamp,
    action,
    category,
  } = activity;

  const formatRelativeTime = (isoString) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'opportunity':
        return { color: '#10B981', label: 'Opportunity' };
      case 'events':
        return { color: '#F59E0B', label: 'Event' };
      case 'projects':
        return { color: '#A855F7', label: 'Project' };
      case 'connections':
        return { color: '#6366F1', label: 'Network' };
      case 'resources':
        return { color: '#3B82F6', label: 'Resource' };
      case 'mentorship':
        return { color: '#EC4899', label: 'Mentorship' };
      default:
        return { color: '#6366F1', label: 'Pulse' };
    }
  };

  const theme = getCategoryTheme(category);

  return (
    <article className="pulse-card" id={`pulse-card-${activity.id}`}>
      {/* Header */}
      <div className="pulse-card-header">
        <div className="actor-profile-row">
          {actor?.avatar ? (
            <img src={actor.avatar} alt={actor.name} className="actor-avatar-img" />
          ) : (
            <div className="actor-avatar-placeholder">
              {actor?.name?.charAt(0) || 'V'}
            </div>
          )}

          <div className="actor-details">
            <div className="actor-name-row">
              <span className="actor-name">{actor?.name}</span>
              <span className="actor-action-desc">{activityDescription}</span>
            </div>
            <div className="actor-subtext">
              <span className="actor-college">{actor?.college}</span>
              <span className="dot-separator">•</span>
              <span className="pulse-timestamp">
                <Clock size={11} />
                {formatRelativeTime(timestamp)}
              </span>
            </div>
          </div>
        </div>

        <span
          className="pulse-badge"
          style={{
            backgroundColor: `${theme.color}15`,
            color: theme.color,
            borderColor: `${theme.color}35`,
          }}
        >
          {badge || theme.label}
        </span>
      </div>

      {/* Target Content */}
      <div className="pulse-card-body">
        <h3 className="pulse-target-title">{targetTitle}</h3>
        {summary && <p className="pulse-summary">{summary}</p>}

        {previewImage && (
          <div className="pulse-image-wrapper">
            <img
              src={previewImage}
              alt={targetTitle}
              className="pulse-preview-image"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Actions and Footer */}
      <div className="pulse-card-footer">
        <div className="pulse-social-actions">
          <button
            type="button"
            className={`social-btn ${hasLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title={hasLiked ? 'Unlike' : 'Cheer this activity'}
          >
            <Heart size={16} fill={hasLiked ? '#EF4444' : 'none'} color={hasLiked ? '#EF4444' : 'currentColor'} />
            <span>{likes}</span>
          </button>

          <button
            type="button"
            className="social-btn"
            onClick={() => onActionClick?.(action)}
            title="Comments"
          >
            <MessageCircle size={16} />
            <span>{activity.metrics?.comments || 0}</span>
          </button>

          <button
            type="button"
            className="social-btn share-btn"
            onClick={handleShare}
            title="Share activity link"
          >
            <Share2 size={16} />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {action && (
          <button
            type="button"
            className="btn btn-sm btn-outline pulse-cta-btn"
            onClick={() => onActionClick?.(action)}
          >
            <span>{action.label || 'View Details'}</span>
            <ExternalLink size={13} />
          </button>
        )}
      </div>
    </article>
  );
}
