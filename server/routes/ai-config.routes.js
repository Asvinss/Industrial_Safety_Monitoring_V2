'use strict';

const express = require('express');
const router = express.Router();
const aiConfigController = require('../controllers/ai-config.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * AI Configuration Routes
 * Endpoints for managing AI model configurations
 */

// Get all AI model configurations
// GET /api/ai-config
router.get('/', verifyToken, aiConfigController.getAIConfig);

// Update AI model path
// PUT /api/ai-config/model-path
router.put('/model-path', verifyToken, isAdmin, aiConfigController.updateModelPath);

// Update model threshold
// PUT /api/ai-config/threshold
router.put('/threshold', verifyToken, isAdmin, aiConfigController.updateModelThreshold);

// Toggle model enabled status
// PATCH /api/ai-config/:modelType/toggle
router.patch('/:modelType/toggle', verifyToken, isAdmin, aiConfigController.toggleModelEnabled);

module.exports = router;