/**
 * Vynora Connect — Network Module Express Router
 *
 * Module: Module 2 (Student Network & Profiles)
 * Owner: Ram
 *
 * Mounted at: /api/v1/network
 */

const express = require('express');
const router = express.Router();
const networkController = require('./network.controller');
const { requireAuth } = require('../../middleware/authMiddleware');

// Student Discovery (Public/Authenticated)
router.get('/students', networkController.getStudents);
router.get('/students/:userId', networkController.getStudentById);

// Authenticated Student Profile Management
router.get('/me/profile', requireAuth, networkController.getMyProfile);
router.put('/me/profile', requireAuth, networkController.updateMyProfile);
router.put('/me/privacy', requireAuth, networkController.updatePrivacy);

// Connection Lifecycle Management
router.get('/connections', requireAuth, networkController.getConnections);
router.get('/requests/received', requireAuth, networkController.getReceivedRequests);
router.get('/requests/sent', requireAuth, networkController.getSentRequests);
router.post('/requests', requireAuth, networkController.sendConnectionRequest);
router.patch('/requests/:id/accept', requireAuth, networkController.acceptRequest);
router.patch('/requests/:id/reject', requireAuth, networkController.rejectRequest);
router.patch('/requests/:id/cancel', requireAuth, networkController.cancelRequest);
router.delete('/connections/:id', requireAuth, networkController.removeConnection);

module.exports = router;

