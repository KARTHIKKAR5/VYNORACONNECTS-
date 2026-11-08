/**
 * Dashboard input validators
 */

export function validatePreferencesUpdate(body) {
  const errors = [];

  if (body.dismissedOnboardingTasks && !Array.isArray(body.dismissedOnboardingTasks)) {
    errors.push('dismissedOnboardingTasks must be an array of task IDs.');
  }

  if (body.hiddenPulseItemIds && !Array.isArray(body.hiddenPulseItemIds)) {
    errors.push('hiddenPulseItemIds must be an array of activity IDs.');
  }

  if (body.sectionOrder && !Array.isArray(body.sectionOrder)) {
    errors.push('sectionOrder must be an array of section identifiers.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

