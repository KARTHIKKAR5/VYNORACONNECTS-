import React, { useState, useEffect } from 'react';
import { Search, History, Shield, Eye, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AuditDetailModal from '../../components/modals/AuditDetailModal.jsx';

export function AuditLogsPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');

  // Modal
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await adminApi.getAuditLogs({
        search,
        category: categoryFilter,
        actor: actorFilter,
      });
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, categoryFilter, actorFilter]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Security &amp; Operational Audit Trail</h1>
          <p className="page-header-subtitle">
            Immutable, append-only chronological log of all administrative interventions, verifications, privilege grants, and moderation resolutions.
          </p>
        </div>
      </div>

      {/* Read-Only Notice Callout */}
      <div className="callout-info">
        <Lock size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Tamper-Evident Governance Invariant:</strong> Audit logs are strictly read-only and permanently retained for compliance. No administrator or system role possesses privileges to alter, truncate, or delete historical records.
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
              placeholder="Search by action, target entity, or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Action Categories</option>
            <option value="Verification">Verification</option>
            <option value="Privilege Management">Privilege Management</option>
            <option value="Account Security">Account Security</option>
            <option value="Moderation">Moderation</option>
            <option value="System Configuration">System Configuration</option>
          </select>

          <select
            className="filter-select"
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
          >
            <option value="all">All Actors</option>
            <option value="Revanth">Platform Owner (Revanth)</option>
          </select>
        </div>

        <span className="filter-summary">
          Showing <strong>{logs.length}</strong> logged events
        </span>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event ID &amp; Timestamp</th>
                <th>Authorized Actor</th>
                <th>Action</th>
                <th>Target Entity</th>
                <th>Documented Reason</th>
                <th>Result</th>
                <th style={{ textAlign: 'right' }}>Payload</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-code" style={{ width: 'fit-content' }}>#{log.id}</span>
                        <span className="cell-secondary">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Shield size={14} color="var(--color-info)" />
                        <span style={{ fontWeight: 600 }}>{log.actorName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="cell-code" style={{ fontWeight: 700, color: 'var(--color-info-text)' }}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{log.targetName}</span>
                        <span className="cell-secondary">{log.targetType} ({log.targetId})</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {log.reason}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> {log.result}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedLog(log);
                          setDetailModalOpen(true);
                        }}
                        title="Inspect full audit record"
                      >
                        <Eye size={14} /> Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <History size={32} className="empty-state-icon" />
                      <div className="empty-state-title">No audit records found</div>
                      <p className="empty-state-desc">
                        No events match the specified search or category parameters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      <AuditDetailModal
        log={selectedLog}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  );
}

export default AuditLogsPage;
