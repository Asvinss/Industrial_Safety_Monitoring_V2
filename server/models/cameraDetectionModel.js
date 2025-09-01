'use strict';

module.exports = (sequelize, DataTypes) => {
  const CameraDetectionModel = sequelize.define('CameraDetectionModel', {
    cameraId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Cameras',
        key: 'id'
      }
    },
    modelId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'DetectionModels',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastActivated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'CameraDetectionModels'
  });

  return CameraDetectionModel;
};