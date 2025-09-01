'use strict';

require('dotenv').config();
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');

// Import models
const db = require('../models');

async function initDatabase() {
  try {
    // Sync all models with database
    console.log('Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully!');

    // Create default admin user
    console.log('Creating default admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@safety.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create sample detection models
    console.log('Creating sample detection models...');
    const models = [
      {
        name: 'PPE Detection',
        description: 'Detects proper use of personal protective equipment',
        accuracy: 95.5,
        version: '1.2.0',
        isActive: true
      },
      {
        name: 'Fall Detection',
        description: 'Identifies potential fall hazards and incidents',
        accuracy: 92.8,
        version: '1.1.5',
        isActive: true
      },
      {
        name: 'Fire Detection',
        description: 'Detects smoke and fire hazards',
        accuracy: 97.2,
        version: '2.0.1',
        isActive: true
      },
      {
        name: 'Restricted Area',
        description: 'Monitors unauthorized access to restricted areas',
        accuracy: 94.0,
        version: '1.3.2',
        isActive: true
      },
      {
        name: 'Machine Safety',
        description: 'Monitors proper machine operation and safety protocols',
        accuracy: 93.5,
        version: '1.0.8',
        isActive: true
      }
    ];

    await db.DetectionModel.bulkCreate(models);

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();