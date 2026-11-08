import React, { useState, useEffect } from 'react';
import { Search, Flag, Eye, CheckCircle2, XCircle, ShieldAlert, AlertTriangle, UserCheck } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import ReportDetailModal from '../../components/modals/ReportDetailModal.jsx';
import ReasonModal from '../../components/common/ReasonModal.jsx';

export function ReportsModerationPage({ onCountsChange }) {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [reportToResolve, setReportToResolve] = useState(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reportToReject, setReportToReject] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await adminApi.getReports({
        search,
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
      });
      setReports(res.data);
      if (onCountsChange) onCountsChange();
    } catch (err) {
      console.error(err);
      showToast('Failed to load moderation reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [search, statusFilter, categoryFilter, priorityFilter]);

  // Resolve
  const handleResolveConfirm = async ({ reason, extra }) => {
    if (!reportToResolve) return;
    try {
      await adminApi.updateReportStatus(reportToResolve.id, {
        status: 'resolved',
        resolutionNotes: reason,
        resolutionAction: extra || 'Content purged and target student notified of policy violation.',
      });
      showToast(`Report #${reportToResolve.id} marked as Resolved.`, 'success');
      setResolveModalOpen(false);
      setReportToResolve(null);
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Resolve failed', 'error');
    }
  };

  // Reject / Dismiss
  const handleRejectConfirm = async ({ reason }) => {
    if (!reportToReject) return;
    try {
      await adminApi.updateReportStatus(reportToReject.id, {
        status: 'rejected',
        resolutionNotes: reason,
      });
      showToast(`Report #${reportToReject.id} dismissed.`, 'info');
      setRejectModalOpen(false);
      setReportToReject(null);
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Dismiss failed', 'error');
    }
  };

  // Assign to Moderator
  const handleAssignModerator = async (reportId, modName) => {
    try {
      await adminApi.updateReportStatus(reportId, {
        status: 'under_review',
        assignedModerator: modName,
      });
      showToast(`Report #${reportId} assigned to ${modName}.`, 'info');
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Assignment failed', 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Reports &amp; Content Moderation</h1>
          <p className="page-header-subtitle">
            Centralized intake of user incident flags, spam quarantine, harassment reports, and impersonation audits.
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
              placeholder="Search target entity, reporter, or description..."
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
            <option value="open">Open (Unresolved)</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Dismissed</option>
          </select>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Harassment">Harassment</option>
            <option value="Inappropriate Content">Inappropriate Content</option>
            <option value="Spam">Spam</option>
            <option value="Fake Account">Fake Account</option>
            <option value="Impersonation">Impersonation</option>
            <option value="Club-related Issue">Club-related Issue</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <span className="filter-summary">
          Showing <strong>{reports.length}</strong> incident reports
        </span>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Incident ID &amp; Target</th>
                <th>Category</th>
                <th>Reporter</th>
                <th>Priority</th>
                <th>Assigned Mod</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((rep) => (
                  <tr key={rep.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{rep.targetName}</span>
                        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                          <span className="cell-code">#{rep.id}</span>
                          <span className="cell-secondary" style={{ textTransform: 'capitalize' }}>
                            {rep.targetType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cell-code">{rep.category}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{rep.reporterName}</span>
                    </td>
                    <td>
                      <StatusBadge status={rep.priority} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: rep.assignedModerator ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {rep.assignedModerator || 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={rep.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedReport(rep);
                            setDetailModalOpen(true);
                          }}
                          title="Inspect report details & evidence"
                        >
                          <Eye size={14} /> Inspect
                        </button>

                        {rep.status !== 'resolved' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                setReportToResolve(rep);
                                setResolveModalOpen(true);
                              }}
                              title="Resolve incident"
                            >
                              <CheckCircle2 size={14} /> Resolve
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                setReportToReject(rep);
                                setRejectModalOpen(true);
                              }}
                              title="Dismiss report as unfounded"
                            >
                              <XCircle size={14} /> Dismiss
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
                      <Flag size={32} className="empty-state-icon" />
                      <div className="empty-state-title">No moderation incident reports found</div>
                      <p className="empty-state-desc">
                        No active reports match the filter parameters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onResolve={(r) => {
          setReportToResolve(r);
          setResolveModalOpen(true);
        }}
        onReject={(r) => {
          setReportToReject(r);
          setRejectModalOpen(true);
        }}
        onAssign={handleAssignModerator}
      />

      {/* Resolve Incident Reason Modal */}
      <ReasonModal
        isOpen={resolveModalOpen}
        title={`Resolve Moderation Report #${reportToResolve?.id}`}
        subtitle={`Target Entity: ${reportToResolve?.targetName}`}
        reasonLabel="Resolution Action &amp; Remediation Notes (Mandatory)"
        placeholder="e.g. Account permanently quarantined; offending content scrubbed from discovery feed; reporter notified..."
        confirmText="Confirm Resolution"
        extraField={{
          label: 'Primary Moderation Action Taken',
          type: 'select',
          options: [
            { label: 'Offending Content Removed & Author Warned', value: 'content_removed_warned' },
            { label: 'Target Account Suspended Permanently', value: 'account_suspended' },
            { label: 'Account Placed on 7-Day Restriction', value: 'account_restricted' },
            { label: 'False Alarm / Resolved with Counseling', value: 'counseled_resolved' },
          ],
        }}
        onConfirm={handleResolveConfirm}
        onClose={() => {
          setResolveModalOpen(false);
          setReportToResolve(null);
        }}
      />

      {/* Dismiss Report Modal */}
      <ReasonModal
        isOpen={rejectModalOpen}
        title={`Dismiss Report #${reportToReject?.id}`}
        subtitle="Explain why this report is determined to be unfounded or does not violate community guidelines."
        reasonLabel="Dismissal Justification"
        placeholder="e.g. Activity investigated and confirmed to be consensual debate within club rules..."
        confirmText="Confirm Dismissal"
        isDestructive={true}
        onConfirm={handleRejectConfirm}
        onClose={() => {
          setRejectModalOpen(false);
          setReportToReject(null);
        }}
      />
    </div>
  );
}

export default ReportsModerationPage;
