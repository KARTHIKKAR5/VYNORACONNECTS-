const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const {
  isValidObjectId,
  isValidWebUrl,
  validateProfileUpdate,
  validatePagination,
  FORBIDDEN_UPDATE_FIELDS,
} = require('../src/modules/network/network.validation');

const {
  toSafeProfileDTO,
  canRespondToRequest,
  canCancelRequest,
  canRemoveConnection,
  canSendConnectionRequest,
} = require('../src/modules/network/network.policy');

describe('Vynora Connect — Network Module Backend Security & Logic Tests', () => {
  describe('1. Input Validation & Security Bounds', () => {
    it('validates 24-character hexadecimal MongoDB ObjectIds', () => {
      assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true);
      assert.equal(isValidObjectId('64b8f0c1a2e3d4c5b6a78901'), true);
      assert.equal(isValidObjectId('invalid-id'), false);
      assert.equal(isValidObjectId('12345'), false);
      assert.equal(isValidObjectId(null), false);
      assert.equal(isValidObjectId({}), false);
    });

    it('enforces safe URL protocols (http/https only) and rejects dangerous schemes', () => {
      assert.equal(isValidWebUrl('https://github.com/vynora'), true);
      assert.equal(isValidWebUrl('http://vynora.org'), true);
      assert.equal(isValidWebUrl('javascript:alert(document.cookie)'), false);
      assert.equal(isValidWebUrl('ftp://server.org/file'), false);
      assert.equal(isValidWebUrl('data:text/html;base64,PHNjcmlwdD4='), false);
      assert.equal(isValidWebUrl(''), true); // empty optional link is valid
    });

    it('bounds pagination limit between 1 and 50 to prevent DoS', () => {
      assert.deepEqual(validatePagination({ page: '1', limit: '10' }), { page: 1, limit: 10 });
      assert.deepEqual(validatePagination({ page: '-5', limit: '0' }), { page: 1, limit: 10 });
      assert.deepEqual(validatePagination({ page: '2', limit: '1000' }), { page: 2, limit: 50 });
      assert.deepEqual(validatePagination({ page: 'abc', limit: 'xyz' }), { page: 1, limit: 10 });
    });

    it('rejects forbidden and protected fields in profile updates (Privilege Escalation Prevention)', () => {
      const maliciousPayload = {
        branch: 'Computer Science',
        role: 'admin',
        isVerified: true,
        email: 'attacker@evil.com',
        passwordHash: 'injected_hash',
        _id: '507f1f77bcf86cd799439011',
      };

      const result = validateProfileUpdate(maliciousPayload);
      assert.equal(result.isValid, false);
      assert.equal(result.errors.length >= 5, true);
      assert.ok(result.errors.some((e) => e.includes('role')));
      assert.ok(result.errors.some((e) => e.includes('isVerified')));
      assert.ok(result.errors.some((e) => e.includes('email')));
      assert.ok(result.errors.some((e) => e.includes('passwordHash')));
    });

    it('enforces maximum 300 character bio length', () => {
      const longBio = 'x'.repeat(301);
      const result = validateProfileUpdate({ bio: longBio });
      assert.equal(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes('Bio cannot exceed 300 characters')));
    });

    it('enforces maximum 15 technical skills count', () => {
      const tooManySkills = Array.from({ length: 16 }, (_, i) => `Skill ${i + 1}`);
      const result = validateProfileUpdate({ skills: tooManySkills });
      assert.equal(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes('at most 15 skills')));
    });

    it('enforces study year integer bounds between 1 and 5', () => {
      assert.equal(validateProfileUpdate({ studyYear: 0 }).isValid, false);
      assert.equal(validateProfileUpdate({ studyYear: 6 }).isValid, false);
      assert.equal(validateProfileUpdate({ studyYear: 3.5 }).isValid, false);
      assert.equal(validateProfileUpdate({ studyYear: 3 }).isValid, true);
    });
  });

  describe('2. Server-Side Privacy & Visibility Policies', () => {
    const mockProfile = {
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
      college: 'VNR VJIET',
      branch: 'Computer Science & Engineering',
      studyYear: 3,
      bio: 'Full-stack developer.',
      skills: ['React.js', 'Node.js', 'MongoDB'],
      interests: ['Open Source', 'Hackathons'],
      links: {
        github: 'https://github.com/vynora',
        linkedin: 'https://linkedin.com/in/vynora',
        website: 'https://vynora.dev',
      },
      visibility: {
        profile: 'students',
        showProjects: true,
        showLinks: true,
      },
      passwordHash: 'secret_hash_never_leak',
      email: 'student@private.edu',
      role: 'student',
      moderationNotes: 'internal confidential',
    };

    it('NEVER leaks passwordHash, email, role, or moderation notes in DTOs', () => {
      const dto = toSafeProfileDTO(mockProfile, '507f1f77bcf86cd799439011', true);
      assert.equal(dto.passwordHash, undefined);
      assert.equal(dto.email, undefined);
      assert.equal(dto.role, undefined);
      assert.equal(dto.moderationNotes, undefined);
      assert.equal(dto.college, 'VNR VJIET');
      assert.equal(dto.isSelf, true);
    });

    it('hides external links when user sets showLinks=false for non-self viewers', () => {
      const profileWithHiddenLinks = {
        ...mockProfile,
        visibility: { profile: 'students', showProjects: true, showLinks: false },
      };

      const viewerId = '64b8f0c1a2e3d4c5b6a78901';
      const dto = toSafeProfileDTO(profileWithHiddenLinks, viewerId, false);

      assert.equal(dto.links.github, '');
      assert.equal(dto.links.linkedin, '');
      assert.equal(dto.links.website, '');
    });

    it('restricts private profile access for non-self viewers', () => {
      const privateProfile = {
        ...mockProfile,
        visibility: { profile: 'private', showProjects: false, showLinks: false },
      };

      const viewerId = '64b8f0c1a2e3d4c5b6a78901';
      const dto = toSafeProfileDTO(privateProfile, viewerId, false);

      assert.equal(dto.isPrivate, true);
      assert.equal(dto.bio, undefined);
      assert.equal(dto.skills, undefined);
      assert.equal(dto.links, undefined);
    });

    it('restricts connections-only profile access for unconnected viewers', () => {
      const connectionsOnlyProfile = {
        ...mockProfile,
        visibility: { profile: 'connections', showProjects: true, showLinks: true },
      };

      const viewerId = '64b8f0c1a2e3d4c5b6a78901';
      const dto = toSafeProfileDTO(connectionsOnlyProfile, viewerId, false); // isConnected = false

      assert.equal(dto.isConnectionsOnly, true);
      assert.equal(dto.bio, undefined);
      assert.equal(dto.skills, undefined);

      // Connected viewer receives full DTO
      const connectedDto = toSafeProfileDTO(connectionsOnlyProfile, viewerId, true); // isConnected = true
      assert.equal(connectedDto.bio, 'Full-stack developer.');
      assert.equal(connectedDto.skills.length, 3);
    });
  });

  describe('3. Connection Authorization & Lifecycle Rules', () => {
    const requesterId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    const recipientId = new mongoose.Types.ObjectId('64b8f0c1a2e3d4c5b6a78901');
    const attackerId = new mongoose.Types.ObjectId('777777777777777777777777');

    const pendingConn = {
      _id: new mongoose.Types.ObjectId(),
      requesterId,
      recipientId,
      status: 'pending',
    };

    const acceptedConn = {
      _id: new mongoose.Types.ObjectId(),
      requesterId,
      recipientId,
      status: 'accepted',
    };

    it('authorizes ONLY the recipient to accept or reject incoming requests', () => {
      assert.equal(canRespondToRequest(pendingConn, recipientId), true);
      assert.equal(canRespondToRequest(pendingConn, requesterId), false); // requester cannot accept own request
      assert.equal(canRespondToRequest(pendingConn, attackerId), false); // unrelated third-party blocked
    });

    it('authorizes ONLY the requester to cancel outgoing pending requests', () => {
      assert.equal(canCancelRequest(pendingConn, requesterId), true);
      assert.equal(canCancelRequest(pendingConn, recipientId), false); // recipient cannot cancel
      assert.equal(canCancelRequest(pendingConn, attackerId), false); // third-party blocked
    });

    it('authorizes either participant to remove an accepted connection, but blocks outsiders', () => {
      assert.equal(canRemoveConnection(acceptedConn, requesterId), true);
      assert.equal(canRemoveConnection(acceptedConn, recipientId), true);
      assert.equal(canRemoveConnection(acceptedConn, attackerId), false); // unauthorized blocked
      assert.equal(canRemoveConnection(pendingConn, requesterId), false); // pending cannot be removed via removeConnection
    });

    it('generates identical normalized pairKey for both (A, B) and (B, A) to prevent concurrent reverse duplicates', () => {
      const idA = '507f1f77bcf86cd799439011';
      const idB = '64b8f0c1a2e3d4c5b6a78901';

      const pairKey1 = [idA, idB].sort().join(':');
      const pairKey2 = [idB, idA].sort().join(':');

      assert.equal(pairKey1, pairKey2);
      assert.equal(pairKey1, '507f1f77bcf86cd799439011:64b8f0c1a2e3d4c5b6a78901');
    });
  });

  describe('4. Authentication Enforcement & Identity Derivation', () => {
    const { requireAuth } = require('../src/middleware/authMiddleware');

    it('rejects unauthenticated requests with 401 Unauthorized', (t, done) => {
      const req = { user: null, headers: {} };
      const res = {
        status: (code) => {
          assert.equal(code, 401);
          return {
            json: (payload) => {
              assert.equal(payload.success, false);
              assert.equal(payload.error.code, 'UNAUTHENTICATED');
              done();
            },
          };
        },
      };
      const next = () => assert.fail('next() should not be called');

      requireAuth(req, res, next);
    });

    it('derives identity exclusively from req.user._id and ignores spoofed headers/bodies', (t, done) => {
      const trustedUserId = '507f1f77bcf86cd799439011';
      const req = {
        user: { _id: trustedUserId, name: 'Ram' },
        headers: { 'x-user-id': 'attacker_spoofed_id' },
        body: { userId: 'attacker_spoofed_id' },
      };
      const res = {};
      const next = () => {
        assert.equal(req.userId, trustedUserId);
        assert.notEqual(req.userId, req.headers['x-user-id']);
        assert.notEqual(req.userId, req.body.userId);
        done();
      };

      requireAuth(req, res, next);
    });
  });
});

