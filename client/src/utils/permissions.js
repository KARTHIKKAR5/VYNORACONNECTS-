/**
 * @file permissions.js
 * @description Role-based Access Control (RBAC) and Resource Authorization (ABAC) for Vynora Connect.
 * 
 * IMPORTANT SECURITY REQUIREMENT:
 * Client-side permission checks are provided for user-interface conditioning,
 * UX guidance, and client-side view gating only. They are NOT a substitute for
 * backend authorization. All privileged actions must be securely authorized
 * and verified on the Express backend before executing or mutating state.
 */

// Supported Project & Platform Roles
export const ROLES = Object.freeze({
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER'
});

// Supported Platform and Marketplace Actions / Permissions
export const ACTIONS = Object.freeze({
  // Project-level Permissions (Day 1)
  EDIT_PROJECT: 'EDIT_PROJECT',
  MANAGE_MEMBERS: 'MANAGE_MEMBERS',
  TRANSFER_OWNERSHIP: 'TRANSFER_OWNERSHIP',
  DELETE_PROJECT: 'DELETE_PROJECT',
  REVIEW_REQUESTS: 'REVIEW_REQUESTS',
  CHANGE_RECRUITING: 'CHANGE_RECRUITING',

  // Marketplace Permissions (Day 2)
  MARKETPLACE_LISTING_CREATE: 'MARKETPLACE_LISTING_CREATE',
  MARKETPLACE_LISTING_READ: 'MARKETPLACE_LISTING_READ',
  MARKETPLACE_LISTING_UPDATE: 'MARKETPLACE_LISTING_UPDATE',
  MARKETPLACE_LISTING_ARCHIVE: 'MARKETPLACE_LISTING_ARCHIVE',
  MARKETPLACE_LISTING_MODERATE: 'MARKETPLACE_LISTING_MODERATE',
  MARKETPLACE_INQUIRY_CREATE: 'MARKETPLACE_INQUIRY_CREATE',
  MARKETPLACE_INQUIRY_READ: 'MARKETPLACE_INQUIRY_READ',
  MARKETPLACE_INQUIRY_RESPOND: 'MARKETPLACE_INQUIRY_RESPOND',
  MARKETPLACE_INQUIRY_CANCEL: 'MARKETPLACE_INQUIRY_CANCEL'
});

/**
 * Explicit Role-to-Permission Matrix for Global / Project Scopes
 * 
 * Strict mapping: Any role or action not explicitly registered
 * is denied by default.
 */
export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.OWNER]: Object.freeze([
    // Project actions
    ACTIONS.EDIT_PROJECT,
    ACTIONS.MANAGE_MEMBERS,
    ACTIONS.TRANSFER_OWNERSHIP,
    ACTIONS.DELETE_PROJECT,
    ACTIONS.REVIEW_REQUESTS,
    ACTIONS.CHANGE_RECRUITING,
    // Marketplace base actions
    ACTIONS.MARKETPLACE_LISTING_CREATE,
    ACTIONS.MARKETPLACE_LISTING_READ,
    ACTIONS.MARKETPLACE_INQUIRY_CREATE,
    ACTIONS.MARKETPLACE_INQUIRY_READ
  ]),
  [ROLES.ADMIN]: Object.freeze([
    // Project actions
    ACTIONS.EDIT_PROJECT,
    ACTIONS.MANAGE_MEMBERS,
    ACTIONS.REVIEW_REQUESTS,
    ACTIONS.CHANGE_RECRUITING,
    // Marketplace base actions
    ACTIONS.MARKETPLACE_LISTING_CREATE,
    ACTIONS.MARKETPLACE_LISTING_READ,
    ACTIONS.MARKETPLACE_INQUIRY_CREATE,
    ACTIONS.MARKETPLACE_INQUIRY_READ,
    // Moderation (Only when explicitly elevated)
    ACTIONS.MARKETPLACE_LISTING_MODERATE
  ]),
  [ROLES.MEMBER]: Object.freeze([
    ACTIONS.REVIEW_REQUESTS,
    ACTIONS.MARKETPLACE_LISTING_CREATE,
    ACTIONS.MARKETPLACE_LISTING_READ,
    ACTIONS.MARKETPLACE_INQUIRY_CREATE,
    ACTIONS.MARKETPLACE_INQUIRY_READ
  ]),
  [ROLES.VIEWER]: Object.freeze([
    // Read-only
    ACTIONS.MARKETPLACE_LISTING_READ
  ])
});

/**
 * Check if a given role is allowed to perform a specific action in a standard RBAC context.
 * 
 * @param {string} userRole - The role of the user (OWNER, ADMIN, MEMBER, VIEWER)
 * @param {string} action - The action requested
 * @returns {boolean} - True if permitted, false otherwise
 */
export function canPerformAction(userRole, action) {
  // Guard against missing, non-string, or empty arguments
  if (!userRole || typeof userRole !== 'string' || !action || typeof action !== 'string') {
    return false;
  }

  // Normalize inputs to uppercase for safety
  const normalizedRole = userRole.trim().toUpperCase();
  const normalizedAction = action.trim().toUpperCase();

  // Deny unknown roles
  const validRoles = Object.values(ROLES);
  if (!validRoles.includes(normalizedRole)) {
    return false;
  }

  // Deny unknown actions
  const validActions = Object.values(ACTIONS);
  if (!validActions.includes(normalizedAction)) {
    return false;
  }

  // Retrieve permissions for the given role
  const permissions = ROLE_PERMISSIONS[normalizedRole];
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }

  return permissions.includes(normalizedAction);
}

/**
 * Check if a user is the owner of a given project.
 * 
 * @param {string|number} userId - The unique identifier of the user
 * @param {string|number} projectOwnerId - The unique identifier of the project's owner
 * @returns {boolean} - True if user is the project owner, false otherwise
 */
export function isProjectOwner(userId, projectOwnerId) {
  if (userId === null || userId === undefined || projectOwnerId === null || projectOwnerId === undefined) {
    return false;
  }

  const normalizedUserId = String(userId).trim();
  const normalizedOwnerId = String(projectOwnerId).trim();

  if (normalizedUserId === '' || normalizedOwnerId === '') {
    return false;
  }

  return normalizedUserId === normalizedOwnerId;
}

/**
 * Check if a user is the author/owner of a ServiceListing.
 * 
 * @param {string|number} userId 
 * @param {string|number} listingOwnerId 
 * @returns {boolean}
 */
export function isListingOwner(userId, listingOwnerId) {
  return isProjectOwner(userId, listingOwnerId);
}

/**
 * Check if a user is a participant (requester or recipient) in an Inquiry.
 * 
 * @param {string|number} userId 
 * @param {Object} inquiry - The inquiry object with requesterId and recipientId
 * @returns {boolean}
 */
export function isInquiryParticipant(userId, inquiry) {
  if (!userId || !inquiry) return false;
  const uid = String(userId).trim();
  const reqId = String(inquiry.requesterId || inquiry.requester?.id || '').trim();
  const recId = String(inquiry.recipientId || inquiry.recipient?.id || '').trim();
  return uid !== '' && (uid === reqId || uid === recId);
}

/**
 * Check if a user is the designated recipient of an Inquiry.
 * 
 * @param {string|number} userId 
 * @param {Object} inquiry 
 * @returns {boolean}
 */
export function isInquiryRecipient(userId, inquiry) {
  if (!userId || !inquiry) return false;
  const uid = String(userId).trim();
  const recId = String(inquiry.recipientId || inquiry.recipient?.id || '').trim();
  return uid !== '' && uid === recId;
}

/**
 * Check if a user is the author/requester of an Inquiry.
 * 
 * @param {string|number} userId 
 * @param {Object} inquiry 
 * @returns {boolean}
 */
export function isInquiryRequester(userId, inquiry) {
  if (!userId || !inquiry) return false;
  const uid = String(userId).trim();
  const reqId = String(inquiry.requesterId || inquiry.requester?.id || '').trim();
  return uid !== '' && uid === reqId;
}

/**
 * Comprehensive Attribute-Based Access Control (ABAC) evaluation
 * for Marketplace actions, considering both user identity and target resource.
 * 
 * @param {Object} user - User object { id, role, isModerator }
 * @param {string} action - Action identifier from ACTIONS
 * @param {Object} [resource=null] - ServiceListing or Inquiry object
 * @returns {boolean}
 */
export function canPerformMarketplaceAction(user, action, resource = null) {
  if (!user || !user.id || !action || typeof action !== 'string') {
    return false;
  }

  const normalizedAction = action.trim().toUpperCase();

  switch (normalizedAction) {
    case ACTIONS.MARKETPLACE_LISTING_CREATE:
      // Any verified user can create a listing
      return true;

    case ACTIONS.MARKETPLACE_LISTING_READ:
      // Published listings are public; Drafts/Archived require listing ownership or moderation
      if (!resource) return true;
      if (resource.status === 'PUBLISHED') return true;
      return isListingOwner(user.id, resource.ownerId) || Boolean(user.isModerator);

    case ACTIONS.MARKETPLACE_LISTING_UPDATE:
      // Only the listing owner can update their listing
      if (!resource) return false;
      return isListingOwner(user.id, resource.ownerId);

    case ACTIONS.MARKETPLACE_LISTING_ARCHIVE:
      // Owner or platform moderator can archive
      if (!resource) return false;
      return isListingOwner(user.id, resource.ownerId) || Boolean(user.isModerator);

    case ACTIONS.MARKETPLACE_LISTING_MODERATE:
      // Only designated moderators
      return Boolean(user.isModerator);

    case ACTIONS.MARKETPLACE_INQUIRY_CREATE:
      // Requesters can submit inquiries, but strictly CANNOT inquire on their own listing
      if (!resource) return true;
      return !isListingOwner(user.id, resource.ownerId);

    case ACTIONS.MARKETPLACE_INQUIRY_READ:
      // Only inquiry participants (or auditor) can read
      if (!resource) return false;
      return isInquiryParticipant(user.id, resource) || Boolean(user.isModerator);

    case ACTIONS.MARKETPLACE_INQUIRY_RESPOND:
      // Only recipient can accept/decline; must be in PENDING state
      if (!resource) return false;
      return isInquiryRecipient(user.id, resource) && resource.status === 'PENDING';

    case ACTIONS.MARKETPLACE_INQUIRY_CANCEL:
      // Only requester can cancel; must be in PENDING state
      if (!resource) return false;
      return isInquiryRequester(user.id, resource) && resource.status === 'PENDING';

    default:
      return false;
  }
}

/**
 * Get human-readable description for an action.
 * 
 * @param {string} action 
 * @returns {string}
 */
export function getActionDescription(action) {
  switch (action) {
    // Project Actions
    case ACTIONS.EDIT_PROJECT:
      return 'Edit project title, description, tags, and general settings.';
    case ACTIONS.MANAGE_MEMBERS:
      return 'Invite members, assign roles, and remove team members.';
    case ACTIONS.TRANSFER_OWNERSHIP:
      return 'Transfer primary project ownership to another active team member.';
    case ACTIONS.DELETE_PROJECT:
      return 'Permanently delete this project and all associated repository records.';
    case ACTIONS.REVIEW_REQUESTS:
      return 'Review, approve, or decline incoming join requests from students.';
    case ACTIONS.CHANGE_RECRUITING:
      return 'Toggle project recruiting status and update open role requirements.';

    // Marketplace Actions
    case ACTIONS.MARKETPLACE_LISTING_CREATE:
      return 'Create a new freelance or peer service listing.';
    case ACTIONS.MARKETPLACE_LISTING_READ:
      return 'Browse and view published service listings.';
    case ACTIONS.MARKETPLACE_LISTING_UPDATE:
      return 'Update description, pricing, skills, and portfolio details for an owned listing.';
    case ACTIONS.MARKETPLACE_LISTING_ARCHIVE:
      return 'Archive an owned service listing from public search.';
    case ACTIONS.MARKETPLACE_LISTING_MODERATE:
      return 'Review, flag, or remove listings violating campus policies.';
    case ACTIONS.MARKETPLACE_INQUIRY_CREATE:
      return 'Send a project inquiry and quote request to a service provider.';
    case ACTIONS.MARKETPLACE_INQUIRY_READ:
      return 'Access confidential inquiry messages and project specifications.';
    case ACTIONS.MARKETPLACE_INQUIRY_RESPOND:
      return 'Accept or decline an incoming project inquiry.';
    case ACTIONS.MARKETPLACE_INQUIRY_CANCEL:
      return 'Cancel a pending inquiry before recipient acceptance.';

    default:
      return 'Unknown action.';
  }
}
