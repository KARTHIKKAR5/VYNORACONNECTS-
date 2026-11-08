/**
 * Vynora Connect — Shared Authentication Middleware Adapter
 *
 * Enforces strict authentication derivation from `req.user`.
 * Never trusts unverified request bodies or raw headers for identity.
 */

function requireAuth(req, res, next) {
  // Actor MUST be derived exclusively from verified req.user
  const actor = req.user;
  const actorId = actor?._id || actor?.id;

  if (!actorId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication required. Valid authenticated user session must be provided.',
      },
    });
  }

  // Ensure normalized string/ObjectId access
  req.userId = actorId.toString();
  next();
}

module.exports = {
  requireAuth,
};

