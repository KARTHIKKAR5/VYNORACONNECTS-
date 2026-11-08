import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Users, ShieldAlert, Eye, Ban, CheckCircle2, Lock, Shield, User } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import UserDetailModal from '../../components/modals/UserDetailModal.jsx';
import ReasonModal from '../../components/common/ReasonModal.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

export function UserManagementPage({ onCountsChange }) {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState(null);

  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  const [userToRestore, setUserToRestore] = useState(null);

  const [restrictModalOpen, setRestrictModalOpen] = useState(false);
  const [userToRestrict, setUserToRestrict] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers({ search, status: statusFilter, role: roleFilter });
      setUsers(res.data);
      if (onCountsChange) onCountsChange();
    } catch (err) {
      console.error(err);
      showToast('Failed to load user accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    setCurrentPage(1);
  }, [search, statusFilter, roleFilter]);

  // Handle Suspend
  const handleSuspendConfirm = async ({ reason, extra }) => {
    if (!userToSuspend) return;
    try {
      await adminApi.updateUserStatus(userToSuspend.id, {
        status: 'suspended',
        reason,
        duration: extra || 'Permanent',
      });
      showToast(`User account "${userToSuspend.name}" has been suspended.`, 'error');
      setSuspendModalOpen(false);
      setUserToSuspend(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Suspension failed', 'error');
    }
  };

  // Handle Restore
  const handleRestoreConfirm = async () => {
    if (!userToRestore) return;
    try {
      await adminApi.updateUserStatus(userToRestore.id, {
        status: 'active',
        reason: 'Account reinstated following review by Platform Owner.',
      });
      showToast(`Account "${userToRestore.name}" restored to Active status.`, 'success');
      setRestoreConfirmOpen(false);
      setUserToRestore(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Restoration failed', 'error');
    }
  };

  // Handle Restrict
  const handleRestrictConfirm = async ({ reason, extra }) => {
    if (!userToRestrict) return;
    try {
      await adminApi.updateUserStatus(userToRestrict.id, {
        status: 'restricted',
        reason,
        restrictions: [extra || 'messaging_muted', 'club_creation_blocked'],
      });
      showToast(`Restrictions applied to "${userToRestrict.name}".`, 'info');
      setRestrictModalOpen(false);
      setUserToRestrict(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Restriction failed', 'error');
    }
  };

  // Pagination slice
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">User Management &amp; Governance</h1>
          <p className="page-header-subtitle">
            Global directory of enrolled student profiles, club leads, staff moderators, and institutional memberships.
          </p>
        </div>
      </div>

      {/* Security Requirement Banner */}
      <div className="callout-security">
        <ShieldAlert size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Server-Enforced RBAC Protocol:</strong> Public user registration with self-selected privileged roles is strictly prohibited. Privileged roles (Platform Owner, Moderator) are provisioned via verified backend database seeds only. Frontend role selectors are never accepted as proof of authority.
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
              placeholder="Search by student name, email, user ID, or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="club_admin">Club Admin</option>
            <option value="moderator">Moderator</option>
            <option value="platform_owner">Platform Owner</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="restricted">Restricted</option>
          </select>
        </div>

        <span className="filter-summary">
          Showing <strong>{users.length}</strong> total users
        </span>
      </div>

      {/* User Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Identity</th>
                <th>Role</th>
                <th>Associated College</th>
                <th>Academic Track</th>
                <th>Account Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => {
                  const isOwner = u.role === 'platform_owner';
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>
                            {u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="table-title-cell">
                            <span className="cell-primary">{u.name}</span>
                            <span className="cell-secondary">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={u.role} />
                      </td>
                      <td>
                        <div className="table-title-cell">
                          <span style={{ fontWeight: 600 }}>{u.collegeName}</span>
                          <span className="cell-secondary">ID: {u.id}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem' }}>{u.department} ({u.year})</span>
                      </td>
                      <td>
                        <StatusBadge status={u.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setDetailModalOpen(true);
                            }}
                            title="Inspect user details"
                          >
                            <Eye size={14} /> Profile
                          </button>

                          {!isOwner && (
                            <>
                              {u.status === 'suspended' ? (
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={() => {
                                    setUserToRestore(u);
                                    setRestoreConfirmOpen(true);
                                  }}
                                  title="Restore user account"
                                >
                                  <CheckCircle2 size={14} /> Restore
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => {
                                    setUserToSuspend(u);
                                    setSuspendModalOpen(true);
                                  }}
                                  title="Suspend account"
                                >
                                  <Ban size={14} /> Suspend
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <Users size={32} className="empty-state-icon" />
                      <div className="empty-state-title">No user accounts found</div>
                      <p className="empty-state-desc">
                        No students or administrators match the filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={users.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onSuspend={(u) => {
          setUserToSuspend(u);
          setSuspendModalOpen(true);
        }}
        onRestore={(u) => {
          setUserToRestore(u);
          setRestoreConfirmOpen(true);
        }}
        onRestrict={(u) => {
          setUserToRestrict(u);
          setRestrictModalOpen(true);
        }}
      />

      {/* Suspend Reason Modal */}
      <ReasonModal
        isOpen={suspendModalOpen}
        title={`Suspend User Account: ${userToSuspend?.name}`}
        subtitle={`User ID: ${userToSuspend?.id} (${userToSuspend?.email})`}
        reasonLabel="Suspension Reason (Logged to Audit Trail)"
        placeholder="e.g. Terms of Service violation: unsolicited spam dissemination, malicious harassment..."
        confirmText="Confirm Suspension"
        isDestructive={true}
        extraField={{
          label: 'Suspension Duration',
          type: 'select',
          options: [
            { label: 'Permanent Account Termination', value: 'Permanent' },
            { label: '30-Day Temporary Suspension', value: '30 Days' },
            { label: '7-Day Disciplinary Cooling Period', value: '7 Days' },
          ],
        }}
        onConfirm={handleSuspendConfirm}
        onClose={() => {
          setSuspendModalOpen(false);
          setUserToSuspend(null);
        }}
      />

      {/* Restore Confirmation Modal */}
      <ConfirmModal
        isOpen={restoreConfirmOpen}
        title="Restore Account Access"
        message={`Are you sure you want to restore full platform access for "${userToRestore?.name}"? All previously applied account locks and publishing restrictions will be lifted.`}
        confirmText="Confirm Account Restoration"
        onConfirm={handleRestoreConfirm}
        onClose={() => {
          setRestoreConfirmOpen(false);
          setUserToRestore(null);
        }}
      />

      {/* Restrict Permissions Modal */}
      <ReasonModal
        isOpen={restrictModalOpen}
        title={`Restrict Account: ${userToRestrict?.name}`}
        subtitle="Apply selective functional constraints without full account suspension."
        reasonLabel="Restriction Rationale"
        placeholder="e.g. Repeated off-topic club postings; temporarily muting post creation..."
        confirmText="Apply Restrictions"
        extraField={{
          label: 'Primary Restriction Constraint',
          type: 'select',
          options: [
            { label: 'Mute Post & Discussion Creation', value: 'posts_muted' },
            { label: 'Disable Direct Messaging Channel', value: 'messaging_muted' },
            { label: 'Block New Club Creation & Leadership Applications', value: 'club_creation_blocked' },
          ],
        }}
        onConfirm={handleRestrictConfirm}
        onClose={() => {
          setRestrictModalOpen(false);
          setUserToRestrict(null);
        }}
      />
    </div>
  );
}

export default UserManagementPage;
