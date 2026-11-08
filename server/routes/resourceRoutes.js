/**
 * Vynora Connect — Opportunities & Resources Module
 * Express Router: /api/v1/resources
 */

const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Public Catalog & Details
router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResourceById);

// Authenticated Student Actions
router.post('/', resourceController.createResource);
router.get('/mine', resourceController.getMyResources);
router.post('/:id/upvote', resourceController.upvoteResource);

// Private Bookmarks Actions
router.get('/bookmarks/all', resourceController.getSavedResources);
router.post('/:id/bookmark', resourceController.saveResource);
router.delete('/:id/bookmark', resourceController.unsaveResource);

module.exports = router;

