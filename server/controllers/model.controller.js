'use strict';

const { DetectionModel, Camera } = require('../models');

/**
 * Get all detection models
 * @route GET /api/models
 * @access Private
 */
exports.getAllModels = async (req, res) => {
  try {
    const models = await DetectionModel.findAll();
    res.json(models);
  } catch (error) {
    console.error('Error fetching detection models:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get detection model by ID
 * @route GET /api/models/:id
 * @access Private
 */
exports.getModelById = async (req, res) => {
  try {
    const model = await DetectionModel.findByPk(req.params.id, {
      include: [{
        model: Camera,
        as: 'cameras',
        through: { attributes: ['isActive'] }
      }]
    });

    if (!model) {
      return res.status(404).json({ message: 'Detection model not found' });
    }

    res.json(model);
  } catch (error) {
    console.error('Error fetching detection model:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new detection model
 * @route POST /api/models
 * @access Private/Admin
 */
exports.createModel = async (req, res) => {
  try {
    const { name, description, accuracy, version } = req.body;

    const model = await DetectionModel.create({
      name,
      description,
      accuracy,
      version,
      isActive: true
    });

    res.status(201).json(model);
  } catch (error) {
    console.error('Error creating detection model:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a detection model
 * @route PUT /api/models/:id
 * @access Private/Admin
 */
exports.updateModel = async (req, res) => {
  try {
    const { name, description, accuracy, version, isActive } = req.body;

    const model = await DetectionModel.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Detection model not found' });
    }

    await model.update({
      name: name || model.name,
      description: description || model.description,
      accuracy: accuracy || model.accuracy,
      version: version || model.version,
      isActive: isActive !== undefined ? isActive : model.isActive
    });

    res.json(model);
  } catch (error) {
    console.error('Error updating detection model:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a detection model
 * @route DELETE /api/models/:id
 * @access Private/Admin
 */
exports.deleteModel = async (req, res) => {
  try {
    const model = await DetectionModel.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Detection model not found' });
    }

    await model.destroy();
    res.json({ message: 'Detection model deleted successfully' });
  } catch (error) {
    console.error('Error deleting detection model:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get cameras using this model
 * @route GET /api/models/:id/cameras
 * @access Private
 */
exports.getModelCameras = async (req, res) => {
  try {
    const model = await DetectionModel.findByPk(req.params.id, {
      include: [{
        model: Camera,
        as: 'cameras',
        through: { attributes: ['isActive', 'lastActivated'] }
      }]
    });

    if (!model) {
      return res.status(404).json({ message: 'Detection model not found' });
    }

    res.json(model.cameras);
  } catch (error) {
    console.error('Error fetching model cameras:', error);
    res.status(500).json({ message: 'Server error' });
  }
};