import React, { useState } from 'react';
import { removeTeamMember, leaveTeam, transferOwnership } from '../../services/projectsService.js';

export function TeamManager({
  project,
  onClose,
  onOpenInvite,
  onTeamUpdated,
  currentUserId = 'usr-current-student',
}) {
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Transfer ownership state
  const [transferConfirmOpen, setTransferConfirmOpen] = useState(false);
  const [selectedTargetUserId, setSelectedTargetUserId] = useState('');

  // Remove confirmation state
  const [removeConfirmTarget, setRemoveConfirmTarget] = useState(null);

  const members = project.team?.members || [];
  const currentUserRecord = members.find(m => m.userId === currentUserId);
  const isOwner = currentUserRecord?.role === 'owner';
  const isManager = currentUserRecord?.role === 'manager';
  const canInvite = isOwner || isManager;

  const handleRemove = async () => {
    if (!removeConfirmTarget) return;
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await removeTeamMember(project.id, removeConfirmTarget.userId, currentUserId);
      setActionSuccess(res.message);
      setRemoveConfirmTarget(null);
      onTeamUpdated();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this project team?')) return;
    setActionError(null);
    try {
      const res = await leaveTeam(project.id, currentUserId);
      setActionSuccess(res.message);
      onTeamUpdated();
      setTimeout(onClose, 1200);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleTransferOwnership = async () => {
    if (!selectedTargetUserId) return;
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await transferOwnership(project.id, selectedTargetUserId, currentUserId);
      setActionSuccess(res.message);
      setTransferConfirmOpen(false);
      onTeamUpdated();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="team-mgr-title">
      <div className="modal-container modal-lg">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-badge-row">
              <span className="category-badge">{project.category}</span>
              <span className="capacity-badge">
                {members.length} / {project.team?.maxCapacity || 8} Members
              </span>
            </div>
            <h2 className="modal-title" id="team-mgr-title">Team Roster &amp; Permissions</h2>
            <p className="modal-subtitle">Team: <strong>{project.team?.name || project.title}</strong></p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Feedback banners */}
        {actionError && <div className="error-banner">{actionError}</div>}
        {actionSuccess && <div className="feedback-banner success">{actionSuccess}</div>}

        {/* Action Bar */}
        <div className="team-action-bar">
          {canInvite && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onOpenInvite(project)}
            >
              + Send Direct Invitation
            </button>
          )}

          {isOwner && members.length > 1 && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setTransferConfirmOpen(true)}
            >
              Transfer Project Ownership
            </button>
          )}

          {!isOwner && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleLeave}
            >
              Leave Team
            </button>
          )}
        </div>

        {/* Member Table / Cards */}
        <div className="modal-body">
          <div className="members-management-list">
            {members.map(member => {
              const isCurrentUser = member.userId === currentUserId;
              const canRemoveThisUser =
                (isOwner && !isCurrentUser) ||
                (isManager && member.role === 'member' && !isCurrentUser);

              return (
                <div key={member.userId} className="member-mgmt-card">
                  <div className="member-mgmt-left">
                    <div className="roster-avatar">{member.name?.charAt(0) || 'U'}</div>
                    <div>
                      <h4 className="member-mgmt-name">
                        {member.name} {isCurrentUser && <span className="you-tag">(You)</span>}
                      </h4>
                      <p className="member-mgmt-meta">
                        {member.college} &bull; Joined: {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                      <p className="member-mgmt-assigned">{member.assignedRoleTitle}</p>
                    </div>
                  </div>

                  <div className="member-mgmt-right">
                    <span className={`member-role-badge role-${member.role}`}>
                      {member.role === 'owner' ? 'Owner / Lead' : member.role === 'manager' ? 'Manager' : 'Member'}
                    </span>

                    {canRemoveThisUser && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setRemoveConfirmTarget(member)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transfer Ownership Sub-Modal */}
        {transferConfirmOpen && (
          <div className="sub-modal-backdrop">
            <div className="sub-modal-card">
              <h4>Transfer Project Ownership</h4>
              <p>
                Select an active team member to become the new Project Owner. You will step down to a Manager role.
              </p>

              <div className="form-group">
                <label className="form-label">New Project Owner:</label>
                <select
                  className="form-control"
                  value={selectedTargetUserId}
                  onChange={e => setSelectedTargetUserId(e.target.value)}
                >
                  <option value="">-- Choose team member --</option>
                  {members
                    .filter(m => m.userId !== currentUserId)
                    .map(m => (
                      <option key={m.userId} value={m.userId}>
                        {m.name} ({m.assignedRoleTitle})
                      </option>
                    ))}
                </select>
              </div>

              <div className="modal-footer-inline">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setTransferConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={!selectedTargetUserId}
                  onClick={handleTransferOwnership}
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Member Confirmation Sub-Modal */}
        {removeConfirmTarget && (
          <div className="sub-modal-backdrop">
            <div className="sub-modal-card">
              <h4>Remove Team Member</h4>
              <p>
                Are you sure you want to remove <strong>{removeConfirmTarget.name}</strong> from the team?
                They will immediately lose access to the project workspace and chat room.
              </p>

              <div className="modal-footer-inline">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setRemoveConfirmTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleRemove}
                >
                  Confirm Removal
                </button>
              </div>
            </div>
          </div>
        )}

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

export default TeamManager;

