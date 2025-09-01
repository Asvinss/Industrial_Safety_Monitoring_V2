'use strict';

const { ViolationReport, Camera, User, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get dashboard summary data
 * @route GET /api/analytics/dashboard
 * @access Private
 */
exports.getDashboardData = async (req, res) => {
  try {
    // Get total counts
    const totalCameras = await Camera.count({ where: { isActive: true } });
    const totalViolations = await ViolationReport.count();
    const unresolvedViolations = await ViolationReport.count({
      where: {
        status: { [Op.notIn]: ['resolved', 'false_alarm'] }
      }
    });
    
    // Get recent violations (last 24 hours)
    const recentViolations = await ViolationReport.findAll({
      where: {
        timestamp: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      include: [
        {
          model: Camera,
          as: 'camera',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['timestamp', 'DESC']],
      limit: 10
    });
    
    // Get violation counts by type
    const violationsByType = await ViolationReport.findAll({
      attributes: [
        'violationType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['violationType'],
      order: [[sequelize.literal('count'), 'DESC']]
    });
    
    // Get camera status summary
    const cameraStatus = await Camera.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    res.json({
      totalCameras,
      totalViolations,
      unresolvedViolations,
      recentViolations,
      violationsByType,
      cameraStatus
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get violation trends over time
 * @route GET /api/analytics/trends
 * @access Private
 */
exports.getViolationTrends = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    
    let timeFormat;
    let groupByClause;
    
    // Determine time grouping based on period
    switch (period) {
      case 'hourly':
        timeFormat = '%Y-%m-%d %H:00:00';
        groupByClause = sequelize.fn('DATE_FORMAT', sequelize.col('timestamp'), timeFormat);
        break;
      case 'daily':
        timeFormat = '%Y-%m-%d';
        groupByClause = sequelize.fn('DATE_FORMAT', sequelize.col('timestamp'), timeFormat);
        break;
      case 'weekly':
        timeFormat = '%Y-%u';
        groupByClause = sequelize.fn('DATE_FORMAT', sequelize.col('timestamp'), timeFormat);
        break;
      case 'monthly':
        timeFormat = '%Y-%m';
        groupByClause = sequelize.fn('DATE_FORMAT', sequelize.col('timestamp'), timeFormat);
        break;
      default:
        timeFormat = '%Y-%m-%d';
        groupByClause = sequelize.fn('DATE_FORMAT', sequelize.col('timestamp'), timeFormat);
    }
    
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
    
    // Get violation counts grouped by time period
    const trends = await ViolationReport.findAll({
      where: whereConditions,
      attributes: [
        [groupByClause, 'timePeriod'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['timePeriod'],
      order: [[sequelize.col('timePeriod'), 'ASC']]
    });
    
    res.json(trends);
  } catch (error) {
    console.error('Error fetching violation trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get violations by type
 * @route GET /api/analytics/by-type
 * @access Private
 */
exports.getViolationsByType = async (req, res) => {
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
    
    // Get violation counts by type
    const violationsByType = await ViolationReport.findAll({
      where: whereConditions,
      attributes: [
        'violationType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['violationType'],
      order: [[sequelize.literal('count'), 'DESC']]
    });
    
    res.json(violationsByType);
  } catch (error) {
    console.error('Error fetching violations by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get violations by location
 * @route GET /api/analytics/by-location
 * @access Private
 */
exports.getViolationsByLocation = async (req, res) => {
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
    
    // Get violation counts by camera location
    const violationsByLocation = await ViolationReport.findAll({
      where: whereConditions,
      include: [{
        model: Camera,
        as: 'camera',
        attributes: ['location']
      }],
      attributes: [
        [sequelize.col('camera.location'), 'location'],
        [sequelize.fn('COUNT', sequelize.col('ViolationReport.id')), 'count']
      ],
      group: [sequelize.col('camera.location')],
      order: [[sequelize.literal('count'), 'DESC']]
    });
    
    res.json(violationsByLocation);
  } catch (error) {
    console.error('Error fetching violations by location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get safety score
 * @route GET /api/analytics/safety-score
 * @access Private
 */
exports.getSafetyScore = async (req, res) => {
  try {
    const { startDate, endDate, location } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    const cameraWhereConditions = {};
    
    if (startDate || endDate) {
      whereConditions.timestamp = {};
      
      if (startDate) {
        whereConditions.timestamp[Op.gte] = new Date(startDate);
      }
      
      if (endDate) {
        whereConditions.timestamp[Op.lte] = new Date(endDate);
      }
    }
    
    if (location) {
      cameraWhereConditions.location = location;
    }
    
    // Get total number of active cameras
    const totalCameras = await Camera.count({
      where: { ...cameraWhereConditions, isActive: true }
    });
    
    // Get total violations in the period
    const totalViolations = await ViolationReport.count({
      where: whereConditions,
      include: location ? [{
        model: Camera,
        as: 'camera',
        where: cameraWhereConditions
      }] : []
    });
    
    // Get critical violations in the period
    const criticalViolations = await ViolationReport.count({
      where: { ...whereConditions, severity: 'critical' },
      include: location ? [{
        model: Camera,
        as: 'camera',
        where: cameraWhereConditions
      }] : []
    });
    
    // Get high severity violations in the period
    const highSeverityViolations = await ViolationReport.count({
      where: { ...whereConditions, severity: 'high' },
      include: location ? [{
        model: Camera,
        as: 'camera',
        where: cameraWhereConditions
      }] : []
    });
    
    // Calculate safety score (higher is better)
    // Base score of 100, deduct for violations based on severity
    const baseScore = 100;
    const criticalWeight = 5;
    const highWeight = 3;
    const mediumWeight = 1;
    
    // Get medium severity violations in the period
    const mediumSeverityViolations = await ViolationReport.count({
      where: { ...whereConditions, severity: 'medium' },
      include: location ? [{
        model: Camera,
        as: 'camera',
        where: cameraWhereConditions
      }] : []
    });
    
    // Calculate deductions
    const criticalDeduction = criticalViolations * criticalWeight;
    const highDeduction = highSeverityViolations * highWeight;
    const mediumDeduction = mediumSeverityViolations * mediumWeight;
    
    // Calculate final score (minimum 0)
    const safetyScore = Math.max(0, baseScore - criticalDeduction - highDeduction - mediumDeduction);
    
    res.json({
      safetyScore: parseFloat(safetyScore.toFixed(2)),
      totalCameras,
      totalViolations,
      violationBreakdown: {
        critical: criticalViolations,
        high: highSeverityViolations,
        medium: mediumSeverityViolations,
        low: totalViolations - criticalViolations - highSeverityViolations - mediumSeverityViolations
      }
    });
  } catch (error) {
    console.error('Error calculating safety score:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Export violation data
 * @route GET /api/analytics/export
 * @access Private
 */
exports.exportData = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    
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
    
    // Get violation data with associations
    const violations = await ViolationReport.findAll({
      where: whereConditions,
      include: [
        {
          model: Camera,
          as: 'camera',
          attributes: ['name', 'location']
        },
        {
          model: User,
          as: 'investigator',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['timestamp', 'DESC']]
    });
    
    // Format data based on requested format
    if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'ID,Timestamp,Type,Severity,Status,Camera,Location,Investigator,AI Confidence,Description\n';
      const csvRows = violations.map(v => {
        return `${v.id},${v.timestamp},${v.violationType},${v.severity},${v.status},${v.camera?.name || ''},${v.camera?.location || ''},${v.investigator ? `${v.investigator.firstName} ${v.investigator.lastName}` : ''},${v.aiConfidence},"${v.description?.replace(/"/g, '""') || ''}"\n`;
      }).join('');
      
      const csvContent = csvHeader + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=violations_${new Date().toISOString().split('T')[0]}.csv`);
      return res.send(csvContent);
    }
    
    // Default to JSON format
    res.json(violations);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};