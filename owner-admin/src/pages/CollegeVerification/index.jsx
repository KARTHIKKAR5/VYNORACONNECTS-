import React, { useState, useEffect } from 'react';
import { Search, Building, CheckCircle2, XCircle, HelpCircle, Eye, FileText, Plus } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import CollegeDetailModal from '../../components/modals/CollegeDetailModal.jsx';
import ReasonModal from '../../components/common/ReasonModal.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

export function CollegeVerificationPage({ onCountsChange }) {
  const { showToast } = useToast();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [collegeToApprove, setCollegeToApprove] = useState(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [collegeToReject, setCollegeToReject] = useState(null);

  const [requestInfoModalOpen, setRequestInfoModalOpen] = useState(false);
  const [collegeToRequestInfo, setCollegeToRequestInfo] = useState(null);

  const fetchColleges = async () => {
    try {
      const res = await adminApi.getColleges({ search, status: statusFilter });
      setColleges(res.data);
      if (onCountsChange) onCountsChange();
    } catch (err) {
      console.error(err);
      showToast('Failed to load college verification records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [search, statusFilter]);

  // Handlers
  const handleApproveConfirm = async () => {
    if (!collegeToApprove) return;
    try {
      await adminApi.updateCollegeStatus(collegeToApprove.id, {
        status: 'approved',
        reason: 'Statutory verification and accreditation documents validated by Platform Owner.',
      });
      showToast(`College "${collegeToApprove.name}" verified and approved successfully.`, 'success');
      setApproveConfirmOpen(false);
      setCollegeToApprove(null);
      fetchColleges();
    } catch (err) {
      showToast(err.message || 'Approval failed', 'error');
    }
  };

  const handleRejectConfirm = async ({ reason }) => {
    if (!collegeToReject) return;
    try {
      await adminApi.updateCollegeStatus(collegeToReject.id, {
        status: 'rejected',
        reason,
      });
      showToast(`College submission for "${collegeToReject.name}" marked as Rejected.`, 'error');
      setRejectModalOpen(false);
      setCollegeToReject(null);
      fetchColleges();
    } catch (err) {
      showToast(err.message || 'Rejection failed', 'error');
    }
  };

  const handleRequestInfoConfirm = async ({ reason }) => {
    if (!collegeToRequestInfo) return;
    try {
      await adminApi.updateCollegeStatus(collegeToRequestInfo.id, {
        status: 'needs_info',
        notes: reason,
        reason: `Requested additional information: ${reason}`,
      });
      showToast(`Information requested from "${collegeToRequestInfo.name}".`, 'info');
      setRequestInfoModalOpen(false);
      setCollegeToRequestInfo(null);
      fetchColleges();
    } catch (err) {
      showToast(err.message || 'Request failed', 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">College Verification</h1>
          <p className="page-header-subtitle">
            Validate institutional accreditation, university domains, and registrar credentials before campus onboarding.
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
              placeholder="Search by college name, city, or AISHE code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Verification Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="needs_info">Needs Information</option>
            <option value="approved">Verified &amp; Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <span className="filter-summary">
          Showing <strong>{colleges.length}</strong> college submissions
        </span>
      </div>

      {/* Colleges Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>College / University</th>
                <th>Location</th>
                <th>Designated Contact</th>
                <th>Submitted Date</th>
                <th>Verification Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.length > 0 ? (
                colleges.map((col) => (
                  <tr key={col.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{col.name}</span>
                        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                          <span className="cell-code">{col.code}</span>
                          <span className="cell-secondary">AISHE: {col.aisheCode}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-title-cell">
                        <span>{col.city}, {col.state}</span>
                        <span className="cell-secondary">{col.domain}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-title-cell">
                        <span style={{ fontWeight: 600 }}>{col.contactPerson}</span>
                        <span className="cell-secondary">{col.contactEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(col.submittedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={col.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedCollege(col);
                            setDetailModalOpen(true);
                          }}
                          title="Inspect submitted documents & details"
                        >
                          <Eye size={14} /> Review
                        </button>

                        {col.status !== 'approved' && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => {
                              setCollegeToApprove(col);
                              setApproveConfirmOpen(true);
                            }}
                            title="Approve College"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                        )}

                        {col.status === 'pending' && (
                          <button
                            type="button"
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => {
                              setCollegeToRequestInfo(col);
                              setRequestInfoModalOpen(true);
                            }}
                            title="Request additional documentation"
                          >
                            <HelpCircle size={14} /> Info
                          </button>
                        )}

                        {col.status !== 'rejected' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              setCollegeToReject(col);
                              setRejectModalOpen(true);
                            }}
                            title="Reject Verification"
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
                      <Building size={32} className="empty-state-icon" />
                      <div className="empty-state-title">No college verification submissions found</div>
                      <p className="empty-state-desc">
                        No institutions match the current search or status filter parameters.
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

      {/* College Details Modal */}
      <CollegeDetailModal
        college={selectedCollege}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onApprove={(col) => {
          setCollegeToApprove(col);
          setApproveConfirmOpen(true);
        }}
        onReject={(col) => {
          setCollegeToReject(col);
          setRejectModalOpen(true);
        }}
        onRequestInfo={(col) => {
          setCollegeToRequestInfo(col);
          setRequestInfoModalOpen(true);
        }}
      />

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={approveConfirmOpen}
        title="Approve Institutional Verification"
        message={`Are you sure you want to verify and approve "${collegeToApprove?.name}"? This will officially register the institution in Vynora Connect, enabling its students to create verified clubs and project teams.`}
        confirmText="Confirm Institutional Approval"
        onConfirm={handleApproveConfirm}
        onClose={() => {
          setApproveConfirmOpen(false);
          setCollegeToApprove(null);
        }}
      />

      {/* Reject Reason Modal */}
      <ReasonModal
        isOpen={rejectModalOpen}
        title={`Reject College Verification: ${collegeToReject?.name}`}
        subtitle="Specify the formal statutory or accreditation deficiency for rejection."
        reasonLabel="Official Rejection Rationale"
        placeholder="e.g. Inability to verify UGC statutory standing, missing institutional registrar attestation, invalid institutional domain..."
        confirmText="Confirm Rejection"
        isDestructive={true}
        onConfirm={handleRejectConfirm}
        onClose={() => {
          setRejectModalOpen(false);
          setCollegeToReject(null);
        }}
      />

      {/* Request Info Modal */}
      <ReasonModal
        isOpen={requestInfoModalOpen}
        title={`Request Information: ${collegeToRequestInfo?.name}`}
        subtitle="Describe the supplementary documentation or institutional validation required."
        reasonLabel="Additional Information Required"
        placeholder="e.g. Please upload certified campus IP range blocks and latest AICTE affiliation approval order for academic year 2026-27..."
        confirmText="Send Information Request"
        onConfirm={handleRequestInfoConfirm}
        onClose={() => {
          setRequestInfoModalOpen(false);
          setCollegeToRequestInfo(null);
        }}
      />
    </div>
  );
}

export default CollegeVerificationPage;
