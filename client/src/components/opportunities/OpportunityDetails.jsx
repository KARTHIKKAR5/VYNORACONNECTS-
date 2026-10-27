import React from 'react';
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Award,
  CheckCircle,
  AlertTriangle,
  Share2,
} from 'lucide-react';
import { getDeadlineInfo } from '../../services/opportunitiesService.js';

export function OpportunityDetails({ opportunity, onBack }) {
  if (!opportunity) {
    return (
      <div className="details-wrapper">
        <button type="button" onClick={onBack} className="btn btn-secondary btn-sm" id="btn-back-to-opps">
          <ArrowLeft size={16} /> Back to Opportunities
        </button>
        <div className="empty-state" style={{ marginTop: '24px' }}>
          <h3>Opportunity Not Found</h3>
          <p>The requested listing could not be found or has been removed from the platform.</p>
        </div>
      </div>
    );
  }

  const {
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Opportunity link copied to clipboard!');
    }
  };

  return (
    <div className="details-wrapper">
      <div className="back-btn-row">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          id="btn-back-to-opps"
        >
          <ArrowLeft size={16} />
          Back to Opportunities
        </button>
      </div>

      <article className="details-card">
        <div className="details-header">
          <div className="details-pill-row">
            <span className={`card-type-badge badge-${type || 'internship'}`}>
              {type || 'Opportunity'}
            </span>
            <div className={`deadline-badge deadline-${deadlineInfo.urgency}`}>
              <Clock size={13} />
              <span>{deadlineInfo.label}</span>
            </div>
            {isVerified ? (
              <span className="verified-pill">
                <ShieldCheck size={14} />
                Verified Opportunity
              </span>
            ) : (
              <span className="unverified-pill">Unverified Listing</span>
            )}
          </div>

          <h1 className="details-title">{title}</h1>

          <div className="details-org" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} />
            <span>{organization}</span>
          </div>

          {deadlineInfo.isExpired && (
            <div className="error-banner" style={{ marginTop: '16px', marginBottom: '0' }}>
              <AlertTriangle size={20} className="error-banner-icon" />
              <div>
                <div className="error-title">Application Deadline Has Passed</div>
                <div className="error-desc">
                  This opportunity closed on {deadlineInfo.formattedDate}. Applications are likely no longer accepted.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="details-grid">
          <div>
            <div className="info-tile-label">Location / Mode</div>
            <div className="info-tile-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="var(--accent-primary)" />
              {location || (remote ? 'Remote' : 'Location TBA')}
              {remote && <span className="tag-badge">Remote</span>}
            </div>
          </div>

          <div>
            <div className="info-tile-label">Deadline</div>
            <div className="info-tile-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="var(--accent-primary)" />
              {deadlineInfo.formattedDate || 'Not specified'}
            </div>
          </div>

          {stipendOrPrize && (
            <div>
              <div className="info-tile-label">Compensation / Prize</div>
              <div className="info-tile-val" style={{ color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={15} />
                {stipendOrPrize}
              </div>
            </div>
          )}

          <div>
            <div className="info-tile-label">Verification Status</div>
            <div className="info-tile-val" style={{ color: isVerified ? 'var(--accent-success)' : 'var(--text-secondary)' }}>
              {isVerified ? 'Campus Verified' : 'Community Submitted'}
            </div>
          </div>
        </div>

        <div className="details-section-title">
          <BriefcaseIcon size={18} />
          Role Overview & Description
        </div>
        <div className="details-body-text">{summary}</div>

        {eligibility && (
          <div style={{ marginBottom: '28px' }}>
            <div className="details-section-title">
              <CheckCircle size={18} color="var(--accent-primary)" />
              Eligibility Criteria
            </div>
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}
            >
              {eligibility}
            </div>
          </div>
        )}

        <div className="details-action-bar">
          <button
            type="button"
            onClick={handleShare}
            className="btn btn-outline"
            id="btn-share-opp"
          >
            <Share2 size={16} />
            Share Listing
          </button>

          {applicationUrl && (
            <a
              href={applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn ${deadlineInfo.isExpired ? 'btn-secondary' : 'btn-primary'}`}
              id="btn-apply-external"
            >
              <ExternalLink size={16} />
              {deadlineInfo.isExpired ? 'View Closed Application Portal' : 'Apply on Official Site'}
            </a>
          )}
        </div>
      </article>
    </div>
  );
}

function BriefcaseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}
