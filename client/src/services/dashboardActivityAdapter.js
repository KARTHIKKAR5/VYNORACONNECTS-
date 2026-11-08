/**
 * Vynora Connect — Teams & Projects Module
 * Adapter: Karthik's Dashboard & Activity Summaries Module Integration
 *
 * Provides aggregated, lightweight summaries for student dashboard widgets
 * without duplicating underlying database schemas or business logic.
 */

export function createDashboardProjectSummary(userProjects = [], userRequests = [], userInvitations = []) {
  const leading = userProjects.filter(p => p.lead?.id === 'usr-current-student' || p.lead?.id === 'usr-varsh');
  const participating = userProjects.filter(p => p.team?.members?.some(m => m.userId === 'usr-current-student'));
  const pendingRequests = userRequests.filter(r => r.status === 'pending');
  const pendingInvitations = userInvitations.filter(i => i.status === 'pending');

  return {
    totalProjectsCount: userProjects.length,
    leadingProjectsCount: leading.length,
    participatingTeamsCount: participating.length,
    pendingApplicationsCount: pendingRequests.length,
    pendingInvitationsCount: pendingInvitations.length,
    lastActiveAt: new Date().toISOString(),
  };
}

export function formatActivityFeedItem(actionType, actorName, projectTitle, details) {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    actionType,
    actorName,
    projectTitle,
    details,
    timestamp: new Date().toISOString(),
  };
}

