/**
 * Pulse Activity Mapper & Privacy Sanitizer
 * Enforces strict privacy rules:
 * - Strips personal contact numbers & private notes
 * - Disallows private messages, confidential projects, and admin moderation notes
 * - Formats consistent presentation DTOs for student cards
 */

export function mapActivityToSafeDTO(activity) {
  if (!activity) return null;

  // Security gate: Disallow private or restricted types
  if (
    activity.isPrivate ||
    activity.type === 'private_message' ||
    activity.type === 'moderation_action' ||
    activity.type === 'admin_log'
  ) {
    return null;
  }

  return {
    id: activity.id,
    type: activity.type,
    category: activity.category, // 'opportunity' | 'event' | 'project' | 'connection' | 'resource' | 'mentorship'
    actor: {
      id: activity.actor?.id || 'std-anonymous',
      name: activity.actor?.name || 'Vynora Member',
      college: activity.actor?.college || 'Affiliated Campus',
      avatar: activity.actor?.avatar || null,
      role: activity.actor?.role || 'student',
    },
    activityDescription: activity.activityDescription,
    targetTitle: activity.targetTitle,
    summary: activity.summary || '',
    badge: activity.badge || null,
    previewImage: activity.previewImage || null,
    timestamp: activity.timestamp,
    action: {
      label: activity.action?.label || 'View Details',
      actionType: activity.action?.actionType || 'navigate',
      targetTab: activity.action?.targetTab || 'dashboard',
      targetId: activity.action?.targetId || null,
      externalUrl: activity.action?.externalUrl || null,
    },
    metrics: {
      likes: activity.metrics?.likes || 0,
      comments: activity.metrics?.comments || 0,
    },
  };
}

