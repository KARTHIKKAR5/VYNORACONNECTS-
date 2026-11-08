import React, { useState, useEffect } from 'react';
import { getProjectApplicants, reviewApplicant } from '../../services/projectsService.js';
import { pointsServiceAdapter } from '../../services/pointsServiceAdapter.js';

export function ApplicantManager({ project, onClose, onApplicantReviewed, currentUserId = 'usr-current-student' }) {
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'
  const [feedbackMap, setFeedbackMap] = useState({});
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const pointsStatus = pointsServiceAdapter.getIntegrationStatus();

  const loadApplicants = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const data = await getProjectApplicants(project.id, currentUserId);
      setApplicants(data);
    } catch (err) {
      setActionError(err.message || 'Failed to load applicants.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [project.id]);

  const handleDecision = async (requestId, decision) => {
    setActionError(null);
    setActionSuccess(null);
    const feedback = feedbackMap[requestId] || '';

    try {
      await reviewApplicant(requestId, decision, feedback, currentUserId);
      setActionSuccess(`Application successfully marked as ${decision}.`);
      await loadApplicants();
      onApplicantReviewed();
    } catch (err) {
      setActionError(err.message || 'Failed to process decision.');
    }
  };

  const pendingList = applicants.filter(a => a.status === 'pending');
  const historyList = applicants.filter(a => a.status !== 'pending');
  const currentCapacity = project.team?.members?.length || 1;
  const maxCapacity = project.team?.maxCapacity || 8;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="applicant-mgr-title">
      <div className="modal-container modal-lg">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-badge-row">
              <span className="category-badge">{project.category}</span>
              <span className="capacity-badge">
                Team Capacity: {currentCapacity} / {maxCapacity}
              </span>
            </div>
            <h2 className="modal-title" id="applicant-mgr-title">
              Applicant Management &amp; Review
            </h2>
            <p className="modal-subtitle">Project: <strong>{project.title}</strong></p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Points & Integration Callout */}
        <div className="integration-status-banner">
          <div className="status-indicator-dot" />
          <div className="status-text">
            <strong>{pointsStatus.statusLabel}</strong>
            <p>{pointsStatus.message}</p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="applicant-tabs-bar">
          <button
            type="button"
            className={`applicant-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Applications ({pendingList.length})
          </button>
          <button
            type="button"
            className={`applicant-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Review History ({historyList.length})
          </button>
        </div>

        {/* Feedback Banners */}
        {actionError && <div className="error-banner">{actionError}</div>}
        {actionSuccess && <div className="feedback-banner success">{actionSuccess}</div>}

        {/* Body List */}
        <div className="modal-body">
          {isLoading ? (
            <div className="loading-state">Loading applicant records...</div>
          ) : activeTab === 'pending' ? (
            pendingList.length === 0 ? (
              <div className="empty-panel">
                <p>No pending applications at this time.</p>
                <span className="empty-sub">
                  When students apply for your open roles, their applications and verified profile summaries will appear here.
                </span>
              </div>
            ) : (
              <div className="applicants-list">
                {pendingList.map(req => {
                  const profile = req.applicantProfile;
                  return (
                    <div key={req.id} className="applicant-card">
                      {/* Candidate Header from Ram's profile module */}
                      <div className="applicant-card-header">
                        <div className="applicant-profile-snippet">
                          <div className="candidate-avatar">{profile?.avatar || 'S'}</div>
                          <div>
                            <h4 className="candidate-name">{profile?.name}</h4>
                            <p className="candidate-meta">
                              {profile?.college} &bull; {profile?.department} ({profile?.year})
                            </p>
                            {profile?.resumeHeadline && (
                              <p className="candidate-headline">{profile.resumeHeadline}</p>
                            )}
                          </div>
                        </div>

                        <div className="applied-for-pill">
                          <span>Role:</span>
                          <strong>{req.roleTitle}</strong>
                        </div>
                      </div>

                      {/* Pitch & Experience */}
                      <div className="applicant-pitch-box">
                        <span className="pitch-label">Introduction / Pitch:</span>
                        <p className="pitch-text">{req.introduction}</p>
                      </div>

                      <div className="applicant-pitch-box">
                        <span className="pitch-label">Relevant Experience:</span>
                        <p className="pitch-text">{req.experienceSummary}</p>
                      </div>

                      {/* Verified Skills */}
                      {profile?.verifiedSkills && profile.verifiedSkills.length > 0 && (
                        <div className="verified-skills-row">
                          <span className="verified-label">Verified Profile Skills:</span>
                          {profile.verifiedSkills.map((s, idx) => (
                            <span key={idx} className="skill-pill verified">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Reviewer Feedback Input & Actions */}
                      <div className="applicant-actions-row">
                        <input
                          type="text"
                          className="form-control feedback-input"
                          placeholder="Optional feedback or onboarding note for the applicant..."
                          value={feedbackMap[req.id] || ''}
                          onChange={e =>
                            setFeedbackMap({ ...feedbackMap, [req.id]: e.target.value })
                          }
                        />

                        <div className="btn-group-decision">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDecision(req.id, 'rejected')}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleDecision(req.id, 'accepted')}
                            disabled={currentCapacity >= maxCapacity}
                            title={currentCapacity >= maxCapacity ? 'Team is at maximum capacity' : ''}
                          >
                            Accept &amp; Add to Team
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            historyList.length === 0 ? (
              <div className="empty-panel">
                <p>No previous application decisions recorded.</p>
              </div>
            ) : (
              <div className="applicants-list">
                {historyList.map(req => (
                  <div key={req.id} className="history-card">
                    <div className="history-header">
                      <div>
                        <strong>{req.applicant?.name}</strong> applied for <strong>{req.roleTitle}</strong>
                        <p className="history-date">
                          Reviewed: {new Date(req.reviewedAt || req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`decision-badge badge-${req.status}`}>
                        {req.status === 'accepted' ? 'Accepted Member' : 'Rejected'}
                      </span>
                    </div>
                    {req.reviewerFeedback && (
                      <p className="history-feedback">Feedback: "{req.reviewerFeedback}"</p>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicantManager;

