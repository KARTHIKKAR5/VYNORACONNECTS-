/**
 * Vynora Connect — Deadline Utilities
 * Pure functions for deadline evaluations, countdowns, and urgency labels.
 */

export function getDeadlineInfo(deadline) {
  if (!deadline) {
    return {
      urgency: 'active',
      isExpired: false,
      daysRemaining: null,
      label: 'Rolling Deadline',
      formattedDate: 'Rolling',
    };
  }

  const deadlineTime = new Date(deadline).getTime();
  const now = Date.now();
  const diffMs = deadlineTime - now;

  const formattedDate = new Date(deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (diffMs <= 0) {
    return {
      urgency: 'expired',
      isExpired: true,
      daysRemaining: 0,
      label: 'Closed / Expired',
      formattedDate,
    };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours <= 48) {
    return {
      urgency: 'urgent',
      isExpired: false,
      daysRemaining: diffDays,
      label: diffHours < 24 ? `Closing in ${diffHours}h` : 'Closing Soon (Tomorrow)',
      formattedDate,
    };
  }

  return {
    urgency: 'active',
    isExpired: false,
    daysRemaining: diffDays,
    label: `${diffDays} days left`,
    formattedDate,
  };
}

export function isValidFutureDate(dateStr) {
  if (!dateStr) return false;
  const t = new Date(dateStr).getTime();
  return !isNaN(t) && t > Date.now();
}

