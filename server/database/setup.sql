-- Industrial Safety Monitor Database Setup

-- Create Database
CREATE DATABASE IF NOT EXISTS industrial_safety_db;
USE industrial_safety_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'supervisor') NOT NULL DEFAULT 'supervisor',
  lastLogin DATETIME,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cameras Table
CREATE TABLE IF NOT EXISTS cameras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status ENUM('online', 'offline', 'maintenance') NOT NULL DEFAULT 'offline',
  feedUrl VARCHAR(255) NOT NULL,
  lastMaintenance DATETIME,
  installationDate DATETIME NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Detection Models Table
CREATE TABLE IF NOT EXISTS detection_models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  accuracy DECIMAL(5,2) NOT NULL,
  version VARCHAR(20) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Camera Detection Models (Junction Table)
CREATE TABLE IF NOT EXISTS camera_detection_models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cameraId INT NOT NULL,
  modelId INT NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  lastActivated DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cameraId) REFERENCES cameras(id) ON DELETE CASCADE,
  FOREIGN KEY (modelId) REFERENCES detection_models(id) ON DELETE CASCADE,
  UNIQUE KEY unique_camera_model (cameraId, modelId)
);

-- Violation Reports Table
CREATE TABLE IF NOT EXISTS violation_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp DATETIME NOT NULL,
  violationType VARCHAR(100) NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  status ENUM('new', 'investigating', 'resolved', 'false_alarm') NOT NULL DEFAULT 'new',
  aiConfidence DECIMAL(5,2) NOT NULL,
  description TEXT,
  notes TEXT,
  thumbnailUrl VARCHAR(255),
  fullImageUrl VARCHAR(255),
  resolutionDate DATETIME,
  cameraId INT NOT NULL,
  investigatorId INT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cameraId) REFERENCES cameras(id) ON DELETE CASCADE,
  FOREIGN KEY (investigatorId) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user
INSERT INTO users (firstName, lastName, email, password, role)
VALUES ('Admin', 'User', 'admin@safety.com', '$2a$10$eCQYy1AUuZmCdz5FEPFCsO5wRwE/SDZ.EZFjQJXBRFLVE/QYdO3Aq', 'admin');

-- Insert sample detection models
INSERT INTO detection_models (name, description, accuracy, version, isActive)
VALUES 
('PPE Detection', 'Detects proper use of personal protective equipment', 95.5, '1.2.0', TRUE),
('Fall Detection', 'Identifies potential fall hazards and incidents', 92.8, '1.1.5', TRUE),
('Fire Detection', 'Detects smoke and fire hazards', 97.2, '2.0.1', TRUE),
('Restricted Area', 'Monitors unauthorized access to restricted areas', 94.0, '1.3.2', TRUE),
('Machine Safety', 'Monitors proper machine operation and safety protocols', 93.5, '1.0.8', TRUE);