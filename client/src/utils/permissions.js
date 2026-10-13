/**
 * @file permissions.js
 * @description Role-based Access Control (RBAC) utilities for Vynora Connect.
 * 
 * IMPORTANT SECURITY REQUIREMENT:
 * Client-side permission checks are provided for user-interface conditioning,
 * UX guidance, and client-side view gating only. They are NOT a substitute for
 * backend authorization. All privileged actions must be securely authorized
 * and verified on the backend before executing or mutating state.
 */

// Supported Project Roles
export const ROLES = Object.freeze({
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER'
});

// Supported Project Actions / Permissions
export const ACTIONS = Object.freeze({
  EDIT_PROJECT: 'EDIT_PROJECT',
  MANAGE_MEMBERS: 'MANAGE_MEMBERS',
  TRANSFER_OWNERSHIP: 'TRANSFER_OWNERSHIP',
  DELETE_PROJECT: 'DELETE_PROJECT',
  REVIEW_REQUESTS: 'REVIEW_REQUESTS',
  CHANGE_RECRUITING: 'CHANGE_RECRUITING'
});

/**
 * Explicit Role-to-Permission Matrix
 * 
 * Strict mapping: Any role or action not explicitly registered
 * is denied by default.
 */
export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.OWNER]: Object.freeze([
    ACTIONS.EDIT_PROJECT,
    ACTIONS.MANAGE_MEMBERS,
    ACTIONS.TRANSFER_OWNERSHIP,
    ACTIONS.DELETE_PROJECT,
    ACTIONS.REVIEW_REQUESTS,
    ACTIONS.CHANGE_RECRUITING
  ]),
  [ROLES.ADMIN]: Object.freeze([
    ACTIONS.EDIT_PROJECT,
    ACTIONS.MANAGE_MEMBERS,
    ACTIONS.REVIEW_REQUESTS,
    ACTIONS.CHANGE_RECRUITING
    // Explicitly excluded: TRANSFER_OWNERSHIP, DELETE_PROJECT
  ]),
  [ROLES.MEMBER]: Object.freeze([
    ACTIONS.REVIEW_REQUESTS
    // Restricted: cannot manage members, edit project settings, transfer or delete
  ]),
  [ROLES.VIEWER]: Object.freeze([
    // Read-only: No management or administrative permissions
  ])
});

/**
 * Check if a given role is allowed to perform a specific action.
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
 * Get human-readable description for an action.
 * 
 * @param {string} action 
 * @returns {string}
 */
export function getActionDescription(action) {
  switch (action) {
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
    default:
      return 'Unknown action.';
  }
}
