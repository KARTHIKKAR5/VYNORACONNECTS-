/**
 * Vynora Connect — Network Module Express Controller
 *
 * Module: Module 2 (Student Network & Profiles)
 * Owner: Ram
 *
 * Implements standard envelope responses, parameter extraction, and HTTP status codes.
 */

const networkService = require('./network.service');
const {
  isValidObjectId,
  validateProfileUpdate,
  validatePagination,
} = require('./network.validation');

/**
 * Helper to send standardized JSON error response
 */
function sendError(res, status, code, message, details = []) {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
  });
}

/**
 * GET /api/v1/network/students
 */
exports.getStudents = async (req, res) => {
  try {
    const { page, limit } = validatePagination(req.query);
    const { search, college, branch, studyYear, skill, interest, sortBy } = req.query;

    const result = await networkService.searchStudents({
      search,
      college,
      branch,
      studyYear,
      skill,
      interest,
      sortBy,
      page,
      limit,
      viewerId: req.userId,
    });

    return res.status(200).json({
      success: true,
      data: result.students,
      meta: result.meta,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * GET /api/v1/network/students/:userId
 */
exports.getStudentById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return sendError(res, 400, 'INVALID_USER_ID', 'Invalid student user ID format.');
    }

    const student = await networkService.getStudentProfile(userId, req.userId);
    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * GET /api/v1/network/me/profile
 */
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await networkService.getMyProfile(req.userId);
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * PUT /api/v1/network/me/profile
 */
exports.updateMyProfile = async (req, res) => {
  try {
    const validation = validateProfileUpdate(req.body);
    if (!validation.isValid) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid profile update data.', validation.errors);
    }

    const updated = await networkService.updateMyProfile(req.userId, validation.sanitized);
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * PUT /api/v1/network/me/privacy
 */
exports.updatePrivacy = async (req, res) => {
  try {
    const { visibility } = req.body;
    if (!visibility || typeof visibility !== 'object') {
      return sendError(res, 400, 'INVALID_PAYLOAD', 'Visibility settings object is required.');
    }

    const updated = await networkService.updatePrivacySettings(req.userId, visibility);
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * GET /api/v1/network/connections
 */
exports.getConnections = async (req, res) => {
  try {
    const connections = await networkService.getAcceptedConnections(req.userId);
    return res.status(200).json({
      success: true,
      data: connections,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * GET /api/v1/network/requests/received
 */
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await networkService.getReceivedRequests(req.userId);
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * GET /api/v1/network/requests/sent
 */
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await networkService.getSentRequests(req.userId);
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * POST /api/v1/network/requests
 */
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (!isValidObjectId(recipientId)) {
      return sendError(res, 400, 'INVALID_RECIPIENT_ID', 'Valid recipient student ID is required.');
    }

    const result = await networkService.sendConnectionRequest(req.userId, recipientId, req.user);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * PATCH /api/v1/network/requests/:id/accept
 */
exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return sendError(res, 400, 'INVALID_REQUEST_ID', 'Invalid request ID.');
    }

    const result = await networkService.acceptConnectionRequest(id, req.userId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * PATCH /api/v1/network/requests/:id/reject
 */
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return sendError(res, 400, 'INVALID_REQUEST_ID', 'Invalid request ID.');
    }

    const result = await networkService.rejectConnectionRequest(id, req.userId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * PATCH /api/v1/network/requests/:id/cancel
 */
exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return sendError(res, 400, 'INVALID_REQUEST_ID', 'Invalid request ID.');
    }

    const result = await networkService.cancelConnectionRequest(id, req.userId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

/**
 * DELETE /api/v1/network/connections/:id
 */
exports.removeConnection = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return sendError(res, 400, 'INVALID_CONNECTION_ID', 'Invalid connection ID.');
    }

    const result = await networkService.removeConnection(id, req.userId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return sendError(res, err.status || 500, err.code || 'SERVER_ERROR', err.message);
  }
};

