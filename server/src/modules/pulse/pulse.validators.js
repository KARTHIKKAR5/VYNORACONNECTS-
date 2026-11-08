/**
 * Pulse activity query validators
 */

export const ALLOWED_PULSE_FILTERS = [
  'all',
  'for_you',
  'connections',
  'opportunities',
  'events',
  'projects',
  'resources',
];

export function validatePulseQuery(query) {
  const errors = [];
  const filter = query.filter || 'all';
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);

  if (!ALLOWED_PULSE_FILTERS.includes(filter)) {
    errors.push(`Invalid filter: ${filter}. Allowed: ${ALLOWED_PULSE_FILTERS.join(', ')}`);
  }

  if (isNaN(page) || page < 1) {
    errors.push('Page must be a positive integer.');
  }

  if (isNaN(limit) || limit < 1 || limit > 50) {
    errors.push('Limit must be an integer between 1 and 50.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    params: {
      filter,
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 10 : Math.min(limit, 50),
    },
  };
}
