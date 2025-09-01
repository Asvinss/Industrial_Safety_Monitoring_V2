require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { sequelize } = require('./models');

// Import services
const socketService = require('./services/socket.service');
const aiDetectionService = require('./services/aiDetection.service');

// Import routes
const authRoutes = require('./routes/auth.routes');
const cameraRoutes = require('./routes/camera.routes');
const violationRoutes = require('./routes/violation.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const userRoutes = require('./routes/user.routes');
const modelRoutes = require('./routes/model.routes');
const cameraModelRoutes = require('./routes/camera-model.routes');
const databaseRoutes = require('./routes/database.routes');
const aiConfigRoutes = require('./routes/ai-config.routes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/camera-models', cameraModelRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/ai-config', aiConfigRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Industrial Safety Monitor API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection and server start
const mysql = require('mysql2/promise');

async function checkAndCreateDatabase() {
  let connection;
  try {
    // Create connection without database name
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });
    
    // Check if database exists
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`
    );

    if (rows.length === 0) {
      console.log(`Database '${process.env.DB_NAME}' does not exist. Creating it now...`);
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Database '${process.env.DB_NAME}' created successfully!`);
    } else {
      console.log(`Database '${process.env.DB_NAME}' already exists.`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Root endpoint for API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Industrial Safety Monitor API',
    version: '1.0.0'
  });
});

// Check/create database then connect with Sequelize
checkAndCreateDatabase()
  .then(() => sequelize.authenticate())
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database models synchronized.');
    // Initialize AI Detection Service
    return aiDetectionService.initialize();
  })
  .then(() => {
    // Initialize Socket.IO service
    socketService.initialize(server);
    
    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });