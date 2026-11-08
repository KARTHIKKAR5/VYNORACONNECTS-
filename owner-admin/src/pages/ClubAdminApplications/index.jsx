import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Eye, CheckCircle2, XCircle, KeyRound, Building2, GraduationCap } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import ApplicationDetailModal from '../../components/modals/ApplicationDetailModal.jsx';
import ReasonModal from '../../components/common/ReasonModal.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

export function ClubAdminApplicationsPage({ onCountsChange }) {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [appToApprove, setAppToApprove] = useState(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [appToReject, setAppToReject] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await adminApi.getClubAdminApplications({ search, status: statusFilter });
      setApplications(res.data);
      if (onCountsChange) onCountsChange();
    } catch (err) {
      console.error(err);
      showToast('Failed to load club admin applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, statusFilter]);

  // Approve & assign flow
  const handleApproveConfirm = async () => {
    if (!appToApprove) return;
    try {
      const res = await adminApi.reviewClubAdminApplication(appToApprove.id, {
        status: 'approved',
        reason: 'Candidate application qualifications verified; assigned club leadership role.',
        createAssignment: true,
      });
      showToast(
        `Application approved! Assigned "${appToApprove.applicantName}" as admin of "${appToApprove.clubName}".`,
        'success'
      );
      setApproveConfirmOpen(false);
      setAppToApprove(null);
      fetchApplications();
    } catch (err) {
      showToast(err.message || 'Approval failed', 'error');
    }
  };

  // Reject flow
  const handleRejectConfirm = async ({ reason }) => {
    if (!appToReject) return;
    try {
      await adminApi.reviewClubAdminApplication(appToReject.id, {
        status: 'rejected',
        reason,
        createAssignment: false,
      });
      showToast(`Application for "${appToReject.applicantName}" marked as Rejected.`, 'error');
      setRejectModalOpen(false);
      setAppToReject(null);
      fetchApplications();
    } catch (err) {
      showToast(err.message || 'Rejection failed', 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Club Admin Applications</h1>
          <p className="page-header-subtitle">
            Review student leadership applications for club management privileges and verify institutional credentials.
          </p>
        </div>
      </div>

      {/* Security Invariant Callout */}
      <div className="callout-security">
        <KeyRound size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Strict Role Isolation:</strong> Approving an application triggers a distinct, traceable assignment granting administrative rights <em>exclusively</em> to the specified club. It never bestows platform-wide owner access.
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
              placeholder="Search applicant name, email, club, or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Application Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved &amp; Assigned</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <span className="filter-summary">
          Showing <strong>{applications.length}</strong> applications
        </span>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant Student</th>
                <th>Target Club</th>
                <th>College &amp; Dept</th>
                <th>Proposed Role</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{app.applicantName}</span>
                        <span className="cell-secondary">{app.applicantEmail}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={15} color="var(--color-purple)" />
                        <span style={{ fontWeight: 600 }}>{app.clubName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-title-cell">
                        <span>{app.collegeName}</span>
                        <span className="cell-secondary">{app.department}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{app.assignedRole || 'Club Administrator'}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedApp(app);
                            setDetailModalOpen(true);
                          }}
                          title="Review application credentials"
                        >
                          <Eye size={14} /> Review
                        </button>

                        {app.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                setAppToApprove(app);
                                setApproveConfirmOpen(true);
                              }}
                              title="Approve and assign to club"
                            >
                              <CheckCircle2 size={14} /> Approve &amp; Assign
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                setAppToReject(app);
                                setRejectModalOpen(true);
                              }}
                              title="Reject application"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <UserCheck size={32} className="empty-state-icon" />
                      <div className="empty-state-title">No club admin applications found</div>
                      <p className="empty-state-desc">
                        No student applications match the specified criteria.
                      </p>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSearch('');
                          setStatusFilter('all');
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApp}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onApprove={(app) => {
          setAppToApprove(app);
          setApproveConfirmOpen(true);
        }}
        onReject={(app) => {
          setAppToReject(app);
          setRejectModalOpen(true);
        }}
      />

      {/* Approve Confirmation Modal with distinct assignment notification */}
      <ConfirmModal
        isOpen={approveConfirmOpen}
        title="Approve & Grant Club Admin Privileges"
        message={`Approving this application will record an approval for "${appToApprove?.applicantName}" and immediately create an active Club Admin Assignment for "${appToApprove?.clubName}". Are you sure you want to proceed?`}
        confirmText="Confirm & Grant Assignment"
        onConfirm={handleApproveConfirm}
        onClose={() => {
          setApproveConfirmOpen(false);
          setAppToApprove(null);
        }}
      />

      {/* Reject Modal */}
      <ReasonModal
        isOpen={rejectModalOpen}
        title={`Reject Club Admin Application: ${appToReject?.applicantName}`}
        subtitle="Provide the reason for rejecting this student's leadership application."
        reasonLabel="Rejection Justification"
        placeholder="e.g. Insufficient documented tenure in student organization, duplicate application, academic probation..."
        confirmText="Confirm Rejection"
        isDestructive={true}
        onConfirm={handleRejectConfirm}
        onClose={() => {
          setRejectModalOpen(false);
          setAppToReject(null);
        }}
      />
    </div>
  );
}

export default ClubAdminApplicationsPage;
