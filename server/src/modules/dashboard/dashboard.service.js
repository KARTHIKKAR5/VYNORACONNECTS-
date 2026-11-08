import { DashboardPreference } from '../../models/DashboardPreference.model.js';
import { modulesAdapter } from '../integrations/modules.adapter.js';
import { isDbConnected } from '../../config/db.js';

// In-memory preference fallback when MongoDB is running in memory mode
const inMemoryPreferences = new Map();

export async function getDashboardData(user) {
  const userId = user.id || 'usr-karthik';

  // Parallel fetch of independent module domains with safe isolation
  const [
    stats,
    events,
    projects,
    recommendations,
    opportunities,
    resources,
    mentors,
    notifications,
    preferences,
  ] = await Promise.all([
    modulesAdapter.getDashboardStats(userId),
    modulesAdapter.getUpcomingEvents(3),
    modulesAdapter.getCollaborationProjects(3),
    modulesAdapter.getRecommendedStudents(userId, 4),
    modulesAdapter.getRecentOpportunities(3),
    modulesAdapter.getRecentResources(3),
    modulesAdapter.getMentors(2),
    modulesAdapter.getNotifications(userId, 4),
    getUserPreferences(userId),
  ]);

  // Construct safe DTO
  return {
    user: {
      id: user.id,
      name: user.name,
      college: user.college,
      department: user.department,
      graduationYear: user.graduationYear || 2026,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills || [],
    },
    stats,
    upcomingEvents: events,
    collaborationProjects: projects,
    recommendations,
    opportunities,
    resources,
    mentors,
    notifications,
    preferences,
  };
}

export async function getUserPreferences(userId) {
  if (isDbConnected()) {
    try {
      const doc = await DashboardPreference.findOne({ userId }).lean();
      if (doc) {
        return {
          dismissedOnboardingTasks: doc.dismissedOnboardingTasks || [],
          hiddenPulseItemIds: doc.hiddenPulseItemIds || [],
          sectionOrder: doc.sectionOrder || [],
        };
      }
    } catch (err) {
      console.warn('[DashboardService] Preference read failed:', err.message);
    }
  }

  // Memory fallback
  return inMemoryPreferences.get(userId) || {
    dismissedOnboardingTasks: [],
    hiddenPulseItemIds: [],
    sectionOrder: [
      'welcome',
      'stats',
      'quickActions',
      'pulse',
      'opportunities',
      'events',
      'projects',
      'recommendations',
      'resources',
      'mentorship',
    ],
  };
}

export async function updateUserPreferences(userId, updateData) {
  if (isDbConnected()) {
    try {
      const updated = await DashboardPreference.findOneAndUpdate(
        { userId },
        {
          $set: {
            ...(updateData.dismissedOnboardingTasks && {
              dismissedOnboardingTasks: updateData.dismissedOnboardingTasks,
            }),
            ...(updateData.hiddenPulseItemIds && {
              hiddenPulseItemIds: updateData.hiddenPulseItemIds,
            }),
            ...(updateData.sectionOrder && {
              sectionOrder: updateData.sectionOrder,
            }),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();

      return {
        dismissedOnboardingTasks: updated.dismissedOnboardingTasks,
        hiddenPulseItemIds: updated.hiddenPulseItemIds,
        sectionOrder: updated.sectionOrder,
      };
    } catch (err) {
      console.warn('[DashboardService] Mongo update failed:', err.message);
    }
  }

  // Memory fallback
  const existing = await getUserPreferences(userId);
  const updated = {
    ...existing,
    ...updateData,
  };
  inMemoryPreferences.set(userId, updated);
  return updated;
}

