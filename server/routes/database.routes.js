const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

/**
 * @route GET /api/database/test-connection
 * @desc Test database connection
 * @access Public
 */
router.get('/test-connection', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ 
      success: true, 
      message: 'Database connection is working properly',
      timestamp: new Date().toISOString(),
      database: process.env.DB_NAME,
      host: process.env.DB_HOST
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;