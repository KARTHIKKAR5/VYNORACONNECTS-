/**
 * Vynora Connect — Network Module Business Logic Service
 *
 * Module: Module 2 (Student Network & Profiles)
 * Owner: Ram
 *
 * Implements core student discovery, privacy filtering, profile management,
 * and atomic connection lifecycle state machine transitions.
 */

const mongoose = require('mongoose');
const Profile = require('./profile.model');
const Connection = require('./connection.model');
const {
  toSafeProfileDTO,
  canRespondToRequest,
  canCancelRequest,
  canRemoveConnection,
  canSendConnectionRequest,
} = require('./network.policy');

/**
 * Escape string for safe use in MongoDB RegExp queries (prevents ReDoS)
 */
function escapeRegex(text) {
  return String(text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Student Discovery Query
 */
async function searchStudents({
  search = '',
  college = '',
  branch = '',
  studyYear = null,
  skill = '',
  interest = '',
  sortBy = 'relevance',
  page = 1,
  limit = 10,
  viewerId = null,
}) {
  const query = {
    'visibility.profile': { $ne: 'private' },
  };

  // Exclude viewer from peer discovery
  if (viewerId) {
    query.userId = { $ne: new mongoose.Types.ObjectId(viewerId) };
  }

  // College filter
  if (college && college !== 'All Colleges') {
    query.college = college;
  }

  // Branch filter
  if (branch && branch !== 'All Branches') {
    query.branch = branch;
  }

  // Year filter
  if (studyYear) {
    query.studyYear = Number(studyYear);
  }

  // Skill filter (case-insensitive)
  if (skill) {
    query.skills = { $regex: new RegExp(`^${escapeRegex(skill)}$`, 'i') };
  }

  // Interest filter (case-insensitive)
  if (interest) {
    query.interests = { $regex: new RegExp(`^${escapeRegex(interest)}$`, 'i') };
  }

  // Text search query
  if (search && search.trim()) {
    const term = escapeRegex(search.trim());
    query.$or = [
      { college: { $regex: term, $options: 'i' } },
      { branch: { $regex: term, $options: 'i' } },
      { bio: { $regex: term, $options: 'i' } },
      { skills: { $regex: term, $options: 'i' } },
    ];
  }

  let sort = { createdAt: -1 };
  if (sortBy === 'college') sort = { college: 1, createdAt: -1 };

  const skip = (page - 1) * limit;

  const [profiles, total] = await Promise.all([
    Profile.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Profile.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  // Retrieve existing connection statuses for viewer if authenticated
  let connectionMap = new Map();
  if (viewerId && profiles.length > 0) {
    const targetUserIds = profiles.map((p) => p.userId);
    const connections = await Connection.find({
      $or: [
        { requesterId: viewerId, recipientId: { $in: targetUserIds } },
        { recipientId: viewerId, requesterId: { $in: targetUserIds } },
      ],
      status: { $in: ['pending', 'accepted'] },
    }).lean();

    connections.forEach((conn) => {
      const isRequester = conn.requesterId.toString() === viewerId.toString();
      const partnerId = isRequester ? conn.recipientId.toString() : conn.requesterId.toString();

      let status = 'not_connected';
      if (conn.status === 'accepted') status = 'connected';
      else if (isRequester) status = 'pending_sent';
      else status = 'pending_received';

      connectionMap.set(partnerId, { status, connectionId: conn._id });
    });
  }

  const dtos = profiles.map((profile) => {
    const connInfo = connectionMap.get(profile.userId.toString()) || {
      status: 'not_connected',
      connectionId: null,
    };
    const dto = toSafeProfileDTO(profile, viewerId, connInfo.status === 'connected');
    dto.connectionStatus = connInfo.status;
    dto.connectionId = connInfo.connectionId;
    return dto;
  });

  return {
    students: dtos,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/**
 * Get Student Profile by Target User ID
 */
async function getStudentProfile(targetUserId, viewerId = null) {
  const profile = await Profile.findOne({ userId: targetUserId }).lean();
  if (!profile) {
    const error = new Error('Student profile not found.');
    error.status = 404;
    error.code = 'PROFILE_NOT_FOUND';
    throw error;
  }

  let isConnected = false;
  let connectionStatus = 'not_connected';
  let connectionId = null;

  if (viewerId && viewerId.toString() !== targetUserId.toString()) {
    const conn = await Connection.findOne({
      $or: [
        { requesterId: viewerId, recipientId: targetUserId },
        { recipientId: viewerId, requesterId: targetUserId },
      ],
      status: { $in: ['pending', 'accepted'] },
    }).lean();

    if (conn) {
      connectionId = conn._id;
      if (conn.status === 'accepted') {
        isConnected = true;
        connectionStatus = 'connected';
      } else if (conn.requesterId.toString() === viewerId.toString()) {
        connectionStatus = 'pending_sent';
      } else {
        connectionStatus = 'pending_received';
      }
    }
  }

  const dto = toSafeProfileDTO(profile, viewerId, isConnected);
  dto.connectionStatus = connectionStatus;
  dto.connectionId = connectionId;

  return dto;
}

/**
 * Get or initialize Authenticated User's Profile
 */
async function getMyProfile(actorId) {
  let profile = await Profile.findOne({ userId: actorId }).lean();
  if (!profile) {
    // Create baseline default profile for the authenticated student if not yet initialized
    profile = await Profile.create({
      userId: actorId,
      college: 'VNR VJIET',
      branch: 'Computer Science & Engineering',
      studyYear: 1,
      bio: '',
      skills: [],
      interests: [],
    });
    profile = profile.toObject();
  }
  return toSafeProfileDTO(profile, actorId, true);
}

/**
 * Update Authenticated User's Profile (Server allowlist enforced)
 */
async function updateMyProfile(actorId, sanitizedData) {
  const updated = await Profile.findOneAndUpdate(
    { userId: actorId },
    { $set: sanitizedData },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return toSafeProfileDTO(updated, actorId, true);
}

/**
 * Update Authenticated User's Privacy Preferences
 */
async function updatePrivacySettings(actorId, visibilityData) {
  const updated = await Profile.findOneAndUpdate(
    { userId: actorId },
    { $set: { visibility: visibilityData } },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return toSafeProfileDTO(updated, actorId, true);
}

/**
 * Get all Accepted Connections for an Actor
 */
async function getAcceptedConnections(actorId) {
  const connections = await Connection.find({
    $or: [{ requesterId: actorId }, { recipientId: actorId }],
    status: 'accepted',
  })
    .sort({ respondedAt: -1, updatedAt: -1 })
    .lean();

  const partnerIds = connections.map((c) =>
    c.requesterId.toString() === actorId.toString() ? c.recipientId : c.requesterId
  );

  const profiles = await Profile.find({ userId: { $in: partnerIds } }).lean();
  const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

  return connections.map((conn) => {
    const isRequester = conn.requesterId.toString() === actorId.toString();
    const partnerId = isRequester ? conn.recipientId.toString() : conn.requesterId.toString();
    const partnerProfile = profileMap.get(partnerId);

    return {
      _id: conn._id,
      requesterId: conn.requesterId,
      recipientId: conn.recipientId,
      status: conn.status,
      createdAt: conn.createdAt,
      respondedAt: conn.respondedAt,
      student: partnerProfile
        ? toSafeProfileDTO(partnerProfile, actorId, true)
        : { userId: partnerId, name: 'Student' },
    };
  });
}

/**
 * Get all Received Pending Requests for an Actor
 */
async function getReceivedRequests(actorId) {
  const requests = await Connection.find({
    recipientId: actorId,
    status: 'pending',
  })
    .sort({ createdAt: -1 })
    .lean();

  const requesterIds = requests.map((r) => r.requesterId);
  const profiles = await Profile.find({ userId: { $in: requesterIds } }).lean();
  const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

  return requests.map((req) => ({
    _id: req._id,
    requesterId: req.requesterId,
    recipientId: req.recipientId,
    status: req.status,
    createdAt: req.createdAt,
    student: profileMap.get(req.requesterId.toString())
      ? toSafeProfileDTO(profileMap.get(req.requesterId.toString()), actorId, false)
      : { userId: req.requesterId, name: 'Student' },
  }));
}

/**
 * Get all Sent Pending Requests for an Actor
 */
async function getSentRequests(actorId) {
  const requests = await Connection.find({
    requesterId: actorId,
    status: 'pending',
  })
    .sort({ createdAt: -1 })
    .lean();

  const recipientIds = requests.map((r) => r.recipientId);
  const profiles = await Profile.find({ userId: { $in: recipientIds } }).lean();
  const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

  return requests.map((req) => ({
    _id: req._id,
    requesterId: req.requesterId,
    recipientId: req.recipientId,
    status: req.status,
    createdAt: req.createdAt,
    student: profileMap.get(req.recipientId.toString())
      ? toSafeProfileDTO(profileMap.get(req.recipientId.toString()), actorId, false)
      : { userId: req.recipientId, name: 'Student' },
  }));
}

/**
 * Send a Connection Request
 */
async function sendConnectionRequest(actorId, recipientId, actor = null) {
  if (actorId.toString() === recipientId.toString()) {
    const error = new Error('You cannot send a connection request to yourself.');
    error.status = 400;
    error.code = 'SELF_CONNECTION_FORBIDDEN';
    throw error;
  }

  if (!canSendConnectionRequest(actor)) {
    const error = new Error('Your account permissions do not allow sending connection requests.');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  // Check for any active existing connection between the two students using pairKey
  const pairKey = [actorId.toString(), recipientId.toString()].sort().join(':');
  const existing = await Connection.findOne({
    pairKey,
    status: { $in: ['pending', 'accepted'] },
  });

  if (existing) {
    if (existing.status === 'accepted') {
      const error = new Error('You are already connected to this student.');
      error.status = 409;
      error.code = 'ALREADY_CONNECTED';
      throw error;
    }

    if (existing.requesterId.toString() === actorId.toString()) {
      const error = new Error('A connection request is already pending for this student.');
      error.status = 409;
      error.code = 'REQUEST_ALREADY_PENDING';
      throw error;
    }

    // POLICY REQUIREMENT:
    // Reject creating reverse duplicates, and prompt user to accept the pending incoming request.
    // (Alternative Proposed Rule: auto-accept upon mutual intent — pending product team confirmation)
    const error = new Error('This student has already sent you a connection request. Please accept it from your Received Requests tab.');
    error.status = 409;
    error.code = 'REVERSE_REQUEST_PENDING';
    error.details = { incomingRequestId: existing._id };
    throw error;
  }

  // Create new pending connection request with normalized pairKey
  const newConn = await Connection.create({
    requesterId: actorId,
    recipientId: recipientId,
    pairKey,
    status: 'pending',
  });

  return {
    connectionId: newConn._id,
    status: 'pending_sent',
    message: 'Connection request sent successfully.',
  };
}

/**
 * Accept Incoming Connection Request
 */
async function acceptConnectionRequest(requestId, actorId) {
  const conn = await Connection.findById(requestId);
  if (!conn) {
    const error = new Error('Connection request not found.');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (!canRespondToRequest(conn, actorId)) {
    const error = new Error('You are not authorized to accept this connection request.');
    error.status = 403;
    error.code = 'UNAUTHORIZED_ACTION';
    throw error;
  }

  if (conn.status !== 'pending') {
    const error = new Error(`Cannot accept request in status '${conn.status}'.`);
    error.status = 409;
    error.code = 'INVALID_STATE_TRANSITION';
    throw error;
  }

  conn.status = 'accepted';
  conn.respondedAt = new Date();
  await conn.save();

  return {
    connectionId: conn._id,
    status: 'accepted',
    message: 'Connection request accepted.',
  };
}

/**
 * Reject Incoming Connection Request
 */
async function rejectConnectionRequest(requestId, actorId) {
  const conn = await Connection.findById(requestId);
  if (!conn) {
    const error = new Error('Connection request not found.');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (!canRespondToRequest(conn, actorId)) {
    const error = new Error('You are not authorized to decline this connection request.');
    error.status = 403;
    error.code = 'UNAUTHORIZED_ACTION';
    throw error;
  }

  if (conn.status !== 'pending') {
    const error = new Error(`Cannot decline request in status '${conn.status}'.`);
    error.status = 409;
    error.code = 'INVALID_STATE_TRANSITION';
    throw error;
  }

  conn.status = 'rejected';
  conn.respondedAt = new Date();
  await conn.save();

  return {
    connectionId: conn._id,
    status: 'rejected',
    message: 'Connection request declined.',
  };
}

/**
 * Cancel Outgoing Connection Request
 */
async function cancelConnectionRequest(requestId, actorId) {
  const conn = await Connection.findById(requestId);
  if (!conn) {
    const error = new Error('Connection request not found.');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (!canCancelRequest(conn, actorId)) {
    const error = new Error('You are not authorized to cancel this connection request.');
    error.status = 403;
    error.code = 'UNAUTHORIZED_ACTION';
    throw error;
  }

  if (conn.status !== 'pending') {
    const error = new Error(`Cannot cancel request in status '${conn.status}'.`);
    error.status = 409;
    error.code = 'INVALID_STATE_TRANSITION';
    throw error;
  }

  conn.status = 'cancelled';
  conn.respondedAt = new Date();
  await conn.save();

  return {
    connectionId: conn._id,
    status: 'cancelled',
    message: 'Connection request cancelled.',
  };
}

/**
 * Remove an Accepted Connection
 *
 * POLICY ENFORCEMENT: Client-controlled hard deletion is disabled.
 * Removals execute a safe audit status transition ('cancelled').
 * Physical document deletion is isolated and reserved for admin maintenance pending PO approval.
 */
async function removeConnection(connectionId, actorId) {
  const conn = await Connection.findById(connectionId);
  if (!conn) {
    const error = new Error('Connection record not found.');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (!canRemoveConnection(conn, actorId)) {
    const error = new Error('You are not authorized to remove this connection.');
    error.status = 403;
    error.code = 'UNAUTHORIZED_ACTION';
    throw error;
  }

  // Soft audit transition: mark as cancelled with response timestamp
  conn.status = 'cancelled';
  conn.respondedAt = new Date();
  await conn.save();

  return {
    connectionId,
    status: 'removed',
    message: 'Connection removed successfully.',
  };
}

module.exports = {
  searchStudents,
  getStudentProfile,
  getMyProfile,
  updateMyProfile,
  updatePrivacySettings,
  getAcceptedConnections,
  getReceivedRequests,
  getSentRequests,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
};

