import React, { useState, useEffect } from 'react';
import { Search, KeyRound, Plus, ShieldAlert, CheckCircle2, XCircle, Building2, GraduationCap } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import GrantAssignmentModal from '../../components/modals/GrantAssignmentModal.jsx';
import ReasonModal from '../../components/common/ReasonModal.jsx';

export function ClubAdminAssignmentsPage() {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [assignmentToRevoke, setAssignmentToRevoke] = useState(null);

  const fetchData = async () => {
    try {
      const [asgnRes, colRes, clubRes] = await Promise.all([
        adminApi.getClubAdminAssignments({ search, status: statusFilter }),
        adminApi.getColleges(),
        adminApi.getClubs(),
      ]);
      setAssignments(asgnRes.data);
      setColleges(colRes.data);
      setClubs(clubRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  // Grant new assignment
  const handleGrantAssignment = async (data) => {
    try {
      await adminApi.grantClubAdminAssignment(data);
      showToast(`Club Admin assignment granted to "${data.userName}" for "${data.clubName}".`, 'success');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Grant failed', 'error');
    }
  };

  // Revoke assignment
  const handleRevokeConfirm = async ({ reason }) => {
    if (!assignmentToRevoke) return;
    try {
      await adminApi.revokeClubAdminAssignment(assignmentToRevoke.id, { reason });
      showToast(`Privileges revoked for "${assignmentToRevoke.userName}" on "${assignmentToRevoke.clubName}".`, 'error');
      setRevokeModalOpen(false);
      setAssignmentToRevoke(null);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Revocation failed', 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Club Admin Assignments</h1>
          <p className="page-header-subtitle">
            Manage scoped administrative authority over individual verified student clubs.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setGrantModalOpen(true)}
          >
            <Plus size={16} /> Grant New Assignment
          </button>
        </div>
      </div>

      {/* Critical Security Banner */}
      <div className="callout-security">
        <ShieldAlert size={22} style={{ flexShrink: 0 }} />
        <div>
          <strong>Critical Privilege Rule:</strong> A Club Admin possesses authority <em>strictly scoped</em> to the club explicitly assigned to them. They must <strong>NEVER</strong> receive platform-owner or system-wide permissions. Revoking an assignment terminates that user's administrative authority immediately.
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-group-left">
          <div className="filter-search">
            <Search size={16} className="filter-search-icon" />
            <input
              type="text"
              className="filter-search-input"
              placeholder="Search by student name, email, club, or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Assignment Statuses</option>
            <option value="active">Active Privileges</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        <span className="filter-summary">
          Showing <strong>{assignments.length}</strong> assignments
        </span>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Assigned Student</th>
                <th>Assigned Club</th>
                <th>Associated College</th>
                <th>Role Title</th>
                <th>Assignment Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((asgn) => (
                  <tr key={asgn.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{asgn.userName}</span>
                        <span className="cell-secondary">{asgn.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={15} color="var(--color-purple)" />
                        <span style={{ fontWeight: 600 }}>{asgn.clubName}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <GraduationCap size={15} color="var(--color-info)" />
                        <span>{asgn.collegeName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{asgn.assignedRole}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(asgn.assignedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={asgn.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        {asgn.status === 'active' ? (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              setAssignmentToRevoke(asgn);
                              setRevokeModalOpen(true);
                            }}
                            title="Revoke club admin privileges"
                          >
                            <XCircle size={14} /> Revoke Authority
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Revoked: {asgn.revocationReason || 'N/A'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <KeyRound size={32} className="empty-state-icon" />
                      <div className="empty-state-title">No club admin assignments found</div>
                      <p className="empty-state-desc">
                        No active or historical assignments match your query.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Assignment Modal */}
      <GrantAssignmentModal
        isOpen={grantModalOpen}
        colleges={colleges}
        clubs={clubs}
        onClose={() => setGrantModalOpen(false)}
        onGrant={handleGrantAssignment}
      />

      {/* Revoke Confirmation & Reason Modal */}
      <ReasonModal
        isOpen={revokeModalOpen}
        title={`Revoke Club Admin Privileges: ${assignmentToRevoke?.userName}`}
        subtitle={`Terminating authority over club: "${assignmentToRevoke?.clubName}"`}
        reasonLabel="Reason for Revocation (Mandatory)"
        placeholder="e.g. Term expiration, graduation, policy violation, failure to uphold faculty guidelines..."
        confirmText="Confirm Revocation"
        isDestructive={true}
        onConfirm={handleRevokeConfirm}
        onClose={() => {
          setRevokeModalOpen(false);
          setAssignmentToRevoke(null);
        }}
      />
    </div>
  );
}

export default ClubAdminAssignmentsPage;
