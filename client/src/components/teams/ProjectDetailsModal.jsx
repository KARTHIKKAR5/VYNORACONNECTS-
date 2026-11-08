import React, { useState } from 'react';
import { calculateAvailablePositions } from '../../services/projectsService.js';
import { chatIntegrationAdapter } from '../../services/chatIntegrationAdapter.js';
import { moderationAdapter, REPORT_REASONS } from '../../services/moderationAdapter.js';

export function ProjectDetailsModal({
  project,
  onClose,
  onApply,
  onEdit,
  onManageTeam,
  onViewTasks,
  currentUserId = 'usr-current-student',
  hasPendingApplication = false,
  isEligibleCampus = true,
}) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState('');
  const [reportFeedback, setReportFeedback] = useState(null);

  if (!project) return null;

  const isMember = project.team?.members?.some(m => m.userId === currentUserId);
  const userMemberRecord = project.team?.members?.find(m => m.userId === currentUserId);
  const isOwner = userMemberRecord?.role === 'owner';
  const isManager = userMemberRecord?.role === 'manager';
  const canManage = isOwner || isManager;
  const availablePositions = calculateAvailablePositions(project);
  const isRecruiting = availablePositions > 0;

  const handleReport = async (e) => {
    e.preventDefault();
    const res = await moderationAdapter.reportProject(
      project.id,
      project.title,
      reportReason,
      reportDetails,
      currentUserId
    );
    setReportFeedback(res.message);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportFeedback(null);
    }, 2000);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-proj-title">
      <div className="modal-container modal-lg">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="modal-badge-row">
              <span className="category-badge">{project.category}</span>
              <span className="visibility-badge">{project.visibility}</span>
              {isRecruiting ? (
                <span className="recruiting-pill">
                  <span className="pill-dot active" />
                  {availablePositions === 1 ? '1 Opening Available' : `${availablePositions} Openings Available`}
                </span>
              ) : (
                <span className="staffed-pill">
                  <span className="pill-dot staffed" />
                  Fully Staffed
                </span>
              )}
            </div>
            <h2 className="modal-title" id="modal-proj-title">{project.title}</h2>
            <p className="modal-subtitle">{project.tagline}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status Banners for Non-Members */}
          {!isMember && (
            <>
              {hasPendingApplication && (
                <div className="pending-application-banner" role="status">
                  <strong>Application Submitted</strong>: You have an active join request pending review by the project owner. You will be notified once a decision is made.
                </div>
              )}

              {!hasPendingApplication && !isEligibleCampus && (
                <div className="unavailable-state-banner" role="status">
                  <strong>Campus Eligibility Notice</strong>: This initiative is designated as campus-only and restricted to students enrolled at <strong>{project.lead?.college || 'the host university'}</strong>.
                </div>
              )}

              {!hasPendingApplication && isEligibleCampus && !isRecruiting && (
                <div className="unavailable-state-banner" role="status">
                  <strong>Positions Filled</strong>: This project is currently fully staffed ({project.team?.members?.length || 0} / {project.team?.maxCapacity || 0} members) and not accepting new applications.
                </div>
              )}
            </>
          )}

          {/* Tech Stack */}
          {project.tags && project.tags.length > 0 && (
            <div className="detail-section">
              <h4 className="section-label">Technology Stack</h4>
              <div className="card-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tech-tag">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Problem Statement & Goals */}
          <div className="detail-grid-2">
            <div className="detail-box">
              <h4 className="section-label">Problem Statement</h4>
              <p className="detail-text">{project.problemStatement || project.summary}</p>
            </div>
            <div className="detail-box">
              <h4 className="section-label">Project Goals</h4>
              <p className="detail-text">{project.goals || project.description}</p>
            </div>
          </div>

          {/* Full Description */}
          <div className="detail-section">
            <h4 className="section-label">Project Description & Architecture</h4>
            <p className="detail-text">{project.description}</p>
          </div>

          {/* Recruitment Requirements */}
          {project.recruitmentRequirements && (
            <div className="detail-section highlight-box">
              <h4 className="section-label">Recruitment Expectations</h4>
              <p className="detail-text">{project.recruitmentRequirements}</p>
            </div>
          )}

          {/* Open Positions List */}
          <div className="detail-section">
            <div className="section-header-row">
              <h4 className="section-label">Team Positions &amp; Openings</h4>
              <span className="section-counter">
                {availablePositions > 0
                  ? `${availablePositions} opening(s) available`
                  : 'All positions filled'}
              </span>
            </div>

            {project.openRoles && project.openRoles.length > 0 ? (
              <div className="roles-list">
                {project.openRoles.map(role => {
                  const remaining = Math.max(0, (role.openings || 1) - (role.filled || 0));
                  const isRoleOpen = role.status === 'open' && remaining > 0;

                  return (
                    <div key={role.id} className={`role-card ${!isRoleOpen ? 'role-filled' : ''}`}>
                      <div className="role-header">
                        <div>
                          <h5 className="role-title">{role.title}</h5>
                          {role.description && <p className="role-desc">{role.description}</p>}
                        </div>
                        <span className={`role-status-badge ${isRoleOpen ? 'open' : 'closed'}`}>
                          {isRoleOpen
                            ? `${remaining} ${remaining === 1 ? 'seat' : 'seats'} available`
                            : 'Position Filled'}
                        </span>
                      </div>

                      {role.skillsRequired && role.skillsRequired.length > 0 && (
                        <div className="role-skills">
                          <span className="skills-label">Required:</span>
                          {role.skillsRequired.map((s, idx) => (
                            <span key={idx} className="skill-pill">{s}</span>
                          ))}
                        </div>
                      )}

                      {!isMember && isRoleOpen && (
                        <div className="role-action-row" style={{ marginTop: '8px' }}>
                          {hasPendingApplication ? (
                            <span className="pending-pill">Application Pending</span>
                          ) : !isEligibleCampus ? (
                            <span className="restricted-pill">Campus Restricted</span>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm role-apply-btn"
                              onClick={() => {
                                onClose();
                                onApply(project, role.id);
                              }}
                            >
                              Apply for this Role
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="empty-inline-text">No distinct recruitment positions configured.</p>
            )}
          </div>

          {/* Team Member Roster */}
          <div className="detail-section">
            <div className="section-header-row">
              <h4 className="section-label">Team Members</h4>
              <span className="section-counter">
                {project.team?.members?.length || 1} / {project.team?.maxCapacity || 8} Members
              </span>
            </div>

            <div className="team-roster-grid">
              {(project.team?.members || []).map((m, idx) => (
                <div key={idx} className="roster-card">
                  <div className="roster-avatar">{m.name?.charAt(0) || 'U'}</div>
                  <div className="roster-info">
                    <span className="roster-name">{m.name}</span>
                    <span className="roster-college">{m.college || 'Vynora Campus'}</span>
                    <span className="roster-role-title">{m.assignedRoleTitle || 'Collaborator'}</span>
                  </div>
                  <span className={`member-role-badge role-${m.role}`}>
                    {m.role === 'owner' ? 'Lead' : m.role === 'manager' ? 'Manager' : 'Member'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Integration for Team Members */}
          {isMember && (
            <div className="chat-integration-banner">
              <div>
                <strong>Team Communication Channel</strong>
                <p>Real-time group messaging is linked to Siri's communication system using canonical team ID ({project.team?.id}).</p>
              </div>
              <a
                href={chatIntegrationAdapter.getChatRoomUrl(project.team?.id)}
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Connecting to Siri's shared chat channel for Team: ${project.team?.name} (${project.team?.id})`);
                }}
              >
                Open Team Chat Room
              </a>
            </div>
          )}

          {/* Report Project Link */}
          <div className="report-row">
            <button
              type="button"
              className="report-link"
              onClick={() => setReportModalOpen(true)}
            >
              Report this project to Moderation
            </button>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {canManage && (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  onClose();
                  onEdit(project);
                }}
              >
                Edit Project Details
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onManageTeam(project);
                }}
              >
                Manage Team &amp; Applicants
              </button>
            </>
          )}

          {isMember && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onViewTasks(project);
              }}
            >
              Team Tasks Checklist
            </button>
          )}

          {/* Non-member Apply / Status states */}
          {!isMember && (
            hasPendingApplication ? (
              <span className="pending-pill">Application Pending Review</span>
            ) : !isEligibleCampus ? (
              <span className="restricted-pill">Restricted to Campus Students</span>
            ) : isRecruiting ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onApply(project);
                }}
              >
                Apply to Join Team
              </button>
            ) : (
              <span className="staffed-text">Project Fully Staffed</span>
            )
          )}
        </div>
      </div>

      {/* Moderation Report Sub-Modal */}
      {reportModalOpen && (
        <div className="sub-modal-backdrop">
          <div className="sub-modal-card">
            <h4>Report Project to Trust &amp; Safety</h4>
            <p>Our moderation team reviews reported projects to maintain a safe campus environment.</p>

            {reportFeedback ? (
              <div className="feedback-banner success">{reportFeedback}</div>
            ) : (
              <form onSubmit={handleReport}>
                <div className="form-group">
                  <label className="form-label">Reason for reporting:</label>
                  <select
                    className="form-control"
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                  >
                    {REPORT_REASONS.map((r, idx) => (
                      <option key={idx} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Details:</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Provide specific details..."
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                  />
                </div>

                <div className="modal-footer-inline">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setReportModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger btn-sm">
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetailsModal;
