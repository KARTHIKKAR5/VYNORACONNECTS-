import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateProfileInput,
  isValidWebUrl,
  PROFILE_LIMITS,
} from '../modules/network/schemas/profileSchema.js';
import {
  formatStudyYear,
  getInitials,
  sanitizeExternalUrl,
  truncateText,
} from '../modules/network/utils/profileFormatters.js';
import mockNetworkService from '../modules/network/services/mockNetworkService.js';

describe('Vynora Connect — Network Module Tests (Task 2)', () => {
  describe('Profile Schema & Input Validation', () => {
    it('validates a complete, compliant profile payload', () => {
      const payload = {
        branch: 'Computer Science & Engineering',
        studyYear: 3,
        bio: 'Passionate student developer exploring distributed systems.',
        skills: ['React.js', 'Node.js', 'MongoDB'],
        interests: ['Web Development', 'Open Source'],
        links: {
          github: 'https://github.com/ram',
          linkedin: 'https://linkedin.com/in/ram',
          website: 'https://ram.dev',
        },
      };

      const result = validateProfileInput(payload);
      assert.equal(result.isValid, true);
      assert.deepEqual(result.errors, {});
    });

    it('rejects missing or empty branch', () => {
      const payload = {
        branch: '',
        studyYear: 2,
      };
      const result = validateProfileInput(payload);
      assert.equal(result.isValid, false);
      assert.match(result.errors.branch, /Branch\/Department is required/);
    });

    it('rejects invalid study year', () => {
      const payload = {
        branch: 'IT',
        studyYear: 99,
      };
      const result = validateProfileInput(payload);
      assert.equal(result.isValid, false);
      assert.match(result.errors.studyYear, /valid study year/);
    });

    it('enforces maximum bio character length (300 characters)', () => {
      const longBio = 'a'.repeat(PROFILE_LIMITS.BIO_MAX_LENGTH + 10);
      const payload = {
        branch: 'CSE',
        studyYear: 3,
        bio: longBio,
      };
      const result = validateProfileInput(payload);
      assert.equal(result.isValid, false);
      assert.match(result.errors.bio, /cannot exceed/);
    });

    it('validates URL safety and rejects unsafe or malformed protocols', () => {
      assert.equal(isValidWebUrl('https://github.com/vynora'), true);
      assert.equal(isValidWebUrl('http://localhost:5173'), true);
      assert.equal(isValidWebUrl('ftp://invalidscheme.com'), false);
      assert.equal(isValidWebUrl('javascript:alert(1)'), false);
      assert.equal(isValidWebUrl('not a url'), false);
      assert.equal(isValidWebUrl(''), true); // empty optional link is valid
    });
  });

  describe('Profile Formatters & Display Helpers', () => {
    it('formats study years accurately', () => {
      assert.equal(formatStudyYear(1), '1st Year');
      assert.equal(formatStudyYear(2), '2nd Year');
      assert.equal(formatStudyYear(3), '3rd Year');
      assert.equal(formatStudyYear(4), '4th Year');
      assert.equal(formatStudyYear(5), '5th Year');
    });

    it('generates uppercase initials correctly', () => {
      assert.equal(getInitials('Ram Charan'), 'RC');
      assert.equal(getInitials('Karthik'), 'KA');
      assert.equal(getInitials('Bala Varshitha'), 'BV');
      assert.equal(getInitials(''), '?');
    });

    it('sanitizes external URLs with protocol prepending', () => {
      assert.equal(sanitizeExternalUrl('github.com/ram'), 'https://github.com/ram');
      assert.equal(sanitizeExternalUrl('https://portfolio.dev'), 'https://portfolio.dev');
      assert.equal(sanitizeExternalUrl(''), '');
    });

    it('truncates long text properly with ellipsis', () => {
      const text = 'This is a test description of a student profile that is fairly long.';
      const truncated = truncateText(text, 20);
      assert.equal(truncated.length <= 23, true);
      assert.equal(truncated.endsWith('...'), true);
    });
  });

  describe('Mock Network Service & Connection Lifecycle', () => {
    it('searches students by name, college, and skill', async () => {
      const res = await mockNetworkService.searchStudents({ search: 'Varshitha' });
      assert.equal(res.students.length, 1);
      assert.equal(res.students[0].name, 'Bala Varshitha');

      const iitRes = await mockNetworkService.searchStudents({ college: 'IIT Hyderabad' });
      assert.equal(iitRes.students.length >= 1, true);
      assert.equal(iitRes.students.every((s) => s.college === 'IIT Hyderabad'), true);

      const skillRes = await mockNetworkService.searchStudents({ skill: 'Python' });
      assert.equal(skillRes.students.length >= 1, true);
      assert.equal(skillRes.students.every((s) => s.skills.includes('Python')), true);
    });

    it('supports server-side pagination with limit and total meta', async () => {
      const res = await mockNetworkService.searchStudents({ page: 1, limit: 2 });
      assert.equal(res.students.length, 2);
      assert.equal(res.meta.page, 1);
      assert.equal(res.meta.limit, 2);
      assert.equal(res.meta.totalPages >= 2, true);
    });

    it('retrieves current authenticated profile and student profile by ID', async () => {
      const myProfile = await mockNetworkService.getMyProfile();
      assert.equal(myProfile.name, 'Ram Charan');
      assert.equal(myProfile.isSelf, true);

      const student = await mockNetworkService.getStudentById('usr_deepu_003');
      assert.equal(student.name, 'Mani Deepika');
      assert.equal(student.isSelf, false);
    });

    it('enforces connection business rules: prevents self-connections', async () => {
      await assert.rejects(
        async () => {
          await mockNetworkService.sendConnectionRequest('usr_ram_001');
        },
        { message: /cannot send a connection request to yourself/ }
      );
    });

    it('enforces connection business rules: prevents duplicate active connections', async () => {
      await assert.rejects(
        async () => {
          await mockNetworkService.sendConnectionRequest('usr_varsh_002');
        },
        { message: /already connected/ }
      );
    });

    it('handles connection lifecycle: send request, cancel request', async () => {
      // Find an unconnected student
      const unconnected = (await mockNetworkService.searchStudents()).students.find(
        (s) => s.connectionStatus === 'not_connected'
      );
      assert.ok(unconnected, 'Found unconnected student for test');

      const sendRes = await mockNetworkService.sendConnectionRequest(unconnected._id);
      assert.equal(sendRes.success, true);
      assert.equal(sendRes.status, 'pending_sent');

      // Cancel the request
      const cancelRes = await mockNetworkService.cancelConnectionRequest(sendRes.connectionId);
      assert.equal(cancelRes.success, true);
      assert.equal(cancelRes.status, 'cancelled');
    });

    it('handles connection lifecycle: accept received request and remove connection', async () => {
      const received = await mockNetworkService.getReceivedRequests();
      assert.ok(received.length > 0, 'Found received request for test');
      const reqId = received[0]._id;

      const acceptRes = await mockNetworkService.acceptConnectionRequest(reqId);
      assert.equal(acceptRes.success, true);
      assert.equal(acceptRes.status, 'connected');

      // Remove the connection
      const removeRes = await mockNetworkService.removeConnection(reqId);
      assert.equal(removeRes.success, true);
    });

    it('blocks user and excludes them from discovery feed', async () => {
      const targetId = 'usr_surya_007';
      const blockRes = await mockNetworkService.blockUser(targetId);
      assert.equal(blockRes.success, true);

      // Verify user no longer appears in discovery
      const searchRes = await mockNetworkService.searchStudents();
      const found = searchRes.students.some((s) => s._id === targetId);
      assert.equal(found, false);
    });
  });
});

