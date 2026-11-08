import React, { useState } from 'react';
import { sendInvitation } from '../../services/projectsService.js';

const CANDIDATE_POOL = [
  { id: 'usr-karthik', name: 'Karthik Kavali', college: 'National Engineering College' },
  { id: 'usr-ram', name: 'Ram Charan', college: 'City Institute of Science' },
  { id: 'usr-siri', name: 'Siri Nallala', college: 'State Technical University' },
  { id: 'usr-candidate-1', name: 'Rohit Sharma', college: 'Apex College of Technology' },
];

export function InviteModal({ project, onClose, onInvitationSent, currentUserId = 'usr-current-student' }) {
  const openRoles = project.openRoles || [];

  const [formData, setFormData] = useState({
    invitedUserId: CANDIDATE_POOL[0]?.id || '',
    roleId: openRoles[0]?.id || '',
    message: 'We would love to invite you to join our project team on Vynora Connect!',
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const selectedCandidate = CANDIDATE_POOL.find(c => c.id === formData.invitedUserId);
    if (!selectedCandidate) {
      setError('Please select a student candidate.');
      setIsSubmitting(false);
      return;
    }

    try {
      await sendInvitation(
        project.id,
        {
          invitedUserId: selectedCandidate.id,
          invitedStudentName: selectedCandidate.name,
          roleId: formData.roleId,
          message: formData.message,
        },
        currentUserId
      );
      onInvitationSent();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to dispatch invitation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="invite-modal-title">
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="invite-modal-title">Invite Student to Team</h2>
            <p className="modal-subtitle">Project: <strong>{project.title}</strong></p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="student-select">
              Select Student to Invite:
            </label>
            <select
              id="student-select"
              className="form-control"
              value={formData.invitedUserId}
              onChange={e => setFormData({ ...formData, invitedUserId: e.target.value })}
            >
              {CANDIDATE_POOL.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.college})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="invite-role-select">
              Assigned Position / Role:
            </label>
            <select
              id="invite-role-select"
              className="form-control"
              value={formData.roleId}
              onChange={e => setFormData({ ...formData, roleId: e.target.value })}
            >
              {openRoles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="invite-msg">
              Invitation Note:
            </label>
            <textarea
              id="invite-msg"
              className="form-control"
              rows="3"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              maxLength={500}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteModal;

