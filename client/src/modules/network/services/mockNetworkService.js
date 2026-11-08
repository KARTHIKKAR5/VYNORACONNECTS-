/**
 * Vynora Connect — Isolated Development Mock Service (Network Module)
 *
 * Simulates real backend state transitions, latency, server-side pagination,
 * filters, and error handling for local frontend development.
 * Designed to be a drop-in match for future live Express APIs.
 */

import { MOCK_CURRENT_USER, MOCK_STUDENTS } from '../data/mockNetworkData.js';
import { validateProfileInput } from '../schemas/profileSchema.js';

// Deep clone initial state in memory
let currentUser = JSON.parse(JSON.stringify(MOCK_CURRENT_USER));
let studentsDirectory = JSON.parse(JSON.stringify(MOCK_STUDENTS));
let connections = [
  {
    _id: 'conn_001',
    requesterId: 'usr_varsh_002',
    recipientId: currentUser._id,
    status: 'accepted',
    createdAt: '2026-10-10T10:00:00.000Z',
    respondedAt: '2026-10-10T12:00:00.000Z',
    student: studentsDirectory.find((s) => s._id === 'usr_varsh_002'),
  },
  {
    _id: 'conn_004',
    requesterId: currentUser._id,
    recipientId: 'usr_karthik_005',
    status: 'accepted',
    createdAt: '2026-10-05T09:00:00.000Z',
    respondedAt: '2026-10-05T11:00:00.000Z',
    student: studentsDirectory.find((s) => s._id === 'usr_karthik_005'),
  },
];

let sentRequests = [
  {
    _id: 'conn_002',
    requesterId: currentUser._id,
    recipientId: 'usr_deepu_003',
    status: 'pending',
    createdAt: '2026-11-06T14:20:00.000Z',
    student: studentsDirectory.find((s) => s._id === 'usr_deepu_003'),
  },
];

let receivedRequests = [
  {
    _id: 'conn_003',
    requesterId: 'usr_siri_004',
    recipientId: currentUser._id,
    status: 'pending',
    createdAt: '2026-11-07T18:45:00.000Z',
    student: studentsDirectory.find((s) => s._id === 'usr_siri_004'),
  },
];

let blockedUserIds = new Set();
let reportsList = [];

// Helper to simulate network latency
const delay = (ms = 180) => new Promise((res) => setTimeout(res, ms));

export const mockNetworkService = {
  /**
   * Search and filter student discovery directory
   */
  async searchStudents({
    search = '',
    college = 'All Colleges',
    branch = 'All Branches',
    studyYear = '',
    skill = '',
    interest = '',
    sortBy = 'relevance',
    page = 1,
    limit = 6,
  } = {}) {
    await delay();

    let filtered = studentsDirectory.filter((student) => {
      // Exclude blocked users
      if (blockedUserIds.has(student._id)) return false;

      // College filter
      if (college && college !== 'All Colleges' && student.college !== college) {
        return false;
      }

      // Branch filter
      if (branch && branch !== 'All Branches' && student.branch !== branch) {
        return false;
      }

      // Year filter
      if (studyYear && Number(student.studyYear) !== Number(studyYear)) {
        return false;
      }

      // Skill filter
      if (skill && !student.skills?.some((s) => s.toLowerCase() === skill.toLowerCase())) {
        return false;
      }

      // Interest filter
      if (interest && !student.interests?.some((i) => i.toLowerCase() === interest.toLowerCase())) {
        return false;
      }

      // Search term filter (name, college, branch, bio, skills)
      if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        const matchesName = student.name.toLowerCase().includes(term);
        const matchesCollege = student.college.toLowerCase().includes(term);
        const matchesBranch = student.branch.toLowerCase().includes(term);
        const matchesBio = student.bio?.toLowerCase().includes(term);
        const matchesSkill = student.skills?.some((s) => s.toLowerCase().includes(term));
        return matchesName || matchesCollege || matchesBranch || matchesBio || matchesSkill;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'college') {
      filtered.sort((a, b) => a.college.localeCompare(b.college));
    }

    const total = filtered.length;
    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (pageNum - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      students: paginated,
      meta: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages,
      },
    };
  },

  /**
   * Get public student profile by ID
   */
  async getStudentById(userId) {
    await delay();
    if (userId === currentUser._id) {
      return { ...currentUser, isSelf: true };
    }
    const student = studentsDirectory.find((s) => s._id === userId);
    if (!student || blockedUserIds.has(student._id)) {
      const err = new Error('Student profile not found.');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }
    return { ...student, isSelf: false };
  },

  /**
   * Get current authenticated user profile
   */
  async getMyProfile() {
    await delay();
    return { ...currentUser, isSelf: true };
  },

  /**
   * Update current user's profile with strict allowlists
   */
  async updateMyProfile(updatePayload) {
    await delay();

    const validation = validateProfileInput(updatePayload);
    if (!validation.isValid) {
      const err = new Error('Invalid profile data.');
      err.status = 400;
      err.code = 'VALIDATION_ERROR';
      err.details = validation.errors;
      throw err;
    }

    // Server-side allowlist: NEVER permit modifying role, isVerified, or account credentials
    currentUser = {
      ...currentUser,
      branch: updatePayload.branch.trim(),
      studyYear: Number(updatePayload.studyYear),
      bio: updatePayload.bio ? updatePayload.bio.trim() : '',
      skills: Array.isArray(updatePayload.skills) ? [...updatePayload.skills] : currentUser.skills,
      interests: Array.isArray(updatePayload.interests) ? [...updatePayload.interests] : currentUser.interests,
      links: {
        github: updatePayload.links?.github?.trim() || '',
        linkedin: updatePayload.links?.linkedin?.trim() || '',
        website: updatePayload.links?.website?.trim() || '',
      },
      visibility: {
        ...currentUser.visibility,
        ...(updatePayload.visibility || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    return { ...currentUser, isSelf: true };
  },

  /**
   * Get all accepted connections
   */
  async getConnections() {
    await delay();
    return [...connections];
  },

  /**
   * Get all received pending requests
   */
  async getReceivedRequests() {
    await delay();
    return [...receivedRequests];
  },

  /**
   * Get all sent pending requests
   */
  async getSentRequests() {
    await delay();
    return [...sentRequests];
  },

  /**
   * Send connection request to a student
   */
  async sendConnectionRequest(recipientId) {
    await delay();

    if (recipientId === currentUser._id) {
      throw new Error('You cannot send a connection request to yourself.');
    }

    const student = studentsDirectory.find((s) => s._id === recipientId);
    if (!student) {
      throw new Error('Student not found.');
    }

    if (student.connectionStatus === 'connected') {
      throw new Error('You are already connected to this student.');
    }

    if (student.connectionStatus === 'pending_sent') {
      throw new Error('Connection request is already pending.');
    }

    if (student.connectionStatus === 'pending_received') {
      // Automatic accept if reverse request exists
      return this.acceptConnectionRequest(student.connectionId);
    }

    const newRequestId = `conn_${Date.now()}`;
    student.connectionStatus = 'pending_sent';
    student.connectionId = newRequestId;

    const requestItem = {
      _id: newRequestId,
      requesterId: currentUser._id,
      recipientId: student._id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      student,
    };

    sentRequests.push(requestItem);

    return { success: true, connectionId: newRequestId, status: 'pending_sent' };
  },

  /**
   * Accept an incoming connection request
   */
  async acceptConnectionRequest(requestId) {
    await delay();

    const index = receivedRequests.findIndex((r) => r._id === requestId);
    if (index === -1) {
      throw new Error('Connection request not found or already processed.');
    }

    const requestItem = receivedRequests[index];
    receivedRequests.splice(index, 1);

    const student = studentsDirectory.find((s) => s._id === requestItem.requesterId);
    if (student) {
      student.connectionStatus = 'connected';
      student.connectionId = requestId;
    }

    const acceptedConn = {
      ...requestItem,
      status: 'accepted',
      respondedAt: new Date().toISOString(),
      student,
    };

    connections.push(acceptedConn);

    return { success: true, status: 'connected', connection: acceptedConn };
  },

  /**
   * Reject an incoming connection request
   */
  async rejectConnectionRequest(requestId) {
    await delay();

    const index = receivedRequests.findIndex((r) => r._id === requestId);
    if (index === -1) {
      throw new Error('Connection request not found.');
    }

    const requestItem = receivedRequests[index];
    receivedRequests.splice(index, 1);

    const student = studentsDirectory.find((s) => s._id === requestItem.requesterId);
    if (student) {
      student.connectionStatus = 'not_connected';
      student.connectionId = null;
    }

    return { success: true, status: 'rejected' };
  },

  /**
   * Cancel an outgoing connection request
   */
  async cancelConnectionRequest(requestId) {
    await delay();

    const index = sentRequests.findIndex((r) => r._id === requestId);
    if (index === -1) {
      throw new Error('Sent request not found or already answered.');
    }

    const requestItem = sentRequests[index];
    sentRequests.splice(index, 1);

    const student = studentsDirectory.find((s) => s._id === requestItem.recipientId);
    if (student) {
      student.connectionStatus = 'not_connected';
      student.connectionId = null;
    }

    return { success: true, status: 'cancelled' };
  },

  /**
   * Remove an accepted connection
   */
  async removeConnection(connectionId) {
    await delay();

    const index = connections.findIndex((c) => c._id === connectionId);
    if (index === -1) {
      throw new Error('Connection not found.');
    }

    const conn = connections[index];
    connections.splice(index, 1);

    const partnerId = conn.requesterId === currentUser._id ? conn.recipientId : conn.requesterId;
    const student = studentsDirectory.find((s) => s._id === partnerId);
    if (student) {
      student.connectionStatus = 'not_connected';
      student.connectionId = null;
    }

    return { success: true, message: 'Connection removed successfully.' };
  },

  /**
   * Safety Service: Report a user
   */
  async reportUser(userId, category, explanation) {
    await delay();
    reportsList.push({
      userId,
      category,
      explanation,
      reportedAt: new Date().toISOString(),
      reporterId: currentUser._id,
    });
    return { success: true, message: 'Report submitted to trust and safety moderation.' };
  },

  /**
   * Safety Service: Block a user
   */
  async blockUser(userId) {
    await delay();
    blockedUserIds.add(userId);

    // Automatically remove connection if one existed
    connections = connections.filter(
      (c) => c.requesterId !== userId && c.recipientId !== userId
    );
    receivedRequests = receivedRequests.filter((r) => r.requesterId !== userId);
    sentRequests = sentRequests.filter((s) => s.recipientId !== userId);

    return { success: true, message: 'User blocked.' };
  },
};

export default mockNetworkService;

