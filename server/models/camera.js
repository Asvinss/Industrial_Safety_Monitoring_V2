'use strict';

module.exports = (sequelize, DataTypes) => {
  const Camera = sequelize.define('Camera', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('online', 'offline', 'maintenance'),
      defaultValue: 'offline'
    },
    feedUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastMaintenance: {
      type: DataTypes.DATE,
      allowNull: true
    },
    installationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Camera.associate = function(models) {
    // Define associations here
    Camera.hasMany(models.ViolationReport, {
      foreignKey: 'cameraId',
      as: 'violations'
    });
    
    Camera.belongsToMany(models.DetectionModel, {
      through: 'CameraDetectionModels',
      foreignKey: 'cameraId',
      as: 'detectionModels'
    });
  };

  return Camera;
};