/**
 * Vynora Connect — Platform Owner Admin & Moderation Service Layer
 *
 * PROPOSED BACKEND INTEGRATION SPECIFICATION & DEMO ADAPTER
 *
 * All privileged operations defined here represent the proposed REST API
 * contract for the shared Vynora backend. In this demonstration frontend,
 * actions operate against an in-memory/localStorage persistent demonstration
 * store and append audit records, verifying end-to-end UX without requiring
 * an unverified Express/MongoDB instance.
 *
 * CRITICAL SECURITY ARCHITECTURE RULES:
 * 1. Frontend role checks are for UI presentation ONLY. Every protected route
 *    must be authorized by the real backend verifying the canonical User session
 *    and cryptographically signed credentials.
 * 2. Club Admins have authority STRICTLY SCOPED to their single assigned club.
 *    They must NEVER inherit global Platform Owner permissions.
 * 3. Audit logs are strictly immutable and appended only via backend actions.
 */

import {
  INITIAL_METRICS,
  USER_GROWTH_DATA,
  PLATFORM_ACTIVITY_DATA,
  VERIFICATION_BREAKDOWN_DATA,
  INITIAL_COLLEGES,
  INITIAL_CLUBS,
  INITIAL_APPLICATIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_USERS,
  INITIAL_REPORTS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLATFORM_SETTINGS,
} from '../data/mockData.js';

const STORAGE_KEYS = {
  STATE: 'vynora_owner_admin_state_v1',
};

// Simulated network latency for realistic UX indicators
const SIMULATED_LATENCY_MS = 60;
const delay = (ms = SIMULATED_LATENCY_MS) => new Promise(res => setTimeout(res, ms));

function loadState() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
  }
  return {
    colleges: INITIAL_COLLEGES,
    clubs: INITIAL_CLUBS,
    applications: INITIAL_APPLICATIONS,
    assignments: INITIAL_ASSIGNMENTS,
    users: INITIAL_USERS,
    reports: INITIAL_REPORTS,
    tickets: INITIAL_TICKETS,
    auditLogs: INITIAL_AUDIT_LOGS,
    settings: INITIAL_PLATFORM_SETTINGS,
  };
}

let state = loadState();

function persistState() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(state));
    } catch {
      // Fallback
    }
  }
}

/**
 * Record an audit log event atomically
 */
function recordAuditEvent({ action, actionCategory, targetType, targetId, targetName, reason, result = 'SUCCESS' }) {
  const newLog = {
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: 'usr-owner-01',
    actorName: 'Revanth (Platform Owner)',
    action,
    actionCategory,
    targetType,
    targetId,
    targetName,
    reason: reason || 'Executed by Platform Owner via Admin Dashboard',
    result,
    ipAddress: '10.24.8.1',
  };
  state.auditLogs = [newLog, ...state.auditLogs];
  persistState();
  return newLog;
}

export const adminApi = {
  /**
   * RESET DEMO DATA
   * Restores all collections back to initial baseline data.
   */
  async resetDemoData() {
    await delay(30);
    state = {
      colleges: INITIAL_COLLEGES,
      clubs: INITIAL_CLUBS,
      applications: INITIAL_APPLICATIONS,
      assignments: INITIAL_ASSIGNMENTS,
      users: INITIAL_USERS,
      reports: INITIAL_REPORTS,
      tickets: INITIAL_TICKETS,
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_PLATFORM_SETTINGS,
    };
    persistState();
    return { success: true, message: 'Demonstration store reset to defaults.' };
  },

  // =========================================================================
  // 1. OVERVIEW & METRICS
  // Contract: GET /api/v1/admin/overview
  // =========================================================================
  async getOverview() {
    await delay();
    const verifiedColleges = state.colleges.filter(c => c.status === 'approved').length;
    const pendingColleges = state.colleges.filter(c => c.status === 'pending' || c.status === 'needs_info').length;
    const verifiedClubs = state.clubs.filter(c => c.status === 'approved').length;
    const pendingClubs = state.clubs.filter(c => c.status === 'pending' || c.status === 'needs_info').length;
    const openReports = state.reports.filter(r => r.status === 'open' || r.status === 'under_review').length;
    const pendingApplications = state.applications.filter(a => a.status === 'pending').length;
    const openTickets = state.tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
    const activeUsers = state.users.filter(u => u.status === 'active').length;
    const suspendedUsers = state.users.filter(u => u.status === 'suspended').length;

    return {
      success: true,
      data: {
        metrics: {
          totalUsers: INITIAL_METRICS.totalUsers,
          activeUsers: activeUsers + (INITIAL_METRICS.totalUsers - state.users.length),
          suspendedUsers: suspendedUsers + INITIAL_METRICS.suspendedUsers - 1,
          verifiedColleges,
          pendingColleges,
          verifiedClubs,
          pendingClubs,
          openReports,
          pendingApplications,
          openTickets,
        },
        charts: {
          userGrowth: USER_GROWTH_DATA,
          platformActivity: PLATFORM_ACTIVITY_DATA,
          verificationBreakdown: [
            { name: 'Verified', value: verifiedColleges, color: '#16A34A' },
            { name: 'Pending Review', value: pendingColleges, color: '#D97706' },
            { name: 'Needs Info', value: state.colleges.filter(c => c.status === 'needs_info').length, color: '#2563EB' },
            { name: 'Rejected', value: state.colleges.filter(c => c.status === 'rejected').length, color: '#DC2626' },
          ],
        },
        recentReports: state.reports.slice(0, 5),
        recentAuditLogs: state.auditLogs.slice(0, 6),
      },
    };
  },

  // =========================================================================
  // 2. COLLEGE VERIFICATION
  // Contract:
  // GET   /api/v1/admin/verifications?type=college
  // PATCH /api/v1/admin/verifications/colleges/:id
  // =========================================================================
  async getColleges(filters = {}) {
    await delay();
    let result = [...state.colleges];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    }
    return { success: true, data: result };
  },

  async updateCollegeStatus(collegeId, { status, reason, notes }) {
    await delay();
    const index = state.colleges.findIndex(c => c.id === collegeId);
    if (index === -1) throw new Error('College not found');

    const college = state.colleges[index];
    college.status = status;
    college.reviewedAt = new Date().toISOString();
    college.reviewedBy = 'Platform Owner';
    if (notes) college.notes = notes;

    recordAuditEvent({
      action: status === 'approved' ? 'COLLEGE_APPROVED' : status === 'rejected' ? 'COLLEGE_REJECTED' : 'COLLEGE_INFO_REQUESTED',
      actionCategory: 'Verification',
      targetType: 'College',
      targetId: college.id,
      targetName: college.name,
      reason: reason || notes,
    });

    persistState();
    return { success: true, data: college };
  },

  // =========================================================================
  // 3. CLUB VERIFICATION
  // Contract:
  // GET   /api/v1/admin/verifications?type=club
  // PATCH /api/v1/admin/verifications/clubs/:id
  // =========================================================================
  async getClubs(filters = {}) {
    await delay();
    let result = [...state.clubs];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(c => c.category === filters.category);
    }
    if (filters.collegeId && filters.collegeId !== 'all') {
      result = result.filter(c => c.collegeId === filters.collegeId);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.collegeName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return { success: true, data: result };
  },

  async updateClubStatus(clubId, { status, reason }) {
    await delay();
    const index = state.clubs.findIndex(c => c.id === clubId);
    if (index === -1) throw new Error('Club not found');

    const club = state.clubs[index];
    club.status = status;
    club.reviewedAt = new Date().toISOString();
    club.reviewedBy = 'Platform Owner';

    recordAuditEvent({
      action: status === 'approved' ? 'CLUB_APPROVED' : status === 'rejected' ? 'CLUB_REJECTED' : 'CLUB_INFO_REQUESTED',
      actionCategory: 'Verification',
      targetType: 'Club',
      targetId: club.id,
      targetName: `${club.name} (${club.collegeName})`,
      reason: reason,
    });

    persistState();
    return { success: true, data: club };
  },

  // =========================================================================
  // 4. CLUB ADMIN APPLICATIONS
  // Contract:
  // GET   /api/v1/admin/club-admin-applications
  // PATCH /api/v1/admin/club-admin-applications/:id
  // =========================================================================
  async getClubAdminApplications(filters = {}) {
    await delay();
    let result = [...state.applications];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(a => a.status === filters.status);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(a =>
        a.applicantName.toLowerCase().includes(q) ||
        a.applicantEmail.toLowerCase().includes(q) ||
        a.clubName.toLowerCase().includes(q) ||
        a.collegeName.toLowerCase().includes(q)
      );
    }
    return { success: true, data: result };
  },

  async reviewClubAdminApplication(applicationId, { status, reason, createAssignment = false }) {
    await delay();
    const index = state.applications.findIndex(a => a.id === applicationId);
    if (index === -1) throw new Error('Application not found');

    const application = state.applications[index];
    application.status = status;

    recordAuditEvent({
      action: status === 'approved' ? 'CLUB_ADMIN_APPLICATION_APPROVED' : 'CLUB_ADMIN_APPLICATION_REJECTED',
      actionCategory: 'Privilege Management',
      targetType: 'Application',
      targetId: application.id,
      targetName: `${application.applicantName} for ${application.clubName}`,
      reason,
    });

    // If approved and requested, create the corresponding assignment directly
    let newAssignment = null;
    if (status === 'approved' && createAssignment) {
      newAssignment = {
        id: `asgn-${Date.now()}`,
        userId: application.applicantId,
        userName: application.applicantName,
        userEmail: application.applicantEmail,
        collegeId: application.collegeId,
        collegeName: application.collegeName,
        clubId: application.clubId,
        clubName: application.clubName,
        assignedRole: application.assignedRole || 'Club Administrator',
        assignedAt: new Date().toISOString(),
        assignedBy: 'Platform Owner',
        status: 'active',
        revokedAt: null,
        revocationReason: null,
      };
      state.assignments = [newAssignment, ...state.assignments];

      // Update user role to club_admin if currently student
      const userIdx = state.users.findIndex(u => u.id === application.applicantId);
      if (userIdx !== -1 && state.users[userIdx].role === 'student') {
        state.users[userIdx].role = 'club_admin';
      }

      recordAuditEvent({
        action: 'CLUB_ADMIN_ASSIGNED',
        actionCategory: 'Privilege Management',
        targetType: 'Club Admin Assignment',
        targetId: newAssignment.id,
        targetName: `${newAssignment.userName} -> ${newAssignment.clubName}`,
        reason: 'Granted following application approval',
      });
    }

    persistState();
    return { success: true, data: { application, assignment: newAssignment } };
  },

  // =========================================================================
  // 5. CLUB ADMIN ASSIGNMENTS
  // Contract:
  // GET   /api/v1/admin/club-admin-assignments
  // POST  /api/v1/admin/club-admin-assignments
  // PATCH /api/v1/admin/club-admin-assignments/:id
  // =========================================================================
  async getClubAdminAssignments(filters = {}) {
    await delay();
    let result = [...state.assignments];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(a => a.status === filters.status);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(a =>
        a.userName.toLowerCase().includes(q) ||
        a.userEmail.toLowerCase().includes(q) ||
        a.clubName.toLowerCase().includes(q) ||
        a.collegeName.toLowerCase().includes(q)
      );
    }
    return { success: true, data: result };
  },

  async grantClubAdminAssignment({ userId, userName, userEmail, collegeId, collegeName, clubId, clubName, assignedRole }) {
    await delay();
    if (!userName || !clubId) throw new Error('User and Club are required');

    const newAssignment = {
      id: `asgn-${Date.now()}`,
      userId: userId || `usr-${Date.now()}`,
      userName,
      userEmail,
      collegeId,
      collegeName,
      clubId,
      clubName,
      assignedRole: assignedRole || 'Club Administrator',
      assignedAt: new Date().toISOString(),
      assignedBy: 'Platform Owner',
      status: 'active',
      revokedAt: null,
      revocationReason: null,
    };
    state.assignments = [newAssignment, ...state.assignments];

    // Promote user role if present
    const userIdx = state.users.findIndex(u => u.id === userId);
    if (userIdx !== -1 && state.users[userIdx].role === 'student') {
      state.users[userIdx].role = 'club_admin';
    }

    recordAuditEvent({
      action: 'CLUB_ADMIN_ASSIGNED',
      actionCategory: 'Privilege Management',
      targetType: 'Club Admin Assignment',
      targetId: newAssignment.id,
      targetName: `${userName} -> ${clubName}`,
      reason: 'Direct assignment granted by Platform Owner',
    });

    persistState();
    return { success: true, data: newAssignment };
  },

  async revokeClubAdminAssignment(assignmentId, { reason }) {
    await delay();
    const index = state.assignments.findIndex(a => a.id === assignmentId);
    if (index === -1) throw new Error('Assignment not found');

    const assignment = state.assignments[index];
    assignment.status = 'revoked';
    assignment.revokedAt = new Date().toISOString();
    assignment.revocationReason = reason || 'Revoked by Platform Owner';

    // Check if user has other active assignments; if not, revert user role back to student
    const otherActive = state.assignments.some(a => a.userId === assignment.userId && a.id !== assignmentId && a.status === 'active');
    if (!otherActive) {
      const userIdx = state.users.findIndex(u => u.id === assignment.userId);
      if (userIdx !== -1 && state.users[userIdx].role === 'club_admin') {
        state.users[userIdx].role = 'student';
      }
    }

    recordAuditEvent({
      action: 'CLUB_ADMIN_REVOKED',
      actionCategory: 'Privilege Management',
      targetType: 'Club Admin Assignment',
      targetId: assignment.id,
      targetName: `${assignment.userName} -> ${assignment.clubName}`,
      reason: reason || 'Revoked by Platform Owner',
    });

    persistState();
    return { success: true, data: assignment };
  },

  // =========================================================================
  // 6. USER MANAGEMENT
  // Contract:
  // GET   /api/v1/admin/users
  // GET   /api/v1/admin/users/:id
  // POST  /api/v1/admin/users/:id/actions (suspend, restore, restrict)
  // =========================================================================
  async getUsers(filters = {}) {
    await delay();
    let result = [...state.users];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(u => u.status === filters.status);
    }
    if (filters.role && filters.role !== 'all') {
      result = result.filter(u => u.role === filters.role);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.collegeName.toLowerCase().includes(q)
      );
    }
    return { success: true, data: result };
  },

  async updateUserStatus(userId, { status, reason, duration = 'Permanent', restrictions = [] }) {
    await delay();
    const index = state.users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const user = state.users[index];
    user.status = status;

    if (status === 'suspended') {
      user.suspensionReason = reason;
      user.suspendedUntil = duration;
      user.restrictions = ['account_locked', ...restrictions];
    } else if (status === 'active') {
      user.suspensionReason = null;
      user.suspendedUntil = null;
      user.restrictions = [];
    } else if (status === 'restricted') {
      user.restrictions = restrictions;
    }

    recordAuditEvent({
      action: status === 'suspended' ? 'USER_SUSPENDED' : status === 'active' ? 'USER_RESTORED' : 'USER_RESTRICTED',
      actionCategory: 'Account Security',
      targetType: 'User',
      targetId: user.id,
      targetName: `${user.name} (${user.email})`,
      reason: reason || `Account transitioned to ${status}`,
    });

    persistState();
    return { success: true, data: user };
  },

  // =========================================================================
  // 7. REPORTS & MODERATION
  // Contract:
  // GET   /api/v1/admin/reports
  // PATCH /api/v1/admin/reports/:id
  // =========================================================================
  async getReports(filters = {}) {
    await delay();
    let result = [...state.reports];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(r => r.status === filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(r => r.category === filters.category);
    }
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(r => r.priority === filters.priority);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(r =>
        r.targetName.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return { success: true, data: result };
  },

  async updateReportStatus(reportId, { status, resolutionNotes, resolutionAction, assignedModerator }) {
    await delay();
    const index = state.reports.findIndex(r => r.id === reportId);
    if (index === -1) throw new Error('Report not found');

    const report = state.reports[index];
    report.status = status;
    if (resolutionNotes) report.resolutionNotes = resolutionNotes;
    if (resolutionAction) report.resolutionAction = resolutionAction;
    if (assignedModerator) report.assignedModerator = assignedModerator;
    if (status === 'resolved' || status === 'rejected') {
      report.resolvedAt = new Date().toISOString();
    }

    recordAuditEvent({
      action: status === 'resolved' ? 'REPORT_RESOLVED' : status === 'rejected' ? 'REPORT_DISMISSED' : 'REPORT_ASSIGNED',
      actionCategory: 'Moderation',
      targetType: 'Report',
      targetId: report.id,
      targetName: `${report.category} report: ${report.targetName}`,
      reason: resolutionNotes || `Report status marked as ${status}`,
    });

    persistState();
    return { success: true, data: report };
  },

  // =========================================================================
  // 8. SUPPORT TICKETS
  // Contract:
  // GET   /api/v1/admin/support-tickets
  // PATCH /api/v1/admin/support-tickets/:id
  // POST  /api/v1/admin/support-tickets/:id/reply
  // =========================================================================
  async getSupportTickets(filters = {}) {
    await delay();
    let result = [...state.tickets];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(t =>
        t.subject.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q)
      );
    }
    return { success: true, data: result };
  },

  async replyToSupportTicket(ticketId, { message, newStatus = 'in_progress' }) {
    await delay();
    const index = state.tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const ticket = state.tickets[index];
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'owner',
      senderName: 'Revanth (Platform Owner)',
      text: message,
      timestamp: new Date().toISOString(),
    };

    ticket.messages.push(newMsg);
    ticket.status = newStatus;
    ticket.updatedAt = new Date().toISOString();

    persistState();
    return { success: true, data: ticket };
  },

  async updateTicketStatus(ticketId, { status }) {
    await delay();
    const index = state.tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const ticket = state.tickets[index];
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    persistState();
    return { success: true, data: ticket };
  },

  // =========================================================================
  // 9. AUDIT LOGS
  // Contract: GET /api/v1/admin/audit-logs
  // Read-only. Modifications and deletions strictly prohibited.
  // =========================================================================
  async getAuditLogs(filters = {}) {
    await delay();
    let result = [...state.auditLogs];

    if (filters.category && filters.category !== 'all') {
      result = result.filter(l => l.actionCategory === filters.category);
    }
    if (filters.actor && filters.actor !== 'all') {
      result = result.filter(l => l.actorName.toLowerCase().includes(filters.actor.toLowerCase()));
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.targetName.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q) ||
        l.targetType.toLowerCase().includes(q)
      );
    }
    return { success: true, data: result };
  },

  // =========================================================================
  // 10. PLATFORM SETTINGS
  // Contract:
  // GET   /api/v1/admin/settings
  // PATCH /api/v1/admin/settings
  // =========================================================================
  async getSettings() {
    await delay();
    return { success: true, data: state.settings };
  },

  async updateSettings(updatedSettings) {
    await delay();
    state.settings = { ...state.settings, ...updatedSettings };

    recordAuditEvent({
      action: 'PLATFORM_SETTINGS_UPDATED',
      actionCategory: 'System Configuration',
      targetType: 'Platform Settings',
      targetId: 'sys-config',
      targetName: 'Global Platform Policies & Controls',
      reason: 'Configuration modified in Owner Admin settings console',
    });

    persistState();
    return { success: true, data: state.settings, message: 'Settings saved to demonstration store.' };
  },
};
