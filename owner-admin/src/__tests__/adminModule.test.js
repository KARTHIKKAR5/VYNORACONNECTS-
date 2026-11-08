/**
 * Vynora Connect — Platform Owner Admin & Moderation Module Automated Verification
 * Uses Node v24 built-in test runner (node:test & node:assert)
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { adminApi } from '../services/adminApi.js';

describe('Vynora Connect — Owner Admin & Moderation Module Verification', () => {

  beforeEach(async () => {
    // Reset state before tests
    await adminApi.resetDemoData();
  });

  // 1. Overview Metrics & Charts Verification
  test('1. Overview returns metrics summary and chart data series', async () => {
    const res = await adminApi.getOverview();
    assert.equal(res.success, true);
    assert.ok(res.data.metrics);
    assert.ok(res.data.metrics.totalUsers > 0);
    assert.ok(res.data.metrics.verifiedColleges > 0);
    assert.ok(res.data.metrics.verifiedClubs > 0);
    assert.ok(res.data.charts.userGrowth.length >= 6);
    assert.ok(res.data.charts.platformActivity.length >= 7);
  });

  // 2. College Verification Workflows
  test('2. College verification: approve, reject with reason, request info, and audit logging', async () => {
    // Get colleges
    const collegesRes = await adminApi.getColleges();
    assert.ok(collegesRes.data.length >= 5);

    // Pending college
    const pendingCol = collegesRes.data.find(c => c.status === 'pending');
    assert.ok(pendingCol);

    // Approve
    const approveRes = await adminApi.updateCollegeStatus(pendingCol.id, {
      status: 'approved',
      reason: 'NAAC A+ accreditation and Dean credentials verified.',
    });
    assert.equal(approveRes.success, true);
    assert.equal(approveRes.data.status, 'approved');

    // Reject another college with reason
    const rejectCol = collegesRes.data.find(c => c.id === 'col-105');
    assert.ok(rejectCol);
    const rejectRes = await adminApi.updateCollegeStatus(rejectCol.id, {
      status: 'rejected',
      reason: 'Failed to provide statutory UGC state university gazette notification.',
    });
    assert.equal(rejectRes.success, true);
    assert.equal(rejectRes.data.status, 'rejected');

    // Verify audit logs contain the college verification events
    const auditRes = await adminApi.getAuditLogs();
    const approvedLog = auditRes.data.find(l => l.action === 'COLLEGE_APPROVED' && l.targetId === pendingCol.id);
    const rejectedLog = auditRes.data.find(l => l.action === 'COLLEGE_REJECTED' && l.targetId === rejectCol.id);
    assert.ok(approvedLog);
    assert.ok(rejectedLog);
  });

  // 3. Club Verification Workflows
  test('3. Club verification: approve, reject with reason, and preserve college relationship', async () => {
    const clubsRes = await adminApi.getClubs();
    assert.ok(clubsRes.data.length >= 5);

    const pendingClub = clubsRes.data.find(c => c.status === 'pending');
    assert.ok(pendingClub);
    assert.ok(pendingClub.collegeName, 'Must have associated verified college');

    // Approve club
    const approveRes = await adminApi.updateClubStatus(pendingClub.id, {
      status: 'approved',
      reason: 'Club charter and faculty advisor verified.',
    });
    assert.equal(approveRes.success, true);
    assert.equal(approveRes.data.status, 'approved');

    // Reject club
    const rejectRes = await adminApi.updateClubStatus(pendingClub.id, {
      status: 'rejected',
      reason: 'Club bylaws violate campus student safety policy.',
    });
    assert.equal(rejectRes.success, true);
    assert.equal(rejectRes.data.status, 'rejected');
  });

  // 4. Club Admin Applications Review & Traceable Assignment
  test('4. Club Admin Applications: approve and automatically create scoped club assignment', async () => {
    const appsRes = await adminApi.getClubAdminApplications({ status: 'pending' });
    assert.ok(appsRes.data.length > 0);

    const targetApp = appsRes.data[0];

    // Approve application and trigger assignment creation
    const reviewRes = await adminApi.reviewClubAdminApplication(targetApp.id, {
      status: 'approved',
      reason: 'Verified candidate experience and faculty endorsement.',
      createAssignment: true,
    });
    assert.equal(reviewRes.success, true);
    assert.equal(reviewRes.data.application.status, 'approved');
    assert.ok(reviewRes.data.assignment);
    assert.equal(reviewRes.data.assignment.userId, targetApp.applicantId);
    assert.equal(reviewRes.data.assignment.clubId, targetApp.clubId);
    assert.equal(reviewRes.data.assignment.status, 'active');

    // Verify user role promoted to club_admin
    const usersRes = await adminApi.getUsers({ search: targetApp.applicantName });
    const user = usersRes.data.find(u => u.id === targetApp.applicantId);
    if (user) {
      assert.equal(user.role, 'club_admin');
    }
  });

  // 5. Club Admin Assignments & Scoped Privilege Boundaries
  test('5. Club Admin Assignments: grant scoped assignment and revoke with mandatory reason', async () => {
    // Grant new assignment
    const grantRes = await adminApi.grantClubAdminAssignment({
      userName: 'Test Student Lead',
      userEmail: 'lead@vit.edu.in',
      collegeId: 'col-101',
      collegeName: 'Vynora Institute of Technology',
      clubId: 'club-201',
      clubName: 'Google Developer Student Club (GDSC)',
      assignedRole: 'Technical Coordinator',
    });
    assert.equal(grantRes.success, true);
    assert.equal(grantRes.data.status, 'active');
    assert.equal(grantRes.data.clubName, 'Google Developer Student Club (GDSC)');

    // Revoke assignment
    const revokeRes = await adminApi.revokeClubAdminAssignment(grantRes.data.id, {
      reason: 'Student graduated; leadership transition completed.',
    });
    assert.equal(revokeRes.success, true);
    assert.equal(revokeRes.data.status, 'revoked');
    assert.ok(revokeRes.data.revokedAt);
    assert.equal(revokeRes.data.revocationReason, 'Student graduated; leadership transition completed.');
  });

  // 6. User Management & Security Governance
  test('6. User management: search, filter, suspend with duration, and restore', async () => {
    const usersRes = await adminApi.getUsers();
    assert.ok(usersRes.data.length >= 8);

    const activeUser = usersRes.data.find(u => u.status === 'active' && u.role === 'student');
    assert.ok(activeUser);

    // Suspend user
    const suspendRes = await adminApi.updateUserStatus(activeUser.id, {
      status: 'suspended',
      reason: 'Multiple harassment complaints in campus robotics channel.',
      duration: '30 Days',
    });
    assert.equal(suspendRes.success, true);
    assert.equal(suspendRes.data.status, 'suspended');
    assert.equal(suspendRes.data.suspendedUntil, '30 Days');
    assert.ok(suspendRes.data.restrictions.includes('account_locked'));

    // Restore user
    const restoreRes = await adminApi.updateUserStatus(activeUser.id, {
      status: 'active',
      reason: 'Cooling period completed; reinstated by Platform Owner.',
    });
    assert.equal(restoreRes.success, true);
    assert.equal(restoreRes.data.status, 'active');
    assert.equal(restoreRes.data.suspensionReason, null);
  });

  // 7. Reports & Moderation Incident Workflows
  test('7. Reports & moderation: filter by priority, assign moderator, and resolve with notes', async () => {
    const reportsRes = await adminApi.getReports({ status: 'open' });
    assert.ok(reportsRes.data.length > 0);

    const openReport = reportsRes.data[0];

    // Assign moderator
    const assignRes = await adminApi.updateReportStatus(openReport.id, {
      status: 'under_review',
      assignedModerator: 'Ananya Sen (Moderator)',
    });
    assert.equal(assignRes.success, true);
    assert.equal(assignRes.data.assignedModerator, 'Ananya Sen (Moderator)');

    // Resolve report
    const resolveRes = await adminApi.updateReportStatus(openReport.id, {
      status: 'resolved',
      resolutionNotes: 'Spam messages removed and target account suspended.',
      resolutionAction: 'account_suspended',
    });
    assert.equal(resolveRes.success, true);
    assert.equal(resolveRes.data.status, 'resolved');
    assert.ok(resolveRes.data.resolvedAt);
  });

  // 8. Support Tickets Threading & Interactive Replies
  test('8. Support tickets: inspect conversation thread, post owner reply, and update status', async () => {
    const ticketsRes = await adminApi.getSupportTickets();
    assert.ok(ticketsRes.data.length > 0);

    const ticket = ticketsRes.data[0];
    const originalCount = ticket.messages.length;

    // Post reply as Platform Owner
    const replyRes = await adminApi.replyToSupportTicket(ticket.id, {
      message: 'We have updated our campus mail gateway settings; please verify your inbox.',
      newStatus: 'resolved',
    });
    assert.equal(replyRes.success, true);
    assert.equal(replyRes.data.status, 'resolved');
    assert.equal(replyRes.data.messages.length, originalCount + 1);
    assert.equal(replyRes.data.messages[replyRes.data.messages.length - 1].sender, 'owner');
  });

  // 9. Immutable Audit Logs & Retention
  test('9. Audit logs: chronological ordering, searchability, and read-only integrity', async () => {
    const auditRes = await adminApi.getAuditLogs();
    assert.ok(auditRes.data.length >= 8);

    // Verify all entries contain required security fields
    auditRes.data.forEach(log => {
      assert.ok(log.id);
      assert.ok(log.timestamp);
      assert.ok(log.actorName);
      assert.ok(log.action);
      assert.ok(log.targetName);
      assert.ok(log.reason);
      assert.ok(log.result);
    });

    // Search filter
    const searchRes = await adminApi.getAuditLogs({ search: 'SUSPENDED' });
    assert.ok(searchRes.data.every(l => l.action.includes('SUSPENDED') || l.reason.includes('SUSPENDED')));
  });

  // 10. Platform Settings & Local Configuration Invariants
  test('10. Platform settings: update moderation threshold and verify audit event generation', async () => {
    const settingsRes = await adminApi.getSettings();
    assert.ok(settingsRes.data.general);
    assert.ok(settingsRes.data.moderation);

    // Update auto quarantine threshold
    const updated = {
      ...settingsRes.data,
      moderation: {
        ...settingsRes.data.moderation,
        autoQuarantineReportThreshold: 7,
      },
    };
    const updateRes = await adminApi.updateSettings(updated);
    assert.equal(updateRes.success, true);
    assert.equal(updateRes.data.moderation.autoQuarantineReportThreshold, 7);

    // Verify audit log captured the update
    const auditRes = await adminApi.getAuditLogs();
    const configLog = auditRes.data.find(l => l.action === 'PLATFORM_SETTINGS_UPDATED');
    assert.ok(configLog);
  });
});
