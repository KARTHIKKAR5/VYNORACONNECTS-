import React, { useState } from 'react';
import { X, ShieldAlert, KeyRound } from 'lucide-react';

export function GrantAssignmentModal({
  isOpen,
  colleges = [],
  clubs = [],
  users = [],
  onClose,
  onGrant,
}) {
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [assignedRole, setAssignedRole] = useState('Club Administrator');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Filter clubs based on selected college if any
  const availableClubs = selectedCollegeId
    ? clubs.filter(c => c.collegeId === selectedCollegeId && c.status === 'approved')
    : clubs.filter(c => c.status === 'approved');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim() || !selectedClubId) {
      setError('Please fill in student name, email, and select a verified club.');
      return;
    }
    const chosenClub = clubs.find(c => c.id === selectedClubId);
    const chosenCollege = colleges.find(col => col.id === (selectedCollegeId || chosenClub?.collegeId));

    onGrant({
      userName: studentName.trim(),
      userEmail: studentEmail.trim(),
      collegeId: chosenCollege?.id || chosenClub?.collegeId,
      collegeName: chosenCollege?.name || chosenClub?.collegeName,
      clubId: chosenClub?.id,
      clubName: chosenClub?.name,
      assignedRole: assignedRole.trim() || 'Club Administrator',
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="grant-modal-title">
      <div className="modal-container" style={{ maxWidth: '560px' }}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'var(--color-purple-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KeyRound size={18} color="var(--color-purple)" />
              </div>
              <div>
                <h3 className="modal-title" id="grant-modal-title">Grant Club Admin Assignment</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scoped privilege assignment</span>
              </div>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            {/* Scoped Permission Security Banner */}
            <div className="callout-security">
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Critical Permission Rule:</strong> A Club Admin must only have authority over the club specifically assigned to them. They must <strong>NEVER</strong> receive global platform-owner permissions.
              </div>
            </div>

            {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">Student Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Institutional Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@college.edu"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">College (Filter)</label>
              <select
                className="form-select"
                value={selectedCollegeId}
                onChange={(e) => {
                  setSelectedCollegeId(e.target.value);
                  setSelectedClubId('');
                }}
              >
                <option value="">All Verified Colleges</option>
                {colleges.filter(c => c.status === 'approved').map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Target Verified Club</label>
              <select
                className="form-select"
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                required
              >
                <option value="">-- Select an Approved Club --</option>
                {availableClubs.map(cl => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} ({cl.collegeName})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Leadership Role Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Club President, Faculty Co-Lead"
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Grant Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GrantAssignmentModal;
