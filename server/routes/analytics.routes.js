const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply auth middleware to all analytics routes
router.use(verifyToken);

// @route   GET api/analytics/dashboard
// @desc    Get dashboard analytics data
// @access  Private
router.get('/dashboard', analyticsController.getDashboardData);

// @route   GET api/analytics/violations/trend
// @desc    Get violation trends over time
// @access  Private
router.get('/violations/trend', analyticsController.getViolationTrends);

// @route   GET api/analytics/violations/by-type
// @desc    Get violations grouped by type
// @access  Private
router.get('/violations/by-type', analyticsController.getViolationsByType);

// @route   GET api/analytics/violations/by-location
// @desc    Get violations grouped by location
// @access  Private
router.get('/violations/by-location', analyticsController.getViolationsByLocation);

// @route   GET api/analytics/safety-score
// @desc    Get overall safety score and metrics
// @access  Private
router.get('/safety-score', analyticsController.getSafetyScore);

// @route   GET api/analytics/export
// @desc    Export analytics data
// @access  Private (Admin and Safety Manager only)
router.get('/export', analyticsController.exportData);

module.exports = router;