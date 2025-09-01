'use strict';

module.exports = (sequelize, DataTypes) => {
  const ViolationReport = sequelize.define('ViolationReport', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    violationType: {
      type: DataTypes.ENUM('ppe_missing', 'fall_risk', 'unauthorized_access', 'fire_hazard', 'spill_hazard', 'machine_safety'),
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('new', 'investigating', 'resolved', 'false_positive'),
      defaultValue: 'new'
    },
    aiConfidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fullImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resolutionDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  ViolationReport.associate = function(models) {
    // Define associations here
    ViolationReport.belongsTo(models.Camera, {
      foreignKey: 'cameraId',
      as: 'camera'
    });
    
    ViolationReport.belongsTo(models.User, {
      foreignKey: 'investigatorId',
      as: 'investigator'
    });
  };

  return ViolationReport;
};