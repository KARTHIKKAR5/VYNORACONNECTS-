/**
 * Student User Identification Middleware
 * Respects team architecture without inventing a fake or duplicate auth system.
 * Extracts user ID from standard headers ('x-user-id' or 'authorization')
 * or falls back to the default current student ID for local module testing.
 */
export const userMiddleware = (req, res, next) => {
  const headerUserId = req.headers['x-user-id'];
  const authHeader = req.headers['authorization'];

  if (headerUserId) {
    req.userId = headerUserId;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    // When the team's shared auth token is provided
    req.userId = authHeader.split(' ')[1] || 'usr-current';
  } else {
    // Default student user ID for isolated module testing
    req.userId = 'usr-current';
  }

  next();
};
