/**
 * Vynora Connect — Network Module Policy & Privacy Layer
 *
 * Module: Module 2 (Student Network & Profiles)
 * Owner: Ram
 *
 * Centralizes profile visibility rules, privacy filtering, connection permissions,
 * and actor authorization. Enforces strict server-side authorization:
 * frontend hiding is never treated as security.
 */

/**
 * Filter profile document into a privacy-safe Data Transfer Object (DTO)
 *
 * @param {Object} profile - Full profile document (with populated user info)
 * @param {String} viewerId - Authenticated viewer's user ID
 * @param {Boolean} isConnected - Whether viewer and profile owner have an accepted connection
 */
function toSafeProfileDTO(profile, viewerId = null, isConnected = false) {
  if (!profile) return null;

  const isSelf = viewerId && profile.userId && profile.userId.toString() === viewerId.toString();
  const visibilityLevel = profile.visibility?.profile || 'students';

  // Private profile check: only visible to self or accepted connections
  if (!isSelf && visibilityLevel === 'private') {
    return {
      _id: profile._id,
      userId: profile.userId,
      college: profile.college,
      isPrivate: true,
      visibility: { profile: 'private' },
    };
  }

  // Connections-only check: hide details if viewer is not an accepted connection
  if (!isSelf && visibilityLevel === 'connections' && !isConnected) {
    return {
      _id: profile._id,
      userId: profile.userId,
      college: profile.college,
      branch: profile.branch,
      studyYear: profile.studyYear,
      isConnectionsOnly: true,
      visibility: { profile: 'connections' },
    };
  }

  // Build permitted DTO — NEVER include password, email, role, or moderation notes
  const dto = {
    _id: profile._id,
    userId: profile.userId,
    college: profile.college,
    branch: profile.branch,
    studyYear: profile.studyYear,
    bio: profile.bio || '',
    skills: profile.skills || [],
    interests: profile.interests || [],
    avatarUrl: profile.avatarUrl || '',
    visibility: profile.visibility || { profile: 'students', showProjects: true, showLinks: true },
    isSelf,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };

  // Safe links filtering based on user preference
  if (isSelf || profile.visibility?.showLinks !== false) {
    dto.links = {
      github: profile.links?.github || '',
      linkedin: profile.links?.linkedin || '',
      website: profile.links?.website || '',
    };
  } else {
    dto.links = { github: '', linkedin: '', website: '' };
  }

  return dto;
}

/**
 * Verify whether an actor is authorized to accept or reject an incoming request
 */
function canRespondToRequest(connection, actorId) {
  if (!connection || !actorId) return false;
  return connection.recipientId.toString() === actorId.toString();
}

/**
 * Verify whether an actor is authorized to cancel an outgoing request
 */
function canCancelRequest(connection, actorId) {
  if (!connection || !actorId) return false;
  return connection.requesterId.toString() === actorId.toString();
}

/**
 * Verify whether an actor is authorized to remove an existing connection
 */
function canRemoveConnection(connection, actorId) {
  if (!connection || !actorId) return false;
  if (connection.status !== 'accepted') return false;
  const actorStr = actorId.toString();
  return (
    connection.requesterId.toString() === actorStr ||
    connection.recipientId.toString() === actorStr
  );
}

/**
 * Check whether unverified students may send connection requests
 * NOTE: Isolated policy hook pending central product team confirmation.
 */
function canSendConnectionRequest(actor) {
  // If product policy allows pending verification to explore & connect, return true.
  // Set to check actor.isVerified === true if central admin policy restricts unverified users.
  return Boolean(actor);
}

module.exports = {
  toSafeProfileDTO,
  canRespondToRequest,
  canCancelRequest,
  canRemoveConnection,
  canSendConnectionRequest,
};

