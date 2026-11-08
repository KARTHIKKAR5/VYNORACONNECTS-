/**
 * Vynora Connect — Opportunities & Resources Module
 * Express Router: /api/v1/opportunities
 */

const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');

// Public Feed & Details
router.get('/', opportunityController.getOpportunities);
router.get('/featured', opportunityController.getFeaturedOpportunities); // Karthik Dashboard Preview
router.get('/:id', opportunityController.getOpportunityById);

// Authenticated Student Actions
router.post('/', opportunityController.createOpportunity);
router.get('/mine', opportunityController.getMySubmissions);

// Private Saved Tracker Actions
router.get('/saved', opportunityController.getSavedOpportunities);
router.post('/:id/save', opportunityController.saveOpportunity);
router.delete('/:id/save', opportunityController.unsaveOpportunity);
router.patch('/:id/tracker', opportunityController.updateTrackerStatus);

module.exports = router;

