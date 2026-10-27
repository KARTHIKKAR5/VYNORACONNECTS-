import React from 'react';
import { Briefcase, Building2, MapPin, Clock, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { getDeadlineInfo } from '../../services/opportunitiesService.js';

export function OpportunityCard({ opportunity, onSelect }) {
  const {
    id,
    title,
    organization,
    type,
    summary,
    eligibility,
    deadline,
    location,
    remote,
    stipendOrPrize,
    applicationUrl,
    isVerified,
  } = opportunity;

  const deadlineInfo = getDeadlineInfo(deadline);
  const typeBadgeClass = `badge-${type || 'internship'}`;

  return (
    <article className="card" id={`opportunity-card-${id}`}>
      <div className="card-top">
        <span className={`card-type-badge ${typeBadgeClass}`}>
          {type || 'Opportunity'}
        </span>
        {isVerified ? (
          <span className="verified-pill" title="Verified campus recruitment/listing">
            <ShieldCheck size={12} />
            Verified
          </span>
        ) : (
          <span className="unverified-pill">Unverified</span>
        )}
      </div>

      <h3 className="card-title" onClick={() => onSelect(opportunity)} style={{ cursor: 'pointer' }}>
        {title}
      </h3>

      <div className="card-org">
        <Building2 size={15} />
        <span>{organization}</span>
      </div>

      <p className="card-description">{summary}</p>

      {eligibility && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Eligibility: </strong>
          {eligibility.length > 80 ? `${eligibility.substring(0, 80)}...` : eligibility}
        </div>
      )}

      <div className="card-meta-row">
        <div className="meta-item">
          <MapPin size={14} />
          <span>{location || (remote ? 'Remote' : 'Location TBA')}</span>
          {remote && (
            <span className="tag-badge" style={{ marginLeft: '4px', color: 'var(--accent-primary)' }}>
              Remote
            </span>
          )}
        </div>

        {stipendOrPrize && (
          <div className="meta-item" style={{ color: 'var(--accent-success)', fontWeight: 600 }}>
            <Award size={14} />
            <span>{stipendOrPrize}</span>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className={`deadline-badge deadline-${deadlineInfo.urgency}`} title={`Deadline: ${deadlineInfo.formattedDate || 'N/A'}`}>
          <Clock size={13} />
          <span>{deadlineInfo.label}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
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
              className="btn btn-outline btn-sm"
              title="Apply via external portal"
              id={`link-apply-${id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              Apply
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
