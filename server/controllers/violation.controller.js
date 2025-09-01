'use strict';

const { ViolationReport, Camera, User } = require('../models');
const { Op } = require('sequelize');
const socketService = require('../services/socket.service');

/**
 * Get all violation reports
 * @route GET /api/violations
 * @access Private
 */
exports.getAllViolations = async (req, res) => {
  try {
    const { status, severity, startDate, endDate, cameraId } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (severity) {
      whereConditions.severity = severity;
    }
    
    if (cameraId) {
      whereConditions.cameraId = cameraId;
    }
    
    // Date range filter
    if (startDate || endDate) {
      whereConditions.timestamp = {};
      
      if (startDate) {
        whereConditions.timestamp[Op.gte] = new Date(startDate);
      }
      
      if (endDate) {
        whereConditions.timestamp[Op.lte] = new Date(endDate);
      }
    }
    
    const violations = await ViolationReport.findAll({
      where: whereConditions,
      include: [
        {
          model: Camera,
          as: 'camera',
          attributes: ['id', 'name', 'location']
        },
        {
          model: User,
          as: 'investigator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['timestamp', 'DESC']]
    });
    
    res.json(violations);
  } catch (error) {
    console.error('Error fetching violations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get violation report by ID
 * @route GET /api/violations/:id
 * @access Private
 */
exports.getViolationById = async (req, res) => {
  try {
    const violation = await ViolationReport.findByPk(req.params.id, {
      include: [
        {
          model: Camera,
          as: 'camera',
          attributes: ['id', 'name', 'location']
        },
        {
          model: User,
          as: 'investigator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    
    if (!violation) {
      return res.status(404).json({ message: 'Violation report not found' });
    }
    
    res.json(violation);
  } catch (error) {
    console.error('Error fetching violation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new violation report
 * @route POST /api/violations
 * @access Private
 */
exports.createViolation = async (req, res) => {
  try {
    const {
      timestamp,
      violationType,
      severity,
      status,
      aiConfidence,
      description,
      notes,
      thumbnailUrl,
      fullImageUrl,
      cameraId,
      investigatorId
    } = req.body;
    
    // Verify camera exists
    const camera = await Camera.findByPk(cameraId);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    
    // Create violation report
    const violation = await ViolationReport.create({
      timestamp: timestamp || new Date(),
      violationType,
      severity,
      status: status || 'new',
      aiConfidence,
      description,
      notes,
      thumbnailUrl,
      fullImageUrl,
      cameraId,
      investigatorId
    });
    
    // Fetch the created violation with associations
    const newViolation = await ViolationReport.findByPk(violation.id, {
      include: [
        {
          model: Camera,
          as: 'camera',
          attributes: ['id', 'name', 'location']
        },
        {
          model: User,
          as: 'investigator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    
    // Send real-time notification via Socket.IO
    socketService.notifyViolation(newViolation);
    
    res.status(201).json(newViolation);
  } catch (error) {
    console.error('Error creating violation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a violation report
 * @route PUT /api/violations/:id
 * @access Private
 */
exports.updateViolation = async (req, res) => {
  try {
    const {
      status,
      notes,
      investigatorId,
      resolutionDate
    } = req.body;
    
    const violation = await ViolationReport.findByPk(req.params.id);
    if (!violation) {
      return res.status(404).json({ message: 'Violation report not found' });
    }
    
    // Update violation
    await violation.update({
      status: status || violation.status,
      notes: notes || violation.notes,
      investigatorId: investigatorId || violation.investigatorId,
      resolutionDate: resolutionDate || violation.resolutionDate
    });
    
    // Fetch the updated violation with associations
    const updatedViolation = await ViolationReport.findByPk(violation.id, {
      include: [
        {
          model: Camera,
          as: 'camera',
          attributes: ['id', 'name', 'location']
        },
        {
          model: User,
          as: 'investigator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    
    res.json(updatedViolation);
  } catch (error) {
    console.error('Error updating violation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a violation report
 * @route DELETE /api/violations/:id
 * @access Private
 */
exports.deleteViolation = async (req, res) => {
  try {
    const violation = await ViolationReport.findByPk(req.params.id);
    if (!violation) {
      return res.status(404).json({ message: 'Violation report not found' });
    }
    
    await violation.destroy();
    res.json({ message: 'Violation report deleted successfully' });
  } catch (error) {
    console.error('Error deleting violation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get violation statistics
 * @route GET /api/violations/stats
 * @access Private
 */
exports.getViolationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date range filter
    const whereConditions = {};
    if (startDate || endDate) {
      whereConditions.timestamp = {};
      
      if (startDate) {
        whereConditions.timestamp[Op.gte] = new Date(startDate);
      }
      
      if (endDate) {
        whereConditions.timestamp[Op.lte] = new Date(endDate);
      }
    }
    
    // Get total count
    const totalCount = await ViolationReport.count({
      where: whereConditions
    });
    
    // Get counts by status
    const statusCounts = await ViolationReport.findAll({
      where: whereConditions,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    // Get counts by severity
    const severityCounts = await ViolationReport.findAll({
      where: whereConditions,
      attributes: [
        'severity',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['severity']
    });
    
    // Get counts by violation type
    const typeCounts = await ViolationReport.findAll({
      where: whereConditions,
      attributes: [
        'violationType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['violationType']
    });
    
    res.json({
      totalCount,
      byStatus: statusCounts,
      bySeverity: severityCounts,
      byType: typeCounts
    });
  } catch (error) {
    console.error('Error fetching violation statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};