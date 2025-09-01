const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// Import controllers
const cameraController = require('../controllers/camera.controller');

// @route   GET api/camera-models/:cameraId
// @desc    Get all models assigned to a camera
// @access  Private
router.get('/:cameraId', verifyToken, cameraController.getCameraModels);

// @route   POST api/camera-models/:cameraId
// @desc    Assign models to a camera
// @access  Private/Admin
router.post(
  '/:cameraId',
  [
    verifyToken,
    isAdmin,
    [
      check('modelIds', 'Model IDs are required').isArray({ min: 1 })
    ]
  ],
  cameraController.assignModelsToCamera
);

// @route   DELETE api/camera-models/:cameraId/:modelId
// @desc    Remove a model from a camera
// @access  Private/Admin
router.delete('/:cameraId/:modelId', [verifyToken, isAdmin], cameraController.removeModelFromCamera);

module.exports = router;