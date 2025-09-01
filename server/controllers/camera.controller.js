'use strict';

const { Camera, DetectionModel, CameraDetectionModel } = require('../models');
const { Op } = require('sequelize');
const socketService = require('../services/socket.service');

/**
 * Toggle detection model for a camera
 * @route PATCH /api/cameras/:cameraId/models/:modelId/toggle
 * @access Private
 */
exports.toggleDetectionModel = async (req, res) => {
  try {
    const { cameraId, modelId } = req.params;
    const { isActive } = req.body;

    const cameraModel = await CameraDetectionModel.findOne({
      where: { cameraId, detectionModelId: modelId }
    });

    if (!cameraModel) {
      return res.status(404).json({ message: 'Camera-model association not found' });
    }

    await cameraModel.update({
      isActive: isActive !== undefined ? isActive : !cameraModel.isActive,
      lastActivated: isActive ? new Date() : cameraModel.lastActivated
    });

    // Notify clients about the model status change
    socketService.emitEvent('modelStatusChanged', {
      cameraId,
      modelId,
      isActive: cameraModel.isActive
    });

    res.json({
      cameraId,
      modelId,
      isActive: cameraModel.isActive,
      lastActivated: cameraModel.lastActivated
    });
  } catch (error) {
    console.error('Error toggling detection model:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get cameras with specific detection model
 * @route GET /api/cameras/by-model/:modelId
 * @access Private
 */
exports.getCamerasByModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    
    const cameras = await Camera.findAll({
      include: [{
        model: DetectionModel,
        as: 'detectionModels',
        where: { id: modelId },
        through: { attributes: ['isActive', 'lastActivated'] }
      }]
    });
    
    res.json(cameras);
  } catch (error) {
    console.error('Error fetching cameras by model:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all models assigned to a camera
 * @route GET /api/camera-models/:cameraId
 * @access Private
 */
exports.getCameraModels = async (req, res) => {
  try {
    const { cameraId } = req.params;
    
    const camera = await Camera.findByPk(cameraId);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    
    const models = await camera.getDetectionModels();
    
    res.json(models);
  } catch (error) {
    console.error('Error fetching camera models:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Assign models to a camera
 * @route POST /api/camera-models/:cameraId
 * @access Private/Admin
 */
exports.assignModelsToCamera = async (req, res) => {
  try {
    const { cameraId } = req.params;
    const { modelIds } = req.body;
    
    const camera = await Camera.findByPk(cameraId);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    
    // Verify all models exist
    const models = await DetectionModel.findAll({
      where: {
        id: {
          [Op.in]: modelIds
        }
      }
    });
    
    if (models.length !== modelIds.length) {
      return res.status(400).json({ message: 'One or more models not found' });
    }
    
    // Remove existing associations
    await CameraDetectionModel.destroy({
      where: {
        cameraId
      }
    });
    
    // Create new associations
    const associations = modelIds.map(modelId => ({
      cameraId,
      detectionModelId: modelId,
      isActive: true
    }));
    
    await CameraDetectionModel.bulkCreate(associations);
    
    // Get updated camera with models
    const updatedCamera = await Camera.findByPk(cameraId, {
      include: [{
        model: DetectionModel,
        as: 'detectionModels',
        through: { attributes: ['isActive'] }
      }]
    });
    
    // Notify clients about camera update
    socketService.emit('camera:update', { id: cameraId, action: 'models_updated' });
    
    res.json(updatedCamera);
  } catch (error) {
    console.error('Error assigning models to camera:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Remove a model from a camera
 * @route DELETE /api/camera-models/:cameraId/:modelId
 * @access Private/Admin
 */
exports.removeModelFromCamera = async (req, res) => {
  try {
    const { cameraId, modelId } = req.params;
    
    const camera = await Camera.findByPk(cameraId);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    
    const model = await DetectionModel.findByPk(modelId);
    if (!model) {
      return res.status(404).json({ message: 'Detection model not found' });
    }
    
    // Remove association
    await CameraDetectionModel.destroy({
      where: {
        cameraId,
        detectionModelId: modelId
      }
    });
    
    // Notify clients about camera update
    socketService.emit('camera:update', { id: cameraId, action: 'model_removed' });
    
    res.json({ message: 'Model removed from camera successfully' });
  } catch (error) {
    console.error('Error removing model from camera:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all cameras
 * @route GET /api/cameras
 * @access Private
 */
exports.getAllCameras = async (req, res) => {
  try {
    const cameras = await Camera.findAll({
      include: [{
        model: DetectionModel,
        as: 'detectionModels',
        through: { attributes: ['isActive'] }
      }]
    });
    res.json(cameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get camera by ID
 * @route GET /api/cameras/:id
 * @access Private
 */
exports.getCameraById = async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id, {
      include: [{
        model: DetectionModel,
        as: 'detectionModels',
        through: { attributes: ['isActive'] }
      }]
    });

    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    res.json(camera);
  } catch (error) {
    console.error('Error fetching camera:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new camera
 * @route POST /api/cameras
 * @access Private
 */
exports.createCamera = async (req, res) => {
  try {
    const { name, location, status, feedUrl, installationDate, detectionModels } = req.body;

    const camera = await Camera.create({
      name,
      location,
      status,
      feedUrl,
      installationDate: installationDate || new Date(),
      isActive: true
    });

    // If detection models are provided, associate them with the camera
    if (detectionModels && detectionModels.length > 0) {
      const modelIds = detectionModels.map(model => model.id);
      const models = await DetectionModel.findAll({
        where: { id: modelIds }
      });
      
      await camera.setDetectionModels(models);
    }

    // Fetch the camera with its associated models
    const newCamera = await Camera.findByPk(camera.id, {
      include: [{
        model: DetectionModel,
        as: 'detectionModels',
        through: { attributes: ['isActive'] }
      }]
    });

    res.status(201).json(newCamera);
  } catch (error) {
    console.error('Error creating camera:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a camera
 * @route PUT /api/cameras/:id
 * @access Private
 */
exports.updateCamera = async (req, res) => {
  try {
    const { name, location, status, feedUrl, lastMaintenance, isActive } = req.body;

    const camera = await Camera.findByPk(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    await camera.update({
      name: name || camera.name,
      location: location || camera.location,
      status: status || camera.status,
      feedUrl: feedUrl || camera.feedUrl,
      lastMaintenance: lastMaintenance || camera.lastMaintenance,
      isActive: isActive !== undefined ? isActive : camera.isActive
    });

    // Fetch the updated camera with its associated models
    const updatedCamera = await Camera.findByPk(camera.id, {
      include: [{
        model: DetectionModel,
        as: 'detectionModels',
        through: { attributes: ['isActive'] }
      }]
    });

    res.json(updatedCamera);
  } catch (error) {
    console.error('Error updating camera:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a camera
 * @route DELETE /api/cameras/:id
 * @access Private
 */
exports.deleteCamera = async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    await camera.destroy();
    res.json({ message: 'Camera deleted successfully' });
  } catch (error) {
    console.error('Error deleting camera:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Assign detection models to a camera
 * @route POST /api/cameras/:id/models
 * @access Private
 */
exports.assignDetectionModels = async (req, res) => {
  try {
    const { modelIds } = req.body;
    const cameraId = req.params.id;

    const camera = await Camera.findByPk(cameraId);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    // Find all requested models
    const models = await DetectionModel.findAll({
      where: { id: modelIds }
    });

    if (models.length !== modelIds.length) {
      return res.status(400).json({ message: 'One or more detection models not found' });
    }

    // Associate models with camera
    await camera.setDetectionModels(models);

    // Fetch the updated camera with its associated models
    const updatedCamera = await Camera.findByPk(cameraId, {
      include: [{
        model: DetectionModel,
        as: 'detectionModels',
        through: { attributes: ['isActive'] }
      }]
    });

    res.json(updatedCamera);
  } catch (error) {
    console.error('Error assigning detection models:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all detection models for a camera
 * @route GET /api/cameras/:id/models
 * @access Private
 */
exports.getCameraDetectionModels = async (req, res) => {
  try {
    const cameraId = req.params.id;

    const camera = await Camera.findByPk(cameraId, {
      include: [{
        model: DetectionModel,
        as: 'detectionModels',
        through: { attributes: ['isActive', 'lastActivated'] }
      }]
    });

    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    res.json(camera.detectionModels);
  } catch (error) {
    console.error('Error fetching camera detection models:', error);
    res.status(500).json({ message: 'Server error' });
  }
};