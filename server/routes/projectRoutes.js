/**
 * Vynora Connect — Teams & Projects Module
 * Express Router Specification: /api/v1/projects
 */

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Project Discovery and Creation
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.patch('/:id', projectController.updateProject);

// Application Management (Join Requests)
router.post('/:id/apply', projectController.applyToProject);
router.get('/:id/applicants', projectController.getApplicants);
router.patch('/:id/applicants/:requestId', projectController.reviewApplicant);

// Invitations
router.post('/:id/invitations', projectController.inviteStudent);
router.patch('/invitations/:invitationId', projectController.respondToInvitation);

// Team & Membership Management
router.delete('/:id/members/:memberUserId', projectController.removeMember);
router.post('/:id/leave', projectController.leaveTeam);
router.post('/:id/transfer-ownership', projectController.transferOwnership);

// Task Management
router.get('/:id/tasks', projectController.getTasks);
router.post('/:id/tasks', projectController.createTask);
router.patch('/:id/tasks/:taskId', projectController.updateTask);

module.exports = router;

