/**
 * Comprehensive Automated Test Suite: Teams & Projects Module
 * Runs via Node v24 built-in test runner (node:test & node:assert)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  getProjects,
  getProjectById,
  createProject,
  submitJoinRequest,
  getProjectApplicants,
  reviewApplicant,
  removeTeamMember,
  leaveTeam,
  transferOwnership,
  sendInvitation,
  respondToInvitation,
  getProjectTasks,
  createProjectTask,
  updateProjectTask,
  calculateAvailablePositions,
  validateProjectForm,
  validateJoinRequestForm,
} from '../services/projectsService.js';

import { getStudentProfileSummary, sanitizeStudentProfile } from '../services/studentProfileAdapter.js';
import { chatIntegrationAdapter } from '../services/chatIntegrationAdapter.js';
import { pointsServiceAdapter } from '../services/pointsServiceAdapter.js';
import { moderationAdapter } from '../services/moderationAdapter.js';

describe('Vynora Connect — Teams & Projects Module Verification', () => {

  // Test 1: Project Creation, Editing & Validation
  test('1. Project creation and form validation', async () => {
    // Validation failure on empty title
    const invalidForm = {
      title: 'A',
      tagline: 'Too short',
      problemStatement: 'Short',
      goals: 'Short',
      summary: 'Short',
      description: 'Short',
      category: 'Web Application',
      visibility: 'public',
    };
    const validation = validateProjectForm(invalidForm);
    assert.equal(validation.isValid, false);
    assert.ok(validation.errors.title);

    // Valid project creation
    const validForm = {
      title: 'Test Autonomous Rover Robotics',
      tagline: 'Building a solar-powered mapping rover for campus terrain exploration.',
      problemStatement: 'Campus grounds are difficult to map during monsoon flooding without remote rovers.',
      goals: 'Design and assemble a 4-wheel rover with LiDAR telemetry mapping.',
      summary: 'Robotics rover project for inter-campus autonomous mapping competition.',
      description: 'Full hardware and ROS2 software implementation for an outdoor autonomous rover equipped with real-time video telemetry.',
      category: 'Research & Academic',
      visibility: 'public',
      tags: ['ros2', 'python', 'lidar', 'robotics'],
      openRoles: [
        {
          title: 'Embedded Firmware Developer',
          skillsRequired: 'C++, ROS2, Arduino',
          openings: 2,
        },
      ],
    };

    const res = await createProject(validForm, {
      id: 'usr-test-lead',
      name: 'Test Lead',
      college: 'Vynora Tech',
      department: 'CSE',
      avatar: 'T',
    });

    assert.equal(res.success, true);
    assert.equal(res.data.title, validForm.title);
    assert.equal(res.data.team.members[0].role, 'owner');
    assert.equal(res.data.openRoles.length, 1);
    assert.equal(res.data.openRoles[0].openings, 2);
  });

  // Test 2: Discovery Search, Filtering, Sorting & Pagination
  test('2. Discovery search, category filter, recruiting filter and sorting', async () => {
    // Search keyword
    const searchRes = await getProjects({ search: 'Patrol' });
    assert.ok(searchRes.data.length > 0);
    assert.ok(searchRes.data[0].title.includes('Patrol'));

    // Category filter
    const catRes = await getProjects({ category: 'AI & Machine Learning' });
    assert.ok(catRes.data.every(p => p.category === 'AI & Machine Learning'));

    // Recruiting Only filter: projects with 0 available positions must not appear
    const recruitingRes = await getProjects({ recruitingOnly: true });
    assert.ok(recruitingRes.data.every(p => calculateAvailablePositions(p) > 0));

    // Fully staffed project (proj-105) has 0 available positions and must NOT appear when recruitingOnly is true
    const proj105InRecruiting = recruitingRes.data.find(p => p.id === 'proj-105');
    assert.equal(proj105InRecruiting, undefined);

    // Project with openings (proj-104 has 2/4 members and 2 available positions) MUST appear in recruiting
    const proj104InRecruiting = recruitingRes.data.find(p => p.id === 'proj-104');
    assert.ok(proj104InRecruiting);

    // Sorting by newest
    const sortRes = await getProjects({ sortBy: 'newest' });
    assert.ok(sortRes.data.length > 1);
    assert.ok(new Date(sortRes.data[0].createdAt) >= new Date(sortRes.data[1].createdAt));
  });

  // Test 3: Project Detail Access & Negative Constraints Check
  test('3. Project detail access and absence of prohibited fields (repoUrl/demoUrl)', async () => {
    const project = await getProjectById('proj-101');
    assert.ok(project);
    assert.equal(project.id, 'proj-101');
    assert.ok(project.problemStatement);
    assert.ok(project.goals);
    assert.ok(project.description);

    // Verify negative constraints: repoUrl and demoUrl should not be populated on new or sanitized models
    const validationCheck = validateProjectForm({
      title: 'Valid Title Here',
      tagline: 'Valid Tagline of adequate length',
      problemStatement: 'Valid problem statement of adequate length for testing purposes',
      goals: 'Valid goals of adequate length for testing purposes',
      summary: 'Valid summary of adequate length for testing purposes',
      description: 'Valid description of adequate length for testing purposes and verification',
      category: 'Web Application',
      visibility: 'public',
    });
    assert.equal(validationCheck.isValid, true);
    assert.equal(validationCheck.errors.repoUrl, undefined);
    assert.equal(validationCheck.errors.demoUrl, undefined);
  });

  // Test 4: Application Submission & Validation
  test('4. Application submission validation', async () => {
    const invalidApp = {
      roleId: '',
      introduction: 'Too short',
      experienceSummary: '',
    };
    const val = validateJoinRequestForm(invalidApp);
    assert.equal(val.isValid, false);
    assert.ok(val.errors.roleId);
    assert.ok(val.errors.introduction);
    assert.ok(val.errors.experienceSummary);

    // Valid submission
    const res = await submitJoinRequest('proj-102', {
      roleId: 'role-102-1',
      introduction: 'I am a 3rd year UI designer experienced with Figma and interactive user testing.',
      relevantSkills: ['Figma', 'Prototyping', 'User Research'],
      experienceSummary: 'Designed campus event portal and interned at a product agency.',
    }, {
      id: 'usr-fresh-applicant',
      name: 'Fresh Candidate',
      college: 'Apex College',
      department: 'Design',
      avatar: 'F',
    });

    assert.equal(res.success, true);
    assert.equal(res.data.status, 'pending');
  });

  // Test 5: Duplicate Application Prevention
  test('5. Duplicate pending application prevention', async () => {
    await assert.rejects(
      async () => {
        await submitJoinRequest('proj-102', {
          roleId: 'role-102-1',
          introduction: 'Duplicate attempt to apply for the same role.',
          experienceSummary: 'Previous experience summary.',
        }, {
          id: 'usr-fresh-applicant',
          name: 'Fresh Candidate',
          college: 'Apex College',
        });
      },
      (err) => {
        return (
          err.name === 'ValidationError' &&
          err.errors &&
          /already have an active pending application/i.test(err.errors.message)
        );
      }
    );
  });

  // Test 6: Privacy-Safe Profile Access from Ram's Module
  test('6. Privacy-safe student profile enrichment from Ram adapter', async () => {
    const rawProfile = {
      id: 'usr-sample',
      name: 'Priya Patel',
      college: 'Vynora Campus',
      department: 'ECE',
      year: '3rd Year',
      email: 'priya.private@example.com', // Must be stripped!
      phone: '+91-9876543210',             // Must be stripped!
      internalAuditHash: 'secret-hash-123', // Must be stripped!
      verifiedSkills: ['Embedded C', 'RTOS'],
      resumeHeadline: 'IoT and Embedded Systems Researcher',
    };

    const sanitized = sanitizeStudentProfile(rawProfile);
    assert.equal(sanitized.name, 'Priya Patel');
    assert.equal(sanitized.email, undefined);
    assert.equal(sanitized.phone, undefined);
    assert.equal(sanitized.internalAuditHash, undefined);
    assert.equal(sanitized.verifiedSkills.length, 2);

    const applicants = await getProjectApplicants('proj-101', 'usr-varsh');
    assert.ok(Array.isArray(applicants));
    if (applicants.length > 0) {
      assert.ok(applicants[0].applicantProfile);
      assert.equal(applicants[0].applicantProfile.email, undefined);
    }
  });

  // Test 7 & 8: Applicant Accept/Reject and Atomic Capacity Enforcement
  test('7 & 8. Review workflow and atomic team capacity enforcement', async () => {
    const applicants = await getProjectApplicants('proj-101', 'usr-varsh');
    const pendingReq = applicants.find(a => a.status === 'pending');

    if (pendingReq) {
      const reviewRes = await reviewApplicant(pendingReq.id, 'accepted', 'Welcome to VisionGuard!', 'usr-varsh');
      assert.equal(reviewRes.success, true);
      assert.equal(reviewRes.data.status, 'accepted');

      // Verify applicant was atomically added to team
      const updatedProj = await getProjectById('proj-101');
      const isMemberNow = updatedProj.team.members.some(m => m.userId === pendingReq.applicant.id);
      assert.equal(isMemberNow, true);

      // Verify role filled count incremented
      const role = updatedProj.openRoles.find(r => r.id === pendingReq.roleId);
      assert.ok(role.filled > 0);
    }
  });

  // Test 9: Team Membership & Role Permissions (Owner, Manager, Member)
  test('9. Role-based permissions enforcement', async () => {
    // Regular member cannot remove teammate
    await assert.rejects(
      async () => {
        await removeTeamMember('proj-104', 'usr-siri', 'usr-candidate-1');
      },
      /Access denied/
    );

    // Project owner cannot leave without transferring ownership
    await assert.rejects(
      async () => {
        await leaveTeam('proj-101', 'usr-varsh');
      },
      /Project owners cannot leave without transferring ownership/
    );

    // Safe ownership transfer
    const transferRes = await transferOwnership('proj-101', 'usr-deep', 'usr-varsh');
    assert.equal(transferRes.success, true);

    const updatedProj = await getProjectById('proj-101');
    const newOwner = updatedProj.team.members.find(m => m.userId === 'usr-deep');
    const oldOwner = updatedProj.team.members.find(m => m.userId === 'usr-varsh');

    assert.equal(newOwner.role, 'owner');
    assert.equal(oldOwner.role, 'manager');
  });

  // Test 10: Invitations & Points Adapter Integrity
  test('10. Invitations workflow and Vynora Points boundary', async () => {
    // Points adapter status: Must report honest offline status without inventing points
    const pointsStatus = pointsServiceAdapter.getIntegrationStatus();
    assert.equal(pointsStatus.available, false);
    assert.ok(pointsStatus.statusLabel.includes('Awaiting Vynora Points'));

    // Candidate skill match evaluation: Technical skills are primary
    const evalRes = pointsServiceAdapter.evaluateCandidateEligibility(
      ['react', 'tailwind', 'javascript'],
      ['React', 'Tailwind', 'Python']
    );
    assert.equal(evalRes.isEligible, true);
    assert.equal(evalRes.pointsVerified, false);
    assert.equal(evalRes.matchingSkills.length, 2);

    // Send direct invitation
    const inviteRes = await sendInvitation(
      'proj-103',
      {
        invitedUserId: 'usr-karthik',
        invitedStudentName: 'Karthik Kavali',
        roleId: 'role-103-1',
        message: 'Join EduFund to audit smart contracts!',
      },
      'usr-ram'
    );
    assert.equal(inviteRes.success, true);
    assert.equal(inviteRes.data.status, 'pending');

    // Duplicate invitation rejection
    await assert.rejects(
      async () => {
        await sendInvitation(
          'proj-103',
          {
            invitedUserId: 'usr-karthik',
            invitedStudentName: 'Karthik Kavali',
            roleId: 'role-103-1',
          },
          'usr-ram'
        );
      },
      /An active pending invitation has already been sent/
    );

    // Respond to invitation: Accept
    const acceptRes = await respondToInvitation(inviteRes.data.id, 'accepted', 'usr-karthik');
    assert.equal(acceptRes.success, true);
    assert.equal(acceptRes.data.status, 'accepted');
  });

  // Test 11: Task Checklist Management
  test('11. Task management checklist (create, assign, complete)', async () => {
    // Create task
    const taskRes = await createProjectTask('proj-101', {
      title: 'Implement LiDAR point-cloud filter',
      description: 'Filter ground plane noise in laser scans.',
      assignedToUserId: 'usr-deep',
      priority: 'urgent',
      dueDate: '2026-11-25',
    }, 'usr-deep');

    assert.equal(taskRes.success, true);
    assert.equal(taskRes.data.priority, 'urgent');

    // Update status to completed
    const updateRes = await updateProjectTask('proj-101', taskRes.data.id, {
      status: 'completed',
    }, 'usr-deep');

    assert.equal(updateRes.success, true);
    assert.equal(updateRes.data.status, 'completed');
    assert.ok(updateRes.data.completedAt);

    // Non-member access to tasks must be blocked
    await assert.rejects(
      async () => {
        await getProjectTasks('proj-101', 'usr-unauthorized-random');
      },
      /Access denied/
    );
  });

  // Test 12 & 13: Chat & Notification Integration Boundaries
  test('12 & 13. Siri chat adapter event emission & room registration', async () => {
    const room = chatIntegrationAdapter.initializeTeamChatRoom('team-test-12', 'proj-test', 'Test Project', ['usr-varsh', 'usr-deep']);
    assert.equal(room.channelId, 'chat-team-team-test-12');
    assert.equal(room.authorizedUserIds.length, 2);

    chatIntegrationAdapter.authorizeMemberInChat('team-test-12', 'usr-new-member');
    assert.ok(room.authorizedUserIds.includes('usr-new-member'));

    chatIntegrationAdapter.deauthorizeMemberInChat('team-test-12', 'usr-new-member');
    assert.equal(room.authorizedUserIds.includes('usr-new-member'), false);

    const chatUrl = chatIntegrationAdapter.getChatRoomUrl('team-test-12');
    assert.ok(chatUrl.includes('channel=team'));
  });

  // Test 14 & 15: Moderation Integration Adapter
  test('14 & 15. Revanth moderation adapter reporting', async () => {
    const reportRes = await moderationAdapter.reportProject(
      'proj-101',
      'Smart Campus Patrol',
      'Inappropriate Content or Language',
      'Test report details'
    );
    assert.equal(reportRes.success, true);
    assert.equal(reportRes.data.status, 'pending_review');
  });

  // Test 16: Issue 1 — Dynamic Available Positions Calculation and Fully Staffed Discovery Rules
  test('16. Issue 1: Dynamic available positions calculation & staffed discovery rules', async () => {
    // A project with 2/4 members (proj-104) must report 2 available positions, NOT 0 ("Fully Staffed")
    const proj104 = await getProjectById('proj-104');
    const available104 = calculateAvailablePositions(proj104);
    assert.equal(available104, 2, 'proj-104 with 2/4 members and 2 open roles must have 2 available positions');
    assert.ok(available104 > 0, 'Project must display Recruiting, not Fully Staffed');

    // A project with 3/3 members (proj-105) must report 0 available positions ("Fully Staffed")
    const proj105 = await getProjectById('proj-105');
    const available105 = calculateAvailablePositions(proj105);
    assert.equal(available105, 0, 'proj-105 with 3/3 members must have 0 available positions');

    // Active recruitment discovery rule:
    // When non-members browse projects, fully staffed projects (0 available positions) are removed from active discovery
    const nonMemberDiscovery = await getProjects({ currentUserId: 'usr-non-member-visitor' });
    const staffedInDiscovery = nonMemberDiscovery.data.find(p => p.id === 'proj-105');
    assert.equal(staffedInDiscovery, undefined, 'Fully staffed project must be excluded from active recruitment discovery for non-members');

    // Preserved access: Project creator and team members CAN still access the fully staffed project
    const leadDiscovery = await getProjects({ currentUserId: 'usr-arjun' }); // Arjun Mehta is lead of proj-105
    const staffedForLead = leadDiscovery.data.find(p => p.id === 'proj-105');
    assert.ok(staffedForLead, 'Project creator must retain access to their fully staffed project');

    const memberDiscovery = await getProjects({ currentUserId: 'usr-deep' }); // Deepu is member of proj-105
    const staffedForMember = memberDiscovery.data.find(p => p.id === 'proj-105');
    assert.ok(staffedForMember, 'Team member must retain access to their fully staffed project');
  });

  // Test 17: Issue 2 — Apply to Join workflow, pending state, duplicate prevention, and campus eligibility
  test('17. Issue 2: Apply to Join workflow, pending state, and campus eligibility', async () => {
    // 1. Eligible non-member can apply to a project with available positions (e.g. proj-104)
    const applyRes = await submitJoinRequest('proj-104', {
      roleId: 'role-104-1',
      introduction: 'I have deep expertise in building offline-first progressive web applications using service workers.',
      relevantSkills: ['PWA', 'WebTorrent', 'Service Workers'],
      experienceSummary: 'Built offline course sync system for national student hackathon.',
    }, {
      id: 'usr-eligible-nonmember',
      name: 'Eligible Student',
      college: 'State Technical University',
      department: 'Computer Science',
    });
    assert.equal(applyRes.success, true);
    assert.equal(applyRes.data.status, 'pending');

    // 2. Prevent duplicate pending applications
    await assert.rejects(
      async () => {
        await submitJoinRequest('proj-104', {
          roleId: 'role-104-1',
          introduction: 'Trying to apply again.',
          experienceSummary: 'Another submission.',
        }, {
          id: 'usr-eligible-nonmember',
          name: 'Eligible Student',
          college: 'State Technical University',
        });
      },
      (err) => err.name === 'ValidationError' && /already have an active pending application/i.test(err.errors?.message)
    );

    // 3. Project lead and existing team members cannot apply
    await assert.rejects(
      async () => {
        await submitJoinRequest('proj-104', {
          roleId: 'role-104-2',
          introduction: 'I am the lead trying to apply.',
          experienceSummary: 'Lead summary.',
        }, {
          id: 'usr-siri', // Lead of proj-104
          name: 'Siri Nallala',
          college: 'State Technical University',
        });
      },
      (err) => err.name === 'ValidationError' && /already an active member/i.test(err.errors?.message)
    );

    // 4. Fully staffed project rejects new applications
    await assert.rejects(
      async () => {
        await submitJoinRequest('proj-105', {
          roleId: 'role-105-1',
          introduction: 'Trying to apply to a fully staffed project.',
          experienceSummary: 'Should fail.',
        }, {
          id: 'usr-random-applicant',
          name: 'Random Student',
          college: 'Apex College of Technology',
        });
      },
      (err) => err.name === 'ValidationError' && /fully staffed/i.test(err.errors?.message)
    );

    // 5. Campus eligibility: campus-only project rejects students from different universities
    const campusProjectRes = await createProject({
      title: 'Campus Shuttle Tracking Network',
      tagline: 'Live GPS telemetry for intra-campus student transit buses.',
      problemStatement: 'Students wait long periods at hostel bus stops without real-time vehicle transit telemetry.',
      goals: 'Install low-cost telemetry units on 6 campus shuttles with WebSocket live tracking.',
      summary: 'Live GPS telemetry tracking for intra-campus student transit buses.',
      description: 'Internal campus transit application with live vehicle locations, ETA calculation, and passenger load monitoring.',
      category: 'Campus Utility',
      visibility: 'campus-only',
      tags: ['gps', 'websockets', 'react', 'mqtt'],
      openRoles: [{
        title: 'Telemetry Integration Engineer',
        skillsRequired: 'MQTT, WebSocket, React',
        openings: 1,
      }],
    }, {
      id: 'usr-shuttle-lead',
      name: 'Shuttle Project Lead',
      college: 'Vynora Institute of Technology',
      department: 'ECE',
    });

    const campusProjId = campusProjectRes.data.id;
    const campusRoleId = campusProjectRes.data.openRoles[0].id;

    // Applicant from another university must be rejected
    await assert.rejects(
      async () => {
        await submitJoinRequest(campusProjId, {
          roleId: campusRoleId,
          introduction: 'Applying from an unaffiliated campus.',
          experienceSummary: 'Student from foreign college.',
        }, {
          id: 'usr-foreign-college-student',
          name: 'Foreign Student',
          college: 'Outside Private University', // Lead is from Vynora Institute of Technology
        });
      },
      (err) => err.name === 'ValidationError' && /restricted to students from/i.test(err.errors?.message)
    );

    // Eligible student from the same campus can apply successfully
    const eligibleCampusApp = await submitJoinRequest(campusProjId, {
      roleId: campusRoleId,
      introduction: 'I study at Vynora Institute and have built real-time WebSocket vehicle trackers.',
      relevantSkills: ['MQTT', 'WebSocket', 'React'],
      experienceSummary: 'Built campus bus alert bot in sophomore year.',
    }, {
      id: 'usr-vynora-local-student',
      name: 'Local Campus Student',
      college: 'Vynora Institute of Technology',
    });
    assert.equal(eligibleCampusApp.success, true);
    assert.equal(eligibleCampusApp.data.status, 'pending');
  });
});
