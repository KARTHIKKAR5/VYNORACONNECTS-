import React, { useState } from 'react';
import {
  Briefcase,
  ExternalLink,
  Clock,
  MapPin,
  Bookmark,
  Calendar,
} from 'lucide-react';
import { getDeadlineInfo } from '../../utils/deadlineUtils.js';
import { toggleSaveOpportunity } from '../../services/opportunitiesService.js';

export function OpportunityCard({ opportunity, onSelect }) {
  const {
    id,
    title,
    organizerName,
    type,
    description,
    deadlineAt,
    mode,
    city,
    stipendDescription,
    prizeDescription,
    applicationUrl,
    skills = [],
    isSaved: initialSaved = false,
    trackerStatus,
  } = opportunity;

  const [isSaved, setIsSaved] = useState(initialSaved);
  const deadlineInfo = getDeadlineInfo(deadlineAt);

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    const res = await toggleSaveOpportunity(id);
    setIsSaved(res.isSaved);
  };

  const typeBadgeClass = `badge-${type || 'internship'}`;
  const urgencyClass = `urgency-${deadlineInfo.urgency}`;

  return (
    <article className="card" id={`opp-card-${id}`}>
      <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className={`card-type-badge ${typeBadgeClass}`}>
            {type ? type.replace('_', ' ') : 'Opportunity'}
          </span>
          <span className={`deadline-badge ${urgencyClass}`}>
            <Clock size={11} />
            {deadlineInfo.label}
          </span>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={handleSaveToggle}
          title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
          aria-label="Save opportunity"
          style={{ color: isSaved ? 'var(--accent-primary)' : 'var(--text-muted)' }}
        >
          <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3 className="card-title" onClick={() => onSelect(opportunity)} style={{ cursor: 'pointer', marginTop: '8px' }}>
        {title}
      </h3>

      <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
        {organizerName}
      </div>

      <p className="card-description">{description}</p>

      {/* Highlights: Compensation or Prize */}
      {(stipendDescription || prizeDescription) && (
        <div style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 600, margin: '8px 0' }}>
          💰 {stipendDescription || prizeDescription}
        </div>
      )}

      {skills.length > 0 && (
        <div className="card-tags">
          {skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="tag-badge">
              #{skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="tag-badge">+{skills.length - 3}</span>
          )}
        </div>
      )}

      <div className="card-meta-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="meta-item">
          <MapPin size={13} />
          <span>{mode === 'online' ? 'Online / Remote' : (city || mode)}</span>
        </div>

        <div className="meta-item">
          <Calendar size={13} />
          <span>Due: {deadlineInfo.formattedDate}</span>
        </div>
      </div>

      <div className="card-footer">
        <button
          type="button"
          onClick={() => onSelect(opportunity)}
          className="btn btn-secondary btn-sm"
          id={`btn-view-opp-${id}`}
        >
          <Briefcase size={14} />
          Details
        </button>

        {applicationUrl && (
          <a
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            title="Open official registration or application page"
            id={`link-apply-${id}`}
            onClick={(e) => e.stopPropagation()}
            style={{ opacity: deadlineInfo.isExpired ? 0.6 : 1 }}
          >
            <ExternalLink size={14} />
            {deadlineInfo.isExpired ? 'Closed' : 'Apply'}
          </a>
        )}
      </div>
    </article>
  );
}

