import React, { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Clock,
  Calendar,
  Bookmark,
  Users,
  Flag,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { getDeadlineInfo } from '../../utils/deadlineUtils.js';
import {
  toggleSaveOpportunity,
  updateOpportunityTrackerStatus,
  TRACKER_STAGES,
} from '../../services/opportunitiesService.js';
import { ReportListingModal } from '../common/ReportListingModal.jsx';

export function OpportunityDetails({ opportunity, onBack }) {
  const {
    id,
    title,
    organizerName,
    type,
    description,
    eligibility,
    deadlineAt,
    mode,
    city,
    stipendDescription,
    prizeDescription,
    applicationUrl,
    teamMin = 1,
    teamMax = 1,
    skills = [],
    isSaved: initialSaved = false,
    trackerStatus: initialStatus = 'saved',
  } = opportunity;

  const [isSaved, setIsSaved] = useState(initialSaved);
  const [trackerStatus, setTrackerStatus] = useState(initialStatus || 'saved');
  const [notes, setNotes] = useState('');
  const [savingTracker, setSavingTracker] = useState(false);
  const [trackerSavedMsg, setTrackerSavedMsg] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const deadlineInfo = getDeadlineInfo(deadlineAt);

  const handleSaveToggle = async () => {
    const res = await toggleSaveOpportunity(id);
    setIsSaved(res.isSaved);
  };

  const handleUpdateTracker = async () => {
    setSavingTracker(true);
    await updateOpportunityTrackerStatus(id, trackerStatus, notes);
    setIsSaved(true);
    setSavingTracker(false);
    setTrackerSavedMsg(true);
    setTimeout(() => setTrackerSavedMsg(false), 2500);
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
        Back to Opportunities
      </button>

      <div className="card details-card">
        <div className="details-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <span className={`card-type-badge badge-${type || 'internship'}`}>
              {type ? type.replace('_', ' ') : 'Opportunity'}
            </span>
            <span className={`deadline-badge urgency-${deadlineInfo.urgency}`}>
              <Clock size={12} />
              {deadlineInfo.label}
            </span>
            <span className="tag-badge">
              <MapPin size={12} />
              {mode === 'online' ? 'Online / Remote' : (city || mode)}
            </span>
          </div>

          <h1 className="details-title">{title}</h1>

          <div className="details-meta-bar">
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Organized by {organizerName}
            </span>
            <div className="meta-item">
              <Calendar size={15} />
              <span>Application Deadline: <strong>{deadlineInfo.formattedDate}</strong></span>
            </div>
          </div>
        </div>

        <div className="details-body">
          {/* Key Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {(stipendDescription || prizeDescription) && (
              <div className="detail-stat-box">
                <span className="stat-label">Compensation / Prize</span>
                <span className="stat-value" style={{ color: 'var(--accent-success)' }}>
                  {stipendDescription || prizeDescription}
                </span>
              </div>
            )}

            <div className="detail-stat-box">
              <span className="stat-label">Team Size</span>
              <span className="stat-value">
                <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {teamMin === teamMax ? (teamMin === 1 ? 'Individual' : `${teamMin} Members`) : `${teamMin} - ${teamMax} Members`}
              </span>
            </div>

            <div className="detail-stat-box">
              <span className="stat-label">Participation Mode</span>
              <span className="stat-value" style={{ textTransform: 'capitalize' }}>
                {mode}
              </span>
            </div>
          </div>

          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Eligibility &amp; Criteria</h4>
          <p className="details-description">{eligibility}</p>

          <h4 style={{ color: 'var(--text-secondary)', marginTop: '20px', marginBottom: '8px', fontSize: '0.9rem' }}>Role Description &amp; Overview</h4>
          <p className="details-description" style={{ whiteSpace: 'pre-line' }}>{description}</p>

          {skills.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.85rem' }}>Relevant Skills</h4>
              <div className="card-tags">
                {skills.map((skill, idx) => (
                  <span key={idx} className="tag-badge">#{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Application Tracker Section */}
          <div style={{ marginTop: '30px', padding: '18px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bookmark size={16} style={{ color: 'var(--accent-primary)' }} />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Personal Application Tracker</h4>
              </div>
              {trackerSavedMsg && (
                <span style={{ color: 'var(--accent-success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Updated
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Current Stage</label>
                <select
                  className="form-select"
                  value={trackerStatus}
                  onChange={e => setTrackerStatus(e.target.value)}
                >
                  {TRACKER_STAGES.map(stage => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Personal Notes</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Applied via referral, follow up on Friday..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleUpdateTracker}
                disabled={savingTracker}
              >
                {savingTracker ? 'Saving...' : 'Update Stage & Notes'}
              </button>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="details-actions-bar">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {applicationUrl && (
              <a
                href={applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ opacity: deadlineInfo.isExpired ? 0.6 : 1 }}
              >
                <ExternalLink size={16} />
                {deadlineInfo.isExpired ? 'Application Closed' : 'Apply on Official Site'}
              </a>
            )}

            <button
              type="button"
              className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleSaveToggle}
            >
              <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved to Tracker' : 'Save Opportunity'}
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
              title="Report suspicious listing or expired deadline"
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
        targetType="opportunity"
        targetId={id}
        targetTitle={title}
      />
    </div>
  );
}

