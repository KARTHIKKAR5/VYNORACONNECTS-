import React, { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle2, XCircle, HelpCircle, Eye, GraduationCap, Users } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import ClubDetailModal from '../../components/modals/ClubDetailModal.jsx';
import ReasonModal from '../../components/common/ReasonModal.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

export function ClubVerificationPage({ onCountsChange }) {
  const { showToast } = useToast();
  const [clubs, setClubs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');

  // Modals
  const [selectedClub, setSelectedClub] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [clubToApprove, setClubToApprove] = useState(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [clubToReject, setClubToReject] = useState(null);

  const [requestInfoModalOpen, setRequestInfoModalOpen] = useState(false);
  const [clubToRequestInfo, setClubToRequestInfo] = useState(null);

  const fetchData = async () => {
    try {
      const [clubsRes, colRes] = await Promise.all([
        adminApi.getClubs({ search, status: statusFilter, category: categoryFilter, collegeId: collegeFilter }),
        adminApi.getColleges(),
      ]);
      setClubs(clubsRes.data);
      setColleges(colRes.data);
      if (onCountsChange) onCountsChange();
    } catch (err) {
      console.error(err);
      showToast('Failed to load club verification records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, categoryFilter, collegeFilter]);

  // Handlers
  const handleApproveConfirm = async () => {
    if (!clubToApprove) return;
    try {
      await adminApi.updateClubStatus(clubToApprove.id, {
        status: 'approved',
        reason: 'Club constitution, faculty advisor endorsement, and student leadership confirmed.',
      });
      showToast(`Club "${clubToApprove.name}" successfully approved and verified!`, 'success');
      setApproveConfirmOpen(false);
      setClubToApprove(null);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Approval failed', 'error');
    }
  };

  const handleRejectConfirm = async ({ reason }) => {
    if (!clubToReject) return;
    try {
      await adminApi.updateClubStatus(clubToReject.id, {
        status: 'rejected',
        reason,
      });
      showToast(`Club "${clubToReject.name}" marked as Rejected.`, 'error');
      setRejectModalOpen(false);
      setClubToReject(null);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Rejection failed', 'error');
    }
  };

  const handleRequestInfoConfirm = async ({ reason }) => {
    if (!clubToRequestInfo) return;
    try {
      await adminApi.updateClubStatus(clubToRequestInfo.id, {
        status: 'needs_info',
        reason: `Requested information: ${reason}`,
      });
      showToast(`Supplementary info requested for "${clubToRequestInfo.name}".`, 'info');
      setRequestInfoModalOpen(false);
      setClubToRequestInfo(null);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Request failed', 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Club Verification</h1>
          <p className="page-header-subtitle">
            Review student organization charters, category classification, and faculty sponsorships across verified member colleges.
          </p>
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
              placeholder="Search club name, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="needs_info">Needs Info</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Entrepreneurship">Entrepreneurship</option>
            <option value="Sports">Sports</option>
            <option value="Academic">Academic</option>
          </select>

          <select
            className="filter-select"
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
          >
            <option value="all">All Colleges</option>
            {colleges.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <span className="filter-summary">
          Showing <strong>{clubs.length}</strong> club submissions
        </span>
      </div>

      {/* Clubs Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Club &amp; Category</th>
                <th>Associated College</th>
                <th>Founding Leadership</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubs.length > 0 ? (
                clubs.map((club) => (
                  <tr key={club.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{club.name}</span>
                        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                          <span className="badge badge-purple">{club.category}</span>
                          <span className="cell-secondary">{club.memberCount || 0} members</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <GraduationCap size={15} color="var(--color-info)" />
                        <span style={{ fontWeight: 600 }}>{club.collegeName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-title-cell">
                        <span style={{ fontWeight: 600 }}>{club.foundingLeadName}</span>
                        <span className="cell-secondary">Advisor: {club.facultyAdvisor}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(club.submittedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={club.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedClub(club);
                            setDetailModalOpen(true);
                          }}
                          title="Review club details & charter"
                        >
                          <Eye size={14} /> Review
                        </button>

                        {club.status !== 'approved' && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => {
                              setClubToApprove(club);
                              setApproveConfirmOpen(true);
                            }}
                            title="Approve club"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                        )}

                        {club.status === 'pending' && (
                          <button
                            type="button"
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => {
                              setClubToRequestInfo(club);
                              setRequestInfoModalOpen(true);
                            }}
                            title="Request info"
                          >
                            <HelpCircle size={14} /> Info
                          </button>
                        )}

                        {club.status !== 'rejected' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              setClubToReject(club);
                              setRejectModalOpen(true);
                            }}
                            title="Reject club"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <Building2 size={32} className="empty-state-icon" />
                      <div className="empty-state-title">No club verification submissions found</div>
                      <p className="empty-state-desc">
                        No clubs match the specified search query or category filters.
                      </p>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSearch('');
                          setStatusFilter('all');
                          setCategoryFilter('all');
                          setCollegeFilter('all');
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Club Details Modal */}
      <ClubDetailModal
        club={selectedClub}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onApprove={(cl) => {
          setClubToApprove(cl);
          setApproveConfirmOpen(true);
        }}
        onReject={(cl) => {
          setClubToReject(cl);
          setRejectModalOpen(true);
        }}
        onRequestInfo={(cl) => {
          setClubToRequestInfo(cl);
          setRequestInfoModalOpen(true);
        }}
      />

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={approveConfirmOpen}
        title="Approve Club Verification"
        message={`Are you sure you want to approve "${clubToApprove?.name}" associated with "${clubToApprove?.collegeName}"? This will activate the club on campus, allowing student memberships and official campus event hosting.`}
        confirmText="Confirm Club Approval"
        onConfirm={handleApproveConfirm}
        onClose={() => {
          setApproveConfirmOpen(false);
          setClubToApprove(null);
        }}
      />

      {/* Reject Reason Modal */}
      <ReasonModal
        isOpen={rejectModalOpen}
        title={`Reject Club: ${clubToReject?.name}`}
        subtitle="Explain why this club submission does not meet community or institutional guidelines."
        reasonLabel="Rejection Rationale"
        placeholder="e.g. Unverified faculty advisor, violation of campus commercial solicitation guidelines..."
        confirmText="Confirm Rejection"
        isDestructive={true}
        onConfirm={handleRejectConfirm}
        onClose={() => {
          setRejectModalOpen(false);
          setClubToReject(null);
        }}
      />

      {/* Request Info Modal */}
      <ReasonModal
        isOpen={requestInfoModalOpen}
        title={`Request Info: ${clubToRequestInfo?.name}`}
        subtitle="Specify what missing documentation is required from the founding student."
        reasonLabel="Information Requested"
        placeholder="e.g. Please provide written departmental endorsement letter signed by the head of department..."
        confirmText="Send Request"
        onConfirm={handleRequestInfoConfirm}
        onClose={() => {
          setRequestInfoModalOpen(false);
          setClubToRequestInfo(null);
        }}
      />
    </div>
  );
}

export default ClubVerificationPage;
