import React from 'react';
import { X, User, ShieldAlert, CheckCircle2, Ban, Lock, ShieldCheck, Mail, Calendar } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onSuspend,
  onRestore,
  onRestrict,
}) {
  if (!isOpen || !user) return null;

  const isOwner = user.role === 'platform_owner';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
      <div className="modal-container modal-lg">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--color-info)' }}>
              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h2 className="modal-title" id="user-modal-title">{user.name}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                <span className="cell-code">{user.id}</span>
                <StatusBadge status={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Privilege Security Boundary Callout */}
          <div className="callout-security">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Security Protocol:</strong> Privileged roles (Platform Owner, Moderator) are strictly provisioned server-side via environment configuration and canonical database permissions. Frontend controls never independently grant global administrative authority.
            </div>
          </div>

          {/* Account Profile Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <span className="form-label">Email Address</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                <Mail size={14} color="var(--text-muted)" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Enrolled College</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.collegeName}</span>
            </div>

            <div className="form-group">
              <span className="form-label">Department &amp; Year</span>
              <span style={{ fontSize: '0.85rem' }}>{user.department} ({user.year})</span>
            </div>

            <div className="form-group">
              <span className="form-label">Registered Since</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                <span>{new Date(user.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Activity Statistics Summary */}
          {user.activityStats && (
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
              <span className="form-label" style={{ display: 'block', marginBottom: 12 }}>Platform Activity Summary</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user.activityStats.posts}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Posts</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user.activityStats.clubsJoined}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clubs</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user.activityStats.teamsJoined}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Projects</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: user.activityStats.reportsReceived > 0 ? 'var(--color-danger)' : 'var(--text-primary)' }}>
                    {user.activityStats.reportsReceived}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reports</div>
                </div>
              </div>
            </div>
          )}

          {/* Suspension Status Callout */}
          {user.status === 'suspended' && (
            <div style={{ backgroundColor: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px', color: 'var(--color-danger-text)' }}>
              <strong style={{ display: 'block', marginBottom: 4 }}>Account Suspended:</strong>
              <div style={{ fontSize: '0.86rem' }}>{user.suspensionReason || 'Account suspended for policy violation.'}</div>
              <div style={{ fontSize: '0.76rem', marginTop: 4 }}>Duration: {user.suspendedUntil || 'Permanent'}</div>
            </div>
          )}

          {/* Active Restrictions */}
          {user.restrictions && user.restrictions.length > 0 && (
            <div className="form-group">
              <span className="form-label">Active Account Restrictions</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {user.restrictions.map((r, idx) => (
                  <span key={idx} className="badge badge-warning">
                    <Lock size={12} /> {r.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {!isOwner && (
            <>
              {user.status !== 'restricted' && (
                <button
                  type="button"
                  className="btn btn-outline-warning"
                  onClick={() => {
                    onClose();
                    onRestrict(user);
                  }}
                >
                  <Lock size={16} /> Restrict Permissions
                </button>
              )}

              {user.status === 'suspended' ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    onClose();
                    onRestore(user);
                  }}
                >
                  <CheckCircle2 size={16} /> Restore Account
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    onClose();
                    onSuspend(user);
                  }}
                >
                  <Ban size={16} /> Suspend Account
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
