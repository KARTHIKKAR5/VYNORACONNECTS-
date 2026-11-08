import React from 'react';

const STATUS_MAP = {
  // Verifications
  approved: { label: 'Verified', class: 'badge-success' },
  verified: { label: 'Verified', class: 'badge-success' },
  pending: { label: 'Pending Review', class: 'badge-warning' },
  needs_info: { label: 'Needs Information', class: 'badge-info' },
  rejected: { label: 'Rejected', class: 'badge-danger' },

  // User Accounts
  active: { label: 'Active', class: 'badge-success' },
  suspended: { label: 'Suspended', class: 'badge-danger' },
  restricted: { label: 'Restricted', class: 'badge-warning' },

  // Roles
  student: { label: 'Student', class: 'badge-neutral' },
  club_admin: { label: 'Club Admin', class: 'badge-purple' },
  moderator: { label: 'Moderator', class: 'badge-info' },
  platform_owner: { label: 'Platform Owner', class: 'badge-danger' },

  // Reports
  open: { label: 'Open', class: 'badge-danger' },
  under_review: { label: 'Under Review', class: 'badge-warning' },
  resolved: { label: 'Resolved', class: 'badge-success' },

  // Support Tickets
  in_progress: { label: 'In Progress', class: 'badge-warning' },
  closed: { label: 'Closed', class: 'badge-neutral' },

  // Priority
  urgent: { label: 'Urgent', class: 'badge-danger' },
  high: { label: 'High', class: 'badge-warning' },
  normal: { label: 'Normal', class: 'badge-info' },
  medium: { label: 'Medium', class: 'badge-info' },
  low: { label: 'Low', class: 'badge-neutral' },

  // Assignments
  revoked: { label: 'Revoked', class: 'badge-danger' },
};

export function StatusBadge({ status, customLabel, size = 'md' }) {
  if (!status) return null;
  const normalized = String(status).toLowerCase();
  const config = STATUS_MAP[normalized] || {
    label: customLabel || status,
    class: 'badge-neutral',
  };

  const label = customLabel || config.label;
  return (
    <span className={`badge ${config.class}`} style={{ fontSize: size === 'sm' ? '0.7rem' : undefined }}>
      {label}
    </span>
  );
}

export default StatusBadge;
