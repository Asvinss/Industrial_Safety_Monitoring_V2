const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const violationController = require('../controllers/violation.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply auth middleware to all violation routes
router.use(verifyToken);

// @route   GET api/violations
// @desc    Get all violations with optional filtering
// @access  Private
router.get('/', violationController.getAllViolations);

// @route   GET api/violations/:id
// @desc    Get violation by ID
// @access  Private
router.get('/:id', violationController.getViolationById);

// @route   POST api/violations
// @desc    Create a new violation report
// @access  Private
router.post(
  '/',
  [
    body('id', 'Violation ID is required').not().isEmpty(),
    body('violationType', 'Invalid violation type').isIn([
      'ppe_missing', 'fall_risk', 'unauthorized_access', 'fire_hazard', 'spill_hazard', 'machine_safety'
    ]),
    body('severity', 'Invalid severity level').isIn(['low', 'medium', 'high', 'critical']),
    body('cameraId', 'Camera ID is required').not().isEmpty(),
    body('aiConfidence', 'AI confidence score is required').isFloat({ min: 0, max: 100 })
  ],
  violationController.createViolation
);

// @route   PUT api/violations/:id
// @desc    Update violation report
// @access  Private
router.put(
  '/:id',
  [
    body('status', 'Invalid status').optional().isIn(['new', 'investigating', 'resolved', 'false_positive']),
    body('notes', 'Notes must be a string').optional().isString(),
    body('investigatorId', 'Investigator ID must be a number').optional().isInt()
  ],
  violationController.updateViolation
);

// @route   DELETE api/violations/:id
// @desc    Delete violation report
// @access  Private (Admin only)
router.delete('/:id', violationController.deleteViolation);

// @route   GET api/violations/stats
// @desc    Get violation statistics
// @access  Private
router.get('/stats/summary', violationController.getViolationStats);

module.exports = router;