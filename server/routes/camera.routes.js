const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cameraController = require('../controllers/camera.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// Apply auth middleware to all camera routes
// This ensures that only authenticated users can access camera data
router.use(verifyToken);

// @route   GET api/cameras
// @desc    Get all cameras
// @access  Private
router.get('/', cameraController.getAllCameras);

// @route   GET api/cameras/:id
// @desc    Get camera by ID
// @access  Private
router.get('/:id', cameraController.getCameraById);

// @route   POST api/cameras
// @desc    Create a new camera
// @access  Private (Admin and Safety Manager only)
router.post(
  '/',
  [
    body('id', 'Camera ID is required').not().isEmpty(),
    body('name', 'Camera name is required').not().isEmpty(),
    body('location', 'Camera location is required').not().isEmpty(),
    body('status', 'Invalid status').isIn(['online', 'offline', 'maintenance'])
  ],
  cameraController.createCamera
);

// @route   PUT api/cameras/:id
// @desc    Update camera
// @access  Private (Admin and Safety Manager only)
router.put(
  '/:id',
  [
    body('name', 'Camera name is required').optional().not().isEmpty(),
    body('location', 'Camera location is required').optional().not().isEmpty(),
    body('status', 'Invalid status').optional().isIn(['online', 'offline', 'maintenance'])
  ],
  cameraController.updateCamera
);

// @route   DELETE api/cameras/:id
// @desc    Delete camera
// @access  Private (Admin only)

// @route   GET api/cameras/by-model/:modelId
// @desc    Get cameras with specific detection model
// @access  Private
router.get('/by-model/:modelId', cameraController.getCamerasByModel);

// @route   PATCH api/cameras/:cameraId/models/:modelId/toggle
// @desc    Toggle detection model for a camera
// @access  Private (Admin and Safety Manager only)
router.patch('/:cameraId/models/:modelId/toggle', isAdmin, cameraController.toggleDetectionModel);
router.delete('/:id', cameraController.deleteCamera);

// @route   POST api/cameras/:id/models
// @desc    Assign detection models to camera
// @access  Private (Admin and Safety Manager only)
router.post(
  '/:id/models',
  [
    body('modelIds', 'Model IDs are required').isArray()
  ],
  cameraController.assignDetectionModels
);

// @route   GET api/cameras/:id/models
// @desc    Get all detection models assigned to a camera
// @access  Private
router.get('/:id/models', cameraController.getCameraDetectionModels);

module.exports = router;