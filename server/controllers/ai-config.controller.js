'use strict';

const fs = require('fs').promises;
const path = require('path');
const aiModelsConfig = require('../config/ai-models.config');

/**
 * AI Configuration Controller
 * Handles API endpoints for managing AI model configurations
 */
const aiConfigController = {
  /**
   * Get all AI model configurations
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAIConfig: async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        data: aiModelsConfig
      });
    } catch (error) {
      console.error('Error getting AI config:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get AI configuration',
        error: error.message
      });
    }
  },

  /**
   * Update AI model path
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateModelPath: async (req, res) => {
    try {
      const { modelType, newPath } = req.body;
      
      if (!modelType || !newPath) {
        return res.status(400).json({
          success: false,
          message: 'Model type and new path are required'
        });
      }
      
      // Check if model type exists
      if (!aiModelsConfig.models[modelType]) {
        return res.status(404).json({
          success: false,
          message: `Model type '${modelType}' not found`
        });
      }
      
      // Update the model path
      const updatedConfig = { ...aiModelsConfig };
      updatedConfig.models[modelType].path = newPath;
      
      // In a real implementation, this would update a configuration file
      // For demonstration, we're just returning the updated configuration
      
      res.status(200).json({
        success: true,
        message: `Path for model '${modelType}' updated successfully`,
        data: updatedConfig.models[modelType]
      });
    } catch (error) {
      console.error('Error updating model path:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update model path',
        error: error.message
      });
    }
  },

  /**
   * Update model threshold
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateModelThreshold: async (req, res) => {
    try {
      const { modelType, threshold } = req.body;
      
      if (!modelType || threshold === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Model type and threshold are required'
        });
      }
      
      // Validate threshold value
      const thresholdValue = parseFloat(threshold);
      if (isNaN(thresholdValue) || thresholdValue < 0 || thresholdValue > 1) {
        return res.status(400).json({
          success: false,
          message: 'Threshold must be a number between 0 and 1'
        });
      }
      
      // Check if model type exists
      if (!aiModelsConfig.thresholds[modelType]) {
        return res.status(404).json({
          success: false,
          message: `Model type '${modelType}' not found`
        });
      }
      
      // Update the model threshold
      const updatedConfig = { ...aiModelsConfig };
      updatedConfig.thresholds[modelType] = thresholdValue;
      
      res.status(200).json({
        success: true,
        message: `Threshold for model '${modelType}' updated successfully`,
        data: {
          modelType,
          threshold: thresholdValue
        }
      });
    } catch (error) {
      console.error('Error updating model threshold:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update model threshold',
        error: error.message
      });
    }
  },

  /**
   * Toggle model enabled status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  toggleModelEnabled: async (req, res) => {
    try {
      const { modelType } = req.params;
      
      if (!modelType) {
        return res.status(400).json({
          success: false,
          message: 'Model type is required'
        });
      }
      
      // Check if model type exists
      if (!aiModelsConfig.models[modelType]) {
        return res.status(404).json({
          success: false,
          message: `Model type '${modelType}' not found`
        });
      }
      
      // Toggle the enabled status
      const updatedConfig = { ...aiModelsConfig };
      updatedConfig.models[modelType].enabled = !updatedConfig.models[modelType].enabled;
      
      res.status(200).json({
        success: true,
        message: `Model '${modelType}' ${updatedConfig.models[modelType].enabled ? 'enabled' : 'disabled'} successfully`,
        data: updatedConfig.models[modelType]
      });
    } catch (error) {
      console.error('Error toggling model enabled status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle model enabled status',
        error: error.message
      });
    }
  }
};

module.exports = aiConfigController;