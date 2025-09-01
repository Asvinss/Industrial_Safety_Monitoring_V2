const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const modelController = require('../controllers/model.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// @route   GET api/models
// @desc    Get all detection models
// @access  Private
router.get('/', verifyToken, modelController.getAllModels);

// @route   GET api/models/:id
// @desc    Get detection model by ID
// @access  Private
router.get('/:id', verifyToken, modelController.getModelById);

// @route   POST api/models
// @desc    Create a new detection model
// @access  Private/Admin
router.post(
  '/',
  [
    verifyToken,
    isAdmin,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('accuracy', 'Accuracy must be a number between 0 and 100').isFloat({ min: 0, max: 100 }),
      check('version', 'Version is required').not().isEmpty()
    ]
  ],
  modelController.createModel
);

// @route   PUT api/models/:id
// @desc    Update a detection model
// @access  Private/Admin
router.put(
  '/:id',
  [
    verifyToken,
    isAdmin,
    [
      check('accuracy', 'Accuracy must be a number between 0 and 100')
        .optional()
        .isFloat({ min: 0, max: 100 })
    ]
  ],
  modelController.updateModel
);

// @route   DELETE api/models/:id
// @desc    Delete a detection model
// @access  Private/Admin
router.delete('/:id', [verifyToken, isAdmin], modelController.deleteModel);

// @route   GET api/models/:id/cameras
// @desc    Get cameras using this model
// @access  Private
router.get('/:id/cameras', verifyToken, modelController.getModelCameras);

module.exports = router;