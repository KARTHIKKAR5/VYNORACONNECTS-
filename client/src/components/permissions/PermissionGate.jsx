import React from 'react';
import { canPerformAction, getActionDescription } from '../../utils/permissions';

/**
 * PermissionGate Component
 * 
 * Conditionally renders UI elements based on the current user's role
 * and the required action permission.
 * 
 * @param {Object} props
 * @param {string} props.userRole - The active role of the user (e.g. 'OWNER', 'ADMIN', 'MEMBER', 'VIEWER')
 * @param {string} props.action - The action permission required (e.g. 'EDIT_PROJECT', 'DELETE_PROJECT')
 * @param {React.ReactNode} props.children - Child elements rendered when permission is granted
 * @param {React.ReactNode} [props.fallback=null] - Optional element rendered when permission is denied
 * @param {boolean} [props.showNotice=false] - Whether to show a styled restriction badge fallback automatically if none provided
 */
export function PermissionGate({
  userRole,
  action,
  children,
  fallback = null,
  showNotice = false
}) {
  const isAllowed = canPerformAction(userRole, action);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback !== null) {
    return <>{fallback}</>;
  }

  if (showNotice) {
    return (
      <div className="permission-denied-badge" title={`Action restricted: ${getActionDescription(action)}`}>
        <span className="permission-lock-icon">🔒</span>
        <span className="permission-lock-text">Requires elevated permissions</span>
      </div>
    );
  }

  // Deny silently if no fallback or notice is requested
  return null;
}

export default PermissionGate;
